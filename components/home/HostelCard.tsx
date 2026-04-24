"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconBuilding, IconCheck, IconMapPin, IconStar, IconWifi, IconUtensils, IconWind, IconZap, IconShield } from '../icons';
import { Tweaks } from '@/lib/types';

interface HostelCardProps {
  hostel: any;
  tweaks: Tweaks;
}

const AmenityIcon = ({ type }: { type: string }) => {
  const map: Record<string, [React.FC<any>, string]> = {
    wifi: [IconWifi, 'WiFi'], meals: [IconUtensils, 'Meals'], ac: [IconWind, 'AC'],
    laundry: [IconZap, 'Laundry'], security: [IconShield, 'Security'], generator: [IconZap, 'Generator'],
  };
  const [Icon, label] = map[type] || [IconCheck, type];
  return (
    <div title={label} style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 12, fontFamily: 'DM Sans, sans-serif' }}>
      <Icon size={14} color="#888" />
    </div>
  );
};

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <IconStar key={i} size={13} color={i <= full ? '#F59E0B' : '#ddd'} fill={i <= full ? '#F59E0B' : '#ddd'} />
      ))}
    </div>
  );
};

export default function HostelCard({ hostel, tweaks }: HostelCardProps) {
  const router = useRouter();
  const red = tweaks?.primaryColor || '#C0392B';
  const [hov, setHov] = useState(false);
  const typeColors: Record<string, string> = { Male: '#2980b9', Female: '#8e44ad', Both: '#27ae60' };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => router.push(`/hostel/${hostel.id}`)}
      style={{
        background: 'white',
        borderRadius: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        boxShadow: hov ? '0 30px 60px rgba(0,0,0,0.12)' : '0 10px 30px rgba(0,0,0,0.04)',
        transform: hov ? 'translateY(-8px)' : 'none',
        border: hov ? `1.5px solid ${red}33` : '1.5px solid #f0f0f0',
        transition: 'all 0.4s cubic-bezier(.4,0,.2,1)'
      }}
    >
      {/* Image placeholder */}
      <div style={{ height: 185, position: 'relative', overflow: 'hidden', flexShrink: 0, background: hostel.grad || 'linear-gradient(135deg, #eee 0%, #ddd 100%)' }}>
        {hostel.image ? (
          <img 
            src={hostel.image} 
            alt={hostel.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              transform: hov ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(.4,0,.2,1)' 
            }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.18 }}>
            <IconBuilding size={80} color="white" />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 60%)' }} />
        {hostel.verified && (
          <div style={{ position: 'absolute', top: 12, left: 12, borderRadius: 100, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5, background: red }}>
            <IconCheck size={11} color="white" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'white', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.05em' }}>VERIFIED</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: 12, right: 12, borderRadius: 100, padding: '4px 10px', background: typeColors[hostel.type] || '#666' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'white', fontFamily: 'DM Sans, sans-serif' }}>{hostel.type}</span>
        </div>
        <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6 }}>
          {hostel.tags?.map((t: string) => (
            <span key={t} style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '3px 9px', fontSize: 11, color: 'white', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: '22px 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 18, color: '#1a1a1a', margin: '0 0 6px', lineHeight: 1.3 }}>{hostel.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <IconMapPin size={14} color={red} />
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#777' }}>{hostel.area}, {hostel.city}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <StarRating rating={hostel.rating} />
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{hostel.rating}</span>
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#999' }}>({hostel.reviews} reviews)</span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {hostel.amenities.map((a: string) => <AmenityIcon key={a} type={a} />)}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 18, borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 4 }}>Starting from</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              {hostel.price !== "Call for Price" && (
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 14, color: red }}>Rs</span>
              )}
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: hostel.price === "Call for Price" ? 16 : 22, color: red, lineHeight: 1 }}>
                {hostel.price}
              </span>
              {hostel.price !== "Call for Price" && (
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#999', marginLeft: 2 }}>/mo</span>
              )}
            </div>
          </div>
          <button style={{ 
            padding: '12px 18px', 
            borderRadius: 14, 
            border: `2px solid ${red}`, 
            background: 'transparent', 
            color: red, 
            fontFamily: 'Plus Jakarta Sans, sans-serif', 
            fontWeight: 800, 
            fontSize: 13, 
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
          onMouseEnter={e => { e.currentTarget.style.background = red; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = red; }}
          >View Details</button>
        </div>
      </div>
    </div>
  );
}
