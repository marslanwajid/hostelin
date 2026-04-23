import React from 'react';

interface CityBuildingProps {
  city: string;
}

export default function CityBuilding({ city }: CityBuildingProps) {
  const svgs: Record<string, React.ReactNode> = {
    Lahore: (
      <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M70 85 L70 55 Q70 30 100 28 Q130 30 130 55 L130 85 Z" fill="rgba(255,255,255,0.18)" />
        <path d="M85 28 Q100 10 115 28" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect x="30" y="25" width="12" height="60" fill="rgba(255,255,255,0.15)" />
        <path d="M30 25 Q36 12 42 25" fill="rgba(255,255,255,0.25)" />
        <rect x="34" y="8" width="4" height="6" fill="rgba(255,255,255,0.3)" />
        <rect x="158" y="25" width="12" height="60" fill="rgba(255,255,255,0.15)" />
        <path d="M158 25 Q164 12 170 25" fill="rgba(255,255,255,0.25)" />
        <rect x="162" y="8" width="4" height="6" fill="rgba(255,255,255,0.3)" />
        <path d="M72 85 L72 65 Q80 55 88 65 L88 85" fill="rgba(255,255,255,0.12)" />
        <path d="M92 85 L92 65 Q100 55 108 65 L108 85" fill="rgba(255,255,255,0.12)" />
        <path d="M112 85 L112 65 Q120 55 128 65 L128 85" fill="rgba(255,255,255,0.12)" />
        <line x1="10" y1="85" x2="190" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </svg>
    ),
    Karachi: (
      <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M60 85 L60 60 L80 60 L80 85 Z" fill="rgba(255,255,255,0.12)" />
        <path d="M120 85 L120 60 L140 60 L140 85 Z" fill="rgba(255,255,255,0.12)" />
        <path d="M55 60 L145 60 L145 55 Q145 30 100 25 Q55 30 55 55 Z" fill="rgba(255,255,255,0.18)" />
        <path d="M80 25 Q100 8 120 25" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <path d="M60 85 L60 65 Q67 55 75 65 L75 85" fill="rgba(255,255,255,0.1)" />
        <path d="M125 85 L125 65 Q132 55 140 65 L140 85" fill="rgba(255,255,255,0.1)" />
        <rect x="97" y="6" width="6" height="8" fill="rgba(255,255,255,0.35)" />
        <line x1="20" y1="85" x2="180" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="30" y="70" width="18" height="15" fill="rgba(255,255,255,0.1)" />
        <rect x="152" y="70" width="18" height="15" fill="rgba(255,255,255,0.1)" />
      </svg>
    ),
    Islamabad: (
      <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M100 18 L150 80 L50 80 Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <path d="M100 18 L130 80" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
        <path d="M100 18 L70 80" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
        <rect x="28" y="28" width="7" height="52" fill="rgba(255,255,255,0.18)" />
        <path d="M28 28 Q31.5 18 35 28" fill="rgba(255,255,255,0.3)" />
        <rect x="165" y="28" width="7" height="52" fill="rgba(255,255,255,0.18)" />
        <path d="M165 28 Q168.5 18 172 28" fill="rgba(255,255,255,0.3)" />
        <rect x="42" y="38" width="6" height="42" fill="rgba(255,255,255,0.13)" />
        <rect x="152" y="38" width="6" height="42" fill="rgba(255,255,255,0.13)" />
        <path d="M97 12 Q103 8 106 14 Q101 11 97 12Z" fill="rgba(255,255,255,0.5)" />
        <line x1="15" y1="80" x2="185" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </svg>
    ),
    Peshawar: (
      <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="30" y="55" width="140" height="30" fill="rgba(255,255,255,0.15)" />
        {[30, 44, 58, 72, 86, 100, 114, 128, 142, 156].map(x => (
          <rect key={x} x={x} y="44" width="10" height="12" fill="rgba(255,255,255,0.22)" />
        ))}
        <rect x="85" y="28" width="30" height="57" fill="rgba(255,255,255,0.2)" />
        {[85, 95, 105].map(x => (
          <rect key={x} x={x} y="20" width="8" height="10" fill="rgba(255,255,255,0.28)" />
        ))}
        <path d="M94 85 L94 65 Q100 56 106 65 L106 85" fill="rgba(255,255,255,0.1)" />
        <rect x="24" y="40" width="18" height="45" fill="rgba(255,255,255,0.15)" />
        <rect x="158" y="40" width="18" height="45" fill="rgba(255,255,255,0.15)" />
        <line x1="10" y1="85" x2="190" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </svg>
    ),
    Faisalabad: (
      <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M80 85 L80 55 L85 50 L95 48 L105 48 L115 50 L120 55 L120 85 Z" fill="rgba(255,255,255,0.15)" />
        <rect x="86" y="30" width="28" height="20" fill="rgba(255,255,255,0.2)" />
        <circle cx="100" cy="40" r="8" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <line x1="100" y1="40" x2="100" y2="34" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <line x1="100" y1="40" x2="105" y2="40" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        <path d="M93 30 L100 10 L107 30 Z" fill="rgba(255,255,255,0.28)" />
        <rect x="98" y="6" width="4" height="5" fill="rgba(255,255,255,0.4)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
          const r = Math.PI * a / 180;
          return <line key={i} x1="100" y1="85" x2={100 + 60 * Math.cos(r)} y2={85 + 30 * Math.sin(r)} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
        })}
        <line x1="20" y1="85" x2="180" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </svg>
    ),
    Quetta: (
      <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M0 85 L30 50 L55 65 L80 35 L105 55 L130 30 L155 55 L180 45 L200 65 L200 85 Z" fill="rgba(255,255,255,0.14)" />
        <path d="M80 35 L88 48 L72 48 Z" fill="rgba(255,255,255,0.35)" />
        <path d="M130 30 L138 44 L122 44 Z" fill="rgba(255,255,255,0.35)" />
        <ellipse cx="100" cy="82" rx="45" ry="5" fill="rgba(255,255,255,0.1)" />
        <line x1="0" y1="85" x2="200" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </svg>
    ),
    Multan: (
      <svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M65 85 L60 70 L65 55 L80 48 L120 48 L135 55 L140 70 L135 85 Z" fill="rgba(255,255,255,0.15)" />
        <path d="M72 48 Q100 15 128 48" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="100" y1="15" x2="100" y2="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <circle cx="100" cy="4" r="3" fill="rgba(255,255,255,0.45)" />
        <rect x="58" y="52" width="10" height="33" fill="rgba(255,255,255,0.18)" />
        <path d="M58 52 Q63 43 68 52" fill="rgba(255,255,255,0.3)" />
        <rect x="132" y="52" width="10" height="33" fill="rgba(255,255,255,0.18)" />
        <path d="M132 52 Q137 43 142 52" fill="rgba(255,255,255,0.3)" />
        <path d="M93 85 L93 68 Q100 60 107 68 L107 85" fill="rgba(255,255,255,0.12)" />
        <line x1="20" y1="85" x2="180" y2="85" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      </svg>
    ),
  };
  return <>{svgs[city] || null}</>;
}
