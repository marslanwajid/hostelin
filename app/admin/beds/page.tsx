"use client";

import React, { useState } from "react";
import { IconBed, IconCheck, IconX, IconSearch, IconBuilding, IconPlus, IconTrash, IconLayers } from "@/components/icons";
import Swal from "sweetalert2";
import { useAdminData } from "../AdminDataContext";

export default function BedsManagement() {
  const { buildings, apiToggleBed, apiDeleteBed, apiAddBed } = useAdminData();
  const [search, setSearch] = useState("");

  // Flatten all beds with parent info for searching/filtering
  const allBeds = buildings.flatMap(b =>
    b.floors.flatMap(f =>
      f.rooms.flatMap((r) =>
        r.beds.map((bed, i) => ({
          ...bed, 
          bedName: `Bed ${i + 1}`, 
          roomNumber: r.roomNumber, 
          roomId: r.id,
          floorNumber: f.floorNumber, 
          floorId: f.id,
          buildingName: b.name, 
          buildingId: b.id,
        }))
      )
    )
  );

  const filtered = allBeds.filter(b =>
    b.bedName.toLowerCase().includes(search.toLowerCase()) ||
    b.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.buildingName.toLowerCase().includes(search.toLowerCase()) ||
    (b.occupantName && b.occupantName.toLowerCase().includes(search.toLowerCase()))
  );

  // Group filtered beds by Building and then by Floor
  const groupedData = filtered.reduce((acc, bed) => {
    if (!acc[bed.buildingName]) acc[bed.buildingName] = {};
    const floorKey = `Floor ${bed.floorNumber}`;
    if (!acc[bed.buildingName][floorKey]) acc[bed.buildingName][floorKey] = [];
    acc[bed.buildingName][floorKey].push(bed);
    return acc;
  }, {} as Record<string, Record<string, typeof allBeds>>);

  const toggleBed = (bed: typeof allBeds[0]) => {
    if (bed.isOccupied) {
      Swal.fire({ 
        title: "Vacate Bed?", 
        text: `${bed.bedName} in Room ${bed.roomNumber} (${bed.buildingName})`, 
        icon: "warning", 
        showCancelButton: true, 
        confirmButtonColor: "#C0392B" 
      }).then(async r => {
        if (!r.isConfirmed) return;
        await apiToggleBed(bed.id, false);
        Swal.fire("Vacated!", "Bed is now available.", "success");
      });
    } else {
      apiToggleBed(bed.id, true, "Occupied");
    }
  };

  const deleteBed = (bed: typeof allBeds[0]) => {
    Swal.fire({ title: "Delete Bed?", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626" }).then(async r => {
      if (!r.isConfirmed) return;
      await apiDeleteBed(bed.id);
    });
  };

  const addBed = () => {
    // Build a flat list of all rooms for selection
    const roomOptions = buildings.flatMap(b =>
      b.floors.flatMap(f =>
        f.rooms.map(r => ({ roomId: r.id, label: `${b.name} → Floor ${f.floorNumber} → Room ${r.roomNumber}` }))
      )
    );
    Swal.fire({
      title: "Add New Bed",
      html: `
        <div style="text-align:left">
          <label style="display:block;margin-bottom:8px;font-weight:600">Select Room</label>
          <select id="swal-room" class="swal2-input" style="margin:0;width:100%">
            ${roomOptions.map(r => `<option value="${r.roomId}">${r.label}</option>`).join("")}
          </select>
        </div>`,
      showCancelButton: true, confirmButtonColor: "#C0392B",
      preConfirm: () => {
        const roomId = (document.getElementById("swal-room") as HTMLSelectElement).value;
        if (!roomId) { Swal.showValidationMessage("Room is required"); return; }
        return { roomId };
      }
    }).then(async r => {
      if (!r.isConfirmed) return;
      await apiAddBed(r.value.roomId);
      Swal.fire("Added!", "New bed has been added to the room.", "success");
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 800, fontSize: 24, color: "#2C2C2C", marginBottom: 8 }}>Beds Management</h1>
          <p style={{ color: "#666", fontSize: 15 }}>Organize and monitor occupancy across all levels.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#999" }}><IconSearch size={16} /></div>
            <input type="text" placeholder="Search beds, rooms..." className="wizard-input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 200, margin: 0 }} />
          </div>
          <button onClick={addBed} className="wizard-btn wizard-btn-submit" style={{ padding: "10px 20px" }}><IconPlus size={16} /> Add Bed</button>
        </div>
      </div>

      {Object.keys(groupedData).length === 0 ? (
        <div className="wizard-card" style={{ padding: "40px", textAlign: "center", color: "#888" }}>
          No beds found matching your search.
        </div>
      ) : (
        Object.entries(groupedData).map(([buildingName, floors]) => (
          <div key={buildingName} style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #eee" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "rgba(192, 57, 43, 0.08)", color: "#C0392B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconBuilding size={24} />
              </div>
              <h2 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 800, fontSize: 22, color: "#2C2C2C", margin: 0 }}>
                {buildingName}
              </h2>
            </div>

            {Object.entries(floors).map(([floorName, beds]) => (
              <div key={floorName} style={{ marginBottom: 32, marginLeft: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <IconLayers size={18} color="#3b82f6" />
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#4B5563", margin: 0 }}>{floorName}</h3>
                  <span style={{ fontSize: 12, backgroundColor: "#f3f4f6", padding: "2px 8px", borderRadius: 12, color: "#6B7280", fontWeight: 600 }}>{beds.length} Beds</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                  {beds.map(bed => (
                    <div key={bed.id} className="wizard-card" style={{ margin: 0, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", minHeight: "260px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ 
                            width: 40, height: 40, borderRadius: 10, 
                            backgroundColor: bed.isOccupied ? "rgba(192, 57, 43, 0.05)" : "rgba(34, 197, 94, 0.05)", 
                            color: bed.isOccupied ? "#C0392B" : "#22c55e", 
                            display: "flex", alignItems: "center", justifyContent: "center" 
                          }}>
                            <IconBed size={20} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2C2C2C", margin: 0 }}>{bed.bedName}</h3>
                            <div style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>Room {bed.roomNumber}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                          <div style={{ 
                            padding: "4px 10px", borderRadius: 20, fontSize: 10, fontWeight: 800, 
                            backgroundColor: bed.isOccupied ? "#fef2f2" : "#f0fdf4", 
                            color: bed.isOccupied ? "#ef4444" : "#22c55e", 
                            border: `1px solid ${bed.isOccupied ? "#fee2e2" : "#dcfce7"}`,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px"
                          }}>
                            {bed.isOccupied ? "OCCUPIED" : "AVAILABLE"}
                          </div>
                          <button 
                            onClick={() => deleteBed(bed)} 
                            style={{ background: "none", border: "none", color: "#d1d5db", cursor: "pointer", padding: 4, transition: "color 0.2s" }} 
                            onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} 
                            onMouseLeave={e => e.currentTarget.style.color = "#d1d5db"}
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </div>

                      <div style={{ backgroundColor: "#f9fafb", borderRadius: 10, padding: "12px 16px", marginBottom: 20, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", border: "1px solid #f3f4f6" }}>
                        {bed.isOccupied ? (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 800, textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.5px" }}>Status</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "#C0392B" }}>{bed.occupantName}</div>
                            </div>
                            {bed.occupiedDate && (
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 800, textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.5px" }}>Date</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#4b5563" }}>{bed.occupiedDate}</div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ fontSize: 13, color: "#9ca3af", fontStyle: "italic", fontWeight: 500 }}>Ready for assignment</div>
                        )}
                      </div>

                      <button 
                        onClick={() => toggleBed(bed)} 
                        className="wizard-btn" 
                        style={{ 
                          width: "100%", 
                          height: "44px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center", 
                          padding: 0,
                          fontSize: "13px",
                          fontWeight: "700",
                          borderRadius: "10px",
                          transition: "all 0.2s",
                          backgroundColor: bed.isOccupied ? "#fff" : "var(--wizard-red, #C0392B)", 
                          color: bed.isOccupied ? "#4b5563" : "#fff", 
                          border: bed.isOccupied ? "1.5px solid #e5e7eb" : "none",
                          boxShadow: bed.isOccupied ? "none" : "0 4px 12px rgba(192, 57, 43, 0.2)"
                        }}
                      >
                        {bed.isOccupied ? (
                          <><IconX size={16} style={{ marginRight: 8 }} /> Mark as Vacant</>
                        ) : (
                          <><IconCheck size={16} style={{ marginRight: 8 }} /> Mark as Occupied</>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
