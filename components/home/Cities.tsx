"use client";

import React, { useState, useRef, useEffect } from 'react';
import { IconMapPin } from '../icons';
import CityBuilding from './CityBuilding';
import { Tweaks } from '@/lib/types';

interface CitiesProps {
  tweaks: Tweaks;
}

const CITIES = [
  { name: 'Lahore', urdu: 'لاہور', count: '120+', grad: 'linear-gradient(160deg,#7b1413,#c0392b)' },
  { name: 'Karachi', urdu: 'کراچی', count: '95+', grad: 'linear-gradient(160deg,#0d3b6e,#1a6fa8)' },
  { name: 'Islamabad', urdu: 'اسلام آباد', count: '80+', grad: 'linear-gradient(160deg,#1a3a2a,#27ae60)' },
  { name: 'Peshawar', urdu: 'پشاور', count: '45+', grad: 'linear-gradient(160deg,#5d3a1a,#e67e22)' },
  { name: 'Faisalabad', urdu: 'فیصل آباد', count: '60+', grad: 'linear-gradient(160deg,#3b1f5e,#8e44ad)' },
  { name: 'Quetta', urdu: 'کوئٹہ', count: '30+', grad: 'linear-gradient(160deg,#0a2e2e,#16a085)' },
  { name: 'Multan', urdu: 'ملتان', count: '40+', grad: 'linear-gradient(160deg,#4a1500,#d35400)' },
];

export default function Cities({ tweaks }: CitiesProps) {
  const red = tweaks?.primaryColor || '#C0392B';
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVis(true);
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section 
      ref={ref} 
      style={{ 
        padding: '88px 0 72px', 
        background: '#F8F8F8',
        width: '100%',
        display: 'block'
      }}
    >
      <div 
        style={{ 
          maxWidth: 1280, 
          margin: '0 auto', 
          padding: '0 24px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{ 
            marginBottom: 40, 
            opacity: vis ? 1 : 0, 
            transform: vis ? 'none' : 'translateY(24px)', 
            transition: 'all 0.6s ease' 
          }}
        >
          <span 
            style={{ 
              fontSize: 13, 
              fontWeight: 700, 
              color: red, 
              letterSpacing: '0.12em', 
              textTransform: 'uppercase', 
              fontFamily: 'DM Sans, sans-serif' 
            }}
          >
            Top Destinations
          </span>
          <h2 
            style={{ 
              fontFamily: 'Plus Jakarta Sans, sans-serif', 
              fontWeight: 800, 
              fontSize: 'clamp(28px,4vw,44px)', 
              color: '#2C2C2C', 
              margin: '8px 0 0', 
              lineHeight: 1.15 
            }}
          >
            Explore by City
          </h2>
        </div>
        <div 
          className="city-scroll"
          style={{ 
            display: 'flex', 
            gap: 20, 
            overflowX: 'auto', 
            paddingBottom: 12, 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {CITIES.map((city, i) => {
            const isActive = active === city.name;
            return (
              <div key={city.name}
                onClick={() => setActive(isActive ? null : city.name)}
                style={{
                  minWidth: 170, 
                  borderRadius: 16, 
                  cursor: 'pointer',
                  background: city.grad, 
                  padding: '32px 20px 24px',
                  position: 'relative', 
                  overflow: 'hidden', 
                  flexShrink: 0,
                  boxShadow: isActive ? `0 12px 40px ${red}55, 0 0 0 3px ${red}` : '0 4px 20px rgba(0,0,0,0.12)',
                  transform: isActive ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
                  transition: 'all 0.28s ease',
                  opacity: vis ? 1 : 0,
                  transitionDelay: `${i * 0.07}s`,
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 10px 32px rgba(0,0,0,0.2), 0 0 0 2.5px ${red}`; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)'; } }}
              >
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 110, opacity: 0.9, pointerEvents: 'none' }}>
                  <CityBuilding city={city.name} />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <IconMapPin size={22} color="rgba(255,255,255,0.85)" fill="rgba(255,255,255,0.25)" />
                  <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 20, color: 'white', margin: '12px 0 2px' }}>{city.name}</h3>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.75)', margin: '0 0 14px', direction: 'rtl' }}>{city.urdu}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: 100, padding: '5px 12px' }}>
                    <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 600, color: 'white' }}>{city.count} hostels</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`.city-scroll::-webkit-scrollbar{display:none}`}</style>
    </section>
  );
}
