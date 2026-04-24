"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IconChevronRight } from '../icons';
import HostelCard from './HostelCard';
import { HOSTELS, FILTERS } from '@/lib/constants';
import { Tweaks } from '@/lib/types';

interface ListingsProps {
  tweaks: Tweaks;
}

export default function Listings({ tweaks }: ListingsProps) {
  const router = useRouter();
  const red = tweaks?.primaryColor || '#C0392B';
  const [activeFilter, setActiveFilter] = useState('All');
  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const [vis, setVis] = useState(false);
 
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await fetch('/api/hostels');
        const data = await res.json();
        if (Array.isArray(data)) setHostels(data);
      } catch (err) {
        console.error("Failed to fetch hostels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVis(true);
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const filterMap: Record<string, string | null> = { 'All': null, 'Male Only': 'Male', 'Female Only': 'Female', 'Co-ed': 'Co-ed' };
  const filtered = activeFilter === 'All' || !filterMap[activeFilter] 
    ? hostels 
    : hostels.filter(h => h.type === filterMap[activeFilter]);

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
            marginBottom: 36, 
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
            Handpicked for You
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
            Featured Hostels
          </h2>
        </div>

        {/* Filter pills */}
        <div 
          className="no-scrollbar"
          style={{ 
            display: 'flex', 
            gap: 10, 
            marginBottom: 40, 
            overflowX: 'auto', 
            paddingBottom: 6, 
            scrollbarWidth: 'none', 
            opacity: vis ? 1 : 0, 
            transition: 'all 0.6s ease 0.1s' 
          }}
        >
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              style={{
                padding: '9px 20px', 
                borderRadius: 100, 
                border: `1.5px solid ${activeFilter === f ? red : '#e5e7eb'}`,
                background: activeFilter === f ? red : 'white',
                color: activeFilter === f ? 'white' : '#555',
                fontFamily: 'DM Sans, sans-serif', 
                fontWeight: 600, 
                fontSize: 13, 
                cursor: 'pointer',
                whiteSpace: 'nowrap', 
                transition: 'all 0.2s', 
                flexShrink: 0,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))',
            gap: 28,
            opacity: vis ? 1 : 0, 
            transform: vis ? 'none' : 'translateY(20px)', 
            transition: 'all 0.7s ease 0.2s'
          }}
        >
          {filtered.length > 0 ? (
            filtered.map(h => <HostelCard key={h.id} hostel={h} tweaks={tweaks} />)
          ) : !loading && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🏘️</div>
              <p style={{ fontSize: 16, fontWeight: 500 }}>No hostels found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* View all */}
        <div style={{ textAlign: 'center', marginTop: 52 }}>
          <button 
            onClick={() => router.push('/find-hostels')}
            style={{
              padding: '14px 40px', 
              borderRadius: 10, 
              border: `2px solid ${red}`, 
              background: 'transparent',
              color: red, 
              fontFamily: 'Plus Jakarta Sans, sans-serif', 
              fontWeight: 700, 
              fontSize: 15, 
              cursor: 'pointer',
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 8, 
              transition: 'all 0.22s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = red; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = red; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            View All Hostels <IconChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
