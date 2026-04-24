"use client";

import React, { useState } from "react";
import { IconLayers, IconBuilding, IconTrash, IconPlus, IconChevronDown, IconChevronUp, IconHash, IconBed } from "@/components/icons";
import Swal from "sweetalert2";
import { useAdminData } from "../AdminDataContext";

export default function FloorsManagement() {
  const { buildings, apiAddFloor, apiEditFloor, apiDeleteFloor, apiAddRoom } = useAdminData();
  const [expandedFloors, setExpandedFloors] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedFloors(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  const allFloors = buildings.flatMap(b => b.floors.map(f => ({ ...f, buildingId: b.id, buildingName: b.name })));

  const addFloor = () => {
    Swal.fire({
      title: "Add New Floor",
      html: `
        <div style="text-align:left">
          <label style="display:block;margin-bottom:8px;font-weight:600">Building</label>
          <select id="swal-building" class="swal2-input" style="margin:0;width:100%">
            ${buildings.map(b => `<option value="${b.id}">${b.name}</option>`).join("")}
          </select>
          <label style="display:block;margin-top:16px;margin-bottom:8px;font-weight:600">Floor Number</label>
          <input id="swal-floor" type="number" class="swal2-input" style="margin:0;width:100%" placeholder="e.g. 3">
        </div>`,
      showCancelButton: true, confirmButtonColor: "#C0392B", confirmButtonText: "Add Floor",
      preConfirm: () => {
        const bid = (document.getElementById("swal-building") as HTMLSelectElement).value;
        const num = (document.getElementById("swal-floor") as HTMLInputElement).value;
        if (!num) Swal.showValidationMessage("Floor number is required");
        return { bid, num: parseInt(num) };
      }
    }).then(async r => {
      if (!r.isConfirmed) return;
      await apiAddFloor(r.value.bid, r.value.num);
      Swal.fire("Added!", "Floor has been created.", "success");
    });
  };

  const editFloor = (floorId: string, currentNum: number) => {
    Swal.fire({
      title: "Edit Floor Number", input: "number", inputValue: currentNum,
      showCancelButton: true, confirmButtonColor: "#C0392B",
    }).then(async r => {
      if (!r.isConfirmed) return;
      await apiEditFloor(floorId, parseInt(r.value));
    });
  };

  const removeFloor = (floorId: string) => {
    Swal.fire({ title: "Remove Floor?", text: "All rooms on this floor will be deleted.", icon: "warning", showCancelButton: true, confirmButtonColor: "#C0392B" }).then(async r => {
      if (!r.isConfirmed) return;
      await apiDeleteFloor(floorId);
    });
  };

  const addRoomToFloor = (floorId: string) => {
    Swal.fire({ title: "Room Number", input: "text", inputPlaceholder: "e.g. 104", showCancelButton: true, confirmButtonColor: "#C0392B", inputValidator: v => !v ? "Required" : null }).then(r1 => {
      if (!r1.isConfirmed) return;
      Swal.fire({ title: "Beds", input: "number", inputValue: "2", showCancelButton: true, confirmButtonColor: "#C0392B" }).then(async r2 => {
        if (!r2.isConfirmed) return;
        await apiAddRoom(floorId, r1.value, parseInt(r2.value) || 2);
        Swal.fire("Added!", "Room created.", "success");
      });
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 800, fontSize: 24, color: "#2C2C2C", marginBottom: 8 }}>Manage Floors</h1>
          <p style={{ color: "#666", fontSize: 15 }}>Organize floors and manage room distributions.</p>
        </div>
        <button onClick={addFloor} className="wizard-btn wizard-btn-submit" style={{ padding: "10px 20px" }}><IconPlus size={16} /> Add New Floor</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {allFloors.map(f => {
          const isExpanded = expandedFloors.includes(f.id);
          return (
            <div key={f.id} className="wizard-card" style={{ margin: 0, padding: 0, overflow: "hidden" }}>
              <div onClick={() => toggleExpand(f.id)} style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: isExpanded ? "1px solid #f0f0f0" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "rgba(59,130,246,0.05)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center" }}><IconLayers size={22} /></div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 700, fontSize: 17, color: "#2C2C2C", margin: "0 0 4px" }}>Floor {f.floorNumber}</h3>
                    <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#888", fontWeight: 600 }}><IconBuilding size={14} /> {f.buildingName} • {f.rooms.length} Rooms</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={e => { e.stopPropagation(); editFloor(f.id, f.floorNumber); }} className="wizard-btn wizard-btn-back" style={{ padding: "8px 12px", fontSize: 12 }}>Edit</button>
                  <button onClick={e => { e.stopPropagation(); removeFloor(f.id); }} style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #fecaca", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "white" }}><IconTrash size={16} /></button>
                  <div style={{ color: "#999", marginLeft: 8 }}>{isExpanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}</div>
                </div>
              </div>
              {isExpanded && (
                <div style={{ padding: "16px 24px", backgroundColor: "#fafafa" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                    {f.rooms.map(room => (
                      <div key={room.id} style={{ background: "white", padding: "12px 16px", borderRadius: 10, border: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><IconHash size={16} color="#8b5cf6" /><span style={{ fontSize: 14, fontWeight: 700, color: "#2C2C2C" }}>Room {room.roomNumber}</span></div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "flex", alignItems: "center", gap: 4 }}><IconBed size={14} /> {room.beds.length}</div>
                      </div>
                    ))}
                    <button onClick={() => addRoomToFloor(f.id)} style={{ border: "1.5px dashed #ccc", borderRadius: 10, padding: "12px", background: "none", color: "#999", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><IconPlus size={14} /> Add Room</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
