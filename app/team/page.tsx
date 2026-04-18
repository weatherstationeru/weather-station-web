import Link from 'next/link';
import { User } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team — ERU Weather Station',
  description: 'Meet the 12 team members behind the ERU Weather Station IoT dashboard.',
};

// ── Team roster (strict order) ────────────────────────────────────────────────
const TEAM = [
  { id: 1,  name: 'Mohannad Abdelkawy' },
  { id: 2,  name: 'Yousif Mohammad'    },
  { id: 3,  name: 'Ahmed Soliman'      },
  { id: 4,  name: 'Hamdy Mohammad'     },
  { id: 5,  name: 'Helmy Ahmed'        },
  { id: 6,  name: 'Ammar Ali'          },
  { id: 7,  name: 'Michael Meseha'     },
  { id: 8,  name: 'Mohammad Aboulela'  },
  { id: 9,  name: 'Hassan Salah'       },
  { id: 10, name: 'Omar Osmanly'       },
  { id: 11, name: 'Ahmed Eltoukhy'     },
  { id: 12, name: 'Ahmed Mohammad'     },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default function TeamPage() {
  return (
    <>
      {/* ── Background video (same as dashboard) ──────────────────────────── */}
      <video
        className="bg-video"
        src="/bg-video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="bg-video-overlay" />

      {/* ── Animated sky / decorative layers ─────────────────────────────── */}
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

      {/* ── Back button ───────────────────────────────────────────────────── */}
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

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="team-page">

        {/* Header */}
        <header className="team-header">
          <span className="team-header-icon" aria-hidden="true">👥</span>
          <h1 className="team-title">
            فريق العمل<br />
            <span className="team-title-en">Team Members</span>
          </h1>
          <p className="team-subtitle">
            The 12 members behind the ERU Weather Station
          </p>
        </header>

        {/* Member grid */}
        <div className="team-grid" role="list">
          {TEAM.map(({ id, name }) => (
            <article key={id} className="team-card" role="listitem">
              {/* Avatar */}
              <div className="team-avatar" aria-hidden="true">
                <User size={32} strokeWidth={1.4} />
              </div>

              {/* Number badge */}
              <span className="team-num">#{id.toString().padStart(2, '0')}</span>

              {/* Name */}
              <h2 className="team-member-name">{name}</h2>

              {/* Role */}
              <p className="team-member-role">ERU Weather Station</p>
            </article>
          ))}
        </div>

        {/* Bottom back button */}
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
