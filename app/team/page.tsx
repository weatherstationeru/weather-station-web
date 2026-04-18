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
    <main className="min-h-screen w-full bg-[#080c12] py-12 px-4 font-sans">

      {/* Back Button */}
      <div className="max-w-[860px] mx-auto mb-6">
        <Link href="/" className="text-[#6c8ebf] hover:text-white text-sm flex items-center gap-2 transition-colors w-fit">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Main Container - Exact HTML Replica */}
      <div className="bg-[#0d1117] rounded-[16px] py-10 px-8 max-w-[860px] mx-auto">

        {/* Header */}
        <div className="text-center mb-[8px]">
          <h2 className="text-[28px] font-medium text-white m-0 tracking-tight">Meet the engineers</h2>
          <p className="text-[13px] text-[#8b95a5] mt-[6px] mb-0">12 Mechatronics Engineers building the future.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[28px] mt-[32px]">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-start gap-[14px]">

              {/* Avatar Logic: Images for 1-11, Initials for 12 */}
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

              {/* Info Details */}
              <div className="flex-1 pt-[2px]">
                <p className="text-[14px] font-medium text-white m-0 mb-[3px]">{member.name}</p>
                <p className="text-[11.5px] text-[#6c8ebf] m-0 mb-[8px]">{member.role}</p>

                <div className="h-[0.5px] bg-[#1e2a3a] m-0 mb-[10px]"></div>

                {/* LinkedIn Icon */}
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[28px] h-[28px] rounded-full bg-[#1a2130] inline-flex items-center justify-center border-[0.5px] border-[#2a3a50] hover:bg-[#223050] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', fill: '#8b95a5' }}>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-[11px] text-[#3a4a5a] italic">No LinkedIn</span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}