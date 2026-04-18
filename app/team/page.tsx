import Link from 'next/link';
import { User } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team — ERU Weather Station',
  description: 'Meet the 12 engineers behind the ERU Weather Station IoT dashboard.',
};

// ── Team roster ───────────────────────────────────────────────────────────────
const TEAM = [
  { id: 1,  name: 'ENG/ Mohannad Abdelkawy' },
  { id: 2,  name: 'ENG/ Yousif Mohammad'    },
  { id: 3,  name: 'ENG/ Ahmed Soliman'      },
  { id: 4,  name: 'ENG/ Hamdy Mohammad'     },
  { id: 5,  name: 'ENG/ Helmy Ahmed'        },
  { id: 6,  name: 'ENG/ Ammar Ali'          },
  { id: 7,  name: 'ENG/ Michael Meseha'     },
  { id: 8,  name: 'ENG/ Mohammad Aboulela'  },
  { id: 9,  name: 'ENG/ Hassan Salah'       },
  { id: 10, name: 'ENG/ Omar Osmanly'       },
  { id: 11, name: 'ENG/ Ahmed Eltoukhy'     },
  { id: 12, name: 'ENG/ Ahmed Mohammad'     },
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
          {TEAM.map(({ id, name }) => {
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
                <a href="#" className="team-linkedin" aria-label={`LinkedIn profile for ${name}`}>
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
