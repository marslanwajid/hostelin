"use client";

import React, { useState, useRef } from "react";
import { IconBuilding, IconBed, IconImage, IconTrash, IconUsers, IconCheck, IconX } from "@/components/icons";

interface MockBed {
  id: string;
  isOccupied: boolean;
  occupantName?: string;
  occupantContact?: string;
}

interface MockRoom {
  id: string;
  roomNumber: string;
  floor: number;
  beds: MockBed[];
  images: { id: string; url: string }[];
}

interface MockBuildingRooms {
  buildingId: string;
  buildingName: string;
  rooms: MockRoom[];
}

export default function RoomsManagement() {
  const [data, setData] = useState<MockBuildingRooms[]>([
    {
      buildingId: "b1",
      buildingName: "Main Boys Hostel",
      rooms: [
        {
          id: "r1",
          roomNumber: "101",
          floor: 1,
          beds: [
            { id: "b1-1", isOccupied: true, occupantName: "Ali Khan", occupantContact: "0300-1234567" },
            { id: "b1-2", isOccupied: true, occupantName: "Usman Tariq", occupantContact: "0321-9876543" },
            { id: "b1-3", isOccupied: false },
          ],
          images: [],
        },
        {
          id: "r2",
          roomNumber: "102",
          floor: 1,
          beds: [
            { id: "b2-1", isOccupied: false },
            { id: "b2-2", isOccupied: false },
          ],
          images: [],
        },
      ],
    },
  ]);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Modal State
  const [selectedBed, setSelectedBed] = useState<{ buildingId: string; roomId: string; bedId: string; bedName: string } | null>(null);
  const [occupantName, setOccupantName] = useState("");
  const [occupantContact, setOccupantContact] = useState("");

  const handleBedClick = (buildingId: string, roomId: string, bed: MockBed, bedIndex: number) => {
    if (bed.isOccupied) {
      // If already occupied, clicking it will vacate the bed
      if (window.confirm(`Are you sure you want to vacate ${bed.occupantName}'s bed?`)) {
        setData((prev) =>
          prev.map((b) => {
            if (b.buildingId !== buildingId) return b;
            return {
              ...b,
              rooms: b.rooms.map((r) => {
                if (r.id !== roomId) return r;
                return {
                  ...r,
                  beds: r.beds.map((dbed) => {
                    if (dbed.id !== bed.id) return dbed;
                    return { ...dbed, isOccupied: false, occupantName: undefined, occupantContact: undefined };
                  }),
                };
              }),
            };
          })
        );
      }
    } else {
      // If free, open the modal to assign occupant details
      setSelectedBed({ buildingId, roomId, bedId: bed.id, bedName: `Bed ${bedIndex + 1}` });
      setOccupantName("");
      setOccupantContact("");
    }
  };

  const handleAssignBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed) return;

    setData((prev) =>
      prev.map((b) => {
        if (b.buildingId !== selectedBed.buildingId) return b;
        return {
          ...b,
          rooms: b.rooms.map((r) => {
            if (r.id !== selectedBed.roomId) return r;
            return {
              ...r,
              beds: r.beds.map((bed) => {
                if (bed.id !== selectedBed.bedId) return bed;
                return { 
                  ...bed, 
                  isOccupied: true, 
                  occupantName: occupantName || "New Occupant",
                  occupantContact: occupantContact || undefined
                };
              }),
            };
          }),
        };
      })
    );
    setSelectedBed(null);
  };

  const handleFileChange = (buildingId: string, roomId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
    }));

    setData((prev) =>
      prev.map((b) => {
        if (b.buildingId !== buildingId) return b;
        return {
          ...b,
          rooms: b.rooms.map((r) => {
            if (r.id !== roomId) return r;
            return { ...r, images: [...r.images, ...newImages] };
          }),
        };
      })
    );
  };

  const removeImage = (buildingId: string, roomId: string, imageId: string) => {
    setData((prev) =>
      prev.map((b) => {
        if (b.buildingId !== buildingId) return b;
        return {
          ...b,
          rooms: b.rooms.map((r) => {
            if (r.id !== roomId) return r;
            return { ...r, images: r.images.filter((img) => img.id !== imageId) };
          }),
        };
      })
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 800, fontSize: 24, color: "#2C2C2C", marginBottom: 8 }}>
            Manage Rooms & Beds
          </h1>
          <p style={{ color: "#666", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 15 }}>
            Update bed availability and room photos.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {data.map((building) => (
          <div key={building.buildingId}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 12, borderBottom: "2px solid #e5e7eb" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "var(--wizard-red, #C0392B)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconBuilding size={16} />
              </div>
              <h2 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 700, fontSize: 18, color: "#2C2C2C", margin: 0 }}>
                {building.buildingName}
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
              {building.rooms.map((room) => (
                <div key={room.id} className="wizard-card" style={{ margin: 0, padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>
                        <IconBed size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 700, fontSize: 16, color: "#2C2C2C", margin: "0 0 4px" }}>
                          Room {room.roomNumber}
                        </h3>
                        <div style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>
                          Floor {room.floor} • {room.beds.length} Beds Total
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Beds Occupancy Toggle Area */}
                  <div style={{ backgroundColor: "#fafafa", borderRadius: 12, padding: 16, border: "1px solid #f0f0f0", marginBottom: 24 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2C", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Bed Status</h4>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {room.beds.map((bed, index) => (
                        <div
                          key={bed.id}
                          onClick={() => handleBedClick(building.buildingId, room.id, bed, index)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "10px 16px",
                            borderRadius: 10,
                            border: `1.5px solid ${bed.isOccupied ? "#fca5a5" : "#a7f3d0"}`,
                            backgroundColor: bed.isOccupied ? "#fef2f2" : "#f0fdf4",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            minWidth: 160,
                          }}
                        >
                          <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: bed.isOccupied ? "#ef4444" : "#22c55e", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {bed.isOccupied ? <IconX size={14} /> : <IconCheck size={14} />}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: bed.isOccupied ? "#991b1b" : "#166534" }}>
                              Bed {index + 1}
                            </div>
                            <div style={{ fontSize: 12, color: bed.isOccupied ? "#ef4444" : "#22c55e", fontWeight: 600, whiteSpace: "nowrap" }}>
                              {bed.isOccupied ? bed.occupantName : "Available"}
                            </div>
                            {bed.isOccupied && bed.occupantContact && (
                              <div style={{ fontSize: 10, color: "#ef4444", opacity: 0.8, marginTop: 2 }}>
                                {bed.occupantContact}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Room Images */}
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2C", marginBottom: 12, fontFamily: "var(--font-plus-jakarta), sans-serif" }}>
                      Room Photos
                    </h4>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {room.images.map((img) => (
                        <div key={img.id} style={{ position: "relative", width: 100, height: 100, borderRadius: 10, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                          <img src={img.url} alt="room" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            onClick={() => removeImage(building.buildingId, room.id, img.id)}
                            style={{
                              position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%",
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
                        onClick={() => fileInputRefs.current[room.id]?.click()}
                        style={{
                          width: 100, height: 100, borderRadius: 10, border: "2px dashed #ddd", backgroundColor: "#fafafa",
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer",
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
                        <IconImage size={20} color="#ccc" />
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#999" }}>Add Photo</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          ref={(el) => { fileInputRefs.current[room.id] = el; }}
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChange(building.buildingId, room.id, e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Assign Occupant Modal */}
      {selectedBed && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
          <div className="wizard-card" style={{ width: 400, maxWidth: "90%", padding: 32, margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-plus-jakarta), sans-serif", fontSize: 20, color: "#2C2C2C" }}>
                Assign {selectedBed.bedName}
              </h3>
              <button 
                onClick={() => setSelectedBed(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}
              >
                <IconX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAssignBed}>
              <div className="wizard-form-group">
                <label className="wizard-label">Occupant Name (Optional)</label>
                <input
                  type="text"
                  className="wizard-input"
                  placeholder="e.g. Ali Khan"
                  value={occupantName}
                  onChange={(e) => setOccupantName(e.target.value)}
                />
              </div>
              <div className="wizard-form-group">
                <label className="wizard-label">Contact Number (Optional)</label>
                <input
                  type="text"
                  className="wizard-input"
                  placeholder="e.g. 0300-1234567"
                  value={occupantContact}
                  onChange={(e) => setOccupantContact(e.target.value)}
                />
              </div>
              
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <button 
                  type="button" 
                  className="wizard-btn wizard-btn-back"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => setSelectedBed(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="wizard-btn wizard-btn-submit"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
