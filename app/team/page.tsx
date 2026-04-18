import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team — ERU Weather Station',
  description: 'Meet the team behind the ERU Weather Station IoT dashboard.',
};

export default function TeamPage() {
  return (
    <>
      {/* Same animated background layers as dashboard */}
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

      {/* Back button */}
      <Link href="/" className="team-back-btn" aria-label="Back to dashboard">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Dashboard</span>
      </Link>

      {/* Page content */}
      <main className="team-page">

        {/* Header */}
        <div className="team-header">
          <div className="team-header-icon">👥</div>
          <h1 className="team-title">أعضاء الفريق</h1>
          <p className="team-subtitle">The minds behind the ERU Weather Station</p>
        </div>

        {/* Placeholder card grid — add real team members here */}
        <div className="team-grid">

          {/* Placeholder member card × 3 */}
          {[1, 2, 3].map((n) => (
            <div key={n} className="team-card team-card--placeholder">
              <div className="team-avatar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36" height="36" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor"
                  strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="team-member-name">Team Member {n}</div>
              <div className="team-member-role">Role / Department</div>
            </div>
          ))}

        </div>

        <p className="team-coming-soon">
          Content coming soon — add your team members here.
        </p>

      </main>
    </>
  );
}
