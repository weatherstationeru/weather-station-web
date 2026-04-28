/**
 * weatherApi.ts — Clean, reusable API layer for weather_measurements.
 *
 * All database interactions go through this module. Never call `supabase`
 * directly from components — always use these functions so that:
 *   - Error handling is centralised and consistent.
 *   - Query logic is easy to test and swap out.
 *   - Components stay thin and focused on rendering.
 *
 * Table: weather_measurements
 * Columns: id, created_at, temp, humidity, rainfall,
 *          uv_index, wind_dir, wind_speed, pressure
 */

import { supabase } from '../utils/supabase';
import type {
  WeatherRow,
  WeatherInsertPayload,
  FetchHistoricalOptions,
  ApiResult,
} from '../types/weather';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ─── Constants ────────────────────────────────────────────────────────────────

const TABLE = 'weather_measurements' as const;

// Default page size for historical queries
const DEFAULT_PAGE_SIZE = 50;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Wraps a Supabase query in a try/catch and normalises the response
 * into a consistent { data, error } shape.
 */
async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: { message: string } | null }>
): Promise<ApiResult<T>> {
  try {
    const { data, error } = await queryFn();
    if (error) {
      console.error(`[weatherApi] Supabase error:`, error.message);
      return { data: null, error: error.message };
    }
    return { data, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[weatherApi] Unexpected error:`, message);
    return { data: null, error: message };
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * fetchLatest
 * -----------
 * Retrieves the single most-recent row from weather_measurements.
 * Used to populate the live dashboard display on initial load.
 *
 * @returns The latest WeatherRow, or null with an error string.
 *
 * @example
 *   const { data, error } = await fetchLatest();
 *   if (data) console.log(data.temp);
 */
export async function fetchLatest(): Promise<ApiResult<WeatherRow>> {
  return safeQuery<WeatherRow>(async () => {
    const result = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // `single()` errors with PGRST116 if no rows exist — treat as null data,
    // not a hard error, so the UI can show an empty state gracefully.
    if (result.error?.code === 'PGRST116') {
      return { data: null, error: null };
    }

    return result;
  });
}

/**
 * fetchHistorical
 * ---------------
 * Retrieves a paginated, optionally date-filtered list of readings,
 * ordered from newest to oldest.
 *
 * @param options - Pagination and date-range options.
 * @returns An array of WeatherRow objects, or null with an error string.
 *
 * @example
 *   // Page 0, 50 rows
 *   const { data } = await fetchHistorical();
 *
 *   // Page 1, 20 rows, filtered to last 24 hours
 *   const { data } = await fetchHistorical({
 *     limit: 20,
 *     page:  1,
 *     from:  new Date(Date.now() - 86_400_000).toISOString(),
 *   });
 */
export async function fetchHistorical(
  options: FetchHistoricalOptions = {}
): Promise<ApiResult<WeatherRow[]>> {
  const {
    limit = DEFAULT_PAGE_SIZE,
    page = 0,
    from,
    to,
  } = options;

  const offset = page * limit;

  return safeQuery<WeatherRow[]>(async () => {
    let query = supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (from) query = query.gte('created_at', from);
    if (to)   query = query.lte('created_at', to);

    return query;
  });
}

/**
 * insertReading
 * -------------
 * Inserts a new sensor reading into weather_measurements.
 * Primarily called by the ESP32 POST endpoint or a server action,
 * but exposed here for completeness / manual testing.
 *
 * @param payload - The sensor values to insert (no id/created_at needed).
 * @returns The newly created WeatherRow, or null with an error string.
 *
 * @example
 *   const { data, error } = await insertReading({
 *     temp: 27.4, humidity: 62, rainfall: 0,
 *     uv_index: 5, wind_dir: 180, wind_speed: 10, pressure: 1013,
 *   });
 */
export async function insertReading(
  payload: WeatherInsertPayload
): Promise<ApiResult<WeatherRow>> {
  return safeQuery<WeatherRow>(async () => {
    const result = await supabase
      .from(TABLE)
      .insert(payload)
      .select()
      .single();
    return result;
  });
}

/**
 * subscribeToLatest
 * -----------------
 * Opens a Supabase Realtime channel that fires `onNewReading` every time
 * a new row is INSERTed into weather_measurements.
 *
 * The caller is responsible for calling `unsubscribe()` on the returned
 * channel when the component unmounts (prevents memory leaks).
 *
 * @param onNewReading - Callback that receives each new WeatherRow.
 * @param onError      - Optional callback for subscription errors.
 * @returns A RealtimeChannel — call `.unsubscribe()` on it to clean up.
 *
 * @example
 *   useEffect(() => {
 *     const channel = subscribeToLatest((row) => setLiveData(row));
 *     return () => { channel.unsubscribe(); };
 *   }, []);
 */
export function subscribeToLatest(
  onNewReading: (row: WeatherRow) => void,
  onError?: (error: string) => void
): RealtimeChannel {
  const channel = supabase
    .channel('weather-live')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: TABLE,
      },
      (payload) => {
        // payload.new contains the freshly-inserted row
        const newRow = payload.new as WeatherRow;
        console.log('[weatherApi] Real-time update received:', newRow);
        onNewReading(newRow);
      }
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log('[weatherApi] Real-time channel subscribed successfully.');
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        const msg = err?.message ?? `Channel status: ${status}`;
        console.error('[weatherApi] Real-time subscription error:', msg);
        onError?.(msg);
      }
    });

  return channel;
}

/**
 * fetchLast24HoursReadings
 * ------------------------
 * Convenience wrapper — fetches up to 288 readings from the last 24 hours
 * (assumes one reading per ~5 minutes from your ESP32). Useful for charts.
 *
 * @returns An array of WeatherRow objects (oldest first for charting).
 */
export async function fetchLast24HoursReadings(): Promise<ApiResult<WeatherRow[]>> {
  const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const result = await fetchHistorical({ limit: 288, page: 0, from });

  // Reverse so array is chronological (oldest → newest) for charts
  if (result.data) {
    result.data = [...result.data].reverse();
  }

  return result;
}

/**
 * fetchAllForDate
 * ---------------
 * Fetches all readings for a specific UTC date (YYYY-MM-DD).
 * Used for data archiving and export functionality.
 *
 * @param dateStr - The date string in YYYY-MM-DD format.
 */
export async function fetchAllForDate(dateStr: string): Promise<ApiResult<WeatherRow[]>> {
  const startOfDay = new Date(`${dateStr}T00:00:00.000Z`).toISOString();
  const endOfDay = new Date(`${dateStr}T23:59:59.999Z`).toISOString();

  return safeQuery<WeatherRow[]>(async () => {
    // We don't use range here because we want all rows for the day.
    // Be mindful of very large datasets, but for 1 reading/5mins = 288 rows.
    const result = await supabase
      .from(TABLE)
      .select('*')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)
      .order('created_at', { ascending: true });
    
    return result;
  });
}
