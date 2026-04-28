'use client';

import Link from 'next/link';
import { useState } from 'react';

// ── Tech stack details ────────────────────────────────────────────────────────
const techStack = [
  {
    icon: '⚡',
    name: 'ESP32 Microcontroller',
    desc: 'The brain of the weather station. The ESP32 reads all sensor data every second and streams it to the cloud via Wi-Fi over MQTT/HTTP.',
    color: '#f59e0b',
  },
  {
    icon: '🌡️',
    name: 'Multi-Sensor Array',
    desc: 'DHT22 (Temperature & Humidity), BMP280 (Barometric Pressure), ML8511 (UV Index), Rain Gauge, and Hall Effect Sensor A3144E x8 for an Anemometer + Wind Vane for wind speed & direction.',
    color: '#34d399',
  },
  {
    icon: '🗄️',
    name: 'Data-base Realtime',
    desc: 'Every sensor reading is instantly pushed to a PostgreSQL table on Supabase. The dashboard subscribes via WebSocket — no polling, zero delay.',
    color: '#60a5fa',
  },
  {
    icon: '▲',
    name: 'Host Server(App Router)',
    desc: 'Server components, TypeScript, and Turbopack for instant HMR during development. The entire frontend is deployed as a statically optimised edge app.',
    color: '#a78bfa',
  },
  {
    icon: '🤖',
    name: 'AI Weather Assistant',
    desc: 'An on-page chat assistant powered by a large language model. It receives the current sensor snapshot and answers questions about conditions, safety, and trends.',
    color: '#f472b6',
  },
  {
    icon: '🕌',
    name: 'Prayer Times Integration',
    desc: 'Pulls daily Adhan times for Cairo from the AlAdhan API and displays them inside the nav menu — a thoughtful addition for local users.',
    color: '#fbbf24',
  },
];

