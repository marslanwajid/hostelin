"use client";

import React, { useState, useEffect } from "react";
import { useAdminData } from "../AdminDataContext";
import { IconCheck, IconBuilding, IconMapPin, IconShield, IconWifi } from "@/components/icons";
import Swal from "sweetalert2";

export default function HostelSettings() {
  const { meta, apiUpdateHostelMeta } = useAdminData();
  const [hostelName, setHostelName] = useState("");
  const [hostelType, setHostelType] = useState<"Boys" | "Girls" | "Co-ed">("Co-ed");
  const [city, setCity] = useState("");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (meta) {
      setHostelName(meta.hostelName || "");
      setHostelType(meta.hostelType || "Co-ed");
      setCity(meta.city || "");
      setTown(meta.town || "");
      setDescription(meta.description || "");
      setAdminName(meta.adminFullName || "");
      setAdminEmail(meta.adminEmail || "");
    }
  }, [meta]);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await apiUpdateHostelMeta({
      hostelName,
      hostelType,
      city,
      town,
      description,
      adminFullName: adminName,
    });
    setIsSaving(false);

    if (success) {
      Swal.fire({
        icon: "success",
        title: "Settings Saved",
        text: "Your hostel profile has been updated.",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire("Error", "Failed to update settings", "error");
    }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 800, fontSize: 24, color: "#2C2C2C", marginBottom: 8 }}>Hostel Settings</h1>
        <p style={{ color: "#666", fontSize: 15 }}>Update your hostel profile and administrative details.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Basic Info */}
        <div className="wizard-card" style={{ margin: 0, padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(192,57,43,0.1)", color: "#C0392B", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconBuilding size={20} />
            </div>
            Basic Profile
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8 }}>Hostel Name</label>
              <input 
                type="text" 
                value={hostelName} 
                onChange={e => setHostelName(e.target.value)} 
                className="wizard-input" 
                placeholder="Enter hostel name" 
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8 }}>Hostel For (Gender)</label>
              <select 
                value={hostelType} 
                onChange={e => setHostelType(e.target.value as any)} 
                className="wizard-input"
              >
                <option value="Male">Male Only</option>
                <option value="Female">Female Only</option>
                <option value="Both">Both (Mixed)</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8 }}>City</label>
              <input 
                type="text" 
                value={city} 
                onChange={e => setCity(e.target.value)} 
                className="wizard-input" 
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8 }}>Town / Area</label>
              <input 
                type="text" 
                value={town} 
                onChange={e => setTown(e.target.value)} 
                className="wizard-input" 
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8 }}>About / Description</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="wizard-input" 
                style={{ height: 120, paddingTop: 12, resize: "none" }}
                placeholder="Tell guests about your hostel..."
              />
            </div>
          </div>
        </div>

        {/* Admin Info */}
        <div className="wizard-card" style={{ margin: 0, padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(59,130,246,0.1)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconShield size={20} />
            </div>
            Administrator Settings
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8 }}>Admin Full Name</label>
              <input 
                type="text" 
                value={adminName} 
                onChange={e => setAdminName(e.target.value)} 
                className="wizard-input" 
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8 }}>Admin Email (Read-only)</label>
              <input 
                type="text" 
                value={adminEmail} 
                readOnly 
                className="wizard-input" 
                style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="wizard-btn wizard-btn-submit" 
            style={{ padding: "14px 40px", fontSize: 16 }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
