import Link from 'next/link';
import { User } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team — ERU Weather Station',
  description: '12 Mechatronics Engineers building the future.',
};

const TEAM = [
  { id: 1,  name: 'Mohannad Abdelkawy', linkedIn: 'https://www.linkedin.com/in/mohannad-abdelkawy-56a1662b4/' },
  { id: 2,  name: 'Yousif Mohammad',    linkedIn: 'https://www.linkedin.com/in/yousif-ebaid-636471323' },
  { id: 3,  name: 'Ahmed Soliman',      linkedIn: 'https://www.linkedin.com/in/ahmed-soliman-4261053b8' },
  { id: 4,  name: 'Hamdy Mohammad',     linkedIn: 'https://www.linkedin.com/in/hamdy-mohamed-24a20b224' },
  { id: 5,  name: 'Helmy Ahmed',        linkedIn: 'https://www.linkedin.com/in/helmy-ahmed-79b383368' },
  { id: 6,  name: 'Ammar Ali',          linkedIn: 'https://www.linkedin.com/in/ammar-ali-8588923b2' },
  { id: 7,  name: 'Michael Meseha',     linkedIn: 'https://www.linkedin.com/in/michael-meseha-a9a2a3394' },
  { id: 8,  name: 'Mohammad Aboulela',  linkedIn: 'https://www.linkedin.com/in/mohamed-aboulela-ab8652285' },
  { id: 9,  name: 'Hassan Salah',       linkedIn: 'https://www.linkedin.com/in/hassan-salah-b1030b371' },
  { id: 10, name: 'Omar Osmanly',       linkedIn: null },
  { id: 11, name: 'Ahmed Eltoukhy',     linkedIn: 'https://www.linkedin.com/in/ahmed-hany-b6362a201' },
  { id: 12, name: 'Ahmed Mohammad',     linkedIn: null },
] as const;

export default function TeamPage() {
  return (
    <div className="relative min-h-screen overflow-y-auto text-white font-sans">

      {/* ── Fixed Background ── */}
      <img
        src="/pic.jpg"
        alt=""
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover -z-10"
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      />
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 -z-10" />

      {/* ── Page Content ── */}
      <div className="pt-24 pb-20">

        {/* Back Button — fixed at top-left, well below nav */}
        <div className="fixed top-5 left-5 z-50">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm text-white hover:bg-white/20 transition-all shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Dashboard
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12 px-6">
          <p className="text-blue-200/60 text-sm font-medium tracking-widest uppercase mb-3">ERU Weather Station</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Team Members</h1>
          <p className="text-blue-100/60 text-lg">12 engineers building the future of IoT weather data</p>
        </div>

        {/* Member Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-6 max-w-6xl mx-auto">
          {TEAM.map(({ id, name, linkedIn }) => (
            <div
              key={id}
              className="flex flex-row items-center gap-6 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl hover:bg-white/10 transition-all duration-300"
              style={{ transform: 'translateZ(0)', willChange: 'transform' }}
            >
              {/* Avatar */}
              <div className="shrink-0">
                {id < 12 ? (
                  <img
                    src={`/team/${id}.jpeg`}
                    alt={`ENG/ ${name}`}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-white/20 shadow-lg bg-blue-500/10 flex items-center justify-center">
                    <User className="text-blue-300 w-9 h-9" strokeWidth={1.5} />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h2 className="text-[17px] font-semibold text-white leading-snug mb-1">
                  <span className="text-blue-400 font-extrabold">ENG/</span>{' '}{name}
                </h2>
                <p className="text-sm text-blue-200/60">ERU Weather Station Team</p>
              </div>

              {/* LinkedIn */}
              {linkedIn && (
                <a
                  href={linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn profile for ENG/ ${name}`}
                  className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-blue-300 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18" height="18" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Back Button */}
        <div className="flex justify-center mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
