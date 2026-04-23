"use client";

import React, { useState, useEffect } from 'react';
import { IconCheck } from '../icons';
import LiveTicker from './LiveTicker';
import PakistanSkyline from './PakistanSkyline';
import Particles from './Particles';
import HeroSearchCard from './HeroSearchCard';
import { Tweaks } from '@/lib/types';

interface HeroProps {
  tweaks: Tweaks;
}

export default function Hero({ tweaks }: HeroProps) {
  const red = tweaks?.primaryColor || '#C0392B';
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const badges = ['500+ Verified Hostels', '15,000+ Beds', 'Free Cancellation', 'Best Price Guaranteed'];

  return (
    <section
      className="min-h-screen relative overflow-hidden flex flex-col pt-20 w-full"
      style={{ 
        background: 'linear-gradient(170deg,#160808 0%,#1e0e0c 25%,#2C2C2C 55%,#1a1a1a 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Geometric grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.055] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.7'%3E%3Crect x='4' y='4' width='72' height='72'/%3E%3Crect x='14' y='14' width='52' height='52'/%3E%3Cline x1='4' y1='4' x2='14' y2='14'/%3E%3Cline x1='76' y1='4' x2='66' y2='14'/%3E%3Cline x1='4' y1='76' x2='14' y2='66'/%3E%3Cline x1='76' y1='76' x2='66' y2='66'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Red atmospheric glow */}
      <div
        className="absolute top-[15%] right-[8%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle,${red}2e 0%,transparent 68%)` }}
      />
      <div
        className="absolute top-[30%] -left-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle,${red}1a 0%,transparent 70%)` }}
      />
      <Particles />

      {/* CONTENT */}
      <div
        className="flex-1 flex flex-col justify-center relative z-10 w-full"
        style={{ 
          maxWidth: 1280, 
          margin: '100px auto 0', 
          padding: '48px 24px 20px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Live ticker */}
        <div
          className="flex justify-center transition-all duration-500 ease-in-out"
          style={{ 
            marginBottom: 28,
            opacity: visible ? 1 : 0, 
            transform: visible ? 'none' : 'translateY(16px)',
            display: 'flex'
          }}
        >
          <LiveTicker red={red} />
        </div>

        {/* Headline */}
        <h1
          className="font-display font-extrabold text-white leading-[1.06] text-center"
          style={{
            fontSize: 'clamp(40px,6.5vw,82px)',
            margin: '0 0 4px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(32px)',
            transition: 'all 0.7s ease 0.1s',
            textWrap: 'balance',
            textAlign: 'center'
          }}
        >
          Pakistan Ka Apna
        </h1>
        <h1
          className="font-display font-extrabold leading-[1.06] text-center"
          style={{
            color: red,
            fontSize: 'clamp(40px,6.5vw,82px)',
            margin: '0 0 20px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(32px)',
            transition: 'all 0.7s ease 0.18s',
            textWrap: 'balance',
            textAlign: 'center'
          }}
        >
          Hostel Portal
        </h1>
        <p
          className="font-sans text-center"
          style={{
            fontSize: 'clamp(15px,2vw,19px)',
            color: 'rgba(255,255,255,0.58)',
            margin: '0 0 40px',
            opacity: visible ? 1 : 0,
            transition: 'all 0.7s ease 0.26s',
            textAlign: 'center'
          }}
        >
          Find Verified, Affordable Hostels Across Pakistan
        </p>

        {/* Search Card Container */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(28px)',
            transition: 'all 0.8s ease 0.34s',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <HeroSearchCard tweaks={tweaks} />
        </div>

        {/* Trust badges */}
        <div
          style={{ 
            opacity: visible ? 1 : 0, 
            transition: 'all 0.7s ease 0.48s',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 10,
            marginTop: 10,
            width: '100%'
          }}
        >
          {badges.map(b => (
            <div key={b} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 7, 
              background: 'rgba(255,255,255,0.08)', 
              backdropFilter: 'blur(8px)', 
              border: '1px solid rgba(255,255,255,0.14)', 
              borderRadius: 100, 
              padding: '7px 15px',
              flexShrink: 0
            }}>
              <div style={{ 
                width: 17, 
                height: 17, 
                borderRadius: '50%', 
                background: red, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexShrink: 0 
              }}>
                <IconCheck size={9} color="white" />
              </div>
              <span style={{ 
                color: 'rgba(255,255,255,0.85)', 
                fontSize: 13, 
                fontFamily: 'var(--font-dm-sans), sans-serif', 
                fontWeight: 600,
                letterSpacing: '0.01em'
              }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PANORAMIC SKYLINE at bottom */}
      <div
        className="relative z-20 mt-auto leading-none w-full"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(40px)',
          transition: 'all 1.1s ease 0.5s',
          width: '100%'
        }}
      >
        <PakistanSkyline />
      </div>

      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
      `}</style>
    </section>
  );
}
