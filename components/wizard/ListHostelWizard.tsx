"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconCheck, IconChevronLeft, IconChevronRight } from '../icons';
import { WizardData } from './types';
import StepBasicDetails from './StepBasicDetails';
import StepBuildings from './StepBuildings';
import StepRooms from './StepRooms';
import StepPricing from './StepPricing';
import StepImages from './StepImages';
import SuccessScreen from './SuccessScreen';
import { Tweaks } from '@/lib/types';
import './wizard.css';

interface Props {
  tweaks?: Tweaks;
}

const getInitialData = (): WizardData => ({
  hostelName: '', city: '', town: '', registrationNumber: '', fullAddress: '',
  registrationCertificate: null, registrationCertificateName: '',
  adminFullName: '', adminPhone: '', adminEmail: '', adminPassword: '',
  buildings: [{ id: 'b_' + Date.now(), name: '', floors: 1, gender: 'both' }],
  rooms: [],
  pricing: [],
  hostelImages: [],
  roomImages: {},
});

const STEPS = [
  { label: 'Basic Details', icon: '📋' },
  { label: 'Buildings', icon: '🏢' },
  { label: 'Rooms', icon: '🛏️' },
  { label: 'Pricing', icon: '💰' },
  { label: 'Images', icon: '📸' },
];

let _idCounter = 0;
const uid = (prefix = 'id') => `${prefix}_${Date.now()}_${++_idCounter}`;

export default function ListHostelWizard({ tweaks }: Props) {
  const red = tweaks?.primaryColor || '#C0392B';
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(getInitialData);
  const [submitted, setSubmitted] = useState(false);
  const [shakeNext, setShakeNext] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const r = parseInt(red.slice(1, 3), 16);
    const g = parseInt(red.slice(3, 5), 16);
    const b = parseInt(red.slice(5, 7), 16);
    document.documentElement.style.setProperty('--wizard-red', red);
    document.documentElement.style.setProperty('--wizard-red-rgb', `${r}, ${g}, ${b}`);
  }, [red]);

  useEffect(() => {
    try {
      const draftStr = localStorage.getItem('hostelIn_draft');
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        if (draft && draft.hostelName) {
          setData(d => ({ ...d, ...draft }));
          if (draft.step) setStep(draft.step);
        }
      }
    } catch {}
  }, []);

  if (!isClient) {
    return <div className="min-h-screen bg-[#f8f9fa]" />;
  }

  const canProceed = (s: number) => {
    switch (s) {
      case 1: return !!(data.hostelName.trim() && data.city && data.adminFullName.trim() && data.adminEmail.trim() && data.adminPassword.trim());
      case 2: return data.buildings.length > 0 && data.buildings.every(b => b.name.trim());
      case 3: return data.rooms.length > 0;
      case 4: return data.pricing.some(p => p.daily || p.weekly || p.monthly);
      case 5: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (!canProceed(step)) {
      setShakeNext(true);
      setTimeout(() => setShakeNext(false), 500);
      return;
    }
    if (step < 5) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('hostelIn_listings') || '[]');
      const serializableData = {
        ...data,
        registrationCertificate: data.registrationCertificateName,
        hostelImages: data.hostelImages.map(i => ({ ...i, file: undefined, preview: i.preview })),
        roomImages: Object.fromEntries(
          Object.entries(data.roomImages).map(([k, v]) => [k, v.map(i => ({ ...i, file: undefined, preview: i.preview }))])
        ),
        createdAt: new Date().toISOString(),
        id: uid('hostel'),
      };
      existing.push(serializableData);
      localStorage.setItem('hostelIn_listings', JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save listing:', e);
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem('hostelIn_draft', JSON.stringify({
        ...data,
        registrationCertificate: null,
        hostelImages: [],
        roomImages: {},
        step,
      }));
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  };

  const handleReset = () => {
    setData(getInitialData());
    setStep(1);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="wizard-page">
        <div className="wizard-topbar">
          <div className="wizard-topbar-left">
            <img src="/uploads/logo.webp" alt="HostelIn" className="wizard-topbar-logo" onClick={() => router.push('/')} />
            <div className="wizard-topbar-title">List Your Hostel</div>
          </div>
        </div>
        <div className="wizard-content">
          <SuccessScreen data={data} red={red} onReset={handleReset} />
        </div>
      </div>
    );
  }

  const progressPercent = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="wizard-page">
      <div className="wizard-topbar">
        <div className="wizard-topbar-left">
          <img src="/uploads/logo.webp" alt="HostelIn" className="wizard-topbar-logo" onClick={() => router.push('/')} />
          <div className="wizard-topbar-title">List Your Hostel</div>
        </div>
        <button className="wizard-topbar-draft" onClick={handleSaveDraft}>Save Draft</button>
      </div>

      <div className="wizard-progress">
        <div className="wizard-progress-bar">
          <div className="wizard-progress-line">
            <div 
              className="wizard-progress-line-fill" 
              style={{ width: `${progressPercent}%`, background: red }} 
            />
          </div>
          {STEPS.map((s, i) => {
            const sNum = i + 1;
            const isActive = sNum === step;
            const isCompleted = sNum < step;
            return (
              <div 
                key={i} 
                className="wizard-step-indicator" 
                onClick={() => { if (sNum <= step) setStep(sNum); }}
              >
                <div className={`wizard-step-circle${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}>
                  {isCompleted ? <IconCheck size={18} /> : sNum}
                </div>
                <div className={`wizard-step-label${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="wizard-content">
        <div className="wizard-step-container">
          {step === 1 && <StepBasicDetails data={data} setData={setData} red={red} />}
          {step === 2 && <StepBuildings data={data} setData={setData} red={red} />}
          {step === 3 && <StepRooms data={data} setData={setData} red={red} />}
          {step === 4 && <StepPricing data={data} setData={setData} red={red} />}
          {step === 5 && <StepImages data={data} setData={setData} red={red} />}
          
          <div className="wizard-inline-nav">
            <div className="wizard-footer-left">
              {step > 1 && (
                <button className="wizard-btn wizard-btn-back" onClick={handleBack}>
                  <IconChevronLeft size={18} /> Back
                </button>
              )}
              {step === 1 && (
                <button className="wizard-btn wizard-btn-back" onClick={() => router.push('/')}>
                  Cancel
                </button>
              )}
            </div>
            <div className="wizard-footer-right">
              {step < 5 ? (
                <button 
                  className="wizard-btn wizard-btn-next" 
                  style={{ background: red }}
                  onClick={handleNext}
                >
                  Next Step <IconChevronRight size={18} />
                </button>
              ) : (
                <button className="wizard-btn wizard-btn-submit" onClick={handleSubmit}>
                  <IconCheck size={18} /> Submit Listing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wizard-btn-next:active { transform: scale(0.98); }
        ${shakeNext ? `
          .wizard-btn-next { animation: wizardShake 0.4s ease; }
          @keyframes wizardShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
          }
        ` : ''}
      `}</style>
    </div>
  );
}


