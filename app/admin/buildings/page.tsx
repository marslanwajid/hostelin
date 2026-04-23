"use client";

import React, { useState, useRef } from "react";
import { IconBuilding, IconUpload, IconTrash, IconImage } from "@/components/icons";

interface MockBuilding {
  id: string;
  name: string;
  floors: number;
  gender: string;
  images: { id: string; url: string }[];
}

export default function BuildingsManagement() {
  const [buildings, setBuildings] = useState<MockBuilding[]>([
    { id: "b1", name: "Main Boys Hostel", floors: 3, gender: "Boys", images: [] },
    { id: "b2", name: "Girls Annex", floors: 2, gender: "Girls", images: [] },
  ]);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (buildingId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file), // Using object URL to preview
    }));

    setBuildings((prev) =>
      prev.map((b) => (b.id === buildingId ? { ...b, images: [...b.images, ...newImages] } : b))
    );
  };

  const removeImage = (buildingId: string, imageId: string) => {
    setBuildings((prev) =>
      prev.map((b) =>
        b.id === buildingId ? { ...b, images: b.images.filter((img) => img.id !== imageId) } : b
      )
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 800, fontSize: 24, color: "#2C2C2C", marginBottom: 8 }}>
            Manage Buildings
          </h1>
          <p style={{ color: "#666", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 15 }}>
            Update building details and upload cover images.
          </p>
        </div>
        <button className="wizard-btn wizard-btn-submit" style={{ padding: "10px 20px" }}>
          + Add New Building
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {buildings.map((b) => (
          <div key={b.id} className="wizard-card" style={{ margin: 0, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "rgba(192,57,43,0.05)", color: "var(--wizard-red, #C0392B)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconBuilding size={24} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 700, fontSize: 18, color: "#2C2C2C", margin: "0 0 4px" }}>
                    {b.name}
                  </h3>
                  <div style={{ display: "flex", gap: 12, fontSize: 13, color: "#888", fontWeight: 600 }}>
                    <span>{b.floors} Floors</span>
                    <span>•</span>
                    <span>{b.gender} Only</span>
                  </div>
                </div>
              </div>
              <button className="wizard-btn wizard-btn-back" style={{ padding: "8px 16px", fontSize: 13 }}>
                Edit Details
              </button>
            </div>

            {/* Images Section */}
            <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2C", marginBottom: 12, fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                Building Images
              </h4>
              
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {b.images.map((img) => (
                  <div key={img.id} style={{ position: "relative", width: 120, height: 120, borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                    <img src={img.url} alt="building" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      onClick={() => removeImage(b.id, img.id)}
                      style={{
                        position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%",
                        backgroundColor: "white", color: "#dc2626", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                      }}
                    >
                      <IconTrash size={12} />
                    </button>
                  </div>
                ))}

                {/* Upload Trigger */}
                <div
                  onClick={() => fileInputRefs.current[b.id]?.click()}
                  style={{
                    width: 120, height: 120, borderRadius: 12, border: "2px dashed #ddd", backgroundColor: "#fafafa",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--wizard-red, #C0392B)";
                    e.currentTarget.style.backgroundColor = "rgba(192,57,43,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#ddd";
                    e.currentTarget.style.backgroundColor = "#fafafa";
                  }}
                >
                  <IconImage size={24} color="#ccc" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#999" }}>Add Image</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={(el) => { fileInputRefs.current[b.id] = el; }}
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(b.id, e)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
