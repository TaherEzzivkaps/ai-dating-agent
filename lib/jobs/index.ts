import { getDb } from '../db';
import { scrapePerson } from '../scrape';
import { runVisionPass, runSynthesisPass } from '../analyst';
import { runQuickScreen, selectVenue, simulateDateConversation, debriefDate } from '../dating';
import { calculateScore, generateRankingExplanation } from '../ranking';

export interface JobEvent {
  jobId: string;
  stage: string;
  progress: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message?: string;
  dateMessage?: any;
  error?: string;
}

type Listener = (event: JobEvent) => void;
const listeners = new Map<string, Set<Listener>>();

export function subscribeToJob(jobId: string, listener: Listener) {
  if (!listeners.has(jobId)) {
    listeners.set(jobId, new Set());
  }
  listeners.get(jobId)!.add(listener);
  return () => {
    listeners.get(jobId)?.delete(listener);
  };
}

export function emitJobEvent(event: JobEvent) {
  const db = getDb();
  db.prepare(`
    UPDATE jobs 
    SET status = ?, progress = ?, stage = ?, error = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(event.status, event.progress, event.stage, event.error || null, event.jobId);

  const jobListeners = listeners.get(event.jobId);
  if (jobListeners) {
    jobListeners.forEach((listener) => listener(event));
  }
}

export async function runFullPipelineForPerson(
  jobId: string,
  personId: string,
  linkedinUrl: string,
  instagramUrl: string,
  interestedIn: string = 'open'
) {
  const db = getDb();

  try {
    emitJobEvent({
      jobId,
      status: 'running',
      stage: 'Scraping public profiles',
      progress: 10,
      message: 'Connecting to Apify actors for Instagram and LinkedIn data...',
    });

    // 1. Scrape
    const scraped = await scrapePerson(linkedinUrl, instagramUrl, (stageDesc, pct) => {
      emitJobEvent({
        jobId,
        status: 'running',
        stage: stageDesc,
        progress: pct,
      });
    });

    const slug = linkedinUrl.split('/in/')[1]?.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase() || `user-${Date.now()}`;

    // Update person in DB
    db.prepare(`
      UPDATE people
      SET name = ?, photo_url = ?, city = ?, raw_linkedin = ?, raw_instagram = ?, images = ?, identity_check = ?
      WHERE id = ?
    `).run(
      scraped.name,
      scraped.photoUrl,
      scraped.city,
      JSON.stringify(scraped.rawLinkedIn),
      JSON.stringify(scraped.rawInstagram),
      JSON.stringify(scraped.images),
      JSON.stringify(scraped.identityCheck),
      personId
    );

    // 2. Vision Pass
    emitJobEvent({
      jobId,
      status: 'running',
      stage: 'Reading photos with Vision AI',
      progress: 45,
      message: 'Extracting scene, activity, and lifestyle tags from profile images...',
    });
    const visionTags = await runVisionPass(scraped.images);

    // 3. Synthesis Pass (Psychological Profile)
    emitJobEvent({
      jobId,
      status: 'running',
      stage: 'Synthesizing psychological profile',
      progress: 60,
      message: 'Building needs, hobbies, interests, values, and 150-word dating persona...',
    });
    const profile = await runSynthesisPass(
      scraped.name,
      scraped.city,
      scraped.rawLinkedIn,
      scraped.rawInstagram,
      visionTags
    );

    db.prepare(`
      INSERT OR REPLACE INTO profiles (
        person_id, summary, needs, hobbies, interests, values_json, personality, lifestyle,
        communication_style, relationship_signals, friction_points, dating_persona,
        overall_confidence, data_quality
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      personId,
      profile.summary,
      JSON.stringify(profile.needs),
      JSON.stringify(profile.hobbies),
      JSON.stringify(profile.interests),
      JSON.stringify(profile.values),
      JSON.stringify(profile.personality),
      JSON.stringify(profile.lifestyle),
      profile.communication_style,
      JSON.stringify(profile.relationship_signals),
      JSON.stringify(profile.friction_points),
      profile.dating_persona,
      profile.overall_confidence,
      profile.data_quality
    );

    // 4. Quick Screen against candidate pool
    emitJobEvent({
      jobId,
      status: 'running',
      stage: 'Screening match candidate pool',
      progress: 75,
      message: 'Executing fast-screen model across all eligible candidates...',
    });

    const candidateRows = db.prepare('SELECT p.*, pr.* FROM people p JOIN profiles pr ON p.id = pr.person_id WHERE p.id != ?').all(personId) as any[];

    const currentPersonRecord = {
      id: personId,
      name: scraped.name,
      city: scraped.city,
      summary: profile.summary,
      needs: profile.needs,
      interests: profile.interests,
      lifestyle: profile.lifestyle,
      profile,
    };

    const screenScores: Array<{ candidate: any; score: number; shared: string[]; tension: string[]; rationale: string }> = [];

    for (const cand of candidateRows) {
      const candProfile = {
        name: cand.name,
        city: cand.city,
        summary: cand.summary,
        needs: cand.needs ? JSON.parse(cand.needs) : [],
        interests: cand.interests ? JSON.parse(cand.interests) : [],
        lifestyle: cand.lifestyle ? JSON.parse(cand.lifestyle) : [],
        values: cand.values_json ? JSON.parse(cand.values_json) : [],
        dating_persona: cand.dating_persona,
      };

      const screen = await runQuickScreen(currentPersonRecord, candProfile);

      db.prepare(`
        INSERT OR REPLACE INTO screens (a_id, b_id, score, shared, tension, rationale)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(personId, cand.id, screen.score, JSON.stringify(screen.shared), JSON.stringify(screen.tension), screen.rationale);

      screenScores.push({
        candidate: { ...cand, profile: candProfile },
        score: screen.score,
        shared: screen.shared,
        tension: screen.tension,
        rationale: screen.rationale,
      });
    }

    // Sort by screen score descending
    screenScores.sort((a, b) => b.score - a.score);

    // 5. Full Dates with Top 5
    const top5 = screenScores.slice(0, 5);
    emitJobEvent({
      jobId,
      status: 'running',
      stage: 'Simulating autonomous multi-turn dates',
      progress: 85,
      message: `Running 5 simulated dates for top candidates...`,
    });

    const dateVerdicts = new Map<string, { verdictA: any; verdictB: any; dateId: string }>();

    for (let i = 0; i < top5.length; i++) {
      const { candidate } = top5[i];
      const venue = await selectVenue(currentPersonRecord, candidate);

      const dateId = `date-${Date.now()}-${i}`;
      const transcript = await simulateDateConversation(
        currentPersonRecord,
        candidate,
        venue,
        (turn) => {
          emitJobEvent({
            jobId,
            status: 'running',
            stage: `Simulating date with ${candidate.name}`,
            progress: 85 + Math.round((i / top5.length) * 10),
            dateMessage: turn,
          });
        }
      );

      const verdictA = await debriefDate(currentPersonRecord, candidate, venue, transcript);
      const verdictB = await debriefDate(candidate, currentPersonRecord, venue, transcript);

      db.prepare(`
        INSERT OR REPLACE INTO dates (id, a_id, b_id, venue, transcript, verdict_a, verdict_b, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')
      `).run(
        dateId,
        personId,
        candidate.id,
        JSON.stringify(venue),
        JSON.stringify(transcript),
        JSON.stringify(verdictA),
        JSON.stringify(verdictB)
      );

      dateVerdicts.set(candidate.id, { verdictA, verdictB, dateId });
    }

    // 6. Compute Rankings
    emitJobEvent({
      jobId,
      status: 'running',
      stage: 'Calculating final compatibility rankings',
      progress: 95,
      message: 'Generating evidence-backed match fit analysis and friction warnings...',
    });

    const rankedCandidates: Array<{ candidateId: string; rank: number; score: number; whyFits: string; watchOut: string }> = [];

    for (let i = 0; i < screenScores.length; i++) {
      const item = screenScores[i];
      const candId = item.candidate.id;
      const dateInfo = dateVerdicts.get(candId);

      const { score, isFullDate } = calculateScore(
        item.score,
        dateInfo ? dateInfo.verdictA.chemistry : undefined,
        dateInfo ? dateInfo.verdictB.chemistry : undefined
      );

      const explanation = await generateRankingExplanation(
        currentPersonRecord,
        item.candidate,
        score,
        isFullDate
      );

      rankedCandidates.push({
        candidateId: candId,
        rank: i + 1,
        score,
        whyFits: explanation.why_fits,
        watchOut: explanation.watch_out,
      });
    }

    // Sort by calculated score descending
    rankedCandidates.sort((a, b) => b.score - a.score);

    // Save rankings
    db.prepare('DELETE FROM rankings WHERE person_id = ?').run(personId);
    const insertRankStmt = db.prepare(`
      INSERT INTO rankings (person_id, candidate_id, rank, score, why_fits, watch_out, sources)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    rankedCandidates.forEach((rc, idx) => {
      insertRankStmt.run(
        personId,
        rc.candidateId,
        idx + 1,
        rc.score,
        rc.whyFits,
        rc.watchOut,
        JSON.stringify({ linkedin: true, instagram: true })
      );
    });

    emitJobEvent({
      jobId,
      status: 'completed',
      stage: 'Finished',
      progress: 100,
      message: 'Profile synthesized, dates completed, and rankings calculated.',
    });
  } catch (err: any) {
    console.error(`Pipeline job ${jobId} failed:`, err);
    emitJobEvent({
      jobId,
      status: 'failed',
      stage: 'Error occurred',
      progress: 0,
      error: err.message || 'Pipeline processing failed',
    });
  }
}
