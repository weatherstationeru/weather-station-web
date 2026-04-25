'use client';

/**
 * HeroOpening.tsx — Cinematic full-screen landing overlay.
 *
 * Displays:
 *  - ERU university logo
 *  - "Weather Station" project title
 *  - Subtitle with location
 *  - Live temperature teaser pill
 *  - "Enter Dashboard →" CTA button
 *
 * When dismissed, the overlay fades/scales out to reveal the dashboard beneath.
 * The dismissed state is stored in sessionStorage so it only plays once per tab.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageProvider';

interface HeroOpeningProps {
  /** Current temperature from live data, or null while loading */
  currentTemp: number | null;
  /** Whether we're still fetching the first reading */
  isLoading: boolean;
}

export default function HeroOpening({ currentTemp, isLoading }: HeroOpeningProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [ready, setReady]     = useState(false); // controls staggered entrance

  // Skip hero if already dismissed this session
  useEffect(() => {
    if (sessionStorage.getItem('hero-dismissed') === '1') {
      setVisible(false);
    } else {
      // Trigger entrance animations after a tiny delay
      const t = setTimeout(() => setReady(true), 100);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem('hero-dismissed', '1');
  }, []);

  // If already dismissed, render nothing
  if (!visible && !ready) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="hero-opening"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Background layers — video + gradient scrim */}
          <video
            className="hero-bg-video"
            src="/bg-video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="hero-scrim" />

          {/* Floating particles */}
          <div className="hero-particles">
            <span /><span /><span /><span /><span /><span /><span /><span />
          </div>

          {/* Center content */}
          <div className={`hero-content ${ready ? 'hero-content--in' : ''}`}>
            {/* ERU Logo */}
            <div className="hero-logo-wrap">
              <img
                src="/eru-logo.png"
                alt="Egyptian Russian University"
                className="hero-logo"
              />
              <div className="hero-logo-glow" />
            </div>

            {/* Title */}
            <h1 className="hero-title">
              <span className="hero-title-line hero-title-line--1">Weather</span>
              <span className="hero-title-line hero-title-line--2">Station</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              Real-Time IoT Meteorology&nbsp;&nbsp;·&nbsp;&nbsp;Badr, Egypt
            </p>

            {/* University name */}
            <p className="hero-university">
              {t('heroUniversity')}
            </p>

            {/* Professor photo + supervision badge */}
            <div className="hero-prof-wrap">
              <div className="hero-prof-avatar">
                <img src="/prof.jpg" alt="Prof. Omar Fathy" className="hero-prof-img" />
                <div className="hero-prof-ring" />
              </div>
              <p className="hero-supervision">
                ✦&nbsp;{t('heroSupervision')}&nbsp;✦
              </p>
            </div>

            {/* Live temperature teaser */}
            <div className="hero-temp-pill">
              <span className="hero-temp-dot" />
              {isLoading ? (
                <span className="hero-temp-text">{t('connecting')}</span>
              ) : currentTemp !== null ? (
                <span className="hero-temp-text">{currentTemp.toFixed(1)}°C&nbsp;&nbsp;·&nbsp;&nbsp;{t('heroLive')}</span>
              ) : (
                <span className="hero-temp-text">{t('awaitingData')}</span>
              )}
            </div>

            {/* CTA Button */}
            <button className="hero-cta" onClick={dismiss}>
              <span>{t('heroEnter')}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Bottom scroll hint — clickable to dismiss */}
          <div
            className={`hero-scroll-hint ${ready ? 'hero-scroll-hint--in' : ''}`}
            onClick={dismiss}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && dismiss()}
          >
            <span>{t('heroTap')}</span>
            <div className="hero-scroll-chevron">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
