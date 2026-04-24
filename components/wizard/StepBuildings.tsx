"use client";

import React from 'react';
import { IconBuilding, IconHome, IconPlus, IconTrash, IconLayers } from '../icons';
import { WizardData } from './types';

interface Props {
  data: WizardData;
  setData: React.Dispatch<React.SetStateAction<WizardData>>;
  red: string;
}

let _idCounter = 0;
const uid = (prefix = 'id') => `${prefix}_${Date.now()}_${++_idCounter}`;

export default function StepBuildings({ data, setData, red }: Props) {
  const updateBuilding = (id: string, key: string, val: string | number) => {
    setData(d => ({
      ...d,
      buildings: d.buildings.map(b => b.id === id ? { ...b, [key]: val } : b),
    }));
  };

  const addBuilding = () => {
    setData(d => ({
      ...d,
      buildings: [...d.buildings, { id: uid('b'), name: '', floors: 1, gender: 'Both' }],
    }));
  };

  const removeBuilding = (id: string) => {
    setData(d => ({
      ...d,
      buildings: d.buildings.filter(b => b.id !== id),
      rooms: d.rooms.filter(r => r.buildingId !== id),
    }));
  };

  const totalBuildings = data.buildings.length;
  const totalFloors = data.buildings.reduce((s, b) => s + (parseInt(b.floors as any) || 0), 0);

  return (
    <div className="wizard-card">
      <div className="wizard-card-header">
        <div className="wizard-card-icon" style={{ background: `${red}15`, color: red }}>
          <IconBuilding size={22} color={red} />
        </div>
        <div className="wizard-card-title">Buildings & Floors</div>
      </div>

      <p style={{ fontSize: 14, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>
        Add each building in your hostel. For each building, specify the type, number of floors, and whether it's for males, females, or both.
      </p>

      {data.buildings.map((b, i) => (
        <div key={b.id} className="building-card">
          <div className="building-card-icon" style={{ background: `${red}10` }}>
            <IconHome size={24} color={red} />
          </div>
          <div className="building-card-fields">
            <input
              className="wizard-input"
              placeholder={`Building ${i + 1} Name`}
              value={b.name}
              onChange={(e) => updateBuilding(b.id, 'name', e.target.value)}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#888', whiteSpace: 'nowrap' }}>Floors:</label>
              <input
                className="wizard-input"
                type="number"
                min="1" max="30"
                value={b.floors}
                onChange={(e) => updateBuilding(b.id, 'floors', Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                style={{ width: 80, textAlign: 'center' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1.5px solid #e5e7eb' }}>
              {[{ value: 'Male', label: '♂ Male', color: '#3b82f6' }, { value: 'Female', label: '♀ Female', color: '#ec4899' }, { value: 'Both', label: '⚥ Both', color: '#8b5cf6' }].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => updateBuilding(b.id, 'gender', opt.value)}
                  style={{
                    flex: 1, padding: '8px 4px', border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: 700,
                    background: b.gender === opt.value ? opt.color : 'white',
                    color: b.gender === opt.value ? 'white' : '#888',
                    transition: 'all 0.2s',
                  }}
                >{opt.label}</button>
              ))}
            </div>
          </div>
          {data.buildings.length > 1 && (
            <button className="building-card-delete" onClick={() => removeBuilding(b.id)} title="Remove building">
              <IconTrash size={18} />
            </button>
          )}
        </div>
      ))}

      <button onClick={addBuilding} className="room-add-btn" style={{ marginTop: 16 }}>
        <IconPlus size={14} /> Add Another Building
      </button>

      {totalBuildings > 0 && (
        <div className="building-summary">
          <div className="building-summary-item">
            <IconBuilding size={16} color="#888" />
            <span className="building-summary-value">{totalBuildings}</span> Building{totalBuildings !== 1 ? 's' : ''}
          </div>
          <div className="building-summary-item">
            <IconLayers size={16} color="#888" />
            <span className="building-summary-value">{totalFloors}</span> Total Floor{totalFloors !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}


