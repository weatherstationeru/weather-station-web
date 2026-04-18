import Link from 'next/link';
import { User } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team — ERU Weather Station',
  description: '12 Mechatronics Engineers building the future.',
};

// ── Team Data ────────────────────────────────────────────────────────────────
const teamMembers = [
  { id: 1, name: 'Mohannad Abdelkawy', linkedIn: 'https://www.linkedin.com/in/mohannad-abdelkawy-56a1662b4/', image: '/team/1.jpg' },
  { id: 2, name: 'Yousif Mohammad', linkedIn: 'https://www.linkedin.com/in/yousif-ebaid-636471323', image: '/team/2.jpg' },
  { id: 3, name: 'Ahmed Soliman', linkedIn: 'https://www.linkedin.com/in/ahmed-soliman-4261053b8', image: '/team/3.jpg' },
  { id: 4, name: 'Hamdy Mohammad', linkedIn: 'https://www.linkedin.com/in/hamdy-mohamed-24a20b224', image: '/team/4.jpg' },
  { id: 5, name: 'Helmy Ahmed', linkedIn: 'https://www.linkedin.com/in/helmy-ahmed-79b383368', image: '/team/5.jpg' },
  { id: 6, name: 'Ammar Ali', linkedIn: 'https://www.linkedin.com/in/ammar-ali-8588923b2', image: '/team/6.jpg' },
  { id: 7, name: 'Michael Meseha', linkedIn: 'https://www.linkedin.com/in/michael-meseha-a9a2a3394', image: '/team/7.jpg' },
  { id: 8, name: 'Mohammad Aboulela', linkedIn: 'https://www.linkedin.com/in/mohamed-aboulela-ab8652285', image: '/team/8.jpg' },
  { id: 9, name: 'Hassan Salah', linkedIn: 'https://www.linkedin.com/in/hassan-salah-b1030b371', image: '/team/9.jpg' },
  { id: 10, name: 'Omar Osmanly', linkedIn: null, image: '/team/10.jpg' },
  { id: 11, name: 'Ahmed Eltoukhy', linkedIn: 'https://www.linkedin.com/in/ahmed-hany-b6362a201', image: '/team/11.jpg' },
  { id: 12, name: 'Ahmed Mohammad', linkedIn: null, image: null }, // No image, uses User icon
];

export default function TeamPage() {
  return (
    <div className="relative min-h-screen overflow-y-auto w-full text-white font-sans transform-gpu">
      
      {/* ── Fixed Background & Dark Overlay ── */}
      <img 
        src="/pic.jpg" 
        alt="Background" 
        className="fixed inset-0 w-full h-full object-cover z-[0] transform-gpu" 
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' }}
      />
      <div className="fixed inset-0 bg-black/40 z-[0] transform-gpu" style={{ transform: 'translateZ(0)' }} />

      {/* ── Content Container (z-10 ensures it stays above background) ── */}
      <main className="relative z-10 max-w-5xl mx-auto px-5 py-16">
        
        {/* Back Button */}
        <div className="mb-10 lg:mb-14">
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition shadow-lg transform-gpu" style={{ transform: 'translateZ(0)' }}>
             <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
            Back to Dashboard
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center mb-16 transform-gpu" style={{ transform: 'translateZ(0)' }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Meet the engineers</h1>
          <p className="text-blue-100/70 text-lg">12 Mechatronics Engineers building the future.</p>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 cols on PC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex flex-row items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl hover:bg-white/15 transition-all duration-300 transform-gpu" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'transform' }}>
              
              {/* Avatar Image or Icon */}
              <div className="shrink-0 w-[72px] h-[72px] lg:w-[82px] lg:h-[82px] rounded-full overflow-hidden border-2 border-white/30 flex items-center justify-center bg-white/5">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-blue-300 w-8 h-8 lg:w-10 lg:h-10 opacity-80" strokeWidth={1.5} />
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1">
                <h2 className="text-[17px] font-semibold text-white mb-1">
                  <span className="text-blue-400">ENG/ </span>{member.name}
                </h2>
                <p className="text-sm text-blue-200/80 m-0">ERU Weather Station Team</p>
              </div>

              {/* LinkedIn Icon */}
              {member.linkedIn && (
                <a 
                  href={member.linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="shrink-0 flex flex-col items-center justify-center w-11 h-11 rounded-full bg-[#0e1629]/50 border border-white/10 text-gray-400 hover:text-white hover:bg-[#0077b5]/80 hover:border-[#0077b5] transition-all"
                  aria-label={`LinkedIn profile for ${member.name}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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

      </main>
    </div>
  );
}