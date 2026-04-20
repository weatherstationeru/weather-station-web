'use client';
import { useEffect, useState, useMemo } from 'react';

export default function StarTrailsBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { arcs, stars, shootingStars } = useMemo(() => {
    // Generates static arcs (the trails)
    const newArcs = Array.from({ length: 250 }).map((_, i) => {
      const r = 30 + Math.random() * 1400; // radius space
      const opacity = Math.random() * 0.4 + 0.1;
      const strokeWidth = Math.random() > 0.8 ? 1.5 : 0.6;
      // 10% to 50% circle dash length
      const dashLength = r * 2 * Math.PI * (Math.random() * 0.4 + 0.1); 
      const gapLength = r * 2 * Math.PI;
      const dashOffset = Math.random() * gapLength;
      
      // Some arcs are blueish, some are whiteish
      const isBlue = Math.random() > 0.65;
      const color = isBlue ? `rgba(165, 215, 255, ${opacity})` : `rgba(255, 255, 255, ${opacity})`;

      return {
        r,
        strokeWidth,
        color,
        dashLength,
        gapLength,
        dashOffset
      };
    });

    // Generate static point stars
    const newStars = Array.from({ length: 350 }).map((_, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * 1500;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const opacity = Math.random() * 0.7 + 0.3;
      const size = Math.random() > 0.9 ? 1.8 : 0.8;
      return { x, y, opacity, size };
    });

    // Shooting stars
    const newShootingStars = Array.from({ length: 6 }).map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 20; // Up to 20s delay
      const duration = 1.0 + Math.random() * 1.5;
      return { top, left, delay, duration };
    });

    return { arcs: newArcs, stars: newStars, shootingStars: newShootingStars };
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-[#05070a] -z-10" />;

  return (
    <div className="fixed inset-0 bg-[#05070a] -z-10 overflow-hidden pointer-events-none">
      
      {/* Container that rotates the entire sky (arcs + dots) */}
      <div 
        className="absolute top-[50%] left-[50%] aspect-square w-[250vw] sm:w-[200vw] lg:w-[150vw]"
        style={{
          transform: 'translate(-50%, -50%)',
          transformOrigin: 'center center',
          animation: 'skyRotate 350s linear infinite', // Extremely slow rotation
        }}
      >
        {/* SVG Arcs for 'Long Exposure' trails */}
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox="-1500 -1500 3000 3000"
          preserveAspectRatio="xMidYMid slice"
        >
          <g transform="translate(0, 0)">
            {arcs.map((arc, i) => (
              <circle
                key={`arc-${i}`}
                cx="0"
                cy="0"
                r={arc.r}
                fill="none"
                stroke={arc.color}
                strokeWidth={arc.strokeWidth}
                strokeDasharray={`${arc.dashLength} ${arc.gapLength}`}
                strokeDashoffset={arc.dashOffset}
              />
            ))}
            
            {/* Dots representing the actual stars currently moving */}
            {stars.map((star, i) => (
              <circle
                key={`star-${i}`}
                cx={star.x}
                cy={star.y}
                r={star.size}
                fill={`rgba(255, 255, 255, ${star.opacity})`}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Occasional shooting stars overlay */}
      {shootingStars.map((ss, i) => (
        <div
          key={`ss-${i}`}
          className="shooting-star-wrapper absolute"
          style={{
            top: `${ss.top}%`,
            left: `${ss.left}%`,
            transform: 'rotate(-45deg)', // falling downwards across screen
          }}
        >
          <div 
            className="shooting-star"
            style={{
              animationDelay: `${ss.delay}s`,
              animationDuration: `${ss.duration}s`
            }}
          ></div>
        </div>
      ))}

      {/* Inline styles for the animations */}
      <style>{`
        @keyframes skyRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .shooting-star-wrapper {
          width: 0;
          height: 0;
        }

        .shooting-star {
          position: absolute;
          width: 140px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,1), transparent);
          opacity: 0;
          border-radius: 999px;
          filter: drop-shadow(0 0 6px white);
          animation-name: shoot;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        @keyframes shoot {
          0% {
            transform: translateX(0);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          15% {
            transform: translateX(-500px);
            opacity: 0;
          }
          100% {
            transform: translateX(-500px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
