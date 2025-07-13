import { type NextRequest, NextResponse } from 'next/server';
import emitter from '@/lib/events';

async function processRequest(request: NextRequest, sessionId: string, catchall: string[] | undefined) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const query: Record<string, string> = {};
  request.nextUrl.searchParams.forEach((value, key) => {
    query[key] = value;
  });
  
  const path = `/${(catchall || []).join('/')}`;

  let body: string;
  try {
    body = await request.text();
  } catch (e) {
    body = '[Could not read body]';
  }

  const requestData = {
    id: crypto.randomUUID(),
    method: request.method,
    timestamp: new Date().toISOString(),
    ip: request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || (process.env.NEXT_RUNTIME === 'nodejs' ? (request as any).socket?.remoteAddress : undefined) || 'N/A',
    headers,
    query,
    body,
    path,
  };

  emitter.emit(`new-request:${sessionId}`, requestData);

  return NextResponse.json({ message: 'Request captured' }, { status: 200 });
}

export async function GET(request: NextRequest, { params }: { params: { sessionId: string; catchall?: string[] } }) {
  const resolvedParams = await params;
  return processRequest(request, resolvedParams.sessionId, resolvedParams.catchall);
}
export async function POST(request: NextRequest, { params }: { params: { sessionId: string; catchall?: string[] } }) {
  const resolvedParams = await params;
  return processRequest(request, resolvedParams.sessionId, resolvedParams.catchall);
}
export async function PUT(request: NextRequest, { params }: { params: { sessionId: string; catchall?: string[] } }) {
  const resolvedParams = await params;
  return processRequest(request, resolvedParams.sessionId, resolvedParams.catchall);
}
export async function DELETE(request: NextRequest, { params }: { params: { sessionId: string; catchall?: string[] } }) {
  const resolvedParams = await params;
  return processRequest(request, resolvedParams.sessionId, resolvedParams.catchall);
}
export async function PATCH(request: NextRequest, { params }: { params: { sessionId: string; catchall?: string[] } }) {
  const resolvedParams = await params;
  return processRequest(request, resolvedParams.sessionId, resolvedParams.catchall);
}
export async function OPTIONS(request: NextRequest, { params }: { params: { sessionId: string; catchall?: string[] } }) {
  const resolvedParams = await params;
  return processRequest(request, resolvedParams.sessionId, resolvedParams.catchall);
}
export async function HEAD(request: NextRequest, { params }: { params: { sessionId: string; catchall?: string[] } }) {
  const resolvedParams = await params;
  return processRequest(request, resolvedParams.sessionId, resolvedParams.catchall);
}
