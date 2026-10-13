import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { subscribeToJob } from '@/lib/jobs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const jobId = params.id;
  const db = getDb();
  const initialJob = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId) as any;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial state
      if (initialJob) {
        const initPayload = `data: ${JSON.stringify({
          jobId: initialJob.id,
          stage: initialJob.stage,
          progress: initialJob.progress,
          status: initialJob.status,
          error: initialJob.error,
        })}\n\n`;
        controller.enqueue(encoder.encode(initPayload));
      }

      // Subscribe to real-time events
      const unsubscribe = subscribeToJob(jobId, (event) => {
        try {
          const payload = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(payload));
          if (event.status === 'completed' || event.status === 'failed') {
            setTimeout(() => {
              try {
                controller.close();
              } catch (_) {}
            }, 1000);
          }
        } catch (_) {}
      });

      req.signal.addEventListener('abort', () => {
        unsubscribe();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
