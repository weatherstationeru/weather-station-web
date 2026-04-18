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
    <main style={{ margin: 0, padding: '2rem', background: '#080c12', fontFamily: 'system-ui, sans-serif', minHeight: '100vh' }}>

      {/* Back Button */}
      <div style={{ maxWidth: '860px', margin: '0 auto 1.5rem' }}>
        <Link href="/" style={{ color: '#6c8ebf', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Main container */}
      <div style={{ background: '#0d1117', borderRadius: '16px', padding: '2.5rem 2rem', maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 500, color: '#ffffff', margin: 0 }}>Meet the engineers</h2>
          <p style={{ fontSize: '13px', color: '#8b95a5', margin: '0.4rem 0 0' }}>12 Mechatronics Engineers building the future.</p>
        </div>

        {/* Responsive grid — 2 cols on wide screens, 1 col on small */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', marginTop: '2rem' }}>
          {teamMembers.map((member) => (
            <div key={member.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>

              {/* Avatar */}
              <div style={{
                flexShrink: 0,
                width: '82px',
                height: '82px',
                minWidth: '82px',
                borderRadius: '50%',
                border: `2.5px solid ${member.color}`,
                background: '#1a2130',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {member.id === 12 ? (
                  <span style={{ fontSize: '15px', fontWeight: 500, color: '#c8d4e8', letterSpacing: '0.5px' }}>
                    {member.initials}
                  </span>
                ) : (
                  <img
                    src={`/team/${member.id}.jpeg`}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, paddingTop: '2px' }}>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', margin: '0 0 3px' }}>{member.name}</p>
                <p style={{ fontSize: '11.5px', color: '#6c8ebf', margin: '0 0 8px' }}>{member.role}</p>

                {/* Divider */}
                <div style={{ height: '0.5px', background: '#1e2a3a', margin: '0 0 10px' }} />

                {/* LinkedIn */}
                {member.linkedin ? (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn profile for ${member.name}`}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#1a2130',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '0.5px solid #2a3a50',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <svg viewBox="0 0 24 24" style={{ width: '13px', height: '13px', fill: '#8b95a5' }}>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                ) : (
                  <span style={{ fontSize: '11px', color: '#3a4a5a', fontStyle: 'italic' }}>No LinkedIn</span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}