"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IconStar } from '../icons';
import { Tweaks } from '@/lib/types';

interface TestimonialsProps {
  tweaks: Tweaks;
}

const TESTIMONIALS = [
  { q: "HostelIn ne meri zindagi aasaan kar di. Lahore mein job ke liye aaya tha, 2 din mein perfect hostel mil gaya.", name: "Usman Tariq", role: "Software Engineer", city: "Lahore", init: "UT", color: "#C0392B" },
  { q: "As a girl moving to Islamabad for university, safety was my top concern. Found a verified ladies hostel through HostelIn in minutes.", name: "Ayesha Noor", role: "Student, NUST", city: "Islamabad", init: "AN", color: "#8e44ad" },
  { q: "Monthly rent, meals included, WiFi — sab kuch ek jagah. Highly recommend to all professionals.", name: "Bilal Hussain", role: "MBA Student", city: "Karachi", init: "BH", color: "#2980b9" },
];

export default function Testimonials({ tweaks }: TestimonialsProps) {
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
        background: 'white',
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
            marginBottom: 56, 
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
            Real Stories
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
            What Residents Say
          </h2>
        </div>
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', 
            gap: 28 
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name}
              style={{
                background: '#FAFAFA', 
                borderRadius: 20, 
                padding: '36px 32px',
                border: '1.5px solid #F0F0F0', 
                position: 'relative',
                opacity: vis ? 1 : 0, 
                transform: vis ? 'none' : 'translateY(28px)',
                transition: `all 0.65s ease ${i * 0.15}s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.1)`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = `${red}33`; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#F0F0F0'; }}
            >
              {/* Quote mark */}
              <div 
                style={{ 
                  fontSize: 64, 
                  lineHeight: 1, 
                  color: `${red}22`, 
                  fontFamily: 'Georgia, serif', 
                  marginTop: -16, 
                  marginBottom: -8, 
                  fontWeight: 900 
                }}
              >
                &quot;
              </div>
              <p 
                style={{ 
                  fontFamily: 'DM Sans, sans-serif', 
                  fontSize: 15, 
                  color: '#444', 
                  lineHeight: 1.75, 
                  margin: '0 0 28px', 
                  fontStyle: 'italic' 
                }}
              >
                &quot;{t.q}&quot;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div 
                  style={{ 
                    width: 46, 
                    height: 46, 
                    borderRadius: '50%', 
                    background: t.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0 
                  }}
                >
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 16, color: 'white' }}>{t.init}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{t.name}</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#888' }}>{t.role} · {t.city}</div>
                </div>
              </div>
              {/* Stars */}
              <div style={{ position: 'absolute', top: 32, right: 28, display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map(s => <IconStar key={s} size={13} color="#F59E0B" fill="#F59E0B" />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
