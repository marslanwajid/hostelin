"use client";

import React, { useState, useEffect } from 'react';
import { IconBed, IconLayers, IconPlus, IconTrash } from '../icons';
import { WizardData, Room } from './types';

interface Props {
  data: WizardData;
  setData: React.Dispatch<React.SetStateAction<WizardData>>;
  red: string;
}

let _idCounter = 0;
const uid = (prefix = 'id') => `${prefix}_${Date.now()}_${++_idCounter}`;

export default function StepRooms({ data, setData, red }: Props) {
  const [activeBuilding, setActiveBuilding] = useState<string>(data.buildings[0]?.id || '');
  const [quickCount, setQuickCount] = useState<number>(5);
  const [quickStart, setQuickStart] = useState<number>(101);
  const [quickBeds, setQuickBeds] = useState<number>(4);
  const [quickFloor, setQuickFloor] = useState<number>(1);

  useEffect(() => {
    if (!data.buildings.find(b => b.id === activeBuilding)) {
      setActiveBuilding(data.buildings[0]?.id || '');
    }
  }, [data.buildings, activeBuilding]);

  const building = data.buildings.find(b => b.id === activeBuilding);
  const floors = building ? Array.from({ length: building.floors || 1 }, (_, i) => i + 1) : [];

  const addRoom = (floor: number) => {
    const floorRooms = data.rooms.filter(r => r.buildingId === activeBuilding && r.floor === floor);
    const lastNum = floorRooms.length > 0
      ? parseInt(floorRooms[floorRooms.length - 1].roomNumber) || (floor * 100 + floorRooms.length)
      : floor * 100;
    setData(d => ({
      ...d,
      rooms: [...d.rooms, { id: uid('r'), buildingId: activeBuilding, floor, roomNumber: String(lastNum + 1), beds: 2 }],
    }));
  };

  const updateRoom = (roomId: string, key: string, val: string | number) => {
    setData(d => ({
      ...d,
      rooms: d.rooms.map(r => r.id === roomId ? { ...r, [key]: val } : r),
    }));
  };

  const removeRoom = (roomId: string) => {
    setData(d => ({
      ...d,
      rooms: d.rooms.filter(r => r.id !== roomId),
    }));
  };

  const handleQuickAdd = () => {
    if (!activeBuilding) return;
    const newRooms: Room[] = [];
    for (let i = 0; i < quickCount; i++) {
      newRooms.push({
        id: uid('r'),
        buildingId: activeBuilding,
        floor: quickFloor,
        roomNumber: String(quickStart + i),
        beds: quickBeds,
      });
    }
    setData(d => ({
      ...d,
      rooms: [...d.rooms, ...newRooms],
    }));
  };

  const totalRooms = data.rooms.filter(r => r.buildingId === activeBuilding).length;
  const totalBeds = data.rooms.filter(r => r.buildingId === activeBuilding).reduce((s, r) => s + (r.beds || 0), 0);

  return (
    <div className="wizard-card">
      <div className="wizard-card-header">
        <div className="wizard-card-icon" style={{ background: `${red}15`, color: red }}>
          <IconBed size={22} color={red} />
        </div>
        <div className="wizard-card-title">Rooms & Beds</div>
        {totalRooms > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: red, background: `${red}12`, padding: '4px 12px', borderRadius: 20 }}>
              {totalRooms} Room{totalRooms !== 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', background: '#6366f112', padding: '4px 12px', borderRadius: 20 }}>
              {totalBeds} Bed{totalBeds !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

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

      <div className="room-quick-toolbar">
        <span className="room-quick-title">⚡ Quick Add:</span>
        <div className="room-quick-fields">
          <input className="wizard-input" type="number" min={1} max={50} value={quickCount} onChange={e => setQuickCount(Math.max(1, parseInt(e.target.value) || 1))} style={{ width: 60 }} />
          <span>rooms from</span>
          <input className="wizard-input" type="number" min={1} value={quickStart} onChange={e => setQuickStart(parseInt(e.target.value) || 1)} style={{ width: 80 }} />
          <span>with</span>
          <input className="wizard-input" type="number" min={1} max={20} value={quickBeds} onChange={e => setQuickBeds(Math.max(1, parseInt(e.target.value) || 1))} style={{ width: 60 }} />
          <span>beds on</span>
          <select className="wizard-select" value={quickFloor} onChange={e => setQuickFloor(parseInt(e.target.value))} style={{ width: 120 }}>
            {floors.map(f => <option key={f} value={f}>Floor {f}</option>)}
          </select>
        </div>
        <button onClick={handleQuickAdd} className="wizard-btn" style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '8px 20px' }}>Add</button>
      </div>

      {floors.map(floor => {
        const floorRooms = data.rooms.filter(r => r.buildingId === activeBuilding && r.floor === floor);
        return (
          <div key={floor} className="floor-section">
            <div className="floor-header">
              <div className="floor-title">
                <IconLayers size={16} color={red} />
                Floor {floor}
                <span className={`floor-count${floorRooms.length > 0 ? ' has-rooms' : ''}`} style={floorRooms.length > 0 ? { background: red } : {}}>
                  {floorRooms.length}
                </span>
              </div>
              <button className="room-add-btn" onClick={() => addRoom(floor)}>
                <IconPlus size={12} /> Add Room
              </button>
            </div>
            
            <table className="room-table">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th>Room Number</th>
                  <th style={{ width: 140 }}>Beds</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {floorRooms.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: 30, color: '#ccc', fontSize: 13 }}>
                      No rooms added yet — click "Add Room" or use Quick Add above
                    </td>
                  </tr>
                ) : (
                  floorRooms.map((room, i) => (
                    <tr key={room.id}>
                      <td style={{ color: '#bbb' }}>{i + 1}</td>
                      <td>
                        <input
                          className="wizard-input-inline"
                          value={room.roomNumber}
                          onChange={e => updateRoom(room.id, 'roomNumber', e.target.value)}
                          placeholder="Room #"
                        />
                      </td>
                      <td>
                        <input
                          className="wizard-input-inline"
                          type="number" min={1} max={50}
                          value={room.beds}
                          onChange={e => updateRoom(room.id, 'beds', Math.max(1, parseInt(e.target.value) || 1))}
                          style={{ textAlign: 'center' }}
                        />
                      </td>
                      <td>
                        <button className="room-delete-btn" onClick={() => removeRoom(room.id)}>
                          <IconTrash size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}


