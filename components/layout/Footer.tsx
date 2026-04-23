"use client";

import React from 'react';
import { IconInstagram, IconFacebook, IconTwitter, IconYoutube } from '../icons';
import { FOOTER_COLS } from '@/lib/constants';
import { Tweaks } from '@/lib/types';

interface FooterProps {
  tweaks: Tweaks;
}

export default function Footer({ tweaks }: FooterProps) {
  const red = tweaks?.primaryColor || '#C0392B';

  return (
    <footer 
      style={{ 
        background: '#2C2C2C', 
        padding: '64px 24px 0', 
        color: 'white',
        width: '100%',
        display: 'block'
      }}
    >
      <div 
        style={{ 
          maxWidth: 1280, 
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 mb-14"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.4fr repeat(4, 1fr)', 
            gap: 40, 
            marginBottom: 56,
            width: '100%'
          }}
        >
          {/* Brand col */}
          <div className="col-span-1 md:col-span-1">
            <img src="/uploads/logo.webp" alt="HostelIn" style={{ height: 36, filter: 'brightness(0) invert(1)', marginBottom: 16, display: 'block' }} />
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 240, margin: '0 0 24px' }}>
              Pakistan&apos;s first dedicated hostel discovery and booking platform for students and working professionals.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[IconInstagram, IconFacebook, IconTwitter, IconYoutube].map((Icon, i) => (
                <a key={i} href="#" 
                  style={{ 
                    width: 38, 
                    height: 38, 
                    borderRadius: 10, 
                    background: 'rgba(255,255,255,0.08)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    transition: 'all 0.2s', 
                    textDecoration: 'none' 
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = red; e.currentTarget.style.borderColor = red; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <Icon size={17} color="white" />
                </a>
              ))}
            </div>
          </div>
          {/* Link cols */}
          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 14, color: 'white', margin: '0 0 20px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" 
                      style={{ 
                        fontFamily: 'DM Sans, sans-serif', 
                        fontSize: 14, 
                        color: 'rgba(255,255,255,0.5)', 
                        textDecoration: 'none', 
                        transition: 'color 0.18s' 
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = red}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            © 2026 HostelIn.pk · <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Privacy Policy</a> · <a href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Terms of Service</a>
          </div>
          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Pakistan Ka Apna Hostel Portal 🇵🇰
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr!important}} 
        @media(max-width:520px){.footer-grid{grid-template-columns:1fr!important}}
      `}</style>
    </footer>
  );
}
