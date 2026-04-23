"use client";

import React, { useState, useEffect } from 'react';
import { IconDollar, IconLayers } from '../icons';
import { WizardData } from './types';

interface Props {
  data: WizardData;
  setData: React.Dispatch<React.SetStateAction<WizardData>>;
  red: string;
}

export default function StepPricing({ data, setData, red }: Props) {
  const [activeBuilding, setActiveBuilding] = useState<string>(data.buildings[0]?.id || '');
  const [bulkType, setBulkType] = useState<string>('monthly');
  const [bulkPrice, setBulkPrice] = useState<string>('');
  const [bulkFloor, setBulkFloor] = useState<string>('all');

  useEffect(() => {
    const existingRoomIds = new Set(data.pricing.map(p => p.roomId));
    const missing = data.rooms.filter(r => !existingRoomIds.has(r.id));
    if (missing.length > 0) {
      setData(d => ({
        ...d,
        pricing: [
          ...d.pricing,
          ...missing.map(r => ({
            roomId: r.id, daily: false, weekly: false, monthly: true,
            dailyPrice: '', weeklyPrice: '', monthlyPrice: '',
          })),
        ],
      }));
    }
  }, [data.rooms, data.pricing, setData]);

  const updatePricing = (roomId: string, key: string, val: string | number | boolean) => {
    setData(d => ({
      ...d,
      pricing: d.pricing.map(p => p.roomId === roomId ? { ...p, [key]: val } : p),
    }));
  };

  const building = data.buildings.find(b => b.id === activeBuilding);
  const floors = building ? Array.from({ length: building.floors || 1 }, (_, i) => i + 1) : [];

  const handleBulkApply = () => {
    if (!bulkPrice) return;
    const price = parseInt(bulkPrice) || 0;
    setData(d => ({
      ...d,
      pricing: d.pricing.map(p => {
        const room = d.rooms.find(r => r.id === p.roomId);
        if (!room || room.buildingId !== activeBuilding) return p;
        if (bulkFloor !== 'all' && room.floor !== parseInt(bulkFloor)) return p;
        return {
          ...p,
          [bulkType]: true,
          [`${bulkType}Price`]: price,
        };
      }),
    }));
    setBulkPrice('');
  };

  const typeColors: Record<string, { color: string; bg: string; border: string; activeBg: string }> = {
    daily: { color: '#1e40af', bg: '#dbeafe', border: '#93c5fd', activeBg: '#eff6ff' },
    weekly: { color: '#92400e', bg: '#fef3c7', border: '#fcd34d', activeBg: '#fffbeb' },
    monthly: { color: '#065f46', bg: '#d1fae5', border: '#6ee7b7', activeBg: '#ecfdf5' },
  };

  return (
    <div className="wizard-card">
      <div className="wizard-card-header">
        <div className="wizard-card-icon" style={{ background: '#10b98115', color: '#10b981' }}>
          <IconDollar size={22} color="#10b981" />
        </div>
        <div className="wizard-card-title">Pricing & Availability</div>
      </div>

      <p style={{ fontSize: 14, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>
        Set availability type and pricing for each room. A room can be available on multiple bases (e.g., both daily and monthly with different prices).
      </p>

      {data.buildings.length > 1 && (
        <div className="room-building-tabs">
          {data.buildings.map(b => (
            <button
              key={b.id}
              className={`room-building-tab${activeBuilding === b.id ? ' active' : ''}`}
              onClick={() => setActiveBuilding(b.id)}
              style={activeBuilding === b.id ? { background: red, borderColor: red } : {}}
            >
              {b.name || 'Unnamed Building'}
            </button>
          ))}
        </div>
      )}

      <div className="room-quick-toolbar" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
        <span className="room-quick-title" style={{ color: '#1e40af' }}>⚡ Bulk Set:</span>
        <div className="room-quick-fields">
          <span>Set all</span>
          {floors.length > 1 && (
            <select className="wizard-select" value={bulkFloor} onChange={e => setBulkFloor(e.target.value)} style={{ width: 130 }}>
              <option value="all">All Floors</option>
              {floors.map(f => <option key={f} value={String(f)}>Floor {f}</option>)}
            </select>
          )}
          <span>to</span>
          <select className="wizard-select" value={bulkType} onChange={e => setBulkType(e.target.value)} style={{ width: 120 }}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <span>@ Rs</span>
          <input className="wizard-input" type="number" min={0} value={bulkPrice} onChange={e => setBulkPrice(e.target.value)} placeholder="Price" style={{ width: 100 }} />
        </div>
        <button onClick={handleBulkApply} className="wizard-btn" style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 20px' }}>Apply</button>
      </div>

      {floors.map(floor => {
        const floorRooms = data.rooms.filter(r => r.buildingId === activeBuilding && r.floor === floor);
        if (floorRooms.length === 0) return null;
        return (
          <div key={floor} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#666', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconLayers size={14} color={red} /> Floor {floor}
            </div>
            {floorRooms.map(room => {
              const p = data.pricing.find(pr => pr.roomId === room.id) || {} as any;
              return (
                <div key={room.id} className="pricing-room-row">
                  <div className="pricing-room-info">
                    <div className="pricing-room-name">Room {room.roomNumber}</div>
                    <div className="pricing-room-beds">{room.beds} bed{room.beds !== 1 ? 's' : ''}</div>
                  </div>
                  
                  <div className="pricing-room-types">
                    {['daily', 'weekly', 'monthly'].map(type => {
                      const tc = typeColors[type];
                      const active = !!p[type];
                      return (
                        <div
                          key={type}
                          className={`pricing-type-box${active ? ' active' : ''}`}
                          style={active ? { borderColor: tc.border, background: tc.activeBg } : {}}
                        >
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={(e) => updatePricing(room.id, type, e.target.checked)}
                              style={{ accentColor: tc.color }}
                            />
                            <span className="pricing-type-tag" style={{ background: tc.bg, color: tc.color }}>{type}</span>
                          </label>
                          {active && (
                            <div className="pricing-type-input-wrap">
                              <span style={{ fontSize: 12, fontWeight: 700, color: tc.color }}>Rs</span>
                              <input
                                className="pricing-type-input"
                                type="number" min={0} placeholder="0"
                                value={p[`${type}Price`] || ''}
                                onChange={(e) => updatePricing(room.id, `${type}Price`, e.target.value)}
                                style={{ borderBottomColor: tc.border }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {data.rooms.filter(r => r.buildingId === activeBuilding).length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#ccc', fontSize: 14 }}>
          No rooms in this building. Go back and add rooms first.
        </div>
      )}
    </div>
  );
}


