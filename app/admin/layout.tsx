"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { IconHome, IconBuilding, IconBed, IconLogOut, IconLayers, IconHash } from "@/components/icons";
import { AdminDataProvider, useAdminData } from "./AdminDataContext";

function AdminContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { meta } = useAdminData();

  useEffect(() => {
    const isAuth = localStorage.getItem("hostelIn_auth");
    if (!isAuth) {
      router.push("/sign-in");
    }
  }, [router]);

  const navLinks = [
    { name: "Overview", path: "/admin", icon: <IconHome size={20} /> },
    { name: "Buildings", path: "/admin/buildings", icon: <IconBuilding size={20} /> },
    { name: "Floors", path: "/admin/floors", icon: <IconLayers size={20} /> },
    { name: "Rooms", path: "/admin/rooms", icon: <IconHash size={20} /> },
    { name: "Beds", path: "/admin/beds", icon: <IconBed size={20} /> },
  ];

  const displayName = meta?.adminFullName || "Hostel Admin";
  const displayEmail = meta?.adminEmail || "admin@hostelin.pk";
  const hostelName = meta?.hostelName || "Admin Dashboard";
  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "A";

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8f9fb", fontFamily: "var(--font-dm-sans), sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 40,
        }}
      >
        <div style={{ padding: "24px 32px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/uploads/logo.webp" alt="HostelIn" style={{ height: "32px", cursor: "pointer" }} onClick={() => router.push("/")} />
        </div>

        {/* Hostel Info Badge */}
        {meta && (
          <div style={{ padding: "16px 16px 0", marginBottom: 8 }}>
            <div style={{ 
              background: "linear-gradient(135deg, rgba(192,57,43,0.06), rgba(192,57,43,0.02))", 
              borderRadius: 12, 
              padding: "14px 16px",
              border: "1px solid rgba(192,57,43,0.08)"
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#2C2C2C", marginBottom: 2 }}>{meta.hostelName}</div>
              <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>{meta.city}{meta.town ? `, ${meta.town}` : ""}</div>
            </div>
          </div>
        )}

        <nav style={{ flex: 1, padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== "/admin" && pathname?.startsWith(link.path));
            return (
              <a
                key={link.name}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(link.path);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: isActive ? "#ffffff" : "#666666",
                  backgroundColor: isActive ? "var(--wizard-red, #C0392B)" : "transparent",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "rgba(192, 57, 43, 0.05)";
                    e.currentTarget.style.color = "var(--wizard-red, #C0392B)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#666666";
                  }
                }}
              >
                <div style={{ color: isActive ? "#ffffff" : "inherit" }}>{link.icon}</div>
                {link.name}
              </a>
            );
          })}
        </nav>

        <div style={{ padding: "20px 16px", borderTop: "1px solid #f0f0f0" }}>
          <button
            onClick={() => {
              localStorage.removeItem("hostelIn_auth");
              localStorage.removeItem("hostelIn_activeHostel");
              router.push("/sign-in");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "10px",
              width: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#dc2626",
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fef2f2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <IconLogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Header */}
        <header
          style={{
            height: "80px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 700, fontSize: "18px", color: "#2C2C2C" }}>
            {hostelName}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#2C2C2C" }}>{displayName}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{displayEmail}</div>
            </div>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "var(--wizard-red, #C0392B)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div style={{ padding: "32px", flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminDataProvider>
      <AdminContent>{children}</AdminContent>
    </AdminDataProvider>
  );
}
