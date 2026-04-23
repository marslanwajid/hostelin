"use client";

import React from "react";

interface LiveTickerProps {
  red: string;
}

export default function LiveTicker({ red }: LiveTickerProps) {
  const messages = [
    { icon: "🔴", text: "247 people searching right now" },
    { icon: "✅", text: "Usman just booked in Lahore · 2 min ago" },
    { icon: "🏠", text: "12 new hostels added this week" },
    { icon: "⭐", text: "Ayesha found a hostel in Islamabad · 5 min ago" },
    { icon: "💰", text: "Avg. price Rs 8,800/mo across Pakistan" },
    { icon: "✅", text: "Bilal confirmed booking in Karachi · 8 min ago" },
  ];

  const [idx, setIdx] = React.useState(0);
  const [fade, setFade] = React.useState(true);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 350);
    }, 3200);
    return () => clearInterval(timer);
  }, [messages.length]);

  const msg = messages[idx];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(255,255,255,0.10)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 100,
        padding: "8px 20px",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: red,
            display: "inline-block",
            animation: "livePulse 1.4s infinite",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: red,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          LIVE
        </span>
      </span>
      <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.25)" }} />
      <span
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          fontSize: 13,
          color: "rgba(255,255,255,0.85)",
          opacity: fade ? 1 : 0,
          transition: "opacity 0.35s ease",
          minWidth: 280,
          display: "inline-block",
        }}
      >
        {msg.icon} {msg.text}
      </span>
      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
      `}</style>
    </div>
  );
}
