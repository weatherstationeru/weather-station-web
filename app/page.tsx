'use client';

/**
 * page.tsx — Main dashboard page.
 *
 * Data flow:
 *  1. On mount, `fetchLatest()` loads the most-recent sensor reading.
 *  2. `subscribeToLatest()` opens a Realtime channel: every new INSERT
 *     from the ESP32 instantly updates the UI without polling.
 *  3. The `liveData` state drives all displayed values.
 *  4. Hardcoded fallbacks are shown for values the sensor doesn't provide
 *     (e.g. feelsLike, dewPoint — calculated or left as UI placeholders).
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLatest, subscribeToLatest } from '../lib/weatherApi';
import { sendChatMessage } from '../lib/chatApi';
import type { ChatMessage } from '../lib/chatApi';
import type { WeatherRow } from '../types/weather';
import NavMenu from './components/NavMenu';
import HeroOpening from './components/HeroOpening';
import { useLanguage } from './components/LanguageProvider';
import type { TranslationKey } from '../lib/i18n';
import { SendHorizontal, Loader2 } from 'lucide-react';

// ─── Web Speech API types (not bundled in Next.js tslib by default) ───────────
interface SpeechRecognitionResult {
  readonly length: number;
  [index: number]: { transcript: string; confidence: number };
}
interface SpeechRecognitionEvent extends Event {
  readonly results: { [index: number]: SpeechRecognitionResult; length: number };
}
interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror:  (() => void) | null;
  onend:    (() => void) | null;
  start(): void;
  stop():  void;
}
declare global {
  interface Window {
    SpeechRecognition?:       new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a wind direction in degrees to a compass label. */
