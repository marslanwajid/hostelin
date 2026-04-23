"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Tweaks } from '@/lib/types';

interface StatsSectionProps {
  tweaks: Tweaks;
}

const useCountUp = (target: number, duration: number, started: boolean) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return count;
};

export default function StatsSection({ tweaks }: StatsSectionProps) {
  const red = tweaks?.primaryColor || '#C0392B';
  const ref = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setStarted(true);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const v1 = useCountUp(500, 1800, started);
  const v2 = useCountUp(15000, 1800, started);
  const v3 = useCountUp(7, 1600, started);
  const v4 = useCountUp(47, 1600, started);

  const stats = [
    { val: v1, suf: '+', label: 'Verified Hostels' },
    { val: v2, suf: '+', label: 'Happy Residents' },
    { val: v3, suf: '', label: 'Major Cities' },
    { val: v4 / 10, suf: '★', label: 'Average Rating' },
  ];

  return (
    <section 
      ref={ref} 
      style={{ 
        background: `linear-gradient(135deg, ${red} 0%, #8e1a10 100%)`, 
        padding: '80px 24px', 
        position: 'relative', 
        overflow: 'hidden',
        width: '100%',
        display: 'block'
      }}
    >
      <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -80, left: 20, width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,0,0,0.1)', pointerEvents: 'none' }} />
      
      <div 
        style={{ 
          maxWidth: 1100, 
          margin: '0 auto', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 48, 
          justifyContent: 'space-around', 
          position: 'relative',
          width: '100%'
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: 'center', flex: '1 1 160px' }}>
            <div 
              style={{ 
                fontFamily: 'Plus Jakarta Sans, sans-serif', 
                fontWeight: 800, 
                fontSize: 'clamp(44px,5vw,68px)', 
                color: 'white', 
                lineHeight: 1, 
                marginBottom: 10 
              }}
            >
              {typeof s.val === 'number' && !Number.isInteger(s.val) ? s.val.toFixed(1) : Math.floor(s.val).toLocaleString()}
              {s.suf}
            </div>
            <div 
              style={{ 
                fontFamily: 'DM Sans, sans-serif', 
                fontSize: 16, 
                color: 'rgba(255,255,255,0.75)', 
                fontWeight: 500, 
                letterSpacing: '0.01em' 
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
