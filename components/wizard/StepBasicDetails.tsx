"use client";

import React, { useRef, useState } from 'react';
import { IconBuilding, IconCheck, IconUpload, IconX, IconEye, IconEyeOff } from '../icons';
import { WizardData } from './types';

interface Props {
  data: WizardData;
  setData: React.Dispatch<React.SetStateAction<WizardData>>;
  red: string;
}

// ========== CITY → TOWN/AREA MAPPING ==========
const CITY_AREAS: Record<string, string[]> = {
  Lahore: ['Gulberg', 'DHA', 'Johar Town', 'Model Town', 'Garden Town', 'Cavalry Ground', 'Allama Iqbal Town', 'Wapda Town', 'Cantt', 'Bahria Town', 'Township', 'Shadman', 'Faisal Town'],
  Karachi: ['DHA', 'Clifton', 'Gulshan-e-Iqbal', 'Gulistan-e-Johar', 'North Nazimabad', 'Saddar', 'PECHS', 'Korangi', 'Malir', 'Nazimabad', 'Bahadurabad', 'FB Area', 'Scheme 33'],
  Islamabad: ['F-6', 'F-7', 'F-8', 'F-10', 'F-11', 'G-8', 'G-9', 'G-10', 'G-11', 'G-13', 'H-8', 'I-8', 'I-10', 'Blue Area', 'Bahria Town'],
  Peshawar: ['University Town', 'Hayatabad', 'Saddar', 'Cantt', 'Board Bazaar', 'Gulbahar', 'Ring Road', 'Warsak Road', 'GT Road'],
  Faisalabad: ['Peoples Colony', 'Madina Town', 'Ghulam Muhammad Abad', 'Susan Road', 'Jinnah Colony', 'Canal Road', 'Satiana Road', 'Abdullahpur'],
  Quetta: ['Cantt', 'Satellite Town', 'Jinnah Town', 'Brewery Road', 'Zarghoon Road', 'Airport Road', 'Sariab Road', 'Joint Road'],
  Multan: ['Bosan Road', 'Shah Rukn-e-Alam Colony', 'Gulgasht Colony', 'Cantt', 'Bahauddin Zakariya', 'Sher Shah Road', 'Mumtazabad', 'Garden Town'],
  Rawalpindi: ['Satellite Town', 'Commercial Market', 'Saddar', 'Chaklala', 'Bahria Town', 'DHA', 'Adiala Road', 'Sixth Road', 'Cantt', 'Westridge'],
};
const CITIES = Object.keys(CITY_AREAS);

export default function StepBasicDetails({ data, setData, red }: Props) {
  const [showPW, setShowPW] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof WizardData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => 
    setData(d => ({ ...d, [key]: e.target.value }));

  const handleFile = (file: File | undefined | null) => {
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) return;
    setData(d => ({ ...d, registrationCertificate: file, registrationCertificateName: file.name }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="wizard-form-grid">
      {/* LEFT — Hostel Information */}
      <div className="wizard-card">
        <div className="wizard-card-header">
          <div className="wizard-card-icon" style={{ background: `${red}15`, color: red }}>
            <IconBuilding size={22} color={red} />
          </div>
          <div className="wizard-card-title">Hostel Information</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="wizard-form-group">
            <label className="wizard-label">Hostel Name *</label>
            <input
              className="wizard-input"
              placeholder="e.g. Al-Noor Boys Hostel"
              value={data.hostelName}
              onChange={set('hostelName')}
            />
          </div>
          
          <div className="wizard-form-group">
            <label className="wizard-label">Location</label>
            <div className="wizard-city-row">
              <input
                className="wizard-input disabled-field"
                value="Pakistan"
                disabled
              />
              <select
                className="wizard-select"
                value={data.city}
                onChange={(e) => setData(d => ({ ...d, city: e.target.value, town: '' }))}
              >
                <option value="">Select City</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          
          {data.city && (
            <div className="wizard-form-group animate-[fadeIn_0.3s_ease]">
              <label className="wizard-label">Town / Area</label>
              <select
                className="wizard-select"
                value={data.town}
                onChange={set('town')}
              >
                <option value="">Select Area</option>
                {(CITY_AREAS[data.city] || []).map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          )}
          
          <div className="wizard-form-group">
            <label className="wizard-label">Registration Number</label>
            <input
              className="wizard-input"
              placeholder="Business registration number"
              value={data.registrationNumber}
              onChange={set('registrationNumber')}
            />
          </div>
          
          <div className="wizard-form-group">
            <label className="wizard-label">Full Address</label>
            <input
              className="wizard-input"
              placeholder="Complete address with street"
              value={data.fullAddress}
              onChange={set('fullAddress')}
            />
          </div>

          <div className="wizard-form-group">
            <label className="wizard-label">Registration Certificate</label>
            {!data.registrationCertificate ? (
              <div
                className={`wizard-upload-zone${dragOver ? ' dragover' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="wizard-upload-zone-icon"><IconUpload size={28} /></div>
                <div className="wizard-upload-zone-text">Upload Registration Certificate</div>
                <div className="wizard-upload-zone-hint">(JPG, PNG, PDF)</div>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }}
                  onChange={(e) => handleFile(e.target.files?.[0])} />
              </div>
            ) : (
              <div className="wizard-upload-preview">
                <IconCheck size={16} color="#16a34a" />
                <span className="wizard-upload-preview-name">{data.registrationCertificateName}</span>
                <button
                  className="wizard-upload-preview-remove"
                  onClick={() => setData(d => ({ ...d, registrationCertificate: null, registrationCertificateName: '' }))}
                >
                  <IconX size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT — Admin Details */}
      <div className="wizard-card">
        <div className="wizard-card-header">
          <div className="wizard-card-icon" style={{ background: '#6366f115', color: '#6366f1' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="wizard-card-title">Admin Details</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="wizard-form-group">
            <label className="wizard-label">Admin Full Name *</label>
            <input
              className="wizard-input"
              placeholder="Your full name"
              value={data.adminFullName}
              onChange={set('adminFullName')}
            />
          </div>
          
          <div className="wizard-form-group">
            <label className="wizard-label">Phone Number</label>
            <div className="wizard-phone-group">
              <div className="wizard-phone-prefix">
                <span className="flag">🇵🇰</span>
                +92
              </div>
              <input
                className="wizard-input"
                type="tel"
                placeholder="3XX XXXXXXX"
                value={data.adminPhone}
                onChange={set('adminPhone')}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          
          <div className="wizard-form-group">
            <label className="wizard-label">Admin Email *</label>
            <input
              className="wizard-input"
              type="email"
              placeholder="admin@example.com"
              value={data.adminEmail}
              onChange={set('adminEmail')}
            />
          </div>
          
          <div className="wizard-form-group">
            <label className="wizard-label">Password *</label>
            <div className="wizard-password-wrap">
              <input
                className="wizard-input"
                type={showPW ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={data.adminPassword}
                onChange={set('adminPassword')}
                style={{ paddingRight: 44 }}
              />
              <button
                className="wizard-password-toggle"
                onClick={() => setShowPW(!showPW)}
                type="button"
              >
                {showPW ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


