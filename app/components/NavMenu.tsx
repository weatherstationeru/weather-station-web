'use client';

/**
 * NavMenu.tsx — Polished full-width glassmorphic Navbar.
 *
 * UI/UX improvements:
 *  - Animated underline indicator tracks the active link
 *  - Live clock (HH:MM) displayed in the brand area
 *  - "Next prayer in X min" countdown badge inside the prayer button
 *  - Smoother spring animations on the prayer popover
 *  - Mobile hamburger that slides down a full-width panel
 *  - Language switcher with smooth pill transition
 *  - Keyboard-accessible (Escape closes popover / mobile menu)
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

function getNext(timings: PrayerTimings): { key: keyof PrayerTimings; minsLeft: number } | null {
  const nowMin = getNowMin();
  for (const { key } of PRAYERS) {
    const diff = toMin(timings[key]) - nowMin;
    if (diff > 0) return { key, minsLeft: diff };
  }
  // After Isha → next is tomorrow's Fajr
  const fajrTomorrow = toMin(timings.Fajr) + 24 * 60;
  return { key: 'Fajr', minsLeft: fajrTomorrow - nowMin };
}

// ── Nav links definition ───────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/',      labelKey: 'navDashboard' as const, icon: '📡' },
  { href: '/team',  labelKey: 'navTeam'      as const, icon: '👥' },
  { href: '/about', labelKey: 'navAbout'     as const, icon: 'ℹ️' },
] as const;

// ── Component ─────────────────────────────────────────────────────────────────
export default function NavMenu() {
  const { t, lang, setLang } = useLanguage();
  const pathname = usePathname();

  const [showPrayer,   setShowPrayer]   = useState(false);
  const [showMobile,   setShowMobile]   = useState(false);
  const [showToast,    setShowToast]    = useState(false);
  const [timings,      setTimings]      = useState<PrayerTimings | null>(null);
  const [prayerError,  setPrayerError]  = useState<string | null>(null);
  const [scrolled,     setScrolled]     = useState(false);
  const [clock,        setClock]        = useState('');
  const [nextInfo,     setNextInfo]     = useState<{ key: string; minsLeft: number } | null>(null);

  const prayerRef  = useRef<HTMLDivElement>(null);
  const mobileRef  = useRef<HTMLDivElement>(null);

  // ── Clock tick ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setClock(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`);
      if (timings) setNextInfo(getNext(timings));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timings]);

  // ── Fetch prayer times ───────────────────────────────────────────────────────
  useEffect(() => {
    fetch('https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5')
      .then(r => r.json())
      .then(json => {
        if (json?.data?.timings) {
          const t = json.data.timings as PrayerTimings;
          setTimings(t);
          setNextInfo(getNext(t));
        } else {
          setPrayerError('Could not load.');
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

  // ── Scroll shadow ────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Escape key ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowPrayer(false); setShowMobile(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // ── Click-outside prayer popover ─────────────────────────────────────────────
  useEffect(() => {
    if (!showPrayer) return;
    const handler = (e: MouseEvent) => {
      if (prayerRef.current && !prayerRef.current.contains(e.target as Node)) {
        setShowPrayer(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPrayer]);

  // ── Click-outside mobile menu ────────────────────────────────────────────────
  useEffect(() => {
    if (!showMobile) return;
    const handler = (e: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setShowMobile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMobile]);

  const activePrayer = timings ? getActive(timings) : null;
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href);

  const nextMinsFormatted = nextInfo
    ? nextInfo.minsLeft >= 60
      ? `${Math.floor(nextInfo.minsLeft / 60)}h ${nextInfo.minsLeft % 60}m`
      : `${nextInfo.minsLeft}m`
    : null;

  return (
    <>
      {/* ── Navbar ───────────────────────────────────────────────────────────── */}
      <nav
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* LEFT — Brand + clock */}
        <div className="navbar-brand">
          <div className="navbar-brand-logo" aria-hidden="true">
            <span className="navbar-brand-logo-dot" />
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-brand-name">ERU Weather</span>
            <span className="navbar-brand-clock" aria-label={`Current time: ${clock}`}>{clock}</span>
          </div>
        </div>

        {/* CENTER — Desktop nav links */}
        <div className="navbar-links" role="list">
          {NAV_LINKS.map(({ href, labelKey, icon }) => (
            <Link
              key={href}
              href={href}
              role="listitem"
              className={`navbar-link ${isActive(href) ? 'navbar-link--active' : ''}`}
              id={`nav-link-${href.replace('/', '') || 'dashboard'}`}
              onClick={() => setShowMobile(false)}
            >
              <span className="navbar-link-icon" aria-hidden="true">{icon}</span>
              <span className="navbar-link-label">{t(labelKey)}</span>
              {isActive(href) && (
                <motion.span
                  className="navbar-link-underline"
                  layoutId="nav-underline"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}

          {/* Prayer Times trigger */}
          <div className="navbar-prayer-wrap" ref={prayerRef} role="listitem">
            <button
              id="nav-link-prayer"
              className={`navbar-link navbar-link--btn ${showPrayer ? 'navbar-link--active' : ''}`}
              onClick={() => setShowPrayer(v => !v)}
              aria-expanded={showPrayer}
              aria-haspopup="dialog"
            >
              <span className="navbar-link-icon" aria-hidden="true">🕌</span>
              <span className="navbar-link-label">{t('navPrayer')}</span>
              {nextMinsFormatted && !showPrayer && (
                <span className="navbar-next-badge" aria-label={`Next prayer in ${nextMinsFormatted}`}>
                  {nextMinsFormatted}
                </span>
              )}
              <span className={`navbar-chevron ${showPrayer ? 'navbar-chevron--up' : ''}`} aria-hidden="true" />
            </button>

            {/* Prayer popover */}
            <AnimatePresence>
              {showPrayer && (
                <motion.div
                  className="navbar-prayer-panel"
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0,  scale: 1 }}
                  exit={{    opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  role="dialog"
                  aria-label="Prayer times"
                >
                  <div className="navbar-prayer-shimmer" aria-hidden="true" />

                  <div className="navbar-prayer-header">
                    <div className="navbar-prayer-header-left">
                      <span className="navbar-prayer-title">Prayer Times</span>
                      <span className="navbar-prayer-city-tag">📍 Cairo, Egypt</span>
                    </div>
                    {nextInfo && nextMinsFormatted && (
                      <div className="navbar-prayer-next">
                        <span className="navbar-prayer-next-label">Next in</span>
                        <span className="navbar-prayer-next-time">{nextMinsFormatted}</span>
                      </div>
                    )}
                  </div>

                  <div className="navbar-prayer-divider" />

                  {!timings && !prayerError && (
                    <div className="navbar-prayer-loading">
                      <span className="navbar-prayer-spinner" />
                      <span>Loading prayer times…</span>
                    </div>
                  )}
                  {prayerError && (
                    <p className="navbar-prayer-msg navbar-prayer-msg--err">⚠ {prayerError}</p>
                  )}

                  {timings && PRAYERS.map(({ key, label, icon }) => {
                    const active = key === activePrayer;
                    const isNext = nextInfo?.key === key;
                    return (
                      <div
                        key={key}
                        className={`navbar-prayer-row ${active ? 'navbar-prayer-row--active' : ''} ${isNext && !active ? 'navbar-prayer-row--next' : ''}`}
                      >
                        <span className="navbar-prayer-icon">{icon}</span>
                        <span className="navbar-prayer-label">{label}</span>
                        <span className="navbar-prayer-time">{fmt12(timings[key])}</span>
                        {active && <span className="navbar-prayer-badge navbar-prayer-badge--now">Now</span>}
                        {isNext && !active && <span className="navbar-prayer-badge navbar-prayer-badge--next">Next</span>}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT — Language switcher + hamburger */}
        <div className="navbar-right">
          {/* Language pills */}
          <div className="navbar-lang" role="group" aria-label="Language selection">
            <div className="navbar-lang-track">
              {(['en', 'ar', 'ru'] as Lang[]).map((l) => (
                <button
                  key={l}
                  id={`nav-lang-${l}`}
                  className={`navbar-lang-btn ${lang === l ? 'navbar-lang-btn--active' : ''}`}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  title={l === 'en' ? 'English' : l === 'ar' ? 'Arabic' : 'Russian'}
                >
                  {l === 'en' ? '🇬🇧' : l === 'ar' ? '🇪🇬' : '🇷🇺'}
                  <span className="navbar-lang-code">{l === 'ar' ? 'عر' : l.toUpperCase()}</span>
                  {lang === l && (
                    <motion.span
                      className="navbar-lang-pill"
                      layoutId="lang-pill"
                      transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`navbar-hamburger ${showMobile ? 'navbar-hamburger--open' : ''}`}
            onClick={() => setShowMobile(v => !v)}
            aria-label={showMobile ? 'Close menu' : 'Open menu'}
            aria-expanded={showMobile}
          >
            <span className="navbar-hamburger-bar" />
            <span className="navbar-hamburger-bar" />
            <span className="navbar-hamburger-bar" />
          </button>
        </div>
      </nav>

      {/* ── Mobile slide-down panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showMobile && (
          <motion.div
            ref={mobileRef}
            className="navbar-mobile-panel"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            {NAV_LINKS.map(({ href, labelKey, icon }) => (
              <Link
                key={href}
                href={href}
                className={`navbar-mobile-link ${isActive(href) ? 'navbar-mobile-link--active' : ''}`}
                onClick={() => setShowMobile(false)}
              >
                <span>{icon}</span>
                <span>{t(labelKey)}</span>
              </Link>
            ))}
            <button
              className={`navbar-mobile-link ${showPrayer ? 'navbar-mobile-link--active' : ''}`}
              onClick={() => { setShowPrayer(v => !v); setShowMobile(false); }}
            >
              <span>🕌</span>
              <span>{t('navPrayer')}</span>
              {nextMinsFormatted && (
                <span className="navbar-next-badge">{nextMinsFormatted}</span>
              )}
            </button>
            <div className="navbar-mobile-divider" />
            <div className="navbar-mobile-lang">
              {(['en', 'ar', 'ru'] as Lang[]).map((l) => (
                <button
                  key={l}
                  className={`navbar-lang-btn ${lang === l ? 'navbar-lang-btn--active' : ''}`}
                  onClick={() => { setLang(l); setShowMobile(false); }}
                >
                  {l === 'en' ? '🇬🇧 EN' : l === 'ar' ? '🇪🇬 عر' : '🇷🇺 RU'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {nextMinsFormatted && nextInfo && (
                <span className="prayer-toast-sub">
                  {PRAYERS.find(p => p.key === nextInfo.key)?.icon} {nextMinsFormatted}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
