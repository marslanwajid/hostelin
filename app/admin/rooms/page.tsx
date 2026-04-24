"use client";

import React, { useState } from "react";
import { IconHash, IconBuilding, IconLayers, IconBed, IconTrash, IconPlus, IconChevronDown, IconChevronUp, IconCheck, IconX } from "@/components/icons";
import Swal from "sweetalert2";
import { useAdminData } from "../AdminDataContext";

export default function RoomsManagement() {
  const {
    buildings,
    apiAddFloor,
    apiAddRoom,
    apiEditRoom,
    apiDeleteRoom,
    apiAddBed,
    apiUpdateRoomImages,
  } = useAdminData();
  const [expandedRooms, setExpandedRooms] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedRooms((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const fileInputs = React.useRef<Record<string, HTMLInputElement | null>>({});

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Flatten all rooms with parent info
  const allRooms = buildings.flatMap((b) =>
    b.floors.flatMap((f) =>
      f.rooms.map((r) => ({
        ...r,
        buildingId: b.id,
        buildingName: b.name,
        floorId: f.id,
        floorNumber: f.floorNumber,
      }))
    )
  );

  const addRoomImages = async (roomId: string, files: File[]) => {
    const room = allRooms.find((r) => r.id === roomId);
    if (!room) return;

    const newB64 = await Promise.all(files.map((f) => fileToBase64(f)));
    const allImages = [...room.images.map((img) => img.url), ...newB64];

    await apiUpdateRoomImages(roomId, allImages);
  };

  const removeRoomImage = async (roomId: string, imageId: string) => {
    const room = allRooms.find((r) => r.id === roomId);
    if (!room) return;

    const allImages = room.images.filter((i) => i.id !== imageId).map((img) => img.url);

    await apiUpdateRoomImages(roomId, allImages);
  };

  const addRoom = () => {
    Swal.fire({
      title: "Add New Room",
      html: `
        <div style="text-align:left">
          <label style="display:block;margin-bottom:8px;font-weight:600">Building</label>
          <select id="swal-building" class="swal2-input" style="margin:0;width:100%">
            ${buildings.map((b) => `<option value="${b.id}">${b.name}</option>`).join("")}
          </select>
          <label style="display:block;margin-top:16px;margin-bottom:8px;font-weight:600">Floor</label>
          <input id="swal-floor" type="number" class="swal2-input" style="margin:0;width:100%" placeholder="Floor #">
          <label style="display:block;margin-top:16px;margin-bottom:8px;font-weight:600">Room Number</label>
          <input id="swal-room" type="text" class="swal2-input" style="margin:0;width:100%" placeholder="e.g. 104">
          <label style="display:block;margin-top:16px;margin-bottom:8px;font-weight:600">Beds</label>
          <input id="swal-beds" type="number" class="swal2-input" style="margin:0;width:100%" value="2">
          <label style="display:block;margin-top:16px;margin-bottom:8px;font-weight:600">Monthly Price (Rs)</label>
          <input id="swal-price" type="number" class="swal2-input" style="margin:0;width:100%" placeholder="e.g. 12000">
        </div>`,
      showCancelButton: true,
      confirmButtonColor: "#C0392B",
      confirmButtonText: "Create Room",
      preConfirm: () => {
        const bid = (document.getElementById("swal-building") as HTMLSelectElement).value;
        const floorNum = parseInt(
          (document.getElementById("swal-floor") as HTMLInputElement).value
        );
        const roomNum = (document.getElementById("swal-room") as HTMLInputElement).value;
        const bedCount =
          parseInt((document.getElementById("swal-beds") as HTMLInputElement).value) || 2;
        const priceMonthly =
          parseInt((document.getElementById("swal-price") as HTMLInputElement).value) || 0;
        if (!roomNum || !floorNum) {
          Swal.showValidationMessage("All fields required");
          return;
        }
        return { bid, floorNum, roomNum, bedCount, priceMonthly };
      },
    }).then(async (r) => {
      if (!r.isConfirmed) return;
      const { bid, floorNum, roomNum, bedCount, priceMonthly } = r.value;
      // Find existing floor or create one
      const building = buildings.find((b) => b.id === bid);
      let floor = building?.floors.find((f) => f.floorNumber === floorNum) || null;
      if (!floor) {
        floor = await apiAddFloor(bid, floorNum);
      }
      if (floor) {
        await apiAddRoom(floor.id, roomNum, bedCount, priceMonthly);
      }
      Swal.fire("Created!", "Room added.", "success");
    });
  };

  const editRoom = (roomId: string, currentNum: string, currentPrice?: number) => {
    Swal.fire({
      title: "Edit Room Details",
      html: `
        <div style="text-align:left">
          <label style="display:block;margin-bottom:8px;font-weight:600">Room Number</label>
          <input id="swal-edit-room" type="text" class="swal2-input" style="margin:0;width:100%" value="${currentNum}">
          <label style="display:block;margin-top:16px;margin-bottom:8px;font-weight:600">Monthly Price (Rs)</label>
          <input id="swal-edit-price" type="number" class="swal2-input" style="margin:0;width:100%" value="${currentPrice || 0}">
        </div>`,
      showCancelButton: true,
      confirmButtonColor: "#C0392B",
      confirmButtonText: "Update Room",
      preConfirm: () => {
        const roomNum = (document.getElementById("swal-edit-room") as HTMLInputElement).value;
        const priceMonthly = parseInt((document.getElementById("swal-edit-price") as HTMLInputElement).value) || 0;
        if (!roomNum) {
          Swal.showValidationMessage("Room number required");
          return;
        }
        return { roomNum, priceMonthly };
      },
    }).then(async (r) => {
      if (!r.isConfirmed || !r.value) return;
      await apiEditRoom(roomId, r.value.roomNum, r.value.priceMonthly);
      Swal.fire("Updated!", "Room details updated.", "success");
    });
  };

  const removeRoom = (roomId: string) => {
    Swal.fire({
      title: "Delete Room?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    }).then(async (r) => {
      if (!r.isConfirmed) return;
      await apiDeleteRoom(roomId);
    });
  };

  const addBedToRoom = (roomId: string) => {
    apiAddBed(roomId);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-plus-jakarta), sans-serif",
              fontWeight: 800,
              fontSize: 24,
              color: "#2C2C2C",
              marginBottom: 8,
            }}
          >
            Manage Rooms
          </h1>
          <p style={{ color: "#666", fontSize: 15 }}>Configure room layouts and bed details.</p>
        </div>
        <button
          onClick={addRoom}
          className="wizard-btn wizard-btn-submit"
          style={{ padding: "10px 20px" }}
        >
          <IconPlus size={16} /> Add New Room
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {allRooms.map((room) => {
          const isExpanded = expandedRooms.includes(room.id);
          const occupiedCount = room.beds.filter((b) => b.isOccupied).length;
          return (
            <div
              key={room.id}
              className="wizard-card"
              style={{ margin: 0, padding: 0, overflow: "hidden" }}
            >
              <div
                onClick={() => toggleExpand(room.id)}
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  borderBottom: isExpanded ? "1px solid #f0f0f0" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      backgroundColor: "rgba(139,92,246,0.05)",
                      color: "#8b5cf6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconHash size={22} />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontFamily: "var(--font-plus-jakarta), sans-serif",
                        fontWeight: 700,
                        fontSize: 17,
                        color: "#2C2C2C",
                        margin: "0 0 4px",
                      }}
                    >
                      Room {room.roomNumber}
                    </h3>
                    <div style={{ display: "flex", gap: 12, fontSize: 13, color: "#888", fontWeight: 600 }}>
                      <span>{room.buildingName}</span>
                      <span>•</span>
                      <span>Floor {room.floorNumber}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "#666", display: "flex", alignItems: "center", gap: 4 }}>
                        <IconBed size={14} /> {room.beds.length} Beds
                      </span>
                      <span style={{ fontSize: 13, color: "#C0392B", fontWeight: 700 }}>
                        Rs {room.priceMonthly?.toLocaleString() || 0} / month
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      editRoom(room.id, room.roomNumber, room.priceMonthly);
                    }}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: "#f5f5f5",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      color: "#666",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRoom(room.id);
                    }}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: "1px solid #fecaca",
                      color: "#ef4444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      background: "white",
                    }}
                  >
                    <IconTrash size={16} />
                  </button>
                  <div style={{ color: "#999", marginLeft: 8 }}>
                    {isExpanded ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div style={{ padding: "20px 24px", backgroundColor: "#fafafa" }}>
                  {/* Image Grid for Room */}
                  <div style={{ marginBottom: 20 }}>
                    <h4
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#888",
                        textTransform: "uppercase",
                        marginBottom: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      Room Photos
                    </h4>
                    <ImageGrid
                      images={room.images}
                      onRemove={(imgId) => removeRoomImage(room.id, imgId)}
                      onUpload={(files) => addRoomImages(room.id, files)}
                      uploadKey={`r-${room.id}`}
                      fileInputs={fileInputs}
                      tileSize={80}
                      emptyLabel="Add Photo"
                    />
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {room.beds.map((bed, idx) => (
                      <div
                        key={bed.id}
                        style={{
                          background: "white",
                          padding: "10px 16px",
                          borderRadius: 10,
                          border: `1.5px solid ${bed.isOccupied ? "#fee2e2" : "#dcfce7"}`,
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          minWidth: 120,
                        }}
                      >
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: bed.isOccupied ? "#ef4444" : "#22c55e",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {bed.isOccupied ? <IconX size={14} /> : <IconCheck size={14} />}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#2C2C2C" }}>
                          Bed {idx + 1}
                        </span>
                      </div>
                    ))}
                    <button
                      onClick={() => addBedToRoom(room.id)}
                      style={{
                        border: "1.5px dashed #ccc",
                        borderRadius: 10,
                        padding: "10px 16px",
                        background: "none",
                        color: "#999",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <IconPlus size={14} /> Add Bed
                    </button>
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

// --- Internal Helpers ---
function ImageGrid({
  images,
  onRemove,
  onUpload,
  uploadKey,
  fileInputs,
  tileSize = 100,
  emptyLabel = "Add Photo",
}: {
  images: any[];
  onRemove: (id: string) => void;
  onUpload: (files: File[]) => void;
  uploadKey: string;
  fileInputs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  tileSize?: number;
  emptyLabel?: string;
}) {
  const { IconImage, IconTrash } = require("@/components/icons");
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {images.map((img) => (
        <div
          key={img.id}
          style={{
            position: "relative",
            width: tileSize,
            height: tileSize,
            borderRadius: 10,
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button
            onClick={() => onRemove(img.id)}
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "white",
              color: "#dc2626",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <IconTrash size={10} />
          </button>
        </div>
      ))}
      <div
        onClick={() => fileInputs.current[uploadKey]?.click()}
        style={{
          width: tileSize,
          height: tileSize,
          borderRadius: 10,
          border: "2px dashed #ddd",
          background: "#fafafa",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          cursor: "pointer",
        }}
      >
        <IconImage size={18} color="#ccc" />
        <span style={{ fontSize: 10, fontWeight: 600, color: "#999" }}>{emptyLabel}</span>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={(el) => {
            fileInputs.current[uploadKey] = el;
          }}
          style={{ display: "none" }}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length) onUpload(files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
