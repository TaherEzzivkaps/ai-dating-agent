import { getDb } from '../lib/db';
import { runSynthesisPass } from '../lib/analyst';
import { runQuickScreen, selectVenue, simulateDateConversation, debriefDate } from '../lib/dating';
import { calculateScore, generateRankingExplanation } from '../lib/ranking';

export async function runAllPipeline() {
  const db = getDb();
  const people = db.prepare('SELECT * FROM people WHERE is_demo = 1').all() as any[];

  console.log(`Starting run-all pipeline for ${people.length} demo candidates...`);

  // 1. Synthesize profiles if missing
  for (const person of people) {
    const existing = db.prepare('SELECT * FROM profiles WHERE person_id = ?').get(person.id);
    if (!existing) {
      console.log(`Synthesizing profile for ${person.name}...`);
      const profile = await runSynthesisPass(
        person.name,
        person.city || 'San Francisco, CA',
        { name: person.name, headline: `${person.name} • Professional`, location: person.city },
        { fullName: person.name, biography: `Creative explorer based in ${person.city}. Public persona.` },
        ['creative', 'outdoors', 'specialty coffee', 'design', 'urban exploration']
      );

      db.prepare(`
        INSERT OR REPLACE INTO profiles (
          person_id, summary, needs, hobbies, interests, values_json, personality, lifestyle,
          communication_style, relationship_signals, friction_points, dating_persona,
          overall_confidence, data_quality
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        person.id,
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
    }
  }

  // 2. Pairwise Screens
  console.log('Running Pairwise Screens across all demo candidates...');
  const allPeople = db.prepare('SELECT p.*, pr.* FROM people p JOIN profiles pr ON p.id = pr.person_id WHERE p.is_demo = 1').all() as any[];

  for (let i = 0; i < allPeople.length; i++) {
    for (let j = i + 1; j < allPeople.length; j++) {
      const pA = allPeople[i];
      const pB = allPeople[j];

      const existingScreen = db.prepare('SELECT * FROM screens WHERE (a_id = ? AND b_id = ?) OR (a_id = ? AND b_id = ?)').get(pA.id, pB.id, pB.id, pA.id);
      if (!existingScreen) {
        const screen = await runQuickScreen(
          {
            name: pA.name,
            city: pA.city,
            summary: pA.summary,
            needs: pA.needs ? JSON.parse(pA.needs) : [],
            interests: pA.interests ? JSON.parse(pA.interests) : [],
            lifestyle: pA.lifestyle ? JSON.parse(pA.lifestyle) : [],
          },
          {
            name: pB.name,
            city: pB.city,
            summary: pB.summary,
            needs: pB.needs ? JSON.parse(pB.needs) : [],
            interests: pB.interests ? JSON.parse(pB.interests) : [],
            lifestyle: pB.lifestyle ? JSON.parse(pB.lifestyle) : [],
          }
        );

        db.prepare(`
          INSERT OR REPLACE INTO screens (a_id, b_id, score, shared, tension, rationale)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(pA.id, pB.id, screen.score, JSON.stringify(screen.shared), JSON.stringify(screen.tension), screen.rationale);
      }
    }
  }

  // 3. Top Dates for each candidate
  console.log('Simulating full dates for top pairs...');
  for (const person of allPeople) {
    const topScreens = db.prepare(`
      SELECT 
        CASE WHEN a_id = ? THEN b_id ELSE a_id END as candidate_id,
        score
      FROM screens
      WHERE a_id = ? OR b_id = ?
      ORDER BY score DESC
      LIMIT 5
    `).all(person.id, person.id, person.id) as any[];

    for (const item of topScreens) {
      const existingDate = db.prepare('SELECT id FROM dates WHERE (a_id = ? AND b_id = ?) OR (a_id = ? AND b_id = ?)').get(person.id, item.candidate_id, item.candidate_id, person.id);
      if (!existingDate) {
        const cand = db.prepare('SELECT p.*, pr.* FROM people p JOIN profiles pr ON p.id = pr.person_id WHERE p.id = ?').get(item.candidate_id) as any;
        if (!cand) continue;

        const candObj = {
          ...cand,
          profile: {
            summary: cand.summary,
            interests: cand.interests ? JSON.parse(cand.interests) : [],
            values: cand.values_json ? JSON.parse(cand.values_json) : [],
            dating_persona: cand.dating_persona,
          },
        };

        const personObj = {
          ...person,
          profile: {
            summary: person.summary,
            interests: person.interests ? JSON.parse(person.interests) : [],
            values: person.values_json ? JSON.parse(person.values_json) : [],
            dating_persona: person.dating_persona,
          },
        };

        const venue = await selectVenue(personObj, candObj);
        const transcript = await simulateDateConversation(personObj, candObj, venue);
        const verdictA = await debriefDate(personObj, candObj, venue, transcript);
        const verdictB = await debriefDate(candObj, personObj, venue, transcript);

        const dateId = `date-${person.slug}-${cand.slug}`;
        db.prepare(`
          INSERT OR REPLACE INTO dates (id, a_id, b_id, venue, transcript, verdict_a, verdict_b, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')
        `).run(
          dateId,
          person.id,
          cand.id,
          JSON.stringify(venue),
          JSON.stringify(transcript),
          JSON.stringify(verdictA),
          JSON.stringify(verdictB)
        );
      }
    }
  }

  // 4. Compute Rankings for all
  console.log('Calculating rankings for all candidates...');
  for (const person of allPeople) {
    const screens = db.prepare(`
      SELECT 
        CASE WHEN a_id = ? THEN b_id ELSE a_id END as candidate_id,
        score
      FROM screens
      WHERE a_id = ? OR b_id = ?
    `).all(person.id, person.id, person.id) as any[];

    const ranked: any[] = [];
    for (const item of screens) {
      const dateRow = db.prepare('SELECT verdict_a, verdict_b FROM dates WHERE (a_id = ? AND b_id = ?) OR (a_id = ? AND b_id = ?)').get(person.id, item.candidate_id, item.candidate_id, person.id) as any;
      let vA: number | undefined;
      let vB: number | undefined;
      if (dateRow) {
        const parsedA = JSON.parse(dateRow.verdict_a);
        const parsedB = JSON.parse(dateRow.verdict_b);
        vA = parsedA.chemistry;
        vB = parsedB.chemistry;
      }

      const { score, isFullDate } = calculateScore(item.score, vA, vB);
      ranked.push({ candidateId: item.candidate_id, score, isFullDate });
    }

    ranked.sort((a, b) => b.score - a.score);

    db.prepare('DELETE FROM rankings WHERE person_id = ?').run(person.id);
    const insertRank = db.prepare(`
      INSERT INTO rankings (person_id, candidate_id, rank, score, why_fits, watch_out, sources)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (let r = 0; r < ranked.length; r++) {
      const candItem = ranked[r];
      insertRank.run(
        person.id,
        candItem.candidateId,
        r + 1,
        candItem.score,
        'High conversational affinity and aligned creative values with mutual resonance.',
        'May require coordinating synchronous time around heavy focus sprint cycles.',
        JSON.stringify({ linkedin: true, instagram: true })
      );
    }
  }

  console.log('Full demo dataset successfully generated and stored in SQLite.');
}

if (require.main === module) {
  runAllPipeline().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
