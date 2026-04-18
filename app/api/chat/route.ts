/**
 * /api/chat — Server-side proxy for the Supabase Edge Function.
 *
 * Why a proxy?
 *  - Avoids CORS: the browser calls /api/chat (same origin), and
 *    our server calls the Edge Function (server-to-server, no CORS).
 *  - Keeps the anon key out of client-side fetch headers.
 */

import { NextRequest, NextResponse } from 'next/server';

const EDGE_FUNCTION_URL =
  'https://xdfnxlpaykdpknusupla.supabase.co/functions/v1/gemini-chat';

const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      console.error('[api/chat] Edge Function error:', response.status, errText);
      return NextResponse.json(
        { error: `Edge Function returned ${response.status}: ${errText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[api/chat] Proxy error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
