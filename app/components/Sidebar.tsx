'use client';

/**
 * Sidebar.tsx
 *
 * Premium glass slide-out sidebar anchored to the top-left.
 * - Fixed glass Menu icon (lucide-react) triggers open/close.
 * - Framer-motion panel slides in from the left.
 * - Clicking the backdrop or the ✕ button closes the sidebar.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Info, Cpu, Wifi, Thermometer } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      {/* ── Trigger button ────────────────────────────────────────────────── */}
      <button
        id="sidebar-menu-trigger"
        className="sidebar-trigger-btn"
        onClick={open}
        aria-label="Open menu"
        title="Menu"
      >
        <Menu size={22} strokeWidth={1.8} />
      </button>

      {/* ── AnimatePresence handles mount/unmount ─────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={close}
              aria-hidden="true"
            />

            {/* Sidebar panel */}
            <motion.aside
              id="sidebar-panel"
              className="sidebar-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              aria-label="Navigation sidebar"
            >
              {/* ── Header ───────────────────────────────────────────────── */}
              <div className="sidebar-header">
                <div className="sidebar-brand">
                  <div className="sidebar-brand-icon">
                    <Thermometer size={18} strokeWidth={1.6} />
                  </div>
                  <div>
                    <div className="sidebar-brand-name">ERU Weather</div>
                    <div className="sidebar-brand-sub">Station Dashboard</div>
                  </div>
                </div>
                <button
                  className="sidebar-close-btn"
                  onClick={close}
                  aria-label="Close menu"
                >
                  <X size={18} strokeWidth={2} />
                </button>
              </div>

              {/* ── Divider ──────────────────────────────────────────────── */}
              <div className="sidebar-divider" />

              {/* ── Nav links ────────────────────────────────────────────── */}
              <nav className="sidebar-nav">
                <div className="sidebar-section-label">Navigation</div>

                <button className="sidebar-nav-item sidebar-nav-item--active">
                  <span className="sidebar-nav-icon">
                    <Cpu size={16} strokeWidth={1.6} />
                  </span>
                  <span>Live Dashboard</span>
                  <span className="sidebar-live-dot" />
                </button>
              </nav>

              {/* ── About section ────────────────────────────────────────── */}
              <div className="sidebar-divider" style={{ marginTop: '12px' }} />

              <div className="sidebar-section">
                <div className="sidebar-section-label">
                  <Info size={11} strokeWidth={2} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                  About
                </div>

                <div className="sidebar-about-card">
                  <p className="sidebar-about-text">
                    The <strong>ERU Weather Station</strong> is a real-time IoT
                    monitoring system built at <strong>Egyptian Russian University</strong>.
                  </p>
                  <p className="sidebar-about-text" style={{ marginTop: '10px' }}>
                    An <strong>ESP32</strong> microcontroller streams live sensor
                    readings — temperature, humidity, pressure, UV index, rainfall,
                    and wind — directly to this dashboard via <strong>Supabase Realtime</strong>.
                  </p>
                </div>
              </div>

              {/* ── Tech stack chips ─────────────────────────────────────── */}
              <div className="sidebar-chips">
                {['ESP32', 'Supabase', 'Next.js 16', 'Tailwind CSS'].map((t) => (
                  <span key={t} className="sidebar-chip">{t}</span>
                ))}
              </div>

              {/* ── Connectivity status ───────────────────────────────────── */}
              <div className="sidebar-divider" style={{ marginTop: '16px' }} />

              <div className="sidebar-status-row">
                <Wifi size={13} strokeWidth={2} style={{ color: '#34d399' }} />
                <span className="sidebar-status-text">Realtime connected</span>
              </div>

              {/* ── Footer ───────────────────────────────────────────────── */}
              <div className="sidebar-footer">
                <a
                  href="https://github.com/weatherstationeru/weather-station-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-github-link"
                  aria-label="View source on GitHub"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14" height="14" viewBox="0 0 24 24"
                    fill="currentColor" aria-hidden="true"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>View on GitHub</span>
                </a>
                <div className="sidebar-version">v1.0.0</div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
