"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IconMenu, IconX } from "../icons";
import { Tweaks } from "@/lib/types";

interface NavbarProps {
  scrolled: boolean;
  tweaks: Tweaks;
  forceSolid?: boolean;
}

export default function Navbar({ scrolled, tweaks, forceSolid = false }: NavbarProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const red = tweaks?.primaryColor || "#C0392B";
  const router = useRouter();

  const effectiveScrolled = scrolled || forceSolid;

  const linkStyle = (isScrolled: boolean): React.CSSProperties => ({
    fontSize: 14,
    fontWeight: 500,
    color: isScrolled ? "#2C2C2C" : "rgba(255,255,255,0.9)",
    textDecoration: "none",
    transition: "color 0.2s",
    fontFamily: "var(--font-dm-sans), sans-serif",
    textShadow: isScrolled ? "none" : "0 1px 6px rgba(0,0,0,0.4)",
    letterSpacing: "0.01em",
  });

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: effectiveScrolled ? "rgba(255,255,255,0.97)" : "transparent",
          backdropFilter: effectiveScrolled ? "blur(14px)" : "none",
          boxShadow: effectiveScrolled ? "0 2px 28px rgba(0,0,0,0.09)" : "none",
          borderBottom: effectiveScrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
          transition: "all 0.38s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div
          style={{
            maxWidth: 1380,
            margin: "0 auto",
            padding: "0 32px",
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            height: effectiveScrolled ? 62 : 80,
            transition: "height 0.38s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="nav-left">
            {[["Find Hostels", "/find-hostels"], ["How It Works", "#how"]].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={(e) => {
                  if (href.startsWith("/")) {
                    e.preventDefault();
                    router.push(href);
                  }
                }}
                style={linkStyle(effectiveScrolled)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = red;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = effectiveScrolled ? "#2C2C2C" : "rgba(255,255,255,0.9)";
                }}
              >
                {label}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img
              src="/uploads/logo.webp"
              alt="HostelIn"
              style={{
                height: effectiveScrolled ? 36 : 54,
                filter: effectiveScrolled ? "none" : "brightness(0) invert(1)",
                transition: "all 0.38s cubic-bezier(.4,0,.2,1)",
                display: "block",
                cursor: "pointer",
              }}
              onClick={() => router.push("/")}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 28 }} className="nav-right">
            {[["Blog", "#"], ["For Owners", "#owner"]].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={linkStyle(effectiveScrolled)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = red;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = effectiveScrolled ? "#2C2C2C" : "rgba(255,255,255,0.9)";
                }}
              >
                {label}
              </a>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: `1.5px solid ${effectiveScrolled ? red : "rgba(255,255,255,0.6)"}`,
                  background: "transparent",
                  color: effectiveScrolled ? red : "white",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textShadow: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = red;
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = red;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = effectiveScrolled ? red : "white";
                  e.currentTarget.style.borderColor = effectiveScrolled ? red : "rgba(255,255,255,0.6)";
                }}
                onClick={() => router.push("/list-hostel")}
              >
                List Hostel
              </button>
              <button
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "none",
                  background: red,
                  color: "white",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: `0 4px 14px ${red}55`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={() => router.push("/sign-in")}
              >
                Sign In
              </button>
            </div>
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "absolute",
              right: 20,
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {menuOpen ? <IconX color={effectiveScrolled ? "#2C2C2C" : "white"} size={26} /> : <IconMenu color={effectiveScrolled ? "#2C2C2C" : "white"} size={26} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: effectiveScrolled ? 62 : 80,
            left: 0,
            right: 0,
            zIndex: 999,
            background: "white",
            borderBottom: "1px solid #eee",
            padding: "12px 24px 20px",
            display: "none",
            flexDirection: "column",
          }}
          className="mobile-dropdown"
        >
          {[
            ["Find Hostels", "/find-hostels"],
            ["How It Works", "#how"],
            ["List Your Hostel", "/list-hostel"],
            ["Blog", "#"],
            ["For Owners", "#owner"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={(e) => {
                if (href.startsWith("/")) {
                  e.preventDefault();
                  router.push(href);
                }
                setMenuOpen(false);
              }}
              style={{
                padding: "12px 0",
                fontSize: 15,
                fontWeight: 500,
                color: "#2C2C2C",
                textDecoration: "none",
                borderBottom: "1px solid #f5f5f5",
                fontFamily: "var(--font-dm-sans), sans-serif",
              }}
            >
              {label}
            </a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button
              onClick={() => {
                router.push("/list-hostel");
                setMenuOpen(false);
              }}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 8,
                border: `2px solid ${red}`,
                background: "transparent",
                color: red,
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              List Hostel
            </button>
            <button
              onClick={() => {
                router.push("/sign-in");
                setMenuOpen(false);
              }}
              style={{
                flex: 1,
                padding: "11px 0",
                borderRadius: 8,
                border: "none",
                background: red,
                color: "white",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .nav-left{display:none!important}
          .nav-right{display:none!important}
          .mobile-menu-btn{display:flex!important}
          .mobile-dropdown{display:flex!important}
        }
      `}</style>
    </>
  );
}
