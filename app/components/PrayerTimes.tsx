'use client';

/**
 * PrayerTimes.tsx
 *
 * Fixed top-right icon + glass popup that lists Cairo prayer times.
 * - On mount: popup slides in automatically, then dismisses after 5 s.
 * - The mosque icon always remains visible as a manual toggle.
 * - Data source: https://api.aladhan.com/v1/timingsByCity
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────
interface PrayerTimings {
  Fajr:    string;
  Dhuhr:   string;
  Asr:     string;
  Maghrib: string;
  Isha:    string;
}

const PRAYER_LABELS: { key: keyof PrayerTimings; label: string; icon: string }[] = [
  { key: 'Fajr',    label: 'Fajr',    icon: '🌙' },
  { key: 'Dhuhr',   label: 'Dhuhr',   icon: '☀️' },
  { key: 'Asr',     label: 'Asr',     icon: '🌤' },
  { key: 'Maghrib', label: 'Maghrib', icon: '🌇' },
  { key: 'Isha',    label: 'Isha',    icon: '🌃' },
];

// ── Strip seconds from HH:MM:SS → HH:MM ──────────────────────────────────────
function fmt(t: string): string {
  return t.slice(0, 5);
}

// ── Detect the currently active prayer slot ───────────────────────────────────
function getActivePrayer(timings: PrayerTimings): keyof PrayerTimings | null {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const keys: (keyof PrayerTimings)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  let active: keyof PrayerTimings | null = null;

  for (const key of keys) {
    if (toMin(timings[key]) <= nowMin) {
      active = key;
    }
  }
  return active;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PrayerTimes() {
  const [timings, setTimings]     = useState<PrayerTimings | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [isOpen, setIsOpen]       = useState(false);
  const [autoShown, setAutoShown] = useState(false); // guard: only auto-show once

  // ── Fetch prayer times on mount ─────────────────────────────────────────────
  useEffect(() => {
    const url =
      'https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5';

    fetch(url)
      .then((r) => r.json())
      .then((json) => {
        if (json?.data?.timings) {
          setTimings(json.data.timings as PrayerTimings);
        } else {
          setError('Could not load prayer times.');
        }
      })
      .catch(() => setError('Network error.'))
      .finally(() => setLoading(false));
  }, []);

  // ── Auto-popup: open immediately, close after 5 s ───────────────────────────
  useEffect(() => {
    if (loading || autoShown) return; // wait for data or skip if already shown
    setAutoShown(true);
    setIsOpen(true);

    const timer = setTimeout(() => setIsOpen(false), 3000);
    return () => clearTimeout(timer);
  }, [loading, autoShown]);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const activePrayer = timings ? getActivePrayer(timings) : null;

  return (
    <>
      {/* ── Fixed toggle icon ─────────────────────────────────────────────────── */}
      <button
        id="prayer-times-toggle"
        onClick={toggle}
        aria-label="Toggle prayer times"
        className="prayer-toggle-btn"
        title="Prayer Times"
      >
        {/* Mosque SVG (inline, no external dep) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="22"
          height="22"
        >
          {/* Dome */}
          <path d="M8 10 Q8 4 12 4 Q16 4 16 10" />
          {/* Minarets */}
          <line x1="5"  y1="10" x2="5"  y2="20" />
          <line x1="19" y1="10" x2="19" y2="20" />
          <rect x="3"   y="8"   width="4" height="3" rx="1" />
          <rect x="17"  y="8"   width="4" height="3" rx="1" />
          {/* Main hall */}
          <rect x="7" y="10" width="10" height="10" rx="1" />
          {/* Door arch */}
          <path d="M10 20 L10 16 Q12 14 14 16 L14 20" />
          {/* Ground line */}
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      </button>

      {/* ── Animated popup ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="prayer-times-popup"
            className="prayer-popup"
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{    opacity: 0, x: 40, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div className="prayer-popup-header">
              <span className="prayer-popup-title">Prayer Times</span>
              <span className="prayer-popup-city">Cairo, Egypt</span>
              <button
                className="prayer-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Divider */}
            <div className="prayer-divider" />

            {/* Body */}
            <div className="prayer-list">
              {loading && (
                <div className="prayer-loading">Loading…</div>
              )}
              {error && (
                <div className="prayer-error">{error}</div>
              )}
              {timings && PRAYER_LABELS.map(({ key, label, icon }) => {
                const isActive = key === activePrayer;
                return (
                  <div
                    key={key}
                    className={`prayer-row ${isActive ? 'prayer-row--active' : ''}`}
                  >
                    <span className="prayer-icon">{icon}</span>
                    <span className="prayer-label">{label}</span>
                    <span className="prayer-time">{fmt(timings[key])}</span>
                    {isActive && (
                      <span className="prayer-now-badge">Now</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Auto-dismiss progress bar */}
            {!autoShown || isOpen ? null : null}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
