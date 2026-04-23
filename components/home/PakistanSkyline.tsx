"use client";

import React from 'react';

export default function PakistanSkyline() {
  return (
    <svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg"
      className="w-full block">
      <defs>
        <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.28" />
          <stop offset="100%" stopColor="white" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="groundFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="10%" stopColor="white" stopOpacity="0.15" />
          <stop offset="90%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ===== BADSHAHI MOSQUE — LAHORE (x: 30–310) ===== */}
      {/* Left minaret */}
      <rect x="44" y="68" width="15" height="222" fill="url(#skyFade)" />
      <path d="M44 68 Q51.5 48 59 68Z" fill="rgba(255,255,255,0.32)" />
      <rect x="48" y="42" width="7" height="28" fill="rgba(255,255,255,0.28)" />
      <rect x="49" y="36" width="5" height="8" fill="rgba(255,255,255,0.4)" />
      <rect x="40" y="130" width="23" height="6" fill="rgba(255,255,255,0.15)" />
      <rect x="40" y="170" width="23" height="6" fill="rgba(255,255,255,0.15)" />
      {/* Right minaret */}
      <rect x="280" y="68" width="15" height="222" fill="url(#skyFade)" />
      <path d="M280 68 Q287.5 48 295 68Z" fill="rgba(255,255,255,0.32)" />
      <rect x="283" y="42" width="7" height="28" fill="rgba(255,255,255,0.28)" />
      <rect x="284" y="36" width="5" height="8" fill="rgba(255,255,255,0.4)" />
      <rect x="277" y="130" width="23" height="6" fill="rgba(255,255,255,0.15)" />
      <rect x="277" y="170" width="23" height="6" fill="rgba(255,255,255,0.15)" />
      {/* Central mosque body */}
      <path d="M70 220 L70 160 Q170 100 270 160 L270 220Z" fill="rgba(255,255,255,0.12)" />
      {/* Main dome */}
      <path d="M130 160 Q170 100 210 160Z" fill="rgba(255,255,255,0.22)" />
      <path d="M145 160 Q170 118 195 160" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      <line x1="170" y1="100" x2="170" y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <circle cx="170" cy="88" r="3.5" fill="rgba(255,255,255,0.5)" />
      {/* Side domes */}
      <path d="M85 175 Q105 150 125 175Z" fill="rgba(255,255,255,0.16)" />
      <path d="M215 175 Q235 150 255 175Z" fill="rgba(255,255,255,0.16)" />
      {/* Arched wall */}
      <rect x="59" y="218" width="221" height="72" fill="rgba(255,255,255,0.10)" />
      {[80, 112, 144, 176, 208, 240].map(x => (
        <path key={x} d={`M${x} 290 L${x} 248 Q${x + 12} 232 ${x + 24} 248 L${x + 24} 290`} fill="rgba(255,255,255,0.08)" />
      ))}

      {/* ===== MODERN BUILDINGS BRIDGE (x: 310–440) ===== */}
      <rect x="318" y="195" width="22" height="95" fill="rgba(255,255,255,0.09)" />
      <rect x="346" y="172" width="28" height="118" fill="rgba(255,255,255,0.11)" />
      <rect x="380" y="190" width="18" height="100" fill="rgba(255,255,255,0.08)" />
      <rect x="404" y="160" width="30" height="130" fill="rgba(255,255,255,0.12)" />
      <rect x="350" y="168" width="28" height="4" fill="rgba(255,255,255,0.18)" />
      <rect x="406" y="156" width="30" height="4" fill="rgba(255,255,255,0.18)" />

      {/* ===== FAISAL MOSQUE — ISLAMABAD (x: 445–660) ===== */}
      {/* 4 slim minarets */}
      <rect x="452" y="108" width="10" height="182" fill="rgba(255,255,255,0.16)" />
      <path d="M452 108 Q457 94 462 108Z" fill="rgba(255,255,255,0.28)" />
      <rect x="455" y="88" width="4" height="22" fill="rgba(255,255,255,0.3)" />
      <rect x="490" y="130" width="8" height="160" fill="rgba(255,255,255,0.12)" />
      <path d="M490 130 Q494 118 498 130Z" fill="rgba(255,255,255,0.22)" />
      <rect x="640" y="108" width="10" height="182" fill="rgba(255,255,255,0.16)" />
      <path d="M640 108 Q645 94 650 108Z" fill="rgba(255,255,255,0.28)" />
      <rect x="643" y="88" width="4" height="22" fill="rgba(255,255,255,0.3)" />
      <rect x="606" y="130" width="8" height="160" fill="rgba(255,255,255,0.12)" />
      <path d="M606 130 Q610 118 614 130Z" fill="rgba(255,255,255,0.22)" />
      {/* Tent shape — main prayer hall */}
      <path d="M498 290 L498 200 L552 128 L606 200 L606 290Z" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      {/* Tent ridges */}
      <line x1="552" y1="128" x2="510" y2="220" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <line x1="552" y1="128" x2="594" y2="220" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      {/* Crescent on top */}
      <path d="M548 122 Q555 114 560 122 Q555 118 548 122Z" fill="rgba(255,255,255,0.55)" />
      <rect x="551" y="110" width="2" height="14" fill="rgba(255,255,255,0.4)" />
      {/* Forecourt */}
      <rect x="498" y="270" width="108" height="20" fill="rgba(255,255,255,0.08)" />

      {/* ===== ISLAMABAD MODERN CITYSCAPE (x: 660–800) ===== */}
      <rect x="665" y="178" width="24" height="112" fill="rgba(255,255,255,0.1)" />
      <rect x="695" y="155" width="18" height="135" fill="rgba(255,255,255,0.12)" />
      <rect x="719" y="168" width="20" height="122" fill="rgba(255,255,255,0.09)" />
      <rect x="745" y="145" width="26" height="145" fill="rgba(255,255,255,0.13)" />
      <rect x="777" y="175" width="16" height="115" fill="rgba(255,255,255,0.09)" />
      {/* Windows pattern */}
      {[697, 701, 705, 709, 713].map(y => [695, 700, 705].map(x => (
        <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" fill="rgba(255,255,255,0.2)" />
      )))}

      {/* ===== QUAID'S MAUSOLEUM — KARACHI (x: 800–960) ===== */}
      {/* Main platform */}
      <rect x="808" y="248" width="148" height="42" fill="rgba(255,255,255,0.10)" />
      {/* Four corner pillars */}
      <rect x="812" y="200" width="16" height="90" fill="rgba(255,255,255,0.13)" />
      <rect x="936" y="200" width="16" height="90" fill="rgba(255,255,255,0.13)" />
      <rect x="836" y="218" width="12" height="72" fill="rgba(255,255,255,0.10)" />
      <rect x="916" y="218" width="12" height="72" fill="rgba(255,255,255,0.10)" />
      {/* Dome */}
      <path d="M832 200 Q882 140 932 200Z" fill="rgba(255,255,255,0.20)" />
      <path d="M848 200 Q882 154 916 200" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      {/* Finial */}
      <line x1="882" y1="140" x2="882" y2="126" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
      <circle cx="882" cy="124" r="4" fill="rgba(255,255,255,0.5)" />
      {/* Arched gates */}
      <path d="M855 290 L855 258 Q869 242 883 258 L883 290" fill="rgba(255,255,255,0.09)" />
      <path d="M883 290 L883 258 Q897 242 911 258 L911 290" fill="rgba(255,255,255,0.09)" />

      {/* ===== CLOCK TOWER — FAISALABAD (x: 970–1090) ===== */}
      {/* Base */}
      <path d="M1000 290 L996 255 L1001 240 L1012 234 L1028 234 L1039 240 L1044 255 L1040 290Z" fill="rgba(255,255,255,0.14)" />
      {/* Mid section */}
      <rect x="1006" y="210" width="28" height="26" fill="rgba(255,255,255,0.18)" />
      {/* Clock face */}
      <circle cx="1020" cy="222" r="10" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" />
      <line x1="1020" y1="222" x2="1020" y2="215" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      <line x1="1020" y1="222" x2="1026" y2="222" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      {/* Spire */}
      <path d="M1010 210 L1020 185 L1030 210Z" fill="rgba(255,255,255,0.26)" />
      <rect x="1018" y="178" width="4" height="8" fill="rgba(255,255,255,0.4)" />
      {/* 8 roads radiating (faint) */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const rad = Math.PI * a / 180;
        return <line key={i} x1="1020" y1="290" x2={1020 + 55 * Math.cos(rad)} y2={290 + 30 * Math.sin(rad)} stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />;
      })}
      {/* Surrounding low buildings */}
      <rect x="972" y="242" width="20" height="48" fill="rgba(255,255,255,0.08)" />
      <rect x="1048" y="250" width="24" height="40" fill="rgba(255,255,255,0.08)" />

      {/* ===== MODERN KARACHI TOWERS (x: 1090–1210) ===== */}
      <rect x="1092" y="162" width="22" height="128" fill="rgba(255,255,255,0.11)" />
      <rect x="1120" y="140" width="26" height="150" fill="rgba(255,255,255,0.13)" />
      <rect x="1152" y="172" width="18" height="118" fill="rgba(255,255,255,0.09)" />
      <rect x="1176" y="155" width="24" height="135" fill="rgba(255,255,255,0.11)" />
      <rect x="1122" y="136" width="26" height="4" fill="rgba(255,255,255,0.2)" />
      <rect x="1094" y="158" width="22" height="4" fill="rgba(255,255,255,0.18)" />

      {/* ===== SHAH RUKN-E-ALAM — MULTAN (x: 1210–1410) ===== */}
      {/* Octagonal base */}
      <path d="M1230 290 L1222 260 L1228 236 L1248 224 L1368 224 L1388 236 L1394 260 L1386 290Z" fill="rgba(255,255,255,0.12)" />
      {/* Corner turrets */}
      <rect x="1220" y="210" width="18" height="80" fill="rgba(255,255,255,0.16)" />
      <path d="M1220 210 Q1229 192 1238 210Z" fill="rgba(255,255,255,0.28)" />
      <rect x="1377" y="210" width="18" height="80" fill="rgba(255,255,255,0.16)" />
      <path d="M1377 210 Q1386 192 1395 210Z" fill="rgba(255,255,255,0.28)" />
      {/* Large dome */}
      <path d="M1248 224 Q1308 152 1368 224Z" fill="rgba(255,255,255,0.20)" />
      <path d="M1262 224 Q1308 164 1354 224" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      {/* Dome finial */}
      <line x1="1308" y1="152" x2="1308" y2="134" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
      <circle cx="1308" cy="132" r="4.5" fill="rgba(255,255,255,0.5)" />
      {/* Doorway arch */}
      <path d="M1293 290 L1293 262 Q1308 246 1323 262 L1323 290" fill="rgba(255,255,255,0.10)" />
      {/* Decorative band */}
      <rect x="1230" y="252" width="156" height="5" fill="rgba(255,255,255,0.12)" />

      {/* ===== TRAILING BUILDINGS (x: 1410–1440) ===== */}
      <rect x="1410" y="222" width="16" height="68" fill="rgba(255,255,255,0.08)" />
      <rect x="1428" y="238" width="12" height="52" fill="rgba(255,255,255,0.06)" />

      {/* ===== GROUND LINE ===== */}
      <rect x="0" y="288" width="1440" height="2" fill="url(#groundFade)" />
      <rect x="0" y="290" width="1440" height="10" fill="rgba(255,255,255,0.04)" />
    </svg>
  );
}
