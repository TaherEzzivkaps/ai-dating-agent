import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const db = getDb();
    const person = db.prepare('SELECT * FROM people WHERE slug = ?').get(params.slug) as any;

    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    const profile = db.prepare('SELECT * FROM profiles WHERE person_id = ?').get(person.id) as any;

    return NextResponse.json({
      person: {
        id: person.id,
        slug: person.slug,
        name: person.name,
        city: person.city,
        photo_url: person.photo_url,
        linkedin_url: person.linkedin_url,
        instagram_url: person.instagram_url,
        images: person.images ? JSON.parse(person.images) : [],
        identity_check: person.identity_check ? JSON.parse(person.identity_check) : null,
        interested_in: person.interested_in,
        is_demo: Boolean(person.is_demo),
        raw_linkedin: person.raw_linkedin ? JSON.parse(person.raw_linkedin) : null,
        raw_instagram: person.raw_instagram ? JSON.parse(person.raw_instagram) : null,
      },
      profile: profile
        ? {
            summary: profile.summary,
            needs: profile.needs ? JSON.parse(profile.needs) : [],
            hobbies: profile.hobbies ? JSON.parse(profile.hobbies) : [],
            interests: profile.interests ? JSON.parse(profile.interests) : [],
            values: profile.values_json ? JSON.parse(profile.values_json) : [],
            personality: profile.personality ? JSON.parse(profile.personality) : [],
            lifestyle: profile.lifestyle ? JSON.parse(profile.lifestyle) : [],
            communication_style: profile.communication_style,
            relationship_signals: profile.relationship_signals ? JSON.parse(profile.relationship_signals) : [],
            friction_points: profile.friction_points ? JSON.parse(profile.friction_points) : [],
            dating_persona: profile.dating_persona,
            overall_confidence: profile.overall_confidence,
            data_quality: profile.data_quality,
          }
        : null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const adminKey = req.headers.get('x-admin-key') || req.nextUrl.searchParams.get('admin_key');
    const isPublicRequest = req.nextUrl.searchParams.get('public_request') === 'true';

    if (!isPublicRequest && adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized: Invalid credentials.' }, { status: 401 });
    }

    const db = getDb();
    const person = db.prepare('SELECT id, is_demo FROM people WHERE slug = ?').get(params.slug) as any;

    if (!person) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    }

    if (isPublicRequest && person.is_demo) {
      return NextResponse.json({ success: true, message: 'Removal ticket logged for demo profile review.' });
    }

    db.prepare('DELETE FROM rankings WHERE person_id = ? OR candidate_id = ?').run(person.id, person.id);
    db.prepare('DELETE FROM screens WHERE a_id = ? OR b_id = ?').run(person.id, person.id);
    db.prepare('DELETE FROM dates WHERE a_id = ? OR b_id = ?').run(person.id, person.id);
    db.prepare('DELETE FROM profiles WHERE person_id = ?').run(person.id);
    db.prepare('DELETE FROM people WHERE id = ?').run(person.id);

    return NextResponse.json({ success: true, message: `Profile ${params.slug} and all associated records deleted.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
