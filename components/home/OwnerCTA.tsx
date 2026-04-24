"use client";

import { useRouter } from 'next/navigation';
import { IconCheck, IconArrowRight } from '../icons';
import { Tweaks } from '@/lib/types';

interface OwnerCTAProps {
  tweaks: Tweaks;
}

export default function OwnerCTA({ tweaks }: OwnerCTAProps) {
  const router = useRouter();
  const red = tweaks?.primaryColor || '#C0392B';
  const perks = ['Free listing — no hidden fees', 'Verified owner badge', 'Online booking management', 'Monthly analytics dashboard', 'Direct payment collection'];

  return (
    <section 
      style={{ 
        padding: '0 24px 88px', 
        background: 'white',
        width: '100%',
        display: 'block'
      }}
    >
      <div 
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          borderRadius: 24, 
          overflow: 'hidden', 
          boxShadow: '0 20px 80px rgba(0,0,0,0.12)',
          display: 'grid',
          width: '100%'
        }}
      >
        {/* Left — charcoal */}
        <div 
          style={{ 
            background: '#2C2C2C', 
            padding: '60px 52px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}
        >
          <span 
            style={{ 
              fontSize: 13, 
              fontWeight: 700, 
              color: red, 
              letterSpacing: '0.12em', 
              textTransform: 'uppercase', 
              fontFamily: 'DM Sans, sans-serif', 
              marginBottom: 16, 
              display: 'block' 
            }}
          >
            For Hostel Owners
          </span>
          <h2 
            style={{ 
              fontFamily: 'Plus Jakarta Sans, sans-serif', 
              fontWeight: 800, 
              fontSize: 'clamp(26px,3vw,40px)', 
              color: 'white', 
              margin: '0 0 20px', 
              lineHeight: 1.2 
            }}
          >
            Own a Hostel?
          </h2>
          <p 
            style={{ 
              fontFamily: 'DM Sans, sans-serif', 
              fontSize: 16, 
              color: 'rgba(255,255,255,0.65)', 
              lineHeight: 1.75, 
              margin: '0 0 32px' 
            }}
          >
            List it on HostelIn.pk and reach thousands of verified students and professionals looking for accommodation across Pakistan.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {perks.map(p => (
              <li key={p} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>
                <div 
                  style={{ 
                    width: 22, 
                    height: 22, 
                    borderRadius: '50%', 
                    background: `${red}33`, 
                    border: `1.5px solid ${red}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0 
                  }}
                >
                  <IconCheck size={11} color={red} />
                </div>
                {p}
              </li>
            ))}
          </ul>
        </div>
        {/* Right — red */}
        <div 
          style={{ 
            background: `linear-gradient(145deg, ${red}, #8e1a10)`, 
            padding: '60px 52px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'flex-start', 
            position: 'relative', 
            overflow: 'hidden' 
          }}
        >
          <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -30, width: 340, height: 340, borderRadius: '50%', background: 'rgba(0,0,0,0.1)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>Join 500+ hostel owners already on our platform</div>
            <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 'clamp(24px,3vw,36px)', color: 'white', margin: '0 0 28px', lineHeight: 1.2 }}>Start Getting Bookings Today — It&apos;s Free</h3>
            <button 
              onClick={() => router.push('/list-hostel')}
              style={{
                padding: '16px 40px', 
                borderRadius: 12, 
                border: 'none',
                background: 'white', 
                color: red,
                fontFamily: 'Plus Jakarta Sans, sans-serif', 
                fontWeight: 800, 
                fontSize: 17, 
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)', 
                transition: 'all 0.22s',
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 10,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'; }}
            >
              List Your Hostel Free <IconArrowRight size={18} color={red} />
            </button>
            <div style={{ marginTop: 20, fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              No credit card required · Setup in 5 minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
