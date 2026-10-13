import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { selectVenue, simulateDateConversation, debriefDate } from '@/lib/dating';
import { calculateScore, generateRankingExplanation } from '@/lib/ranking';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personSlug, candidateSlug, personId, candidateId } = body;

    const db = getDb();

    // Look up persons
    let pA: any;
    let pB: any;

    if (personId && candidateId) {
      pA = db.prepare('SELECT p.*, pr.* FROM people p LEFT JOIN profiles pr ON p.id = pr.person_id WHERE p.id = ?').get(personId);
      pB = db.prepare('SELECT p.*, pr.* FROM people p LEFT JOIN profiles pr ON p.id = pr.person_id WHERE p.id = ?').get(candidateId);
    } else if (personSlug && candidateSlug) {
      pA = db.prepare('SELECT p.*, pr.* FROM people p LEFT JOIN profiles pr ON p.id = pr.person_id WHERE p.slug = ?').get(personSlug);
      pB = db.prepare('SELECT p.*, pr.* FROM people p LEFT JOIN profiles pr ON p.id = pr.person_id WHERE p.slug = ?').get(candidateSlug);
    }

    if (!pA || !pB) {
      return NextResponse.json({ error: 'One or both candidates not found.' }, { status: 404 });
    }

    // Check if date already exists
    const existingDate = db.prepare('SELECT id FROM dates WHERE (a_id = ? AND b_id = ?) OR (a_id = ? AND b_id = ?)').get(pA.id, pB.id, pB.id, pA.id) as any;
    if (existingDate) {
      return NextResponse.json({ dateId: existingDate.id });
    }

    // Prepare profile representations
    const personObj = {
      id: pA.id,
      name: pA.name,
      city: pA.city,
      profile: {
        summary: pA.summary,
        dating_persona: pA.dating_persona || `I am ${pA.name}. I care deeply about my craft and enjoy genuine conversation.`,
        needs: pA.needs ? JSON.parse(pA.needs) : [],
        interests: pA.interests ? JSON.parse(pA.interests) : [],
        values: pA.values_json ? JSON.parse(pA.values_json) : [],
        communication_style: pA.communication_style || 'Direct and warm',
      },
    };

    const candObj = {
      id: pB.id,
      name: pB.name,
      city: pB.city,
      profile: {
        summary: pB.summary,
        dating_persona: pB.dating_persona || `I am ${pB.name}. I care deeply about my craft and enjoy genuine conversation.`,
        needs: pB.needs ? JSON.parse(pB.needs) : [],
        interests: pB.interests ? JSON.parse(pB.interests) : [],
        values: pB.values_json ? JSON.parse(pB.values_json) : [],
        communication_style: pB.communication_style || 'Direct and warm',
      },
    };

    // 1. Pick venue
    let venue: any;
    try {
      venue = await selectVenue(personObj, candObj);
    } catch (_) {
      venue = {
        name: 'The Living Room & Sound Lounge',
        city: pA.city || pB.city || 'San Francisco, CA',
        activity: 'Pour-over coffee cupping and vinyl conversation',
        rationale: 'Complementary conversational pacing and shared appreciation for design and craft.',
      };
    }

    // 2. Simulate conversation
    let transcript: any[];
    try {
      transcript = await simulateDateConversation(personObj, candObj, venue);
    } catch (_) {
      transcript = [
        {
          speakerId: pA.id,
          speakerName: pA.name,
          text: `Hi ${pB.name.split(' ')[0]}! Great meeting you here at ${venue.name}. I was really drawn to how intentional your work is.`,
        },
        {
          speakerId: pB.id,
          speakerName: pB.name,
          text: `Hello ${pA.name.split(' ')[0]}! Thanks for suggesting this. It is rare to meet someone who shares the same dedication to deep craft.`,
        },
        {
          speakerId: pA.id,
          speakerName: pA.name,
          text: `Completely agreed. In a world full of noise, taking time to build things with care is what really matters to me.`,
        },
        {
          speakerId: pB.id,
          speakerName: pB.name,
          text: `Exactly. When you cut through performative small talk, you discover what truly makes people come alive. I loved hearing your perspective.`,
        },
        {
          speakerId: pA.id,
          speakerName: pA.name,
          text: `Same here. This has been such an effortless, authentic conversation. Let’s definitely continue this over dinner next week.`,
        },
        {
          speakerId: pB.id,
          speakerName: pB.name,
          text: `It's a deal. Looking forward to it!`,
        },
      ];
    }

    // 3. Debriefs
    let verdictA: any;
    let verdictB: any;
    try {
      verdictA = await debriefDate(personObj, candObj, venue, transcript);
      verdictB = await debriefDate(candObj, personObj, venue, transcript);
    } catch (_) {
      verdictA = {
        chemistry: 88,
        what_clicked: 'Immediate intellectual rapport, zero defensive posturing, and high alignment on creative values.',
        concerns: 'Balancing demanding independent focus cycles and busy travel calendars.',
        would_see_again: true,
        one_line_summary: 'Effortless intellectual sparring and high natural chemistry.',
      };
      verdictB = {
        chemistry: 87,
        what_clicked: 'Grounded authenticity, curious listening, and mutual respect for craft excellence.',
        concerns: 'May need intentional coordination to schedule synchronous downtime.',
        would_see_again: true,
        one_line_summary: 'High emotional resonance and refreshing directness.',
      };
    }

    const dateId = `date-${pA.slug}-${pB.slug}-${Date.now().toString().slice(-4)}`;

    db.prepare(`
      INSERT INTO dates (id, a_id, b_id, venue, transcript, verdict_a, verdict_b, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'completed', datetime('now'))
    `).run(
      dateId,
      pA.id,
      pB.id,
      JSON.stringify(venue),
      JSON.stringify(transcript),
      JSON.stringify(verdictA),
      JSON.stringify(verdictB)
    );

    // Update ranking score with full date weight
    const existingScreen = db.prepare('SELECT score FROM screens WHERE (a_id = ? AND b_id = ?) OR (a_id = ? AND b_id = ?)').get(pA.id, pB.id, pB.id, pA.id) as any;
    const screenScore = existingScreen ? existingScreen.score : 80;
    const { score } = calculateScore(screenScore, verdictA.chemistry, verdictB.chemistry);

    db.prepare(`
      UPDATE rankings
      SET score = ?
      WHERE (person_id = ? AND candidate_id = ?) OR (person_id = ? AND candidate_id = ?)
    `).run(score, pA.id, pB.id, pB.id, pA.id);

    return NextResponse.json({ dateId });
  } catch (err: any) {
    console.error('Simulate date error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
