"use client";

import React from "react";
import { IconBuilding, IconBed, IconUsers, IconHome, IconLayers, IconHash } from "@/components/icons";
import { useAdminData, countRooms, countBeds, countOccupied } from "./AdminDataContext";

export default function AdminOverview() {
  const { buildings, meta } = useAdminData();

  const totalFloors = buildings.reduce((s, b) => s + b.floors.length, 0);
  const totalRooms = buildings.reduce((s, b) => s + countRooms(b), 0);
  const totalBeds = buildings.reduce((s, b) => s + countBeds(b), 0);
  const totalOccupied = buildings.reduce((s, b) => s + countOccupied(b), 0);
  const rate = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;
  const firstName = meta?.adminFullName?.split(" ")[0] || "Admin";

  const stats = [
    { label: "Buildings", value: buildings.length, icon: <IconBuilding size={24} />, color: "#C0392B", bg: "#fef2f2" },
    { label: "Floors", value: totalFloors, icon: <IconLayers size={24} />, color: "#3b82f6", bg: "#eff6ff" },
    { label: "Rooms", value: totalRooms, icon: <IconHash size={24} />, color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Beds", value: totalBeds, icon: <IconBed size={24} />, color: "#f59e0b", bg: "#fffbeb" },
    { label: "Occupied", value: totalOccupied, icon: <IconUsers size={24} />, color: "#10b981", bg: "#ecfdf5" },
    { label: "Rate", value: `${rate}%`, icon: <IconHome size={24} />, color: rate > 80 ? "#dc2626" : "#10b981", bg: rate > 80 ? "#fef2f2" : "#ecfdf5" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 800, fontSize: 24, color: "#2C2C2C", marginBottom: 8 }}>
          Welcome back, {firstName}!
        </h1>
        <p style={{ color: "#666", fontSize: 15 }}>Here is what's happening with your hostels today.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginBottom: 40 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "white", padding: 20, borderRadius: 16, border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#2C2C2C", fontFamily: "var(--font-plus-jakarta), sans-serif" }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "white", borderRadius: 16, padding: 28, border: "1px solid #f0f0f0" }}>
        <h2 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 700, fontSize: 18, color: "#2C2C2C", marginBottom: 24 }}>Building Summary</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {buildings.map((b) => {
            const beds = countBeds(b);
            const occ = countOccupied(b);
            const pct = beds > 0 ? Math.round((occ / beds) * 100) : 0;
            return (
              <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 16, borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "rgba(192,57,43,0.06)", color: "#C0392B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconBuilding size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2C" }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{b.gender} • {b.floors.length} Floors • {countRooms(b)} Rooms • {beds} Beds</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: pct > 80 ? "#dc2626" : "#16a34a" }}>{pct}%</div>
                  <div style={{ fontSize: 11, color: "#888" }}>Occupied</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hostel Photos Section */}
      {meta?.images && meta.images.length > 0 && (
        <div style={{ marginTop: 32, background: "white", borderRadius: 16, padding: 28, border: "1px solid #f0f0f0" }}>
          <h2 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 700, fontSize: 18, color: "#2C2C2C", marginBottom: 20 }}>
            Hostel Gallery
          </h2>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12 }}>
            {meta.images.map((url, idx) => (
              <div key={idx} style={{ flexShrink: 0, width: 220, height: 140, borderRadius: 12, overflow: "hidden", border: "1px solid #eee" }}>
                <img src={url} alt={`Hostel ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