function degToCompass(deg: number | null): string {
  if (deg === null) return '--';
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

/** Returns a translation key for the UV category (scale 0–12). */
function uvCategoryKey(uv: number): TranslationKey {
  if (uv <= 2)  return 'uvLow';
  if (uv <= 5)  return 'uvModerate';
  if (uv <= 7)  return 'uvHigh';
  if (uv <= 10) return 'uvVeryHigh';
  return 'uvExtreme';
}

/** Returns a translation key for sun-safety advice. */
function uvAdviceKey(uv: number): TranslationKey {
  if (uv <= 2) return 'uvNoProtection';
  if (uv <= 5) return 'uvUseSunscreen';
  if (uv <= 7) return 'uvSeekShade';
  if (uv <= 10) return 'uvAvoidSun';
  return 'uvStayIndoors';
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { t, lang } = useLanguage();
  // ── UI state ──────────────────────────────────────────────────────────────
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [skyColors, setSkyColors]   = useState({ top: '#0d2545', mid: '#1a4a7a', bot: '#2d6ea8' });
  const [moonOpacity, setMoonOpacity] = useState(0);

  // ── Live data state ───────────────────────────────────────────────────────
  const [liveData, setLiveData]         = useState<WeatherRow | null>(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [dataError, setDataError]       = useState<string | null>(null);
  const [lastUpdated, setLastUpdated]   = useState<Date | null>(null);
  const [isLive, setIsLive]             = useState(false); // true once realtime connects

  // ── Chat state ────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am your AI weather assistant. How can I help you today?' },
  ]);
  const [chatInput, setChatInput]         = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening]     = useState(false);  // mic active
  const [isSpeaking, setIsSpeaking]       = useState(false);  // TTS playing
  const [ttsEnabled, setTtsEnabled]       = useState(true);   // user toggle
  const chatBodyRef    = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // ── Text-to-Speech helper ─────────────────────────────────────────────────
  const speakText = useCallback((text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

    // Voice names ranked best → worst (all major browsers / OS combos).
    // The first match found in getVoices() will be used.
    const PREFERRED_VOICES = [
      // Chrome / Android — neural quality
      'Google UK English Female',
      'Google US English',
      'Google UK English Male',
      // Microsoft Edge / Windows — neural quality
      'Microsoft Aria Online (Natural) - English (United States)',
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft Zira - English (United States)',
      'Microsoft David - English (United States)',
      // macOS / iOS — high quality
      'Samantha',
      'Karen',
      'Moira',
      'Tessa',
      // fallback
      'Alex',
    ];

    const doSpeak = () => {
      const voices = window.speechSynthesis.getVoices();

      // Find the best match from our preference list
      let chosen: SpeechSynthesisVoice | null = null;
      for (const name of PREFERRED_VOICES) {
        const match = voices.find((v) => v.name === name);
        if (match) { chosen = match; break; }
      }

      // Fallback 1: any English female voice
      if (!chosen) {
        chosen = voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ?? null;
      }
      // Fallback 2: any English voice
      if (!chosen) {
        chosen = voices.find((v) => v.lang.startsWith('en')) ?? null;
      }

      window.speechSynthesis.cancel();
      const utter      = new SpeechSynthesisUtterance(text);
      utter.voice      = chosen;          // null = system default (better than nothing)
      utter.lang       = 'en-US';
      utter.rate       = 0.88;            // slightly slower → sounds more considered
      utter.pitch      = 0.95;            // slightly lower → warmer, less robotic
      utter.volume     = 1.0;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend   = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    };

    // Voices may not be loaded yet on first call — wait for them
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      doSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
    }
  }, [ttsEnabled]);

  // ── Speech-to-Text helpers ────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition is not supported in this browser.'); return; }

    const recognition = new SR();
    recognition.lang             = 'en-US';
    recognition.interimResults   = false;
    recognition.maxAlternatives  = 1;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      setChatInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend   = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── Chat send handler ────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = chatInput.trim();
    if (!text || isChatLoading) return;

    // Stop any ongoing speech when user sends a new message
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    const { data, error } = await sendChatMessage(text, liveData);

    const replyText = error
      ? `Sorry, I couldn't reach the AI: ${error}`
      : (data ?? 'No response received.');

    const reply: ChatMessage = { role: 'assistant', content: replyText };
    setMessages((prev) => [...prev, reply]);
    setIsChatLoading(false);

    // Speak the AI reply if TTS is enabled (don't speak error messages)
    if (!error && data) speakText(data);
  }, [chatInput, isChatLoading, liveData, speakText]);

  // Auto-scroll chat body whenever messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // ── Update handler (used by both initial fetch & realtime) ───────────────
  const handleNewData = useCallback((row: WeatherRow) => {
    setLiveData(row);
    setLastUpdated(new Date());
    setIsLoading(false);
    setDataError(null);
  }, []);

  // ── Initial fetch + Realtime subscription ─────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    // 1. Load the most-recent reading immediately
    fetchLatest().then(({ data, error }) => {
      if (cancelled) return;

      if (error) {
        setDataError(error);
        setIsLoading(false);
        return;
      }

      if (data) {
        handleNewData(data);
      } else {
        // Table exists but is empty
        setIsLoading(false);
      }
    });

    // 2. Subscribe to real-time inserts from the ESP32
    const channel = subscribeToLatest(
      (row) => {
        if (!cancelled) {
          handleNewData(row);
          setIsLive(true); // Mark as live once we receive a push update
        }
      },
      (errMsg) => {
        if (!cancelled) {
          console.warn('[Dashboard] Realtime warning:', errMsg);
          // Don't set dataError here — polling fallback can handle it
        }
      }
    );

    // Cleanup: cancel async callbacks and close realtime channel on unmount
    return () => {
      cancelled = true;
      channel.unsubscribe();
    };
  }, [handleNewData]);

  // ── Dynamic sky background ─────────────────────────────────────────────────
  useEffect(() => {
    const hour = new Date().getHours();
    const isDay     = hour > 6  && hour < 19;
    const isSunrise = hour >= 5 && hour <= 8;
    const isSunset  = hour >= 17 && hour <= 20;

    let top: string, mid: string, bot: string, mOpacity: number;

    if (isSunrise) {
      top = '#0f1a2e'; mid = '#2d3a5c'; bot = '#8b4a2c'; mOpacity = 0.3;
    } else if (isSunset) {
      top = '#1a1a3e'; mid = '#4a2050'; bot = '#c0502a'; mOpacity = 0.5;
    } else if (isDay) {
      top = '#0d2545'; mid = '#1a4a7a'; bot = '#2d6ea8'; mOpacity = 1;
    } else {
      top = '#050c18'; mid = '#0a1628'; bot = '#0f2040'; mOpacity = 0.75;
    }

    setSkyColors({ top, mid, bot });
    setMoonOpacity(mOpacity);
  }, []);

  // ── Derived display values ─────────────────────────────────────────────────
  // Safe accessors with sensible fallbacks when data hasn't arrived yet.
  //
  // UV NOTE: The ESP32 stores the raw sensor reading (0–1200 scale).
  // We divide by 100 here to convert to the standard UV index (0–12).
  // Raw data in Supabase is intentionally left untouched.
  const rawUv        = liveData?.uv_index ?? null;
  const normalizedUv = rawUv !== null ? rawUv / 100 : null;

  const d = {
    temp:        liveData?.temp       ?? '--',
    humidity:    liveData?.humidity   ?? '--',
    rainfall:    liveData?.rainfall   ?? '--',
    uvIndex:     normalizedUv,
    windSpeed:   liveData?.wind_speed ?? '--',
    windDir:     liveData?.wind_dir   ?? null,
    pressure:    liveData?.pressure   ?? '--',
    windDirText: degToCompass(liveData?.wind_dir ?? null),
  };

  // ── Status footer text ─────────────────────────────────────────────────────
  const locale = lang === 'ar' ? 'ar-EG' : lang === 'ru' ? 'ru-RU' : 'en-US';
  const footerText = isLoading
    ? t('loading')
    : dataError
    ? `⚠ ${dataError}`
    : lastUpdated
    ? `${t('updated')} ${lastUpdated.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}${isLive ? ` · ${t('live')}` : ''}`
    : t('noDataYet');

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Cinematic opening overlay — shows once per session */}
      <HeroOpening currentTemp={liveData?.temp ?? null} isLoading={isLoading} />

      {/* Nav Menu (burger + prayer times + startup toast) */}
      <NavMenu />

      {/* Chat Widget */}
      <div className="chat-widget">
        <div className={`chat-box ${isChatOpen ? 'active' : ''}`}>
          <div className="chat-header">
            <span>AI Assistant</span>
            <i className="fas fa-times" onClick={() => setIsChatOpen(false)}></i>
          </div>

          {/* Message history */}
          <div className="chat-body" ref={chatBodyRef}>
            {messages.map((msg, i) => (
              <p key={i} className={msg.role === 'assistant' ? 'ai-msg' : 'user-msg'}>
                {msg.content}
              </p>
            ))}
            {/* Typing indicator while waiting for AI */}
            {isChatLoading && (
              <p className="ai-msg" style={{ opacity: 0.6, fontStyle: 'italic' }}>
                Thinking…
              </p>
            )}
          </div>

          {/* Input row */}
          <div className="chat-input-area">
            {/* Mic button — hold to speak */}
            <button
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={isChatLoading}
              title={isListening ? 'Stop listening' : 'Speak your question'}
            >
              <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
            </button>

            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              <input
                type="text"
                placeholder={isListening ? 'Listening…' : 'Ask something…'}
                value={chatInput}
                disabled={isChatLoading || isListening}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                style={{ paddingRight: '44px', width: '100%', boxSizing: 'border-box' }}
              />
              <button
                onClick={handleSend}
                disabled={isChatLoading}
                className="hover:bg-blue-500/20 hover:border-blue-500/50 transition-all"
                style={{
                  position: 'absolute',
                  right: '4px',
                  width: '34px',
                  height: '34px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isChatLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <SendHorizontal className="w-4 h-4 text-white" style={{ marginLeft: '-1px' }} />
                )}
              </button>
            </div>

            {/* Speaker toggle — mute/unmute AI voice */}
            <button
              className={`speaker-btn ${!ttsEnabled ? 'muted' : ''} ${isSpeaking ? 'speaking' : ''}`}
              onClick={() => { setTtsEnabled((v) => !v); window.speechSynthesis?.cancel(); setIsSpeaking(false); }}
              title={ttsEnabled ? 'Mute AI voice' : 'Unmute AI voice'}
            >
              <i className={`fas ${isSpeaking ? 'fa-volume-high' : ttsEnabled ? 'fa-volume-low' : 'fa-volume-xmark'}`}></i>
            </button>
          </div>
        </div>
        {!isChatOpen && (
          <div className="chat-bubble" onClick={() => setIsChatOpen(true)}>
            <i className="fas fa-robot"></i>
          </div>
        )}
      </div>

      {/* Overscroll fill — dark color shows in iOS/Android rubber-band areas */}
      <div className="bg-overscroll" />
      {/* Background video */}
      <video
        className="bg-video"
        src="/bg-video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Dark scrim over video — keeps text readable */}
      <div className="bg-video-overlay" />

      {/* Sky / animated layers on top of video */}
      <div className="sky-wrap" style={{
        '--sky-top': skyColors.top,
        '--sky-mid': skyColors.mid,
        '--sky-bot': skyColors.bot,
      } as React.CSSProperties}></div>
      <div className="stars"></div>
      <div className="aurora">
        <div className="aurora-band"></div>
        <div className="aurora-band"></div>
        <div className="aurora-band"></div>
      </div>
      <div className="clouds">
        <div className="cloud c1"></div>
        <div className="cloud c2"></div>
        <div className="cloud c3"></div>
        <div className="cloud c4"></div>
      </div>
      <div className="moon" style={{ opacity: moonOpacity }}></div>
      <div className="horizon-glow"></div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="app">

        {/* Location + Primary Temp */}
        <div className="location-header">
          <div className="location-pill">
            <i className="fas fa-location-dot"></i>
                        <span>{t('city')}</span>
          </div>
          <div className="current-temp">{liveData?.temp != null ? liveData.temp.toFixed(1) : '--'}{liveData?.temp != null ? '°' : ''}</div>
          <div className="condition">
            {isLoading ? t('loading') : liveData ? t('liveReading') : t('noData')}
          </div>
          <div className="hi-low">
            <span>
              <i className="hi-dot fas fa-circle"></i>
              {t('humidity')}:&nbsp;<span>{d.humidity}{liveData ? '%' : ''}</span>
            </span>
            <span>
              <i className="lo-dot fas fa-circle"></i>
              {t('rain')}:&nbsp;<span>{d.rainfall}{liveData ? ' mm' : ''}</span>
            </span>
          </div>
        </div>

        {/* Conditions Cards */}
        <div className="section-wrap">
          <div className="section-label">
            <i className="fas fa-gauge-high" style={{ marginRight: '6px', opacity: 0.7 }}></i>
            {t('liveConditions')}
          </div>
          <div className="card-grid">

            {/* UV Index */}
            <div className="weather-card">
              <div className="card-header">
                <i className="fas fa-sun" style={{ color: 'var(--accent-warm)' }}></i> {t('uvIndex')}
              </div>
              <div>
                <span className="card-value-large">
                  {normalizedUv != null ? normalizedUv.toFixed(1) : '--'}
                </span>
              </div>
              <div className="card-sub">{normalizedUv != null ? t(uvCategoryKey(normalizedUv)) : '--'}</div>
              <div className="uv-bar-wrap">
                <div className="uv-track">
                  <div
                    className="uv-fill"
                    style={{ width: `${Math.min(((normalizedUv ?? 0) / 12) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="uv-labels"><span>0</span><span>12 · {t('uvExtreme')}</span></div>
              </div>
              <div className="card-sub" style={{ marginTop: '4px' }}>{normalizedUv != null ? t(uvAdviceKey(normalizedUv)) : '--'}</div>
            </div>

            {/* Rainfall */}
            <div className="weather-card">
              <div className="card-header">
                <i className="fas fa-droplet" style={{ color: 'var(--accent-blue)' }}></i> {t('rainfall')}
              </div>
              <div>
                <span className="card-value-large">
                  {liveData?.rainfall != null ? liveData.rainfall.toFixed(1) : '--'}
                </span>
                <span className="card-unit">mm</span>
              </div>
              <div className="card-sub">{t('currentReading')}</div>
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{t('lastUpdated')}</div>
                <div style={{ fontSize: '15px', fontWeight: 500, marginTop: '3px' }}>
                  {lastUpdated
                    ? lastUpdated.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
                    : '--'}
                </div>
              </div>
            </div>

            {/* Wind */}
            <div className="weather-card">
              <div className="card-header">
                <i className="fas fa-wind" style={{ color: 'var(--accent-teal)' }}></i> {t('wind')}
              </div>
              <div className="wind-speed-row">
                <span className="card-value-large">
                  {liveData?.wind_speed != null ? liveData.wind_speed.toFixed(1) : '--'}
                </span>
                <span className="card-unit">km/h</span>
              </div>
              <div className="gust-tag">{t('windDir')}: {d.windDirText}</div>
              <div className="compass-wrap">
                <div className="compass">
                  <div className="compass-ring"></div>
                  <div
                    className="compass-arrow"
                    style={{ transform: `translate(-50%, 0) rotate(${(d.windDir ?? 0) + 180}deg)` }}
                  ></div>
                  <div className="compass-dot"></div>
                  <span className="compass-lbl cn">N</span>
                  <span className="compass-lbl cs">S</span>
                  <span className="compass-lbl ce">E</span>
                  <span className="compass-lbl cw">W</span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
                  {d.windDirText}
                </div>
              </div>
            </div>

            {/* Humidity */}
            <div className="weather-card">
              <div className="card-header">
                <i className="fas fa-tint" style={{ color: 'var(--accent-blue)' }}></i> {t('humidity')}
              </div>
              <div>
                <span className="card-value-large">
                  {liveData?.humidity != null ? liveData.humidity.toFixed(1) : '--'}
                </span>
                <span className="card-unit">%</span>
              </div>
              <div className="card-sub">{t('relativeHumidity')}</div>
              <div className="humidity-track">
                <div className="humidity-fill" style={{ width: `${liveData?.humidity ?? 0}%` }}></div>
              </div>
              <div className="hum-labels"><span>0</span><span>50</span><span>100%</span></div>
            </div>

            {/* Pressure */}
            <div className="weather-card">
              <div className="card-header">
                <i className="fas fa-gauge-high" style={{ color: 'rgba(200,220,255,.7)' }}></i> {t('pressure')}
              </div>
              <div>
                <span className="card-value-large">
                  {liveData?.pressure != null ? liveData.pressure.toFixed(0) : '--'}
                </span>
                <span className="card-unit">hPa</span>
              </div>
              <div className="trend-row">
                <div className="trend-bar" style={{ height: '20px' }}></div>
                <div className="trend-bar" style={{ height: '24px' }}></div>
                <div className="trend-bar" style={{ height: '18px' }}></div>
                <div className="trend-bar" style={{ height: '22px' }}></div>
                <div className="trend-bar" style={{ height: '20px' }}></div>
              </div>
              <div className="card-sub">{t('steady')}</div>
            </div>

            {/* Temperature Detail */}
            <div className="weather-card">
              <div className="card-header">
                <i className="fas fa-thermometer-half" style={{ color: 'var(--accent-warm)' }}></i> {t('temperature')}
              </div>
              <div>
                <span className="card-value-large">
                  {liveData?.temp != null ? liveData.temp.toFixed(1) : '--'}°
                </span>
              </div>
              <div className="card-sub">{t('sensorReading')}</div>
              <div className="sun-row">
                <div className="sun-item">
                  <i className="fas fa-sunrise"></i>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{t('sunrise')}</div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>6:42</div>
                  </div>
                </div>
                <div className="sun-item moon-item">
                  <i className="fas fa-sunset"></i>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{t('sunset')}</div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>19:24</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="footer-note">
          {/* Live indicator dot: green when realtime is active, amber otherwise */}
          <span
            className="footer-dot"
            style={{ background: isLive ? '#4ade80' : lastUpdated ? '#fbbf24' : '#6b7280' }}
          ></span>
          {footerText}&nbsp;·&nbsp;{t('eruStation')}
        </div>

      </div>
    </>
  );
}