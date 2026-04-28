export default function PlanPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>ERU Dashboard — UI/UX Improvement Plan</title>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', sans-serif;
            background: #080c14;
            color: #e2eaf8;
            min-height: 100vh;
            padding: 40px 20px 80px;
          }
          .container { max-width: 860px; margin: 0 auto; }

          /* Header */
          .hero {
            text-align: center;
            padding: 48px 0 40px;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            margin-bottom: 48px;
          }
          .hero h1 {
            font-size: 2.2rem; font-weight: 700; letter-spacing: -0.5px;
            background: linear-gradient(135deg, #60a5fa, #a78bfa);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          }
          .hero p { color: rgba(180,200,240,0.6); margin-top: 10px; font-size: 0.95rem; }
          .status-badge {
            display: inline-block; margin-top: 16px;
            padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
            background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3);
            color: #fbbf24; letter-spacing: 0.5px; text-transform: uppercase;
          }

          /* Sections */
          h2 { font-size: 1.4rem; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
          h3 { font-size: 1rem; font-weight: 600; margin: 28px 0 10px; color: #c7d8f8; }
          p { line-height: 1.7; color: rgba(200,220,255,0.75); margin-bottom: 10px; }

          /* Palette cards */
          .palette-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 48px; }
          @media (max-width: 600px) { .palette-grid { grid-template-columns: 1fr; } }
          .palette-card {
            background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px; padding: 20px; position: relative; transition: transform 0.2s, border-color 0.2s;
          }
          .palette-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.16); }
          .palette-card.recommended { border-color: rgba(96,165,250,0.4); background: rgba(96,165,250,0.05); }
          .rec-badge {
            position: absolute; top: 14px; right: 14px;
            font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 8px;
            background: rgba(96,165,250,0.2); color: #60a5fa; border: 1px solid rgba(96,165,250,0.3);
          }
          .palette-card h3 { margin-top: 0; font-size: 1.05rem; }
          .palette-swatches { display: flex; gap: 8px; margin: 14px 0; }
          .swatch { width: 28px; height: 28px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
          .palette-vibe { font-size: 13px; color: rgba(180,200,240,0.55); font-style: italic; margin-top: 8px; }
          .token-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
          .token-table th { text-align: left; color: rgba(180,200,240,0.5); font-weight: 500; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .token-table td { padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
          .token-table td:first-child { font-family: 'JetBrains Mono', monospace; color: #a78bfa; font-size: 11px; }
          .token-table td:last-child { color: rgba(200,220,255,0.6); }
          .color-dot { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 6px; vertical-align: middle; border: 1px solid rgba(255,255,255,0.15); }

          /* Improvement items */
          .priority-section { margin-bottom: 40px; }
          .priority-label {
            font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;
            padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 20px;
          }
          .high  { background: rgba(239,68,68,0.15);  color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
          .med   { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
          .low   { background: rgba(52,211,153,0.12); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }
          .item-card {
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
            border-radius: 14px; padding: 18px 20px; margin-bottom: 12px;
          }
          .item-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 6px; color: #e2eaf8; }
          .item-file { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #60a5fa; margin-bottom: 8px; }
          .item-desc { font-size: 13px; color: rgba(180,200,240,0.65); }
          code {
            font-family: 'JetBrains Mono', monospace; font-size: 12px;
            background: rgba(255,255,255,0.07); padding: 2px 6px; border-radius: 5px; color: #a78bfa;
          }

          /* Checklist */
          .checklist { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px 28px; }
          .checklist h2 { margin-bottom: 16px; }
          .check-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
          .check-box { width: 20px; height: 20px; border-radius: 5px; border: 1.5px solid rgba(255,255,255,0.2); flex-shrink: 0; margin-top: 1px; }
          .check-text { font-size: 14px; color: rgba(200,220,255,0.8); line-height: 1.5; }
          .check-text strong { color: #e2eaf8; }
          .options { color: rgba(150,180,230,0.6); font-size: 13px; margin-top: 2px; }

          /* divider */
          .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 48px 0; }
        `}</style>
      </head>
      <body>
        <div className="container">

          {/* ── Hero ── */}
          <div className="hero">
            <h1>🌦️ ERU Weather Dashboard</h1>
            <p>UI/UX Improvement Plan · Color Palettes + Component Upgrades</p>
            <div className="status-badge">⏳ Awaiting Approval — No Changes Made</div>
          </div>

          {/* ── Palettes ── */}
          <h2>🎨 Color Palette Options</h2>
          <p style={{marginBottom:'24px'}}>Choose one palette. All options replace the 6 CSS variables in <code>:root</code> inside <code>globals.css</code>.</p>

          <div className="palette-grid">

            {/* Palette 1 */}
            <div className="palette-card recommended">
              <div className="rec-badge">✅ Recommended</div>
              <h3>1 — Aurora Deep</h3>
              <div className="palette-swatches">
                <div className="swatch" style={{background:'#060d1f'}} title="#060d1f" />
                <div className="swatch" style={{background:'#0b1d3a'}} title="#0b1d3a" />
                <div className="swatch" style={{background:'#0f2d55'}} title="#0f2d55" />
                <div className="swatch" style={{background:'#ffcc44'}} title="#ffcc44" />
                <div className="swatch" style={{background:'#5daaff'}} title="#5daaff" />
                <div className="swatch" style={{background:'#00e8b5'}} title="#00e8b5" />
              </div>
              <table className="token-table">
                <thead><tr><th>Token</th><th>New Value</th></tr></thead>
                <tbody>
                  <tr><td>--sky-top</td><td><span className="color-dot" style={{background:'#060d1f'}} />#060d1f</td></tr>
                  <tr><td>--sky-mid</td><td><span className="color-dot" style={{background:'#0b1d3a'}} />#0b1d3a</td></tr>
                  <tr><td>--sky-bot</td><td><span className="color-dot" style={{background:'#0f2d55'}} />#0f2d55</td></tr>
                  <tr><td>--accent-warm</td><td><span className="color-dot" style={{background:'#ffcc44'}} />#ffcc44</td></tr>
                  <tr><td>--accent-blue</td><td><span className="color-dot" style={{background:'#5daaff'}} />#5daaff</td></tr>
                  <tr><td>--accent-teal</td><td><span className="color-dot" style={{background:'#00e8b5'}} />#00e8b5</td></tr>
                  <tr><td>--glass-bg</td><td>rgba(120,170,255,0.07)</td></tr>
                  <tr><td>--glass-border</td><td>rgba(140,190,255,0.16)</td></tr>
                </tbody>
              </table>
              <p className="palette-vibe">Polished refinement. Blue-tinted glass feels more intentional than neutral white.</p>
            </div>

            {/* Palette 2 */}
            <div className="palette-card">
              <h3>2 — Midnight Amber 🔥</h3>
              <div className="palette-swatches">
                <div className="swatch" style={{background:'#0a0a0f'}} />
                <div className="swatch" style={{background:'#12101a'}} />
                <div className="swatch" style={{background:'#1c1428'}} />
                <div className="swatch" style={{background:'#f59e0b'}} />
                <div className="swatch" style={{background:'#818cf8'}} />
                <div className="swatch" style={{background:'#a78bfa'}} />
              </div>
              <table className="token-table">
                <thead><tr><th>Token</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td>--sky-top</td><td><span className="color-dot" style={{background:'#0a0a0f'}} />#0a0a0f</td></tr>
                  <tr><td>--sky-mid</td><td><span className="color-dot" style={{background:'#12101a'}} />#12101a</td></tr>
                  <tr><td>--sky-bot</td><td><span className="color-dot" style={{background:'#1c1428'}} />#1c1428</td></tr>
                  <tr><td>--accent-warm</td><td><span className="color-dot" style={{background:'#f59e0b'}} />#f59e0b</td></tr>
                  <tr><td>--accent-blue</td><td><span className="color-dot" style={{background:'#818cf8'}} />#818cf8</td></tr>
                  <tr><td>--accent-teal</td><td><span className="color-dot" style={{background:'#a78bfa'}} />#a78bfa</td></tr>
                  <tr><td>--glass-bg</td><td>rgba(255,200,100,0.05)</td></tr>
                  <tr><td>--glass-border</td><td>rgba(245,158,11,0.15)</td></tr>
                </tbody>
              </table>
              <p className="palette-vibe">Cinematic and mysterious. Warm/cool contrast makes data pop.</p>
            </div>

            {/* Palette 3 */}
            <div className="palette-card">
              <h3>3 — Coastal Storm 🌊</h3>
              <div className="palette-swatches">
                <div className="swatch" style={{background:'#020d18'}} />
                <div className="swatch" style={{background:'#043d5a'}} />
                <div className="swatch" style={{background:'#066990'}} />
                <div className="swatch" style={{background:'#fb923c'}} />
                <div className="swatch" style={{background:'#22d3ee'}} />
                <div className="swatch" style={{background:'#4ade80'}} />
              </div>
              <table className="token-table">
                <thead><tr><th>Token</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td>--sky-top</td><td><span className="color-dot" style={{background:'#020d18'}} />#020d18</td></tr>
                  <tr><td>--sky-mid</td><td><span className="color-dot" style={{background:'#043d5a'}} />#043d5a</td></tr>
                  <tr><td>--sky-bot</td><td><span className="color-dot" style={{background:'#066990'}} />#066990</td></tr>
                  <tr><td>--accent-warm</td><td><span className="color-dot" style={{background:'#fb923c'}} />#fb923c</td></tr>
                  <tr><td>--accent-blue</td><td><span className="color-dot" style={{background:'#22d3ee'}} />#22d3ee</td></tr>
                  <tr><td>--accent-teal</td><td><span className="color-dot" style={{background:'#4ade80'}} />#4ade80</td></tr>
                  <tr><td>--glass-bg</td><td>rgba(6,105,144,0.10)</td></tr>
                  <tr><td>--glass-border</td><td>rgba(34,211,238,0.20)</td></tr>
                </tbody>
              </table>
              <p className="palette-vibe">Nautical & scientific. Teal/orange contrast is thematically on-brand.</p>
            </div>

            {/* Palette 4 */}
            <div className="palette-card">
              <h3>4 — Dusk Purple 🌅</h3>
              <div className="palette-swatches">
                <div className="swatch" style={{background:'#0d0514'}} />
                <div className="swatch" style={{background:'#1a0a2e'}} />
                <div className="swatch" style={{background:'#2d1057'}} />
                <div className="swatch" style={{background:'#f472b6'}} />
                <div className="swatch" style={{background:'#818cf8'}} />
                <div className="swatch" style={{background:'#c084fc'}} />
              </div>
              <table className="token-table">
                <thead><tr><th>Token</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td>--sky-top</td><td><span className="color-dot" style={{background:'#0d0514'}} />#0d0514</td></tr>
                  <tr><td>--sky-mid</td><td><span className="color-dot" style={{background:'#1a0a2e'}} />#1a0a2e</td></tr>
                  <tr><td>--sky-bot</td><td><span className="color-dot" style={{background:'#2d1057'}} />#2d1057</td></tr>
                  <tr><td>--accent-warm</td><td><span className="color-dot" style={{background:'#f472b6'}} />#f472b6</td></tr>
                  <tr><td>--accent-blue</td><td><span className="color-dot" style={{background:'#818cf8'}} />#818cf8</td></tr>
                  <tr><td>--accent-teal</td><td><span className="color-dot" style={{background:'#c084fc'}} />#c084fc</td></tr>
                  <tr><td>--glass-bg</td><td>rgba(192,132,252,0.06)</td></tr>
                  <tr><td>--glass-border</td><td>rgba(167,139,250,0.18)</td></tr>
                </tbody>
              </table>
              <p className="palette-vibe">Futuristic & artistic. Very eye-catching — designer portfolio feel.</p>
            </div>

          </div>

          <div className="divider" />

          {/* ── Improvements ── */}
          <h2>🖥️ UI/UX Improvements</h2>

          {/* HIGH */}
          <div className="priority-section">
            <div className="priority-label high">🔴 High Priority — Visual Impact</div>

            <div className="item-card">
              <div className="item-title">1. Two-Column Card Grid on Tablet / Desktop</div>
              <div className="item-file">globals.css</div>
              <div className="item-desc">Add <code>@media (min-width: 640px)</code> to switch <code>.card-grid</code> to 2 columns and expand <code>.app</code> max-width to 720px. Currently all 6 cards stack single-column even on wide screens — wastes horizontal space.</div>
            </div>

            <div className="item-card">
              <div className="item-title">2. Thicker Progress Bars (UV & Humidity)</div>
              <div className="item-file">globals.css</div>
              <div className="item-desc">Increase <code>.uv-track</code> and <code>.humidity-track</code> height from <code>5px</code> → <code>8px</code>. Thin bars are hard to read at a glance, especially on mobile.</div>
            </div>

            <div className="item-card">
              <div className="item-title">3. Card Hover Glow (Accent Color)</div>
              <div className="item-file">globals.css</div>
              <div className="item-desc">Replace plain <code>translateY(-2px)</code> hover with a colored <code>box-shadow</code> bloom: <code>0 12px 32px rgba(96,165,250,0.12)</code>. Makes cards feel alive and premium.</div>
            </div>

            <div className="item-card">
              <div className="item-title">4. Live Dot Animated Ping</div>
              <div className="item-file">globals.css + app/page.tsx</div>
              <div className="item-desc">Add a CSS <code>@keyframes livePing</code> box-shadow pulse to the footer dot when <code>isLive</code> is true. The current static dot is easy to miss.</div>
            </div>
          </div>

          {/* MEDIUM */}
          <div className="priority-section">
            <div className="priority-label med">🟡 Medium Priority — Polish & Usability</div>

            <div className="item-card">
              <div className="item-title">5. Shimmer Skeleton Loader on Card Values</div>
              <div className="item-file">globals.css + app/page.tsx</div>
              <div className="item-desc">When <code>isLoading</code> is true, render an animated shimmer <code>.skeleton</code> span instead of plain <code>--</code> dashes. Much more polished loading state.</div>
            </div>

            <div className="item-card">
              <div className="item-title">6. Chat Typing Indicator (Bouncing Dots)</div>
              <div className="item-file">globals.css + app/page.tsx</div>
              <div className="item-desc">Replace the italic "Thinking…" text with animated 3-dot <code>.typing-dots</code> bounce animation. Standard chat UX pattern — feels natural and modern.</div>
            </div>

            <div className="item-card">
              <div className="item-title">7. "Ask AI" Tooltip on Chat Bubble</div>
              <div className="item-file">globals.css</div>
              <div className="item-desc">CSS <code>::after</code> pseudo-element reveals "Ask AI" label to the left of the floating robot button on hover. Makes the button&apos;s purpose obvious to new users.</div>
            </div>

            <div className="item-card">
              <div className="item-title">8. Hero Temperature — Italic Style</div>
              <div className="item-file">globals.css</div>
              <div className="item-desc">Add <code>font-style: italic</code> to <code>.current-temp</code>. DM Serif Display italic looks spectacular at 110px — editorial, magazine-quality feel.</div>
            </div>

            <div className="item-card">
              <div className="item-title">9. Add "Team" Link to Sidebar</div>
              <div className="item-file">app/components/Sidebar.tsx</div>
              <div className="item-desc">Add a nav item linking to <code>/team</code> using the Lucide <code>Users</code> icon. The team page exists but is completely undiscoverable from the UI.</div>
            </div>
          </div>

          {/* LOW */}
          <div className="priority-section">
            <div className="priority-label low">🟢 Low Priority — Nice-to-Have</div>

            <div className="item-card">
              <div className="item-title">10. Fix Hardcoded Sunrise/Sunset Times</div>
              <div className="item-file">app/page.tsx</div>
              <div className="item-desc">Compute real sunrise/sunset from date + coordinates instead of hardcoded <code>6:42</code> / <code>19:24</code>. Adds credibility and accuracy to the Temperature card.</div>
            </div>

            <div className="item-card">
              <div className="item-title">11. Fix Sidebar Version Chip</div>
              <div className="item-file">app/components/Sidebar.tsx</div>
              <div className="item-desc">The chip reads "Next.js 16" but the installed version is different. Update to match <code>package.json</code>.</div>
            </div>

            <div className="item-card">
              <div className="item-title">12. Compass Live Glow Pulse</div>
              <div className="item-file">globals.css</div>
              <div className="item-desc">Animate <code>.compass-dot</code> with a soft <code>@keyframes compassGlow</code> box-shadow alternate. Subtle indicator that the compass is live.</div>
            </div>
          </div>

          <div className="divider" />

          {/* ── Checklist ── */}
          <div className="checklist">
            <h2>✅ Decision Checklist</h2>
            <div className="check-item"><div className="check-box" /><div className="check-text"><strong>Which palette?</strong><div className="options">1 Aurora Deep &nbsp;·&nbsp; 2 Midnight Amber &nbsp;·&nbsp; 3 Coastal Storm &nbsp;·&nbsp; 4 Dusk Purple</div></div></div>
            <div className="check-item"><div className="check-box" /><div className="check-text"><strong>Two-column card layout?</strong><div className="options">Yes &nbsp;·&nbsp; No</div></div></div>
            <div className="check-item"><div className="check-box" /><div className="check-text"><strong>Implement HIGH priority items?</strong><div className="options">All &nbsp;·&nbsp; Pick: 1, 2, 3, 4</div></div></div>
            <div className="check-item"><div className="check-box" /><div className="check-text"><strong>Implement MEDIUM priority items?</strong><div className="options">All &nbsp;·&nbsp; Pick: 5, 6, 7, 8, 9</div></div></div>
            <div className="check-item"><div className="check-box" /><div className="check-text"><strong>Implement LOW priority items?</strong><div className="options">All &nbsp;·&nbsp; Pick: 10, 11, 12</div></div></div>
          </div>

        </div>
      </body>
    </html>
  );
}
