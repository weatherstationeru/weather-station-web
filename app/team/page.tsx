import Link from 'next/link';
import { User } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team — ERU Weather Station',
  description: 'Meet the 12 engineers behind the ERU Weather Station IoT dashboard.',
};

// ── Team roster ───────────────────────────────────────────────────────────────
const TEAM = [
  { id: 1,  name: 'ENG/ Mohannad Abdelkawy', linkedIn: 'https://www.linkedin.com/in/mohannad-abdelkawy-56a1662b4/' },
  { id: 2,  name: 'ENG/ Yousif Mohammad',    linkedIn: 'https://www.linkedin.com/in/yousif-ebaid-636471323' },
  { id: 3,  name: 'ENG/ Ahmed Soliman',      linkedIn: 'https://www.linkedin.com/in/ahmed-soliman-4261053b8' },
  { id: 4,  name: 'ENG/ Hamdy Mohammad',     linkedIn: 'https://www.linkedin.com/in/hamdy-mohamed-24a20b224' },
  { id: 5,  name: 'ENG/ Helmy Ahmed',        linkedIn: 'https://www.linkedin.com/in/helmy-ahmed-79b383368' },
  { id: 6,  name: 'ENG/ Ammar Ali',          linkedIn: 'https://www.linkedin.com/in/ammar-ali-8588923b2' },
  { id: 7,  name: 'ENG/ Michael Meseha',     linkedIn: 'https://www.linkedin.com/in/michael-meseha-a9a2a3394' },
  { id: 8,  name: 'ENG/ Mohammad Aboulela',  linkedIn: 'https://www.linkedin.com/in/mohamed-aboulela-ab8652285' },
  { id: 9,  name: 'ENG/ Hassan Salah',       linkedIn: 'https://www.linkedin.com/in/hassan-salah-b1030b371' },
  { id: 10, name: 'ENG/ Omar Osmanly',       linkedIn: null },
  { id: 11, name: 'ENG/ Ahmed Eltoukhy',     linkedIn: 'https://www.linkedin.com/in/ahmed-hany-b6362a201' },
  { id: 12, name: 'ENG/ Ahmed Mohammad',     linkedIn: null },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  return (
    <>
      {/* ── Overscroll fill — dark bg for iOS/Android rubber-band ───── */}
      <div className="bg-overscroll" />

      {/* ── Background image ─────── */}
      <img
        className="bg-video"
        src="/pic.jpg"
        alt="Team Background"
      />
      {/* Dark scrim over background image: bg-black/40 */}
      <div className="bg-video-overlay" style={{ background: 'rgba(0, 0, 0, 0.4)' }} />

      {/* ── Decorative sky layers ─────────────────────────────────────────── */}
      <div className="sky-wrap" />
      <div className="stars" />
      <div className="aurora">
        <div className="aurora-band" />
        <div className="aurora-band" />
        <div className="aurora-band" />
      </div>
      <div className="clouds">
        <div className="cloud c1" />
        <div className="cloud c2" />
        <div className="cloud c3" />
        <div className="cloud c4" />
      </div>
      <div className="moon" />
      <div className="horizon-glow" />

      {/* ── Fixed back button ─────────────────────────────────────────────── */}
      <Link href="/" className="team-back-btn" aria-label="Back to dashboard">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17" height="17" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Dashboard</span>
      </Link>

      {/* ── Main scroll container ─────────────────────────────────────────── */}
      <main className="team-page">

        {/* Header — English only, sans-serif */}
        <header className="team-header">
          <span className="team-header-icon" aria-hidden="true">👥</span>
          <h1 className="team-title">Team Members</h1>
          <p className="team-subtitle">
            The 12 engineers behind the ERU Weather Station
          </p>
        </header>

        {/* Responsive member grid */}
        <div className="team-grid" role="list">
          {TEAM.map(({ id, name, linkedIn }) => {
            const [prefix, ...rest] = name.split(' ');
            return (
              <article key={id} className="team-card-horizontal" role="listitem">
                
                {/* ── Image / Icon on Left ── */}
                {id < 12 ? (
                  <img src={`/team/${id}.jpg`} alt={name} className="team-avatar-img" />
                ) : (
                  <div className="team-avatar" aria-hidden="true">
                    <User size={28} strokeWidth={1.5} />
                  </div>
                )}

                {/* ── Text Content ── */}
                <div className="team-card-content">
                  <h2 className="team-member-name">
                    <span className="team-name-prefix">{prefix}</span>{' '}
                    {rest.join(' ')}
                  </h2>
                  <p className="team-member-role">ERU Weather Station Team</p>
                </div>

                {/* ── LinkedIn Icon on Right ── */}
                {linkedIn && (
                  <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="team-linkedin" aria-label={`LinkedIn profile for ${name}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                )}

              </article>
            );
          })}
        </div>

        {/* Bottom navigation */}
        <div className="team-footer">
          <Link href="/" className="team-back-btn team-back-btn--bottom">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

      </main>
    </>
  );
}
