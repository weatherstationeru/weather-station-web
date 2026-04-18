/**
 * chatApi.ts — Connects the chat widget to the Supabase Edge Function.
 *
 * The client calls /api/chat (our local Next.js proxy) instead of the
 * Edge Function directly. This avoids CORS issues — the proxy runs
 * server-side and forwards the request to Supabase without restrictions.
 *
 * Flow:
 *   Browser → /api/chat (Next.js route) → Supabase Edge Function → DeepSeek AI
 */

import type { WeatherRow } from '../types/weather';
import type { ApiResult } from '../types/weather';

// ─── Config ───────────────────────────────────────────────────────────────────

// Same-origin proxy — no CORS, no anon key needed on the client.
const PROXY_URL = '/api/chat';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── API Function ─────────────────────────────────────────────────────────────

/**
 * sendChatMessage
 * ---------------
 * Sends a user message through the local proxy to the Supabase Edge Function
 * and returns the AI reply string.
 *
 * @param message        - The user's question or message.
 * @param weatherContext - Current live sensor reading passed as AI context.
 * @returns { data: replyString } on success, { error: errorString } on failure.
 *
 * @example
 *   const { data, error } = await sendChatMessage("What's the UV level?", liveData);
 *   if (data) console.log(data); // "The current UV index is 5.2 — Moderate."
 */
export async function sendChatMessage(
  message: string,
  weatherContext: WeatherRow | null = null
): Promise<ApiResult<string>> {
  try {
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: message,   // Edge Function expects 'question', not 'message'
        // Pass live sensor data so the AI can answer sensor-specific questions
        context: weatherContext
          ? {
              temperature: weatherContext.temp,
              humidity:    weatherContext.humidity,
              rainfall:    weatherContext.rainfall,
              uv_index:    weatherContext.uv_index != null
                             ? weatherContext.uv_index / 100   // normalized 0–12
                             : null,
              wind_speed:  weatherContext.wind_speed,
              wind_dir:    weatherContext.wind_dir,
              pressure:    weatherContext.pressure,
              recorded_at: weatherContext.created_at,
            }
          : null,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      console.error('[chatApi] Proxy error:', response.status, errText);
      return { data: null, error: `Server error ${response.status}: ${errText}` };
    }

    const json = await response.json();

    // Handle different response shapes the Edge Function might return:
    //   { reply } | { message } | { content } | { response } | { text }
    const reply: string =
      json.reply    ??
      json.message  ??
      json.content  ??
      json.response ??
      json.text     ??
      null;

    if (!reply) {
      console.error('[chatApi] Unexpected response shape:', json);
      return { data: null, error: 'Unexpected response from AI assistant.' };
    }

    return { data: String(reply), error: null };

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error';
    console.error('[chatApi] Fetch failed:', msg);
    return { data: null, error: msg };
  }
}
