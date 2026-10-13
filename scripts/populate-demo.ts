import { getDb } from '../lib/db';

async function main() {
  const db = getDb();
  const people = db.prepare('SELECT * FROM people WHERE is_demo = 1').all() as any[];

  console.log(`Populating rich dossiers for ${people.length} demo candidates...`);

  const demoTraits: Record<string, any> = {
    'elena-rostova': {
      summary: 'Staff Product Designer at Stripe with a focus on developer infrastructure and minimalist payment interfaces. Passionate about low-intervention natural wines, brutalist spatial architecture, and high-difficulty indoor bouldering.',
      needs: [
        {
          label: 'Intellectual Sparring Without Defensive Posturing',
          detail: 'Seeks partners who thrive in rapid conceptual debates regarding systems design, ethics, and typography without taking criticism personally.',
          evidence: [{ source: 'linkedin', ref: 'experience_stripe', quote_or_note: 'Staff Product Designer leading Developer Experience' }],
          confidence: 0.92,
        },
        {
          label: 'Respect for Creative Autonomy',
          detail: 'Maintains independent sabbatical periods and requires emotional security with solitude.',
          evidence: [{ source: 'instagram', ref: 'post_sabbatical_kyoto', quote_or_note: 'Three weeks in Kyoto studios studying woodblock textures' }],
          confidence: 0.88,
        },
      ],
      hobbies: [
        {
          label: 'V6+ Indoor Bouldering',
          detail: 'Trains 3 mornings a week at Dogpatch Boulders; focuses on dynamic technical problem solving.',
          evidence: [{ source: 'instagram', ref: 'post_dogpatch_v6', quote_or_note: 'Finally sent the sloper problem after four sessions' }],
          confidence: 0.95,
        },
        {
          label: 'Low-Intervention Natural Wines & Fermentation',
          detail: 'Collects unfiltered pet-nat and orange wines from Jura and Georgia.',
          evidence: [{ source: 'instagram', ref: 'caption_jura_harvest', quote_or_note: 'Skin-contact ribolla with natural ambient yeasts' }],
          confidence: 0.91,
        },
      ],
      interests: [
        {
          label: 'Brutalist Architecture & Mid-Century Design',
          detail: 'Admires Marcel Breuer and Scandinavian modernist furniture.',
          evidence: [{ source: 'instagram', ref: 'post_breuer_building', quote_or_note: 'Form following concrete gravity' }],
          confidence: 0.89,
        },
      ],
      values: [
        {
          label: 'Radical Craft Excellence',
          detail: 'Disdain for corporate buzzwords, prioritizing tactile precision and tangible utility.',
          evidence: [{ source: 'linkedin', ref: 'about_section', quote_or_note: 'Design is how systems endure under pressure' }],
          confidence: 0.94,
        },
      ],
      personality: [
        {
          label: 'High Openness & Warm Dry Humor',
          detail: 'Engages in dry, understated banter; avoids small talk in favor of exploratory discussion.',
          evidence: [{ source: 'instagram', ref: 'bio_satire', quote_or_note: 'Making software slightly less agonizing' }],
          confidence: 0.87,
        },
      ],
      lifestyle: [
        {
          label: 'Early Riser with Focused Deep Work Blocks',
          detail: 'Protects morning hours for espresso extraction and creative sprints.',
          evidence: [{ source: 'instagram', ref: 'post_morning_workflow', quote_or_note: '06:30 cortado before the slack flood' }],
          confidence: 0.9,
        },
      ],
      communication_style: 'Understated, dry wit, direct and thoughtful without corporate ornamentation.',
      relationship_signals: [
        {
          label: 'Unstated / Looking for Long-Term Resonance',
          detail: 'Independent lifestyle, seeking synchronous partnership with mutual growth.',
          evidence: [{ source: 'instagram', ref: 'bio_openness', quote_or_note: 'Based in SF & travel cycles' }],
          confidence: 0.75,
        },
      ],
      friction_points: [
        {
          label: 'International Q1 Travel Cycles',
          detail: 'Frequent travel between San Francisco, Tokyo, and London can stress asynchronous communication.',
          evidence: [{ source: 'linkedin', ref: 'talks_conferences', quote_or_note: 'Keynotes scheduled across EU & Asia' }],
          confidence: 0.84,
        },
      ],
      dating_persona: 'I value intentional conversations that skip polite corporate pleasantries. I spend my days shaping developer tools and my evenings climbing or hunting down unusual natural wines. I am looking for someone with fierce intellectual curiosity, unpretentious humor, and their own deep creative pursuits.',
      overall_confidence: 0.92,
      data_quality: 'rich',
    },
    'marcus-vance': {
      summary: 'Founder and Generative Audio Architect at ArchiMetric in San Francisco. Dedicated to physical analog vinyl preservation, algorithmic sound synthesis, and high-altitude alpine trail exploration.',
      needs: [
        {
          label: 'Aesthetic & Auditory Symmetry',
          detail: 'Drawn to partners with deep tactile appreciation for craft, materials, and acoustics.',
          evidence: [{ source: 'linkedin', ref: 'founder_archimetric', quote_or_note: 'Architecting generative spatial acoustics' }],
          confidence: 0.94,
        },
      ],
      hobbies: [
        {
          label: 'Analog Vinyl Archeology',
          detail: 'Curates rare Japanese ambient pressings and European jazz pressings from the 1970s.',
          evidence: [{ source: 'instagram', ref: 'post_tokyo_vinyl_haul', quote_or_note: 'Mint pressing of Hiroshi Yoshimura discovered in Shibuya' }],
          confidence: 0.96,
        },
      ],
      interests: [
        {
          label: 'Modular Synthesizers & Acoustic Physics',
          detail: 'Builds custom Eurorack modules and explores psychoacoustics.',
          evidence: [{ source: 'linkedin', ref: 'patents_spatial_audio', quote_or_note: 'Patents in binaural synthesis algorithms' }],
          confidence: 0.93,
        },
      ],
      values: [
        {
          label: 'Creative Autonomy and Craft',
          detail: 'Values self-directed exploration over traditional corporate ladders.',
          evidence: [{ source: 'linkedin', ref: 'founder_story', quote_or_note: 'Left Big Tech to pursue acoustic purity' }],
          confidence: 0.95,
        },
      ],
      personality: [
        {
          label: 'Calm, Deeply Curious & Attentive',
          detail: 'Listens with rare focus; enjoys playful technical debates.',
          evidence: [{ source: 'instagram', ref: 'caption_listening_room', quote_or_note: 'The room responds when you stop talking' }],
          confidence: 0.9,
        },
      ],
      lifestyle: [
        {
          label: 'Alpine Escapes & Minimalist Urban Life',
          detail: 'Splits time between the Mission District and Sierra backcountry huts.',
          evidence: [{ source: 'instagram', ref: 'post_tahoe_ridge', quote_or_note: 'Dawn ridge run before the studio session' }],
          confidence: 0.88,
        },
      ],
      communication_style: 'Warm, measured, thoughtful, and punctuated with wry observation.',
      relationship_signals: [
        {
          label: 'Ready for Meaningful Partnership',
          detail: 'Established founder lifestyle seeking authentic companionship.',
          evidence: [{ source: 'instagram', ref: 'caption_home_studio', quote_or_note: 'Building roots in SF' }],
          confidence: 0.8,
        },
      ],
      friction_points: [
        {
          label: 'Deep Focus Immersion Modes',
          detail: 'Can become engrossed in studio acoustics for 14-hour stretches.',
          evidence: [{ source: 'linkedin', ref: 'release_schedule', quote_or_note: 'Product sprint deep work cycles' }],
          confidence: 0.82,
        },
      ],
      dating_persona: 'I find joy in discovering how things sound and feel at their foundational level. Whether we are discussing physical record grooves, architecture, or climbing routes, I appreciate honest curiosity and warm laughter. Let us skip performative small talk and share what genuinely moves us.',
      overall_confidence: 0.94,
      data_quality: 'rich',
    },
  };

  for (const p of people) {
    const t = demoTraits[p.slug] || {
      summary: `${p.name} is an accomplished professional based in ${p.city}. Passionate about design, creative problem solving, and urban exploration.`,
      needs: [
        {
          label: 'Authentic Mutual Curiosity',
          detail: 'Desires transparent communication and shared ambition.',
          evidence: [{ source: 'linkedin', ref: 'profile_summary', quote_or_note: 'Driven by impactful projects' }],
          confidence: 0.85,
        },
      ],
      hobbies: [
        {
          label: 'Urban & Outdoor Exploration',
          detail: 'Frequent weekend hikes, coffee scouting, and cultural exhibits.',
          evidence: [{ source: 'instagram', ref: 'recent_posts', quote_or_note: 'Exploring weekend spots' }],
          confidence: 0.88,
        },
      ],
      interests: [
        {
          label: 'Design & Modern Technology',
          detail: 'Keen interest in future-facing interfaces and cultural trends.',
          evidence: [{ source: 'linkedin', ref: 'skills_section', quote_or_note: 'Design & Technology' }],
          confidence: 0.86,
        },
      ],
      values: [
        {
          label: 'Integrity and Growth',
          detail: 'Dedicated to craftsmanship and personal evolution.',
          evidence: [{ source: 'linkedin', ref: 'career_history', quote_or_note: 'Consistent advancement and leadership' }],
          confidence: 0.9,
        },
      ],
      personality: [
        {
          label: 'Warm, Engaging & Balanced',
          detail: 'Friendly demeanor with a thoughtful conversational cadence.',
          evidence: [{ source: 'instagram', ref: 'bio_highlights', quote_or_note: 'Living fully and curiously' }],
          confidence: 0.84,
        },
      ],
      lifestyle: [
        {
          label: 'Active & Mindful',
          detail: 'Balances intense professional focus with restorative recreation.',
          evidence: [{ source: 'instagram', ref: 'activity_photos', quote_or_note: 'Fitness and city life' }],
          confidence: 0.87,
        },
      ],
      communication_style: 'Warm, articulate, and receptive.',
      relationship_signals: [
        {
          label: 'Open to Meaningful Connection',
          detail: 'Clear intentionality in finding a compatible partner.',
          evidence: [{ source: 'instagram', ref: 'bio', quote_or_note: 'Public persona' }],
          confidence: 0.78,
        },
      ],
      friction_points: [
        {
          label: 'Demanding Professional Sprint Cycles',
          detail: 'Work obligations require intentional calendar alignment.',
          evidence: [{ source: 'linkedin', ref: 'role_requirements', quote_or_note: 'High-responsibility career' }],
          confidence: 0.8,
        },
      ],
      dating_persona: `I am ${p.name}. I care deeply about my craft and bringing genuine curiosity to everything I do. On a date, I enjoy discovering what someone cares about most when no one is watching.`,
      overall_confidence: 0.89,
      data_quality: 'rich',
    };

    db.prepare(`
      INSERT OR REPLACE INTO profiles (
        person_id, summary, needs, hobbies, interests, values_json, personality, lifestyle,
        communication_style, relationship_signals, friction_points, dating_persona,
        overall_confidence, data_quality
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      p.id,
      t.summary,
      JSON.stringify(t.needs),
      JSON.stringify(t.hobbies),
      JSON.stringify(t.interests),
      JSON.stringify(t.values),
      JSON.stringify(t.personality),
      JSON.stringify(t.lifestyle),
      t.communication_style,
      JSON.stringify(t.relationship_signals),
      JSON.stringify(t.friction_points),
      t.dating_persona,
      t.overall_confidence,
      t.data_quality
    );
  }

  // Pre-seed Pairwise Screens across all pairs
  console.log('Generating pairwise screen affinities for 25 candidates...');
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const pA = people[i];
      const pB = people[j];

      // Calculate deterministic compatibility score
      let score = 70 + ((pA.name.length * pB.name.length * 13) % 25);
      if (
        (pA.slug.includes('elena') && pB.slug.includes('marcus')) ||
        (pA.slug.includes('marcus') && pB.slug.includes('elena'))
      ) {
        score = 94;
      } else if (
        (pA.slug.includes('elena') && pB.slug.includes('julian')) ||
        (pA.slug.includes('julian') && pB.slug.includes('elena'))
      ) {
        score = 89;
      }

      db.prepare(`
        INSERT OR REPLACE INTO screens (a_id, b_id, score, shared, tension, rationale)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        pA.id,
        pB.id,
        score,
        JSON.stringify(['Design Systems', 'Specialty Coffee', 'Creative Autonomy']),
        JSON.stringify(['Synchronous Calendar Alignment']),
        'Strong resonance across creative disciplines and tactile appreciation of craft.'
      );
    }
  }

  // Pre-seed Flagship Featured Date (Elena Rostova & Marcus Vance)
  console.log('Generating flagship simulated date for Elena & Marcus...');
  const elena = people.find((p: any) => p.slug === 'elena-rostova');
  const marcus = people.find((p: any) => p.slug === 'marcus-vance');

  if (elena && marcus) {
    const venue = {
      name: 'Bar Gemini & Vinyl Soundroom',
      city: 'San Francisco, CA',
      activity: 'Low-intervention natural wine tasting and ambient vinyl listening',
      rationale: 'Directly bridges Elena’s documented natural wine passion and Marcus’s acoustic sound architecture research.',
    };

    const transcript = [
      {
        speakerId: elena.id,
        speakerName: 'Elena Rostova',
        text: 'Hi Marcus! When I saw you picked Bar Gemini, I was impressed—they just tapped a skin-contact Ribolla Gialla from Friuli that I’ve been hunting down for months.',
      },
      {
        speakerId: marcus.id,
        speakerName: 'Marcus Vance',
        text: 'Good evening Elena! I noticed their analog sound system too—they’re running vintage Tannoy dual-concentric monitors through a tube preamp. It gives the room such a tactile warmth.',
      },
      {
        speakerId: elena.id,
        speakerName: 'Elena Rostova',
        text: 'Tactile warmth is rare in software these days. Everything is polished to a sterile glassy sheen. That’s partly why I spend my weekends bouldering—at least gravity doesn’t have an A/B test.',
      },
      {
        speakerId: marcus.id,
        speakerName: 'Marcus Vance',
        text: 'Haha, exactly! In acoustic engineering, we say you can’t compress physical air pressure without losing the soul of the room. Do you train outdoors often, or mostly at Dogpatch?',
      },
      {
        speakerId: elena.id,
        speakerName: 'Elena Rostova',
        text: 'Dogpatch during sprint weeks, but whenever I can escape, Castle Rock or Bishop. There’s something meditative about working a single V6 problem for three hours with zero distractions.',
      },
      {
        speakerId: marcus.id,
        speakerName: 'Marcus Vance',
        text: 'I relate to that completely. When I’m voicing a new spatial audio driver, I will sit with the same twelve bars of Hiroshi Yoshimura for an entire evening until the reflections disappear.',
      },
      {
        speakerId: elena.id,
        speakerName: 'Elena Rostova',
        text: 'Yoshimura! Green is one of my all-time favorite records to design to. It feels like clean morning light filtered through shoji screens.',
      },
      {
        speakerId: marcus.id,
        speakerName: 'Marcus Vance',
        text: 'You have immaculate taste, Elena. I actually found an original 1986 Japanese pressing in Shibuya last spring. We should listen to it properly on my turntable setup.',
      },
      {
        speakerId: elena.id,
        speakerName: 'Elena Rostova',
        text: 'Only if I get to bring a bottle of unfiltered Jura orange wine to accompany it. Deal?',
      },
      {
        speakerId: marcus.id,
        speakerName: 'Marcus Vance',
        text: 'Deal. It is rare to meet someone who shares the exact same sensory frequency. This has been a breath of fresh air.',
      },
    ];

    const verdictA = {
      chemistry: 94,
      what_clicked: 'Effortless intellectual sparring matched with shared tactile design appreciation. Zero posturing and immediate resonance on creative autonomy.',
      concerns: 'Both principals maintain intense international travel cycles in Q1 (Tokyo and London respectively), requiring high intentionality to bridge synchronous schedule gaps.',
      would_see_again: true,
      one_line_summary: 'Rare sensory and creative symmetry with an effortless natural flow.',
    };

    const verdictB = {
      chemistry: 93,
      what_clicked: 'Understated dry humor, mutual love for Yoshimura ambient vinyl, and deep respect for physical craft over corporate hype.',
      concerns: 'Deep focus immersion habits might lead to occasional asynchronous communication lapses.',
      would_see_again: true,
      one_line_summary: 'Exceptional resonance across aesthetic, intellectual, and lifestyle vectors.',
    };

    db.prepare(`
      INSERT OR REPLACE INTO dates (id, a_id, b_id, venue, transcript, verdict_a, verdict_b, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'completed')
    `).run(
      'date-elena-marcus-flagship',
      elena.id,
      marcus.id,
      JSON.stringify(venue),
      JSON.stringify(transcript),
      JSON.stringify(verdictA),
      JSON.stringify(verdictB)
    );
  }

  // Pre-seed Rankings for each demo person
  console.log('Calculating rankings across demo candidate pool...');
  for (const person of people) {
    const screens = db.prepare(`
      SELECT 
        CASE WHEN a_id = ? THEN b_id ELSE a_id END as candidate_id,
        score
      FROM screens
      WHERE a_id = ? OR b_id = ?
      ORDER BY score DESC
    `).all(person.id, person.id, person.id) as any[];

    db.prepare('DELETE FROM rankings WHERE person_id = ?').run(person.id);
    const insertRank = db.prepare(`
      INSERT INTO rankings (person_id, candidate_id, rank, score, why_fits, watch_out, sources)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    screens.forEach((item: any, idx: number) => {
      let isFeatured = (person.slug === 'elena-rostova' && item.candidate_id === marcus?.id) ||
                       (person.slug === 'marcus-vance' && item.candidate_id === elena?.id);
      let calculatedScore = isFeatured ? 92.4 : Math.round(item.score * 0.88 * 10) / 10;

      insertRank.run(
        person.id,
        item.candidate_id,
        idx + 1,
        calculatedScore,
        isFeatured
          ? 'Effortless intellectual sparring matched with shared tactile design appreciation. Both prioritize physical craft and acoustic precision.'
          : 'High cognitive symmetry and aligned creative curiosity without corporate posturing.',
        isFeatured
          ? 'Both principals maintain intense international travel cycles in Q1, requiring high intentionality to bridge synchronous schedule gaps.'
          : 'Asynchronous communication rhythms may require coordination around heavy focus sprint cycles.',
        JSON.stringify({ linkedin: true, instagram: true })
      );
    });
  }

  console.log('Finished populating rich demo dossiers, simulated dates, and rankings in SQLite.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
