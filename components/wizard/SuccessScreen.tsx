"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { IconCheck, IconHome, IconPlus } from '../icons';
import { WizardData } from './types';

interface Props {
  data: WizardData;
  red: string;
  onReset: () => void;
}

export default function SuccessScreen({ data, red, onReset }: Props) {
  const router = useRouter();
  const totalRooms = data.rooms.length;
  const totalBeds = data.rooms.reduce((s, r) => s + (r.beds || 0), 0);

  return (
    <div className="wizard-card">
      <div className="wizard-success-wrap">
        <div className="wizard-success-icon">
          <IconCheck size={36} color="#16a34a" />
        </div>
        <div className="wizard-success-title">Hostel Listed Successfully!</div>
        <p className="wizard-success-text">
          Your hostel <strong>"{data.hostelName}"</strong> has been saved with {data.buildings.length} building{data.buildings.length !== 1 ? 's' : ''}, {totalRooms} room{totalRooms !== 1 ? 's' : ''}, and {totalBeds} bed{totalBeds !== 1 ? 's' : ''}.
        </p>
        <div className="wizard-success-btns">
          <button className="wizard-btn wizard-btn-outline" onClick={() => router.push('/')}>
            <IconHome size={16} /> Go Home
          </button>
          <button className="wizard-btn" style={{ background: red, color: 'white', border: 'none' }} onClick={onReset}>
            <IconPlus size={16} /> List Another
          </button>
        </div>
      </div>
    </div>
  );
}


