"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IconSearch, IconMapPin, IconCheck } from '../icons';
import { Tweaks } from '@/lib/types';

interface HowItWorksProps {
  tweaks: Tweaks;
}

const STEPS = [
  { n: 1, icon: IconSearch, title: 'Search Your City', desc: 'Enter your city, preferred dates, and stay preferences to see matching hostels in seconds.' },
  { n: 2, icon: IconMapPin, title: 'Compare & Choose', desc: 'Browse verified photos, amenities, reviews, and pricing side by side to find your perfect match.' },
  { n: 3, icon: IconCheck, title: 'Book & Move In', desc: 'Confirm your booking online and move in hassle-free — no paperwork, no surprises.' },
];

export default function HowItWorks({ tweaks }: HowItWorksProps) {
  const red = tweaks?.primaryColor || '#C0392B';
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
        padding: '88px 0', 
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
            textAlign: 'center', 
            marginBottom: 60, 
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
            Simple Process
          </span>
          <h2 
            style={{ 
              fontFamily: 'Plus Jakarta Sans, sans-serif', 
              fontWeight: 800, 
              fontSize: 'clamp(28px,4vw,44px)', 
              color: '#2C2C2C', 
              margin: '8px 0 0' 
            }}
          >
            Book in 3 Simple Steps
          </h2>
        </div>

        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', 
            gap: 32, 
            position: 'relative' 
          }}
        >
          {/* Dotted connector line */}
          <div 
            className="hidden md:block absolute top-[56px] left-[16.67%] right-[16.67%] h-[2px]"
            style={{ 
              backgroundImage: `repeating-linear-gradient(90deg,${red}44 0,${red}44 10px,transparent 10px,transparent 22px)`,
            }}
          />

          {STEPS.map((step, i) => (
            <div key={step.n}
              style={{
                background: 'white', 
                borderRadius: 20, 
                padding: '40px 32px 36px', 
                textAlign: 'center',
                boxShadow: '0 4px 28px rgba(0,0,0,0.08)',
                opacity: vis ? 1 : 0, 
                transform: vis ? 'none' : 'translateY(28px)',
                transition: `all 0.65s ease ${i * 0.15}s`,
                position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.13)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 28px rgba(0,0,0,0.08)'; }}
            >
              {/* Step number */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: -18, 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  width: 36, 
                  height: 36, 
                  borderRadius: '50%', 
                  background: red, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  boxShadow: `0 4px 16px ${red}66` 
                }}
              >
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 16, color: 'white' }}>{step.n}</span>
              </div>
              <div 
                style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  background: `${red}11`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '16px auto 24px' 
                }}
              >
                <step.icon size={38} color={red} />
              </div>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 22, color: '#2C2C2C', margin: '0 0 12px' }}>{step.title}</h3>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#666', lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
