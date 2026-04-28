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
        {(['overview', 'hardware', 'technology', 'timeline'] as const).map((tab) => (
          <button
            key={tab}
            className={`about-tab ${activeSection === tab ? 'about-tab--active' : ''}`}
            onClick={() => setActiveSection(tab)}
          >
            {tab === 'overview' ? '📋 Overview'
              : tab === 'hardware' ? '🔧 Hardware'
              : tab === 'technology' ? '⚙️ Technology'
              : '🗓️ Timeline'}
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

          {/* Executive Summary card */}
          <div className="about-card about-card--highlight">
            <div className="about-card-icon">🚀</div>
            <div>
              <h2 className="about-card-title">Executive Summary</h2>
              <p className="about-card-text" style={{ marginBottom: '16px' }}>
                The <strong>Smart Solar-Powered IoT Weather Station</strong> is a self-contained, autonomous sensor network node
                designed to monitor and log local weather conditions with zero human intervention. Powered by a 5 V solar panel and
                a single 18650 Li-ion battery, it continuously measures temperature, humidity, pressure, UV intensity, wind
                speed/direction, and rainfall.
              </p>
              <img src="/about/outdoor_station.png" alt="Simulated Outdoor Station" className="hw-bento-img" style={{ marginBottom: '16px' }} />
              <p className="about-card-text">
                Using an <strong>ESP32 microcontroller</strong>, it gathers data from multiple sensors, transmits readings wirelessly
                to an indoor gateway via <strong>ESP-NOW</strong>, and logs them in a Supabase cloud database for real-time
                visualization. It serves as a scalable platform for precision agriculture, distributed meteorological sensing,
                and environmental IoT applications.
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


      {/* ══════════════════════════════════════════ HARDWARE ══ */}
      {activeSection === 'hardware' && (
        <div className="about-section">

          {/* ── Bento Grid: System Overview ── */}
          <h2 className="about-section-title">System Architecture</h2>
          <p className="about-section-sub">A self-contained, solar-powered IoT node that streams live environmental data to the cloud — no human intervention required.</p>

          <div className="hw-bento">

            {/* Card 1 – Mission */}
            <div className="hw-bento-card hw-bento-card--wide hw-bento-card--accent">
              <div className="hw-bento-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <h3 className="hw-bento-title">Autonomous Operation</h3>
              <p className="hw-bento-desc">Powered by a 5 V solar panel → TP4056 charger → 18650 Li-ion battery → MT3608 boost converter (tuned to 5.0 V). Runs continuously with zero external power. Deep-sleep between transmissions extends battery life.</p>
            </div>

            {/* Card 2 – Sensors */}
            <div className="hw-bento-card">
              <div className="hw-bento-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3z"/><path d="M14 3h7v7h-7z"/><path d="M3 14h7v7H3z"/><path d="M14 14h7v7h-7z"/></svg>
              </div>
              <h3 className="hw-bento-title">6-Sensor Array</h3>
              <p className="hw-bento-desc" style={{ marginBottom: '12px' }}>
                <img src="/about/sensor_array.png" alt="Sensor Array Circuit" className="hw-bento-img" />
              </p>
              <ul className="hw-bento-list">
                <li>🌡️ AHT20 — Temperature &amp; Humidity (I²C, 3.3 V)</li>
                <li>🔵 BMP280 — Barometric Pressure ±1.0 hPa (I²C)</li>
                <li>☀️ GY-ML8511 — UV Index (Analog, GPIO32)</li>
                <li>💨 A3144 ×4 — Wind Vane N/E/S/W (Hall, 5 V)</li>
                <li>🌀 A3144 ×1 — Anemometer Speed (Hall, GPIO34)</li>
                <li>🌧️ A3144 ×1 — Rain Gauge tips (Hall, GPIO35)</li>
              </ul>
            </div>

            {/* Card 3 – Wireless */}
            <div className="hw-bento-card hw-bento-card--purple">
              <div className="hw-bento-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>
              </div>
              <h3 className="hw-bento-title">ESP-NOW Wireless</h3>
              <p className="hw-bento-desc">Proprietary 2.4 GHz peer-to-peer link — no Wi-Fi router needed. Ultra-low latency, minimal overhead. Outdoor node transmits to Indoor Gateway ESP32 which bridges to cloud via HTTPS.</p>
            </div>

            {/* Card 4 – Power Live Status */}
            <div className="hw-bento-card hw-bento-card--power">
              <div className="hw-bento-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <h3 className="hw-bento-title">Power System</h3>
              <div className="hw-power-chain">
                <span className="hw-power-node">☀️ Solar 5 V</span>
                <span className="hw-power-arrow">→</span>
                <span className="hw-power-node">🔋 TP4056</span>
                <span className="hw-power-arrow">→</span>
                <span className="hw-power-node">⚡ MT3608</span>
                <span className="hw-power-arrow">→</span>
                <span className="hw-power-node">🟢 5.0 V Rail</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <img src="/about/power_flow.png" alt="Power System Diagram" className="hw-bento-img" />
              </div>
              <div className="hw-power-rails">
                <div className="hw-power-rail hw-power-rail--5v"><span>5 V Rail</span><span>Hall VCC · ESP32 VIN · Shifter HV</span></div>
                <div className="hw-power-rail hw-power-rail--3v"><span>3.3 V Rail</span><span>AHT20 · BMP280 · GY-ML8511 · Shifter LV</span></div>
                <div className="hw-power-rail hw-power-rail--gnd"><span>GND Rail</span><span>All sensor grounds · Battery (−)</span></div>
              </div>
            </div>

            {/* Card 5 – Cloud Stack */}
            <div className="hw-bento-card hw-bento-card--wide">
              <div className="hw-bento-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
              </div>
              <h3 className="hw-bento-title">Data Flow: Node → Cloud</h3>
              <div style={{ margin: '16px 0' }}>
                <img src="/about/system_architecture.png" alt="System Architecture Diagram" className="hw-bento-img" />
              </div>
              <div className="hw-flow-row">
                {['Outdoor ESP32\n+ Sensors','ESP-NOW\nWireless','Indoor Gateway\nESP32 + TFT','Wi-Fi HTTPS','Node.js\nAPI Server','Supabase\nPostgreSQL'].map((label, i, arr) => (
                  <div key={i} className="hw-flow-step">
                    <div className="hw-flow-bubble">{label.split('\n').map((l, j) => <span key={j}>{l}</span>)}</div>
                    {i < arr.length - 1 && <div className="hw-flow-arr">→</div>}
                  </div>
                ))}
              </div>
            </div>

          </div>{/* /hw-bento */}

          {/* ── GPIO Pin Mapping Table ── */}
          <h2 className="about-section-title" style={{ marginTop: '40px' }}>GPIO Pin Mapping</h2>
          <p className="about-section-sub">Interactive pin assignment table — hover rows to highlight. All Hall signals pass through 5V→3.3V level shifters before reaching the ESP32.</p>

          <div className="hw-table-wrap">
            <table className="hw-table">
              <thead>
                <tr>
                  <th>Signal</th>
                  <th>ESP32 Pin</th>
                  <th>Sensor / Module</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { signal: '3.3 V Supply', pin: '3V3', module: 'AHT20 VCC, BMP280 VCC, UV VIN, Shifter LV', notes: '10 μF decouple between 3.3V–GND' },
                  { signal: '5 V Supply', pin: 'VIN (or 5V)', module: 'TP4056 OUT+, Shifter HV, Hall VCC pins', notes: 'Boost module tuned to 5.00 V' },
                  { signal: 'Ground', pin: 'GND', module: 'All sensor grounds, GND pins', notes: 'Common reference' },
                  { signal: 'I²C SDA', pin: 'GPIO21', module: 'AHT20, BMP280 (SDA)', notes: 'Also connect to pull-ups (board)' },
                  { signal: 'I²C SCL', pin: 'GPIO22', module: 'AHT20, BMP280 (SCL)', notes: '' },
                  { signal: 'UV Sensor EN', pin: '3.3V (tie high)', module: 'GY-ML8511', notes: 'Always high (active)' },
                  { signal: 'UV Sensor OUT', pin: 'GPIO32 (ADC)', module: 'GY-ML8511', notes: 'Analog input 0–3.3 V range' },
                  { signal: 'Wind North', pin: 'GPIO25', module: 'Hall A3144 #1 (N)', notes: 'via Shifter1 LV1' },
                  { signal: 'Wind East', pin: 'GPIO26', module: 'Hall A3144 #2 (E)', notes: 'via Shifter1 LV2' },
                  { signal: 'Wind South', pin: 'GPIO27', module: 'Hall A3144 #3 (S)', notes: 'via Shifter1 LV3' },
                  { signal: 'Wind West', pin: 'GPIO14', module: 'Hall A3144 #4 (W)', notes: 'via Shifter1 LV4' },
                  { signal: 'Anemometer', pin: 'GPIO34', module: 'Hall A3144 #5 (speed)', notes: 'via Shifter2 LV1' },
                  { signal: 'Rain Gauge', pin: 'GPIO35', module: 'Hall A3144 #6 (rain)', notes: 'via Shifter2 LV2' },
                  { signal: 'Hall Pull-ups', pin: '5 V', module: '10 kΩ (one per A3144)', notes: 'One between VCC and OUT each — MANDATORY' },
                ].map((row, i) => (
                  <tr key={i} className="hw-table-row">
                    <td className="hw-td hw-td--signal">{row.signal}</td>
                    <td className="hw-td hw-td--pin"><code>{row.pin}</code></td>
                    <td className="hw-td">{row.module}</td>
                    <td className="hw-td hw-td--note">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Sensor Interfacing ── */}
          <h2 className="about-section-title" style={{ marginTop: '40px' }}>Sensor Interfacing &amp; Level Shifting</h2>
          <div className="hw-bento hw-bento--3col">

            <div className="hw-bento-card">
              <div className="hw-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3 className="hw-bento-title">I²C Digital (3.3 V)</h3>
              <p className="hw-bento-desc" style={{ marginBottom: '12px' }}>
                <img src="/about/dht_bmp.png" alt="DHT22 and BMP280 Sensors" className="hw-bento-img" />
              </p>
              <p className="hw-bento-desc"><strong>AHT20 / DHT22</strong> — 2.2–5.5 V VDD, 10 μF decoupling cap on VDD-GND, SDA → GPIO21, SCL → GPIO22. 10 kΩ pull-up resistors on bus lines.</p>
              <p className="hw-bento-desc" style={{marginTop:'8px'}}><strong>BMP280</strong> — I²C address 0x76/0x77, 3.3 V, 10 μF decoupling. Same SDA/SCL bus. Accuracy: ±1.0 hPa.</p>
            </div>

            <div className="hw-bento-card">
              <div className="hw-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              </div>
              <h3 className="hw-bento-title">Analog UV (GY-ML8511)</h3>
              <p className="hw-bento-desc" style={{ marginBottom: '12px' }}>
                <img src="/about/uv_sensor.png" alt="ML8511 UV Sensor" className="hw-bento-img" />
              </p>
              <p className="hw-bento-desc">UV photodiode + op-amp outputting 0–3.6 V proportional to UVA intensity. VIN = 3.3 V, EN pin must be tied HIGH (3.3 V) to activate. OUT → GPIO32 ADC. 0.1 μF decoupling on VDD.</p>
            </div>

            <div className="hw-bento-card hw-bento-card--warn">
              <div className="hw-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h3 className="hw-bento-title">Hall A3144 — CRITICAL</h3>
              <p className="hw-bento-desc" style={{ marginBottom: '12px' }}>
                <img src="/about/hall_sensor.png" alt="A3144E Hall Sensor" className="hw-bento-img" />
              </p>
              <p className="hw-bento-desc">Unipolar open-collector switches, 4.5–24 V operation. Run at 5 V for clean digital signals. <strong>10 kΩ pull-up between VCC and OUT is MANDATORY</strong> — without it, output floats and data is noisy. 0.01–0.1 μF cap between VCC-GND per sensor.</p>
              <p className="hw-bento-desc" style={{marginTop:'8px'}}>ESP32 GPIOs are NOT 5 V tolerant → two 4-channel BSS138 level shifters translate HV (5 V) to LV (3.3 V) for each Hall signal. I²C bus bypasses shifters (already 3.3 V).</p>
            </div>

          </div>

          {/* ── Software Logic ── */}
          <h2 className="about-section-title" style={{ marginTop: '40px' }}>Firmware &amp; Software Logic</h2>
          <div className="hw-bento hw-bento--3col">

            <div className="hw-bento-card">
              <div className="hw-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>
              </div>
              <h3 className="hw-bento-title">Outdoor Node (C++)</h3>
              <p className="hw-bento-desc">setup(): init I²C + ESP-NOW. loop(): read AHT20/BMP280 via I²C, read UV ADC, count anemometer pulses, decode wind vane magnets, count rain tips. Package into struct → <code>esp_now_send()</code> to Gateway MAC → <code>esp_sleep()</code> 10 s.</p>
            </div>

            <div className="hw-bento-card">
              <div className="hw-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              </div>
              <h3 className="hw-bento-title">Indoor Gateway (C++)</h3>
              <p className="hw-bento-desc">Boot → connect Wi-Fi + init TFT + register ESP-NOW receiver. On packet callback: parse readings → update TFT display (optionally render QR) → HTTP POST to Node.js REST API (HTTPS, API key auth) → optional SD card backup.</p>
            </div>

            <div className="hw-bento-card hw-bento-card--accent">
              <div className="hw-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
              </div>
              <h3 className="hw-bento-title">Node.js + Supabase</h3>
              <p className="hw-bento-desc"><strong>Node.js (Express):</strong> POST /addReading endpoint (API-key protected) → inserts row into Supabase <code>sensor_data</code> table. Minimal code — Supabase auto-generates REST endpoints.</p>
              <p className="hw-bento-desc" style={{marginTop:'8px'}}><strong>Table columns:</strong> id, device_id, timestamp, temperature, humidity, pressure, uv_index, wind_speed, wind_direction, rainfall. Dashboards subscribe via Supabase Realtime WebSocket.</p>
            </div>

          </div>

          {/* ── Safety Checklist ── */}
          <h2 className="about-section-title" style={{ marginTop: '40px' }}>Safety &amp; Testing Checklist</h2>
          <div className="hw-checklist">
            {[
              { icon: '⚡', label: 'Electrical Safety', detail: 'Verify battery polarity. No exposed wires. Multimeter: 5 V rail exactly 5.0 V, 3.3 V rail stable.' },
              { icon: '🔩', label: 'Component Ratings', detail: 'A3144 outputs MUST have 10 kΩ pull-ups to 5 V. UV sensor EN pin tied HIGH (3.3 V).' },
              { icon: '📡', label: 'Sensor Function', detail: 'I²C scan: confirm AHT20 (0x38) + BMP280 (0x76/0x77) respond. UV: shine lamp → read ADC. Hall: move magnet → observe GPIO toggle in Serial.' },
              { icon: '💻', label: 'Software Sanity', detail: 'POST fake data to Node.js endpoint (curl/Postman) before trusting ESP32. Check gateway TFT displays updates.' },
              { icon: '🌧️', label: 'Environmental Protection', detail: 'Outdoor electronics in waterproof box with silicone-sealed cable entries. Conformal coating recommended on PCB.' },
            ].map((item, i) => (
              <div key={i} className="hw-check-item">
                <div className="hw-check-icon">{item.icon}</div>
                <div>
                  <div className="hw-check-label">{item.label}</div>
                  <div className="hw-check-detail">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Deployment & Improvements ── */}
          <div className="hw-bento hw-bento--2col" style={{ marginTop: '32px' }}>

            <div className="hw-bento-card">
              <div className="hw-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h3 className="hw-bento-title">Deployment &amp; Maintenance</h3>
              <ul className="hw-bento-list">
                <li>🧭 Mount anemometer in clear, unobstructed area. Align magnets with true N/S/E/W.</li>
                <li>☀️ Keep solar panel clean. Full sun recharges 18650 daily under light load.</li>
                <li>📡 OTA firmware updates via gateway Wi-Fi. Send heartbeats to Node.js for uptime monitoring.</li>
                <li>📊 Use Supabase dashboard or Grafana (Postgres source) for visualization &amp; alerts.</li>
                <li>🔧 Inspect solder joints every few months. Replace 18650 after ~2 years (below 2.9 V).</li>
              </ul>
            </div>

            <div className="hw-bento-card hw-bento-card--purple">
              <div className="hw-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <h3 className="hw-bento-title">Suggested Improvements</h3>
              <ul className="hw-bento-list">
                <li>💤 Deep sleep between transmissions (wake on timer or rain-bucket interrupt).</li>
                <li>🌿 Add BH1750 light sensor or CO₂ sensor via spare I²C pins.</li>
                <li>🎛️ Software calibration: BMP280 pressure offset + AHT20 humidity offset in EEPROM.</li>
                <li>📶 Multi-station mesh via ESP-NOW broadcast or switch to LoRaWAN for long range.</li>
                <li>🏠 Fabricate proper Stevenson screen (ventilated white box) for accurate air temp.</li>
              </ul>
            </div>

          </div>

          {/* ══════════════════════════════════ ROADMAP TO V2.0 ══ */}
          <div className="rm-header">
            <div className="rm-badge">
              <span className="rm-badge-dot" />
              V2.0 Roadmap
            </div>
            <h2 className="rm-title">Roadmap to V2.0</h2>
            <p className="rm-subtitle">
              The next evolution of the ERU Weather Station — from passive sensing to active automation,
              predictive intelligence, and large-scale industrial deployment.
            </p>
          </div>

          {/* Category labels row */}
          <div className="rm-categories">
            {[
              { color: '#f59e0b', label: 'Automation' },
              { color: '#60a5fa', label: 'Analytics' },
              { color: '#34d399', label: 'Applications' },
              { color: '#f472b6', label: 'Industrial' },
            ].map(c => (
              <span key={c.label} className="rm-cat-pill" style={{ '--cat-color': c.color } as React.CSSProperties}>
                {c.label}
              </span>
            ))}
          </div>

          {/* Horizontal scroll showcase */}
          <div className="rm-scroll-track">

            {/* ── AUTOMATION cards ── */}
            <div className="rm-card rm-card--amber rm-card--priority" data-category="Automation">
              <div className="rm-card-glow" />
              <div className="rm-card-top">
                <div className="rm-card-icon rm-card-icon--amber">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M2 12h4m12 0h4M12 2v4m0 12v4"/></svg>
                </div>
                <div>
                  <div className="rm-card-cat">Automation · Priority</div>
                  <h3 className="rm-card-title">Actuator Node</h3>
                </div>
              </div>
              <p className="rm-card-desc">Add a dedicated indoor ESP32 wired to a 5 V relay module. When the outdoor node detects high humidity or extreme temperature, the Node.js backend sends a command back to the hardware — automatically switching fans, humidifiers, or exhaust vents. Closes the automation loop entirely.</p>
              <div className="rm-card-tags">
                {['Relay Module', 'Node.js Commands', 'Closed-Loop'].map(t => <span key={t} className="rm-tag">{t}</span>)}
              </div>
            </div>

            <div className="rm-card rm-card--amber rm-card--priority" data-category="Automation">
              <div className="rm-card-glow" />
              <div className="rm-card-top">
                <div className="rm-card-icon rm-card-icon--amber">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                </div>
                <div>
                  <div className="rm-card-cat">Automation · Priority</div>
                  <h3 className="rm-card-title">Hardware-in-the-Loop</h3>
                </div>
              </div>
              <p className="rm-card-desc">The ultimate mechatronics integration. Attach a servo motor to the indoor gateway to physically react to outdoor conditions — adjusting window vents on temperature drop, or triggering relays when wind spikes. Transforms the station from observer to actor.</p>
              <div className="rm-card-tags">
                {['Servo Motor', 'Relay Control', 'Physical Automation'].map(t => <span key={t} className="rm-tag">{t}</span>)}
              </div>
            </div>

            {/* ── ANALYTICS cards ── */}
            <div className="rm-card rm-card--blue rm-card--priority" data-category="Analytics">
              <div className="rm-card-glow rm-card-glow--blue" />
              <div className="rm-card-top">
                <div className="rm-card-icon rm-card-icon--blue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
                <div>
                  <div className="rm-card-cat">Analytics · Priority</div>
                  <h3 className="rm-card-title">Predictive Analytics Microservice</h3>
                </div>
              </div>
              <p className="rm-card-desc">Build a Python microservice using Pandas to pull historical data from Supabase via API. Calculate trend averages, predict battery drain during cloudy weeks, and forecast local temperature drops. Push predictions back to the dashboard as an intelligent weather layer.</p>
              <div className="rm-card-tags">
                {['Python / Pandas', 'Supabase API', 'ML Forecasting'].map(t => <span key={t} className="rm-tag rm-tag--blue">{t}</span>)}
              </div>
            </div>

            {/* ── APPLICATIONS cards ── */}
            <div className="rm-card rm-card--green" data-category="Applications">
              <div className="rm-card-top">
                <div className="rm-card-icon rm-card-icon--green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <div className="rm-card-cat">Applications</div>
                  <h3 className="rm-card-title">Hyper-Local Accuracy</h3>
                </div>
              </div>
              <p className="rm-card-desc">Commercial weather apps average data from distant stations. This station provides ground-truth readings for your exact street — capturing temperature micro-drops, wind spikes, and local humidity shifts that generic apps completely miss.</p>
              <div className="rm-card-tags">
                {['Microclimates', 'Street-Level Data'].map(t => <span key={t} className="rm-tag rm-tag--green">{t}</span>)}
              </div>
            </div>

            <div className="rm-card rm-card--green" data-category="Applications">
              <div className="rm-card-top">
                <div className="rm-card-icon rm-card-icon--green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <div className="rm-card-cat">Applications</div>
                  <h3 className="rm-card-title">Precision Agriculture</h3>
                </div>
              </div>
              <p className="rm-card-desc">Deploy modular ESP nodes across a garden or greenhouse. Add soil moisture and sun exposure sensors to dictate exactly when to activate irrigation. In arid climates, knowing precise evaporation rate prevents over-watering and saves critical resources.</p>
              <div className="rm-card-tags">
                {['Soil Moisture', 'Irrigation Control', 'Greenhouse'].map(t => <span key={t} className="rm-tag rm-tag--green">{t}</span>)}
              </div>
            </div>

            <div className="rm-card rm-card--green" data-category="Applications">
              <div className="rm-card-top">
                <div className="rm-card-icon rm-card-icon--green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                </div>
                <div>
                  <div className="rm-card-cat">Applications</div>
                  <h3 className="rm-card-title">Indoor/Outdoor Comfort</h3>
                </div>
              </div>
              <p className="rm-card-desc">Place one node outside, one inside. Calculate the real-time temperature/humidity delta. Dashboard alerts you the moment it is cooler outside than inside — telling you precisely when to open windows for free natural cooling instead of running AC.</p>
              <div className="rm-card-tags">
                {['Dual Node', 'HVAC Optimization', 'Delta Alerts'].map(t => <span key={t} className="rm-tag rm-tag--green">{t}</span>)}
              </div>
            </div>

            <div className="rm-card rm-card--green" data-category="Applications">
              <div className="rm-card-top">
                <div className="rm-card-icon rm-card-icon--green">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>
                </div>
                <div>
                  <div className="rm-card-cat">Applications</div>
                  <h3 className="rm-card-title">Dust &amp; Air Quality Defense</h3>
                </div>
              </div>
              <p className="rm-card-desc">Add a PM2.5/PM10 particulate sensor to detect rising dust levels before they are visible. The system closes windows automatically or sends an alert — protecting occupants and equipment during dust storms common in arid regions.</p>
              <div className="rm-card-tags">
                {['PM2.5 Sensor', 'Air Quality', 'Auto-Alert'].map(t => <span key={t} className="rm-tag rm-tag--green">{t}</span>)}
              </div>
            </div>

            {/* ── INDUSTRIAL cards ── */}
            <div className="rm-card rm-card--pink rm-card--priority" data-category="Industrial">
              <div className="rm-card-glow rm-card-glow--pink" />
              <div className="rm-card-top">
                <div className="rm-card-icon rm-card-icon--pink">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/><path d="M12 7v4m-2-2h4"/></svg>
                </div>
                <div>
                  <div className="rm-card-cat">Industrial · Priority</div>
                  <h3 className="rm-card-title">Smart Manufacturing &amp; Predictive Maintenance</h3>
                </div>
              </div>
              <p className="rm-card-desc">Replace weather sensors with vibration or high-heat probes. Magnetically attach solar-powered nodes to factory motors. ESP-NOW transmits telemetry to a central Node.js server — flagging abnormal heat signatures before equipment failure halts production. Mirrors Siemens IIoT methodology.</p>
              <div className="rm-card-tags">
                {['Vibration Sensors', 'IIoT', 'Predictive Alerts', 'Siemens-style'].map(t => <span key={t} className="rm-tag rm-tag--pink">{t}</span>)}
              </div>
            </div>

            <div className="rm-card rm-card--pink" data-category="Industrial">
              <div className="rm-card-top">
                <div className="rm-card-icon rm-card-icon--pink">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                </div>
                <div>
                  <div className="rm-card-cat">Industrial</div>
                  <h3 className="rm-card-title">Large-Scale Infrastructure Monitoring</h3>
                </div>
              </div>
              <p className="rm-card-desc">Equip nodes with CO/NO₂ gas sensors and deploy at intervals through tunnel networks or bridges. Because ESP-NOW requires no central Wi-Fi router, nodes relay critical air quality data down the chain. Dangerous fume buildup triggers heavy-duty ventilation automatically.</p>
              <div className="rm-card-tags">
                {['Gas Sensors (CO/NO₂)', 'Tunnel Networks', 'Mesh Relay'].map(t => <span key={t} className="rm-tag rm-tag--pink">{t}</span>)}
              </div>
            </div>

            <div className="rm-card rm-card--pink" data-category="Industrial">
              <div className="rm-card-top">
                <div className="rm-card-icon rm-card-icon--pink">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <div className="rm-card-cat">Industrial</div>
                  <h3 className="rm-card-title">Distributed Agricultural Automation</h3>
                </div>
              </div>
              <p className="rm-card-desc">Deploy dozens of deep-sleep, off-grid nodes across large agricultural sectors. Soil moisture and pH probes identify which zones are drying. The system actuates only the specific irrigation valves for those dry sectors — saving massive water and power at commercial scale.</p>
              <div className="rm-card-tags">
                {['Soil pH / Moisture', 'Valve Actuation', 'Off-Grid Scale'].map(t => <span key={t} className="rm-tag rm-tag--pink">{t}</span>)}
              </div>
            </div>

          </div>{/* /rm-scroll-track */}

          <p className="rm-scroll-hint">← Scroll to explore all improvements →</p>

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
