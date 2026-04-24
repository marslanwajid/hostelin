"use client";

import React, { useState } from "react";
import { IconBed, IconCheck, IconX, IconSearch, IconBuilding, IconPlus, IconTrash, IconLayers } from "@/components/icons";
import Swal from "sweetalert2";
import { useAdminData, uid } from "../AdminDataContext";

export default function BedsManagement() {
  const { buildings, setBuildings } = useAdminData();
  const [search, setSearch] = useState("");

  // Flatten all beds with parent info
  const allBeds = buildings.flatMap(b =>
    b.floors.flatMap(f =>
      f.rooms.flatMap((r, _, __, bedIdx = { v: 0 }) =>
        r.beds.map((bed, i) => ({
          ...bed, bedName: `Bed ${i + 1}`, roomNumber: r.roomNumber, roomId: r.id,
          floorNumber: f.floorNumber, floorId: f.id,
          buildingName: b.name, buildingId: b.id,
        }))
      )
    )
  );

  const filtered = allBeds.filter(b =>
    b.bedName.toLowerCase().includes(search.toLowerCase()) ||
    b.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.buildingName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleBed = (bed: typeof allBeds[0]) => {
    if (bed.isOccupied) {
      Swal.fire({ title: "Vacate Bed?", text: `${bed.bedName} in Room ${bed.roomNumber}`, icon: "warning", showCancelButton: true, confirmButtonColor: "#C0392B" }).then(r => {
        if (!r.isConfirmed) return;
        updateBed(bed.buildingId, bed.floorId, bed.roomId, bed.id, false, undefined);
        Swal.fire("Vacated!", "Bed available.", "success");
      });
    } else {
      Swal.fire({ title: "Assign Bed", input: "text", inputPlaceholder: "Occupant name", showCancelButton: true, confirmButtonColor: "#C0392B" }).then(r => {
        if (!r.isConfirmed || !r.value) return;
        updateBed(bed.buildingId, bed.floorId, bed.roomId, bed.id, true, r.value);
        Swal.fire("Assigned!", "Bed occupied.", "success");
      });
    }
  };

  const updateBed = (bId: string, fId: string, rId: string, bedId: string, isOccupied: boolean, name?: string) => {
    setBuildings(prev => prev.map(b => b.id !== bId ? b : {
      ...b, floors: b.floors.map(f => f.id !== fId ? f : {
        ...f, rooms: f.rooms.map(r => r.id !== rId ? r : {
          ...r, beds: r.beds.map(bd => bd.id !== bedId ? bd : { ...bd, isOccupied, occupantName: name })
        })
      })
    }));
  };

  const deleteBed = (bed: typeof allBeds[0]) => {
    Swal.fire({ title: "Delete Bed?", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626" }).then(r => {
      if (!r.isConfirmed) return;
      setBuildings(prev => prev.map(b => b.id !== bed.buildingId ? b : {
        ...b, floors: b.floors.map(f => f.id !== bed.floorId ? f : {
          ...f, rooms: f.rooms.map(rm => rm.id !== bed.roomId ? rm : { ...rm, beds: rm.beds.filter(bd => bd.id !== bed.id) })
        })
      }));
    });
  };

  const addBed = () => {
    Swal.fire({
      title: "Add Bed",
      html: `
        <div style="text-align:left">
          <label style="display:block;margin-bottom:8px;font-weight:600">Building</label>
          <select id="swal-building" class="swal2-input" style="margin:0;width:100%">
            ${buildings.map(b => `<option value="${b.id}">${b.name}</option>`).join("")}
          </select>
          <label style="display:block;margin-top:16px;margin-bottom:8px;font-weight:600">Room Number</label>
          <input id="swal-room" type="text" class="swal2-input" style="margin:0;width:100%" placeholder="e.g. 101">
        </div>`,
      showCancelButton: true, confirmButtonColor: "#C0392B",
      preConfirm: () => {
        const bid = (document.getElementById("swal-building") as HTMLSelectElement).value;
        const room = (document.getElementById("swal-room") as HTMLInputElement).value;
        if (!room) { Swal.showValidationMessage("Room required"); return; }
        return { bid, room };
      }
    }).then(r => {
      if (!r.isConfirmed) return;
      setBuildings(prev => prev.map(b => b.id !== r.value.bid ? b : {
        ...b, floors: b.floors.map(f => ({
          ...f, rooms: f.rooms.map(rm => rm.roomNumber !== r.value.room ? rm : {
            ...rm, beds: [...rm.beds, { id: uid("bed"), isOccupied: false }]
          })
        }))
      }));
      Swal.fire("Added!", "Bed registered.", "success");
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 800, fontSize: 24, color: "#2C2C2C", marginBottom: 8 }}>Manage Beds</h1>
          <p style={{ color: "#666", fontSize: 15 }}>Monitor and assign beds across all rooms.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#999" }}><IconSearch size={16} /></div>
            <input type="text" placeholder="Search beds..." className="wizard-input" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, width: 200, margin: 0 }} />
          </div>
          <button onClick={addBed} className="wizard-btn wizard-btn-submit" style={{ padding: "10px 20px" }}><IconPlus size={16} /> Add Bed</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
        {filtered.map(bed => (
          <div key={bed.id} className="wizard-card" style={{ margin: 0, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: bed.isOccupied ? "rgba(192,57,43,0.05)" : "rgba(34,197,94,0.05)", color: bed.isOccupied ? "#C0392B" : "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}><IconBed size={20} /></div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#2C2C2C", margin: 0 }}>{bed.bedName}</h3>
                  <div style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>Room {bed.roomNumber}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <div style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, backgroundColor: bed.isOccupied ? "#fef2f2" : "#f0fdf4", color: bed.isOccupied ? "#ef4444" : "#22c55e", border: `1px solid ${bed.isOccupied ? "#fee2e2" : "#dcfce7"}` }}>
                  {bed.isOccupied ? "OCCUPIED" : "AVAILABLE"}
                </div>
                <button onClick={() => deleteBed(bed)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", padding: 4 }} onMouseEnter={e => e.currentTarget.style.color = "#ef4444"} onMouseLeave={e => e.currentTarget.style.color = "#ccc"}><IconTrash size={14} /></button>
              </div>
            </div>
            <div style={{ backgroundColor: "#f9fafb", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#666", marginBottom: 4 }}><IconBuilding size={14} /> {bed.buildingName}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#666" }}><IconLayers size={14} /> Floor {bed.floorNumber}</div>
              {bed.isOccupied && <div style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2C", marginTop: 4 }}>Occupant: {bed.occupantName}</div>}
            </div>
            <button onClick={() => toggleBed(bed)} className="wizard-btn" style={{ width: "100%", justifyContent: "center", padding: 10, fontSize: 13, backgroundColor: bed.isOccupied ? "#fff" : "var(--wizard-red, #C0392B)", color: bed.isOccupied ? "#666" : "#fff", border: bed.isOccupied ? "1px solid #e5e7eb" : "none" }}>
              {bed.isOccupied ? <><IconX size={16} style={{ marginRight: 8 }} /> Mark as Vacant</> : <><IconCheck size={16} style={{ marginRight: 8 }} /> Mark as Occupied</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
