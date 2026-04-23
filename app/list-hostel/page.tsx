"use client";

import React, { useState, useEffect } from 'react';
import ListHostelWizard from '@/components/wizard/ListHostelWizard';
import { TWEAK_DEFAULTS } from '@/lib/constants';
import { Tweaks } from '@/lib/types';

export default function ListHostelPage() {
  const [tweaks, setTweaks] = useState<Tweaks>(TWEAK_DEFAULTS);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem('hostelIn_tweaks');
      if (stored) {
        setTweaks({ ...TWEAK_DEFAULTS, ...JSON.parse(stored) });
      }
    } catch {
      setTweaks(TWEAK_DEFAULTS);
    }
  }, []);

  if (!isClient) {
    return <div className="min-h-screen bg-[#f8f9fa]" />;
  }

  return <ListHostelWizard tweaks={tweaks} />;
}
