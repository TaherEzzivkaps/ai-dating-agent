import { NextRequest, NextResponse } from 'next/server';
import { runAllPipeline } from '@/scripts/run-all';

export async function POST(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key') || req.nextUrl.searchParams.get('admin_key');
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json({ error: 'Unauthorized: Invalid admin key' }, { status: 401 });
    }

    // Run in background so request does not timeout
    setTimeout(() => {
      runAllPipeline().catch((err) => console.error('Admin run-all error:', err));
    }, 50);

    return NextResponse.json({ success: true, message: 'Batch run-all pipeline initiated in background.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
