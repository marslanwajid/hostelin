"use client";

import React from "react";
import { IconBuilding, IconBed, IconUsers, IconDollar } from "@/components/icons";

export default function AdminOverview() {
  // Mock data for the dashboard overview
  const stats = [
    { label: "Total Buildings", value: "2", icon: <IconBuilding size={24} />, color: "#3b82f6", bg: "#eff6ff" },
    { label: "Total Rooms", value: "24", icon: <IconHome size={24} />, color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Total Beds", value: "72", icon: <IconBed size={24} />, color: "#f59e0b", bg: "#fffbeb" },
    { label: "Occupancy Rate", value: "85%", icon: <IconUsers size={24} />, color: "#10b981", bg: "#ecfdf5" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 800, fontSize: 24, color: "#2C2C2C", marginBottom: 8 }}>
          Welcome back, Admin!
        </h1>
        <p style={{ color: "#666", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 15 }}>
          Here is what's happening with your hostels today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 40 }}>
        {stats.map((stat, i) => (
          <div
            key={i}
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
              border: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.03)";
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: "14px", backgroundColor: stat.bg, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ color: "#888", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#2C2C2C", fontFamily: "var(--font-plus-jakarta), sans-serif", lineHeight: 1 }}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity (Mock) */}
      <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.03)", border: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 700, fontSize: 18, color: "#2C2C2C" }}>Recent Activity</h2>
          <button style={{ background: "none", border: "none", color: "var(--wizard-red, #C0392B)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>View All</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { msg: "New booking request for Room 101, Building A", time: "2 hours ago", icon: <IconUsers size={16} />, color: "#3b82f6" },
            { msg: "Payment received for Bed 3, Room 204", time: "5 hours ago", icon: <IconDollar size={16} />, color: "#10b981" },
            { msg: "Room 302 marked as occupied", time: "Yesterday", icon: <IconBed size={16} />, color: "#f59e0b" },
            { msg: "Building B profile images updated", time: "Yesterday", icon: <IconBuilding size={16} />, color: "#8b5cf6" },
          ].map((activity, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, paddingBottom: i !== 3 ? 16 : 0, borderBottom: i !== 3 ? "1px solid #f5f5f5" : "none" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: `${activity.color}15`, color: activity.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {activity.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#2C2C2C", marginBottom: 4 }}>{activity.msg}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Need to define IconHome locally as it wasn't imported from icons if it doesn't exist, wait, IconHome was in icons!
function IconHome(props: any) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
