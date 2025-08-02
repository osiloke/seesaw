import { type NextRequest } from 'next/server';
import emitter from '@/lib/events';
import type { RequestDetail } from '@/lib/types';

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  const resolvedParams = await params;
  const stream = new ReadableStream({
    start(controller) {
      const onNewRequest = (data: RequestDetail) => {
        try {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        } catch (e) {
          console.error('Failed to enqueue data:', e);
          try {
            controller.error(e);
            controller.close();
          } catch {}
        }
      };

      emitter.on(`new-request:${resolvedParams.sessionId}`, onNewRequest);

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(': heartbeat\n\n');
        } catch (e) {
          console.error('Failed to enqueue heartbeat:', e);
        }
      }, 30000);

      request.signal.addEventListener('abort', () => {
        emitter.off(`new-request:${resolvedParams.sessionId}`, onNewRequest);
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch (e) {
          // Ignore errors from closing an already closed controller
        }
      });
    },
    cancel() {
        // This function is called when the stream is canceled by the client.
        // You might not need to do anything here if the 'abort' event on request.signal
        // already handles all necessary cleanup.
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
