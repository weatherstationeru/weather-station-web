"use client";

import React from 'react';
import Link from 'next/link';

const teamMembers = [
  { id: 1, initials: 'MA', name: 'Mohannad Abdelkawy', role: 'Mechatronics Engineering', color: '#6c63ff', linkedin: 'https://www.linkedin.com/in/mohannad-abdelkawy-56a1662b4/' },
  { id: 2, initials: 'YM', name: 'Yousif Mohammad', role: 'Mechatronics Engineering', color: '#2a8a6e', linkedin: 'https://www.linkedin.com/in/yousif-ebaid-636471323' },
  { id: 3, initials: 'AS', name: 'Ahmed Soliman', role: 'Mechatronics Engineering', color: '#3a7bd5', linkedin: 'https://www.linkedin.com/in/ahmed-soliman-4261053b8' },
  { id: 4, initials: 'HM', name: 'Hamdy Mohammad', role: 'Mechatronics Engineering', color: '#c05a2e', linkedin: 'https://www.linkedin.com/in/hamdy-mohamed-24a20b224' },
  { id: 5, initials: 'HA', name: 'Helmy Ahmed', role: 'Mechatronics Engineering', color: '#b07015', linkedin: 'https://www.linkedin.com/in/helmy-ahmed-79b383368' },
  { id: 6, initials: 'AA', name: 'Ammar Ali', role: 'Mechatronics Engineering', color: '#993356', linkedin: 'https://www.linkedin.com/in/ammar-ali-8588923b2' },
  { id: 7, initials: 'MM', name: 'Michael Meseha', role: 'Mechatronics Engineering', color: '#6c63ff', linkedin: 'https://www.linkedin.com/in/michael-meseha-a9a2a3394' },
  { id: 8, initials: 'MA', name: 'Mohammad Aboulela', role: 'Mechatronics Engineering', color: '#2a8a6e', linkedin: 'https://www.linkedin.com/in/mohamed-aboulela-ab8652285' },
  { id: 9, initials: 'HS', name: 'Hassan Salah', role: 'Mechatronics Engineering', color: '#3a7bd5', linkedin: 'https://www.linkedin.com/in/hassan-salah-b1030b371' },
  { id: 10, initials: 'OO', name: 'Omar Osmanly', role: 'Mechatronics Engineering', color: '#c05a2e', linkedin: '' },
  { id: 11, initials: 'AE', name: 'Ahmed Eltoukhy', role: 'Mechatronics Engineering', color: '#b07015', linkedin: 'https://www.linkedin.com/in/ahmed-hany-b6362a201' },
  { id: 12, initials: 'AM', name: 'Ahmed Mohammad', role: 'Mechatronics Engineering', color: '#993356', linkedin: '' },
];

export default function TeamPage() {
  return (
    <main className="min-h-screen w-full bg-[#0a192f] p-8 font-sans text-white">

      {/* Back Button */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/" className="text-blue-300 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Meet the engineers</h2>
        <p className="text-slate-400">12 Mechatronics Engineers building the future.</p>
      </div>

      {/* GRID & CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex flex-row items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl shadow-lg hover:bg-white/10 transition-all"
          >
            {/* Avatar / Image */}
            <div
              className="shrink-0 flex items-center justify-center overflow-hidden rounded-full bg-[#1a2130]"
              style={{ width: '82px', height: '82px', minWidth: '82px', border: `2.5px solid ${member.color}` }}
            >
              {member.id === 12 ? (
                <span className="text-[15px] font-medium text-[#c8d4e8] tracking-[0.5px]">
                  {member.initials}
                </span>
              ) : (
                <img
                  src={`/team/${member.id}.jpeg`}
                  alt={member.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              )}
            </div>

            {/* Text & Social */}
            <div className="flex-1 flex flex-col items-start">
              <h3 className="text-lg font-bold text-white m-0">{member.name}</h3>
              <p className="text-sm text-blue-300 m-0 mb-3">{member.role}</p>

              {member.linkedin ? (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  aria-label={`LinkedIn profile for ${member.name}`}
                >
                  <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              ) : (
                <span className="text-xs text-slate-500 italic">No LinkedIn</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </main>
  );
}