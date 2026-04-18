import Link from 'next/link';
import { User } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team — ERU Weather Station',
  description: '12 Mechatronics Engineers building the future.',
};

// ── Team Data ────────────────────────────────────────────────────────────────
const TEAM = [
  { id: 1,  name: 'ENG/ Mohannad Abdelkawy', linkedIn: 'https://www.linkedin.com/in/mohannad-abdelkawy-56a1662b4/', image: '/team/1.jpeg' },
  { id: 2,  name: 'ENG/ Yousif Mohammad',    linkedIn: 'https://www.linkedin.com/in/yousif-ebaid-636471323', image: '/team/2.jpeg' },
  { id: 3,  name: 'ENG/ Ahmed Soliman',      linkedIn: 'https://www.linkedin.com/in/ahmed-soliman-4261053b8', image: '/team/3.jpeg' },
  { id: 4,  name: 'ENG/ Hamdy Mohammad',     linkedIn: 'https://www.linkedin.com/in/hamdy-mohamed-24a20b224', image: '/team/4.jpeg' },
  { id: 5,  name: 'ENG/ Helmy Ahmed',        linkedIn: 'https://www.linkedin.com/in/helmy-ahmed-79b383368', image: '/team/5.jpeg' },
  { id: 6,  name: 'ENG/ Ammar Ali',          linkedIn: 'https://www.linkedin.com/in/ammar-ali-8588923b2', image: '/team/6.jpeg' },
  { id: 7,  name: 'ENG/ Michael Meseha',     linkedIn: 'https://www.linkedin.com/in/michael-meseha-a9a2a3394', image: '/team/7.jpeg' },
  { id: 8,  name: 'ENG/ Mohammad Aboulela',  linkedIn: 'https://www.linkedin.com/in/mohamed-aboulela-ab8652285', image: '/team/8.jpeg' },
  { id: 9,  name: 'ENG/ Hassan Salah',       linkedIn: 'https://www.linkedin.com/in/hassan-salah-b1030b371', image: '/team/9.jpeg' },
  { id: 10, name: 'ENG/ Omar Osmanly',       linkedIn: null, image: '/team/10.jpeg' },
  { id: 11, name: 'ENG/ Ahmed Eltoukhy',     linkedIn: 'https://www.linkedin.com/in/ahmed-hany-b6362a201', image: '/team/11.jpeg' },
  { id: 12, name: 'ENG/ Ahmed Mohammad',     linkedIn: null, image: null }, // No image, uses User icon
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-8 mx-auto" role="list">
          {TEAM.map(({ id, name, linkedIn, image }) => {
            const [prefix, ...rest] = name.split(' ');
            return (
              <article 
                key={id} 
                className="flex flex-row items-center gap-6 text-left relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-white/10 transition-all duration-500 transform-gpu p-6 lg:p-8" 
                style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' }}
                role="listitem"
              >
                
                {/* ── Image / Icon on Left ── */}
                <div className="shrink-0 w-[72px] h-[72px] lg:w-[82px] lg:h-[82px] rounded-full overflow-hidden border-2 border-white/20 flex items-center justify-center bg-white/5 drop-shadow-xl z-10 transition-transform duration-500 hover:scale-105">
                  {image ? (
                    <img src={image} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-blue-300 w-8 h-8 opacity-80" strokeWidth={1.5} />
                  )}
                </div>

                {/* ── Text Content ── */}
                <div className="flex-1 z-10">
                  <h2 className="text-[17px] font-semibold text-white mb-1 leading-snug">
                    <span className="text-blue-400 font-extrabold drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]">{prefix}</span>{' '}
                    {rest.join(' ')}
                  </h2>
                  <p className="text-sm text-blue-200/80 m-0">ERU Weather Station Team</p>
                </div>

                {/* ── LinkedIn Icon on Right ── */}
                {linkedIn && (
                  <a 
                    href={linkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-[#93c5fd] hover:text-[#0077b5] hover:bg-[#0077b5]/15 hover:border-[#0077b5]/30 transition-all duration-300 z-10" 
                    aria-label={`LinkedIn profile for ${name}`}
                  >
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

                {/* Subtle light shimmer overlay for card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

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
