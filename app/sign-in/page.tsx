"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconLock, IconMail, IconEye, IconEyeOff } from '@/components/icons';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const red = "#C0392B";
    const r = parseInt(red.slice(1, 3), 16);
    const g = parseInt(red.slice(3, 5), 16);
    const b = parseInt(red.slice(5, 7), 16);
    document.documentElement.style.setProperty('--wizard-red', red);
    document.documentElement.style.setProperty('--wizard-red-rgb', `${r}, ${g}, ${b}`);
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      try {
        // Read all saved hostel listings
        const listingsRaw = localStorage.getItem('hostelIn_listings');
        const listings = listingsRaw ? JSON.parse(listingsRaw) : [];

        // Find a listing whose adminEmail and adminPassword match
        const matched = listings.find(
          (l: { adminEmail: string; adminPassword: string }) =>
            l.adminEmail.toLowerCase() === email.toLowerCase() && l.adminPassword === password
        );

        if (matched) {
          // Successful login — set auth and active hostel
          localStorage.setItem('hostelIn_auth', 'true');
          localStorage.setItem('hostelIn_activeHostel', matched.id);
          // Clear any stale persisted admin data so fresh transform happens
          localStorage.removeItem('hostelIn_adminData');
          router.push('/admin');
        } else if (listings.length === 0) {
          setError('No hostel listings found. Please list your hostel first.');
          setLoading(false);
        } else {
          setError('Invalid email or password. Please try again.');
          setLoading(false);
        }
      } catch {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="wizard-page" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="wizard-topbar">
        <div className="wizard-topbar-left">
          <img 
            src="/uploads/logo.webp" 
            alt="HostelIn" 
            className="wizard-topbar-logo" 
            onClick={() => router.push('/')} 
          />
          <div className="wizard-topbar-title">Hostel Admin Portal</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div className="wizard-card" style={{ maxWidth: 420, width: '100%', margin: 0 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ 
              fontFamily: 'var(--font-plus-jakarta), sans-serif', 
              fontWeight: 800, 
              fontSize: 28, 
              color: '#2C2C2C',
              marginBottom: 8
            }}>Welcome Back</h2>
            <p style={{ 
              fontFamily: 'var(--font-dm-sans), sans-serif', 
              color: '#666', 
              fontSize: 15 
            }}>Sign in with the credentials you used when listing your hostel</p>
          </div>

          <form onSubmit={handleSignIn}>
            <div className="wizard-form-group" style={{ marginBottom: 20 }}>
              <label className="wizard-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>
                  <IconMail size={18} />
                </div>
                <input 
                  type="email" 
                  className="wizard-input" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: 44 }}
                  required
                />
              </div>
            </div>

            <div className="wizard-form-group" style={{ marginBottom: 24 }}>
              <label className="wizard-label">Password</label>
              <div className="wizard-password-wrap">
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#999', zIndex: 1 }}>
                  <IconLock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="wizard-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: 44 }}
                  required
                />
                <button 
                  type="button"
                  className="wizard-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ 
                background: '#fef2f2', 
                color: '#ef4444', 
                padding: '12px', 
                borderRadius: 8, 
                fontSize: 13, 
                fontWeight: 600, 
                marginBottom: 20,
                textAlign: 'center',
                border: '1px solid #fee2e2'
              }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="wizard-btn wizard-btn-next" 
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', height: 48 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span style={{ 
                    width: 18, 
                    height: 18, 
                    border: '2px solid rgba(255,255,255,0.3)', 
                    borderTopColor: '#fff', 
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Signing In...
                </span>
              ) : "Sign In to Dashboard"}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <p style={{ 
              fontSize: 14, 
              color: '#888', 
              fontFamily: 'var(--font-dm-sans), sans-serif' 
            }}>
              Don&apos;t have a listing yet?{' '}
              <span 
                onClick={() => router.push('/list-hostel')}
                style={{ color: 'var(--wizard-red)', fontWeight: 700, cursor: 'pointer' }}
              >
                List Your Hostel
              </span>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
