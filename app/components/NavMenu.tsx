'use client';

/**
 * NavMenu.tsx — Fixed corner "Dashboard" pill button that opens a slide-down
 * dropdown panel containing nav links, prayer times, and a language switcher.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import type { Lang } from '../../lib/i18n';

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

/** Convert "HH:MM" (24h) → "h:MM AM/PM" (12h). */
function fmt12(t: string) {
  const [hStr, mStr] = t.slice(0, 5).split(':');
  let h = parseInt(hStr, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${mStr} ${suffix}`;
}

function toMin(t: string) {
  const [h, m] = t.slice(0, 5).split(':').map(Number);
  return h * 60 + m;
}

function getNowMin() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

function getActive(timings: PrayerTimings): keyof PrayerTimings | null {
  const nowMin = getNowMin();
  let active: keyof PrayerTimings | null = null;
  for (const { key } of PRAYERS) {
    if (toMin(timings[key]) <= nowMin) active = key;
  }
  return active;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function NavMenu() {
  const { t, lang, setLang } = useLanguage();

  const [isMenuOpen,   setIsMenuOpen]   = useState(false);
  const [showPrayer,   setShowPrayer]   = useState(false);
  const [showToast,    setShowToast]    = useState(false);
  const [timings,      setTimings]      = useState<PrayerTimings | null>(null);
  const [prayerError,  setPrayerError]  = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(v => !v);

  // ── Fetch prayer times ───────────────────────────────────────────────────────
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

  // ── Startup toast ────────────────────────────────────────────────────────────
  useEffect(() => {
    const show = setTimeout(() => setShowToast(true), 800);
    const hide  = setTimeout(() => setShowToast(false), 4000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  // ── Escape key ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsMenuOpen(false); setShowPrayer(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // ── Click-outside ────────────────────────────────────────────────────────────
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

  const activePrayer = timings ? getActive(timings) : null;

  return (
    <>
      {/* ── Dashboard button + dropdown ──────────────────────────────────────── */}
      <div className="navmenu-wrap" ref={menuRef}>
        {/* Dashboard button */}
        <button
          id="nav-burger-btn"
          className={`navmenu-dash-btn ${isMenuOpen ? 'navmenu-dash-btn--open' : ''}`}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          aria-label="Open Dashboard menu"
        >
          {/* 4-square grid icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="navmenu-dash-icon"
          >
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
          </svg>
          <span className="navmenu-dash-label">{t('navDashboard')}</span>
        </button>

        {/* Dropdown panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="navmenu-panel"
              role="menu"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{    opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              {/* Shimmer top edge */}
              <div className="navmenu-shimmer" aria-hidden="true" />

              {/* Brand header */}
              <div className="navmenu-header">
                <span className="navmenu-header-dot" />
                <span className="navmenu-header-title">ERU Weather Station</span>
              </div>

              <div className="navmenu-divider" />

              {/* Nav links */}
              <nav aria-label="Main navigation">
                <Link href="/"      className="navmenu-item" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                  <span className="navmenu-item-icon">📡</span>
                  <span>{t('navDashboard')}</span>
                </Link>
                <Link href="/team"  className="navmenu-item" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                  <span className="navmenu-item-icon">👥</span>
                  <span>{t('navTeam')}</span>
                </Link>
                <Link href="/about" className="navmenu-item" role="menuitem" onClick={() => setIsMenuOpen(false)}>
                  <span className="navmenu-item-icon">ℹ️</span>
                  <span>{t('navAbout')}</span>
                </Link>
              </nav>

              <div className="navmenu-divider" />

              {/* Prayer Times accordion */}
              <button
                id="nav-prayer-toggle"
                className={`navmenu-item navmenu-prayer-toggle ${showPrayer ? 'navmenu-prayer-toggle--open' : ''}`}
                onClick={() => setShowPrayer(v => !v)}
                aria-expanded={showPrayer}
              >
                <span className="navmenu-item-icon">🕌</span>
                <span>{t('navPrayer')}</span>
                <span className={`navmenu-chevron ${showPrayer ? 'navmenu-chevron--up' : ''}`} aria-hidden="true" />
              </button>

              <AnimatePresence>
                {showPrayer && (
                  <motion.div
                    className="navmenu-prayer-list"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{    height: 0, opacity: 0 }}
                    transition={{ duration: 0.26, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    {!timings && !prayerError && (
                      <p className="navmenu-prayer-msg">Loading…</p>
                    )}
                    {prayerError && (
                      <p className="navmenu-prayer-msg navmenu-prayer-msg--err">⚠ {prayerError}</p>
                    )}
                    {timings && PRAYERS.map(({ key, label, icon }) => (
                      <div
                        key={key}
                        className={`navmenu-prayer-row ${key === activePrayer ? 'navmenu-prayer-row--active' : ''}`}
                      >
                        <span className="navmenu-prayer-icon">{icon}</span>
                        <span className="navmenu-prayer-label">{label}</span>
                        <span className="navmenu-prayer-time">{fmt12(timings[key])}</span>
                        {key === activePrayer && <span className="navmenu-prayer-now">Now</span>}
                      </div>
                    ))}
                    <p className="navmenu-prayer-city">📍 Cairo, Egypt</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="navmenu-divider" />

              {/* Language switcher */}
              <div className="navmenu-lang" role="group" aria-label="Language selection">
                {(['en', 'ar', 'ru'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    id={`nav-lang-${l}`}
                    className={`navmenu-lang-btn ${lang === l ? 'navmenu-lang-btn--active' : ''}`}
                    onClick={() => { setLang(l); }}
                    aria-pressed={lang === l}
                    title={l === 'en' ? 'English' : l === 'ar' ? 'Arabic' : 'Russian'}
                  >
                    {l === 'en' ? '🇬🇧 EN' : l === 'ar' ? '🇪🇬 عر' : '🇷🇺 RU'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Startup toast ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            className="prayer-toast"
            initial={{ opacity: 0, x: 20, scale: 0.88 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{    opacity: 0, x: 20, scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            aria-live="polite"
          >
            <span className="prayer-toast-mosque">🕌</span>
            <div className="prayer-toast-text">
              <span className="prayer-toast-ar">مواقيت الصلاة</span>
              <span className="prayer-toast-sub">Cairo · Egypt</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
