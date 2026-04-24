"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconMapPin, IconCalendar, IconSearch } from '../icons';
import { Tweaks } from '@/lib/types';

interface HeroSearchCardProps {
  tweaks: Tweaks;
}

export default function HeroSearchCard({ tweaks }: HeroSearchCardProps) {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [checkin, setCheckin] = useState('');
  const [stayType, setStayType] = useState('Monthly');
  
  const red = tweaks?.primaryColor || '#C0392B';
  const cities = ['Lahore', 'Karachi', 'Islamabad', 'Peshawar', 'Faisalabad', 'Quetta', 'Multan'];
  const stayTypes = ['Daily', 'Weekly', 'Monthly'];

  const handleSearch = () => {
    let url = '/find-hostels';
    if (city) url += `?city=${encodeURIComponent(city)}`;
    router.push(url);
  };

  const inputStyle: React.CSSProperties = { 
    width: '100%', 
    padding: '11px 14px', 
    borderRadius: 8, 
    border: '1.5px solid #e5e7eb', 
    fontFamily: 'DM Sans, sans-serif', 
    fontSize: 14, 
    color: '#2C2C2C', 
    outline: 'none', 
    background: '#fafafa', 
    transition: 'border-color 0.2s', 
    boxSizing: 'border-box' 
  };

  const labelStyle: React.CSSProperties = { 
    fontSize: 11, 
    fontWeight: 700, 
    color: '#888', 
    letterSpacing: '0.08em', 
    textTransform: 'uppercase', 
    marginBottom: 6, 
    display: 'block', 
    fontFamily: 'DM Sans, sans-serif' 
  };

  return (
    <div 
      className="bg-white rounded-[20px]" 
      style={{ 
        background: 'white',
        borderRadius: 20,
        padding: '28px 32px', 
        boxShadow: '0 32px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.1)', 
        maxWidth: 920, 
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit,minmax(148px,1fr))', 
          gap: 14, 
          alignItems: 'end' 
        }}
      >
        <div>
          <label style={labelStyle}>City / Area</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
              <IconMapPin size={15} color={red} />
            </div>
            <select 
              value={city} 
              onChange={e => setCity(e.target.value)} 
              style={{ ...inputStyle, paddingLeft: 32, appearance: 'none', cursor: 'pointer' }}
            >
              <option value="">Select City</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Check-In</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
              <IconCalendar size={15} color="#aaa" />
            </div>
            <input 
              type="date" 
              value={checkin} 
              onChange={e => setCheckin(e.target.value)} 
              style={{ ...inputStyle, paddingLeft: 32 }} 
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Stay Type</label>
          <div style={{ display: 'flex', gap: 5 }}>
            {stayTypes.map(t => (
              <button 
                key={t} 
                onClick={() => setStayType(t)}
                className="font-sans"
                style={{ 
                  flex: 1, 
                  padding: '11px 2px', 
                  borderRadius: 8, 
                  fontSize: 12, 
                  fontWeight: 700, 
                  border: `1.5px solid ${stayType === t ? red : '#e5e7eb'}`, 
                  background: stayType === t ? red : 'white', 
                  color: stayType === t ? 'white' : '#666', 
                  cursor: 'pointer', 
                  transition: 'all 0.18s', 
                  fontFamily: 'DM Sans, sans-serif' 
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={handleSearch}
          style={{ 
            padding: '13px 20px', 
            borderRadius: 10, 
            border: 'none', 
            background: `linear-gradient(135deg,${red},#a93226)`, 
            color: 'white', 
            fontFamily: 'Plus Jakarta Sans, sans-serif', 
            fontWeight: 700, 
            fontSize: 14, 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 7, 
            boxShadow: `0 6px 20px ${red}55`, 
            transition: 'all 0.22s', 
            whiteSpace: 'nowrap' 
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${red}66`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 20px ${red}55`; }}
        >
          <IconSearch size={16} color="white" /> Search Hostels
        </button>
      </div>
    </div>
  );
}
