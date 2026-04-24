"use client";

import React, { useState, useEffect, use } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TWEAK_DEFAULTS } from '@/lib/constants';
import { Tweaks } from '@/lib/types';
import { IconMapPin, IconStar, IconCheck, IconZap, IconWifi, IconWind, IconUtensils, IconShield, IconChevronRight, IconBed } from '@/components/icons';

export default function HostelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  console.log("Rendering HostelDetailPage for ID:", id);
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);
  const [scrolled, setScrolled] = useState(false);
  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeBuildingTab, setActiveBuildingTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    const fetchHostel = async () => {
      try {
        const res = await fetch(`/api/hostels/${id}`);
        const data = await res.json();
        if (data && !data.error) setHostel(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const stored = localStorage.getItem('hostelIn_tweaks');
    if (stored) setTweaks({ ...TWEAK_DEFAULTS, ...JSON.parse(stored) });
    
    fetchHostel();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  const red = tweaks.primaryColor || '#C0392B';

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Loading property details...</div>;
  
  if (!hostel) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>🔍</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 10px' }}>Hostel Not Found</h2>
      <p style={{ color: '#666', marginBottom: 32 }}>The property you're looking for might have been removed or moved.</p>
      <button 
        onClick={() => window.location.href = '/find-hostels'}
        style={{ padding: '14px 28px', borderRadius: 12, background: red, color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
      >
        Browse All Hostels
      </button>
    </div>
  );
  const mainImage = hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200';

  return (
    <main style={{ background: '#fff' }}>
      <Navbar scrolled={scrolled} tweaks={tweaks} forceSolid={true} />
      
      {/* Hero Gallery Section */}
      <div style={{ paddingTop: 80, background: '#f8f9fa' }}>
        <div style={{ maxWidth: 1380, margin: '0 auto', padding: '20px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, height: 500, borderRadius: 24, overflow: 'hidden' }}>
            <div style={{ background: `url(${mainImage}) center/cover no-repeat` }} />
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
              <div style={{ background: `url(${hostel.images?.[1] || mainImage}) center/cover no-repeat` }} />
              <div style={{ background: `url(${hostel.images?.[2] || mainImage}) center/cover no-repeat`, position: 'relative' }}>
                {hostel.images?.length > 3 && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 20 }}>
                    +{hostel.images.length - 3} Photos
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: 60 }}>
          
          {/* Left: Info */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 42, fontWeight: 900, margin: '0 0 12px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{hostel.hostelName}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#666' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconMapPin size={18} color={red} /> {hostel.town}, {hostel.city}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconStar size={18} color="#F59E0B" /> 4.8 (124 reviews)</div>
                </div>
              </div>
              <div style={{ background: '#fef2f2', padding: '12px 20px', borderRadius: 16, border: `1px solid ${red}22` }}>
                <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: red, textTransform: 'uppercase', marginBottom: 4 }}>Hostel For</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#2C2C2C' }}>{hostel.hostelType || 'Both'}</span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '32px 0' }} />

            {/* Description */}
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>About this hostel</h3>
              <p style={{ fontSize: 16, color: '#555', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {hostel.description || 'Welcome to one of the most comfortable hostels in the area. We provide verified accommodations with all basic amenities including high-speed internet, secure premises, and nutritious meals.'}
              </p>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: 48 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Facilities & Amenities</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 20 }}>
                {[
                  { icon: <IconWifi />, label: 'High Speed WiFi' },
                  { icon: <IconUtensils />, label: 'Nutritious Meals' },
                  { icon: <IconZap />, label: 'Power Backup' },
                  { icon: <IconWind />, label: 'Air Conditioning' },
                  { icon: <IconShield />, label: '24/7 Security' },
                  { icon: <IconCheck />, label: 'Laundry Service' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 12, background: '#f9f9f9' }}>
                    <div style={{ color: red }}>{item.icon}</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#444' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buildings & Rooms Breakdown */}
            <div style={{ marginBottom: 40 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Available Rooms</h3>
              
              {/* Building Tabs */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 32, borderBottom: '1px solid #eee' }}>
                {hostel.buildings.map((b: any, i: number) => (
                  <button 
                    key={b._id}
                    onClick={() => setActiveBuildingTab(i)}
                    style={{
                      padding: '12px 24px',
                      fontSize: 15,
                      fontWeight: 700,
                      background: 'none',
                      border: 'none',
                      borderBottom: activeBuildingTab === i ? `3px solid ${red}` : '3px solid transparent',
                      color: activeBuildingTab === i ? red : '#888',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {b.name}
                  </button>
                ))}
              </div>

              {/* Rooms in Active Building */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                {hostel.buildings[activeBuildingTab]?.images?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <h5 style={{ fontSize: 13, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', marginBottom: 16 }}>Building Photos</h5>
                    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                      {hostel.buildings[activeBuildingTab].images.map((img: string, idx: number) => (
                        <div key={idx} style={{ width: 240, height: 160, borderRadius: 16, background: `url(${img}) center/cover`, flexShrink: 0 }} />
                      ))}
                    </div>
                  </div>
                )}

                {hostel.buildings[activeBuildingTab]?.floors.map((f: any) => (
                  <div key={f._id}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.05em' }}>Floor {f.floorNumber}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {f.rooms.map((r: any) => (
                        <div 
                          key={r._id} 
                          style={{ 
                            padding: '24px', 
                            borderRadius: 20, 
                            border: '1px solid #eee', 
                            background: '#fff',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = red}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
                        >
                          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                            <div style={{ width: 100, height: 80, borderRadius: 12, background: r.images?.[0] ? `url(${r.images[0]}) center/cover` : '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {!r.images?.[0] && <IconBed size={24} color="#ccc" />}
                            </div>
                            <div>
                              <div style={{ fontSize: 18, fontWeight: 800, color: '#2C2C2C', marginBottom: 4 }}>Room {r.roomNumber}</div>
                              <div style={{ display: 'flex', gap: 12 }}>
                                <span style={{ fontSize: 13, color: '#888' }}>{r.roomType || 'Standard'}</span>
                                <span style={{ fontSize: 13, color: '#888' }}>•</span>
                                <span style={{ fontSize: 13, color: '#888' }}>{r.beds.length} Beds Total</span>
                                <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 700 }}>{r.beds.filter((b:any)=>!b.isOccupied).length} Available</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 22, fontWeight: 900, color: '#2C2C2C' }}>
                              {r.priceMonthly ? `Rs ${r.priceMonthly.toLocaleString()}` : 'Call for Price'}
                            </div>
                            <div style={{ fontSize: 12, color: '#888', fontWeight: 600 }}>per month</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sticky Booking */}
          <div style={{ position: 'sticky', top: 110, height: 'fit-content' }}>
            <div style={{ background: '#fff', borderRadius: 32, padding: 36, boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 28 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: '#2C2C2C' }}>
                  {hostel.startingPrice > 0 ? `Rs ${hostel.startingPrice.toLocaleString()}` : 'Call for Price'}
                </span>
                {hostel.startingPrice > 0 && (
                  <span style={{ fontSize: 16, color: '#888', fontWeight: 600, paddingBottom: 6 }}>/month onwards</span>
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: 10 }}>Check-in Date</label>
                <input type="date" style={{ width: '100%', padding: '16px', borderRadius: 14, border: '1.5px solid #eee', fontSize: 15, fontWeight: 600, outline: 'none' }} />
              </div>

              <button 
                style={{
                  width: '100%',
                  padding: '20px',
                  borderRadius: 16,
                  background: red,
                  color: 'white',
                  border: 'none',
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: `0 10px 30px ${red}44`,
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10
                }}
              >
                Book Your Bed <IconZap size={18} />
              </button>

              <div style={{ textAlign: 'center', fontSize: 13, color: '#888', fontWeight: 600 }}>
                No booking fees • 100% Secure
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '28px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconShield size={20} color={red} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>HostelIn Verified</div>
                    <div style={{ fontSize: 12, color: '#888' }}>Verified location & pricing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer tweaks={tweaks} />
    </main>
  );
}
