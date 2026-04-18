'use client';

/**
 * NavMenu.tsx — Unified burger menu with embedded Prayer Times.
 *
 * Features:
 *  - Simple three-line burger icon (top-left, fixed, glass style)
 *  - Framer-motion dropdown panel when clicked
 *  - "Prayer Times" option inside the menu → expands inline prayer list
 *  - Click-outside closes the menu
 *  - 3-second startup toast "مواقيت الصلاة" (top-right, then auto-hides)
 *  - Fetches Cairo prayer times from aladhan API on mount
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Types ─────────────────────────────────────────────────────────────────────
interface PrayerTimings {
  Fajr: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string;
}
const PRAYERS: { key: keyof PrayerTimings; label: string; icon: string }[] = [
  { key: 'Fajr',    label: 'Fajr',    icon: '🌙' },
  { key: 'Dhuhr',   label: 'Dhuhr',   icon: '☀️' },
  { key: 'Asr',     label: 'Asr',     icon: '🌤' },
  { key: 'Maghrib', label: 'Maghrib', icon: '🌇' },
  { key: 'Isha',    label: 'Isha',    icon: '🌃' },
];

function fmt(t: string) { return t.slice(0, 5); }

function getActive(timings: PrayerTimings): keyof PrayerTimings | null {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  let active: keyof PrayerTimings | null = null;
  for (const { key } of PRAYERS) {
    if (toMin(timings[key]) <= nowMin) active = key;
  }
  return active;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function NavMenu() {
  const [isMenuOpen,   setIsMenuOpen]   = useState(false);
  const [showPrayer,   setShowPrayer]   = useState(false);
  const [showToast,    setShowToast]    = useState(false);
  const [timings,      setTimings]      = useState<PrayerTimings | null>(null);
  const [prayerError,  setPrayerError]  = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── Fetch prayer times on mount ─────────────────────────────────────────────
  useEffect(() => {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5')
      .then(r => r.json())
      .then(json => {
        if (json?.data?.timings) {
          setTimings(json.data.timings as PrayerTimings);
        } else {
          setPrayerError('Could not load prayer times.');
        }
      })
      .catch(() => setPrayerError('Network error.'));
  }, []);

  // ── Startup toast: show for exactly 3 seconds ───────────────────────────────
  useEffect(() => {
    const showTimer = setTimeout(() => setShowToast(true), 600);   // slight delay feels natural
    const hideTimer = setTimeout(() => setShowToast(false), 3600); // 3 s visible
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);

  // ── Click-outside handler ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setShowPrayer(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(v => {
      if (v) setShowPrayer(false); // collapse prayer when closing
      return !v;
    });
  }, []);

  const activePrayer = timings ? getActive(timings) : null;

  return (
    <>
      {/* ── Startup toast ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="prayer-toast"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{    opacity: 0, x: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            aria-live="polite"
          >
            <span className="prayer-toast-mosque">🕌</span>
            <span>مواقيت الصلاة</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Burger + Dropdown container ───────────────────────────────────── */}
      <div ref={menuRef} className="navmenu-wrap">

        {/* Burger button */}
        <button
          id="nav-burger-btn"
          className={`navmenu-burger ${isMenuOpen ? 'navmenu-burger--open' : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span className="burger-bar" />
          <span className="burger-bar" />
          <span className="burger-bar" />
        </button>

        {/* Dropdown panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="nav-dropdown"
              className="navmenu-panel"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{    opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              {/* ── Brand header ──────────────────────────────────────────── */}
              <div className="navmenu-header">
                <span className="navmenu-brand">ERU Weather Station</span>
                <span className="navmenu-live-dot" aria-label="Live" />
              </div>

              <div className="navmenu-divider" />

              {/* ── Live Dashboard ────────────────────────────────────────── */}
              <div className="navmenu-item navmenu-item--active" aria-current="page">
                <span className="navmenu-item-icon" aria-hidden="true">📡</span>
                <span className="navmenu-item-text">Live Dashboard</span>
              </div>

              {/* ── Prayer Times trigger ──────────────────────────────────── */}
              <button
                className={`navmenu-item navmenu-item--btn ${showPrayer ? 'navmenu-item--on' : ''}`}
                onClick={() => setShowPrayer(v => !v)}
                aria-expanded={showPrayer}
              >
                <span className="navmenu-item-icon" aria-hidden="true">🕌</span>
                <span className="navmenu-item-text">Prayer Times</span>
                <span className="navmenu-chevron" aria-hidden="true">
                  {showPrayer ? '▴' : '▾'}
                </span>
              </button>

              {/* ── Inline Prayer List ────────────────────────────────────── */}
              <AnimatePresence initial={false}>
                {showPrayer && (
                  <motion.div
                    className="navmenu-prayer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{    opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    {/* Loading / error states */}
                    {!timings && !prayerError && (
                      <p className="navmenu-prayer-msg">Loading…</p>
                    )}
                    {prayerError && (
                      <p className="navmenu-prayer-msg navmenu-prayer-msg--err">{prayerError}</p>
                    )}

                    {/* Prayer rows */}
                    {timings && PRAYERS.map(({ key, label, icon }) => {
                      const active = key === activePrayer;
                      return (
                        <div
                          key={key}
                          className={`navmenu-prayer-row ${active ? 'navmenu-prayer-row--active' : ''}`}
                        >
                          <span className="navmenu-prayer-icon">{icon}</span>
                          <span className="navmenu-prayer-label">{label}</span>
                          <span className="navmenu-prayer-time">{fmt(timings[key])}</span>
                          {active && <span className="navmenu-prayer-badge">Now</span>}
                        </div>
                      );
                    })}

                    {/* Location caption */}
                    <p className="navmenu-prayer-city">Cairo, Egypt</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="navmenu-divider" />

              {/* ── About ─────────────────────────────────────────────────── */}
              <div className="navmenu-item navmenu-item--about">
                <span className="navmenu-item-icon" aria-hidden="true">ℹ️</span>
                <span className="navmenu-item-text navmenu-item-text--dim">
                  ESP32 · Supabase · Real-time IoT dashboard
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
