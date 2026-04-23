"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Cities from '@/components/home/Cities';
import Listings from '@/components/home/Listings';
import HowItWorks from '@/components/home/HowItWorks';
import StatsSection from '@/components/home/StatsSection';
import Testimonials from '@/components/home/Testimonials';
import OwnerCTA from '@/components/home/OwnerCTA';
import { TWEAK_DEFAULTS } from '@/lib/constants';
import { Tweaks } from '@/lib/types';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Set tweaks dynamically from outer scripts (if they exist)
  useEffect(() => {
    (window as any).__setTweaks = (update: Partial<Tweaks>) => {
      setTweaks((prev) => {
        const next = { ...prev, ...update };
        localStorage.setItem('hostelIn_tweaks', JSON.stringify(next));
        return next;
      });
    };
  }, []);

  if (!isClient) {
    // Return an unstyled placeholder or null to avoid hydration mismatch
    // But since the design requires a specific background, we can just return a div with the same background.
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Navbar scrolled={scrolled} tweaks={tweaks} />
      <Hero tweaks={tweaks} />
      <Cities tweaks={tweaks} />
      <Listings tweaks={tweaks} />
      <HowItWorks tweaks={tweaks} />
      <StatsSection tweaks={tweaks} />
      <Testimonials tweaks={tweaks} />
      <OwnerCTA tweaks={tweaks} />
      <Footer tweaks={tweaks} />
    </main>
  );
}