// ── Project timeline ──────────────────────────────────────────────────────────
const timeline = [
  { phase: '01', title: 'Hardware Design', desc: 'Sensor selection, PCB wiring, ESP32 firmware development and calibration.' },
  { phase: '02', title: 'Cloud Architecture', desc: 'Supabase schema design, Row-Level Security policies, and Realtime channel setup.' },
  { phase: '03', title: 'Dashboard UI', desc: 'Glassmorphic Next.js frontend with animated backgrounds, live data cards, and full i18n (EN/AR/RU).' },
  { phase: '04', title: 'AI Integration', desc: 'Contextual AI chat assistant that receives live sensor data and answers weather queries in natural language.' },
  { phase: '05', title: 'Deployment', desc: 'Continuous deployment via GitHub Actions. Frontend on Vercel Edge, data pipeline always-on.' },
];

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <main className="about-page">

      {/* ── Animated background layers (match dashboard) ── */}
      <div className="about-bg" />
      <div className="about-stars" />
      <div className="about-aurora">
        <div className="about-aurora-band" />
        <div className="about-aurora-band" />
      </div>

      {/* ── Back button ── */}
      <div className="about-back-wrap">
        <Link href="/" className="about-back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Dashboard</span>
        </Link>
      </div>

      {/* ── Hero ── */}
      <div className="about-hero">
        <div className="about-hero-badge">
          <span className="about-live-dot" />
          <span>ERU Weather Station</span>
        </div>
        <h1 className="about-hero-title">About the Project</h1>
        <p className="about-hero-sub">
          A real-time IoT meteorological monitoring system built by Mechatronics Engineering students at the&nbsp;
          <strong>Egyptian Russian University</strong>, under the supervision of&nbsp;
          <strong>Prof. Omar Fathy</strong>.
        </p>
      </div>

      {/* ── Tab navigation ── */}
      <nav className="about-tabs" aria-label="Page sections">
        {(['overview', 'technology', 'timeline'] as const).map((tab) => (
          <button
            key={tab}
            className={`about-tab ${activeSection === tab ? 'about-tab--active' : ''}`}
            onClick={() => setActiveSection(tab)}
          >
            {tab === 'overview' ? '📋 Overview' : tab === 'technology' ? '⚙️ Technology' : '🗓️ Timeline'}
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════════ OVERVIEW ══ */}
      {activeSection === 'overview' && (
        <div className="about-section">

          {/* ── Project Explainer Video ── */}
          <div className="about-video-card">
            <div className="about-video-header">
              <span className="about-video-badge">🎬 Project Video</span>
              <h2 className="about-video-title">Watch the Full Explainer</h2>
              <p className="about-video-sub">
                A cinematic overview of the ERU Weather Station — hardware, software, and live data pipeline.
              </p>
            </div>
            <div className="about-video-frame-wrap">
              <iframe
                className="about-video-iframe"
                src="https://www.youtube.com/embed/lqFAkYpyXcI?rel=0&modestbranding=1&color=white"
                title="ERU Weather Station – Project Explainer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          {/* Mission card */}
          <div className="about-card about-card--highlight">
            <div className="about-card-icon">🎯</div>
            <div>
              <h2 className="about-card-title">Mission</h2>
              <p className="about-card-text">
                To design, build, and deploy a fully autonomous weather monitoring system that streams
                real-time environmental data from a physical IoT device to a polished web dashboard —
                bridging embedded systems, cloud engineering, and modern frontend development.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="about-stats">
            {[
              { value: '6', label: 'Sensors', icon: '📡' },
              { value: '1s', label: 'Update rate', icon: '⚡' },
              { value: '3', label: 'Languages', icon: '🌐' },
              { value: '12', label: 'Engineers', icon: '👥' },
            ].map((s) => (
              <div key={s.label} className="about-stat">
                <div className="about-stat-icon">{s.icon}</div>
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* What it measures */}
          <h2 className="about-section-title">What It Measures</h2>
          <div className="about-sensors">
            {[
              { icon: '🌡️', name: 'Temperature', detail: 'Ambient air temperature in °C' },
              { icon: '💧', name: 'Humidity', detail: 'Relative humidity %' },
              { icon: '⏱️', name: 'Pressure', detail: 'Barometric pressure in hPa' },
              { icon: '☀️', name: 'UV Index', detail: 'Solar UV radiation (0–12 scale)' },
              { icon: '🌧️', name: 'Rainfall', detail: 'Cumulative precipitation in mm' },
              { icon: '💨', name: 'Wind', detail: 'Speed (km/h) + Direction (°)' },
            ].map((s) => (
              <div key={s.name} className="about-sensor-chip">
                <span className="about-sensor-icon">{s.icon}</span>
                <div>
                  <div className="about-sensor-name">{s.name}</div>
                  <div className="about-sensor-detail">{s.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* University info */}
          <div className="about-card about-card--uni">
            <div className="about-uni-logo">ERU</div>
            <div>
              <h2 className="about-card-title">Egyptian Russian University</h2>
              <p className="about-card-text">
                Faculty of Engineering &amp; Technology · Department of Mechatronics Engineering.
                Located in Badr City, Cairo Governorate, Egypt.
              </p>
              <p className="about-card-text" style={{ marginTop: '8px' }}>
                <strong>Supervision:</strong> Prof. Omar Fathy
              </p>
            </div>
          </div>

          {/* ── Wiring Diagram featured card ── */}
          <div className="about-wiring-card">
            {/* Top: click-to-zoom image */}
            <div
              className="about-wiring-img-wrap"
              onClick={() => setLightboxOpen(true)}
              role="button"
              tabIndex={0}
              aria-label="View full-screen wiring diagram"
              onKeyDown={(e) => e.key === 'Enter' && setLightboxOpen(true)}
            >
              <img
                src="/about/wiring.png"
                alt="Project wiring diagram"
                className="about-wiring-img"
              />
              {/* Zoom hint overlay */}
              <div className="about-wiring-zoom-hint">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <span>Click to expand</span>
              </div>
            </div>

            {/* Bottom: project description */}
            <div className="about-wiring-body">
              <div className="about-wiring-label">
                <span className="about-wiring-badge">📐 Hardware</span>
                <h3 className="about-wiring-title">Circuit & Wiring Diagram</h3>
              </div>
              <p className="about-wiring-desc">
                The ERU Weather Station is built around an <strong>ESP32 development board</strong> at its core.
                Every environmental sensor feeds its raw signal into dedicated GPIO pins, where the firmware
                digitises, calibrates, and packages readings in real time.
              </p>
              <p className="about-wiring-desc">
                The wiring schematic above shows the full inter-connection:
                the <strong>DHT22</strong> on the data bus for temperature and humidity,
                the <strong>BMP280</strong> over I²C for barometric pressure,
                the <strong>ML8511</strong> UV sensor through the ADC,
                an omni-directional <strong>rain gauge</strong> on an interrupt pin,
                and an array of <strong>Hall-effect sensors (A3144E × 8)</strong> forming both the
                anemometer cup counter and the wind-vane position encoder.
                All sensors share a common 3.3 V regulated rail and ground plane.
              </p>
              <div className="about-wiring-tags">
                {['ESP32', 'DHT22', 'BMP280', 'ML8511', 'A3144E × 8', 'I²C', 'ADC', '3.3 V Rail'].map((tag) => (
                  <span key={tag} className="about-wiring-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}


      {/* ══════════════════════════════════════════ TECHNOLOGY ══ */}
      {activeSection === 'technology' && (
        <div className="about-section">
          <h2 className="about-section-title">Technology Stack</h2>
          <p className="about-section-sub">
            The system is built on a modern, event-driven architecture — from embedded C++ firmware on the microcontroller
            to a TypeScript edge-deployed web application.
          </p>

          <div className="about-tech-grid">
            {techStack.map((t) => (
              <div key={t.name} className="about-tech-card" style={{ '--tech-color': t.color } as React.CSSProperties}>
                <div className="about-tech-icon">{t.icon}</div>
                <h3 className="about-tech-name">{t.name}</h3>
                <p className="about-tech-desc">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Architecture diagram (text-based) */}
          <h2 className="about-section-title" style={{ marginTop: '40px' }}>Data Flow</h2>
          <div className="about-flow">
            {[
              { label: 'Sensors', sub: 'Physical hardware', icon: '📡' },
              { label: 'ESP32', sub: 'Firmware (C++)', icon: '⚡' },
              { label: 'Supabase', sub: 'PostgreSQL + Realtime', icon: '🗄️' },
              { label: 'Next.js', sub: 'WebSocket subscription', icon: '▲' },
              { label: 'You', sub: 'Live dashboard', icon: '🖥️' },
            ].map((node, i, arr) => (
              <div key={node.label} className="about-flow-step">
                <div className="about-flow-node">
                  <div className="about-flow-icon">{node.icon}</div>
                  <div className="about-flow-label">{node.label}</div>
                  <div className="about-flow-sub">{node.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="about-flow-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════ TIMELINE ══ */}
      {activeSection === 'timeline' && (
        <div className="about-section">
          <h2 className="about-section-title">Development Timeline</h2>
          <p className="about-section-sub">
            The project was completed in five phases, each building on the previous.
          </p>

          <div className="about-timeline">
            {timeline.map((item, i) => (
              <div key={item.phase} className="about-timeline-item">
                <div className="about-timeline-left">
                  <div className="about-timeline-phase">{item.phase}</div>
                  {i < timeline.length - 1 && <div className="about-timeline-line" />}
                </div>
                <div className="about-timeline-content">
                  <h3 className="about-timeline-title">{item.title}</h3>
                  <p className="about-timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* GitHub link */}
          <div className="about-github">
            <div className="about-github-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </div>
            <div>
              <div className="about-github-title">Open Source</div>
              <p className="about-github-desc">The full source code is available on GitHub.</p>
            </div>
            <a
              href="https://github.com/weatherstationeru/weather-station-web"
              target="_blank"
              rel="noopener noreferrer"
              className="about-github-btn"
            >
              View on GitHub ›
            </a>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="about-footer">
        <span className="about-live-dot" />
        ERU Weather Station · Badr, Egypt · Mechatronics Engineering
      </footer>

      {/* ── Lightbox overlay ── */}
      {lightboxOpen && (
        <div
          className="about-lightbox"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Wiring diagram full-screen view"
          onKeyDown={(e) => e.key === 'Escape' && setLightboxOpen(false)}
          tabIndex={-1}
        >
          {/* Close button */}
          <button
            className="about-lightbox-close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          {/* Image — stop propagation so clicking it doesn't close */}
          <img
            src="/about/wiring.png"
            alt="Full-screen wiring diagram"
            className="about-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="about-lightbox-caption">Circuit &amp; Wiring Diagram — ERU Weather Station</p>
        </div>
      )}

    </main>
  );
}
