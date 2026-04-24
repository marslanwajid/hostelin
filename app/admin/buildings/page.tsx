"use client";

import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  IconBuilding,
  IconBed,
  IconImage,
  IconTrash,
  IconCheck,
  IconX,
  IconChevronDown,
  IconLayers,
  IconPlus,
  IconHash,
} from "@/components/icons";
import {
  useAdminData,
  countRooms,
  countBeds,
  countOccupied,
  floorRoomCount,
  floorBedCount,
  type MockBuilding,
  type MockBed,
  type MockRoom,
  type MockImage,
  type MockFloor,
} from "../AdminDataContext";

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

const uid = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export default function BuildingsManagement() {
  const {
    buildings,
    setBuildings,
    apiAddBuilding,
    apiDeleteBuilding,
    apiAddFloor,
    apiDeleteFloor,
    apiAddRoom,
    apiDeleteRoom,
    apiAddBed,
    apiDeleteBed,
    apiToggleBed,
    apiUpdateBuildingImages,
    apiUpdateRoomImages,
  } = useAdminData();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Collapse state — default collapsed (empty = collapsed, toggled entries = open)
  const [openBuildings, setOpenBuildings] = useState<Record<string, boolean>>({});
  const [openFloors, setOpenFloors] = useState<Record<string, boolean>>({});

  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  /* ---------- TOGGLERS ---------- */
  const toggleBuilding = (id: string) =>
    setOpenBuildings((p) => ({ ...p, [id]: !p[id] }));
  const toggleFloor = (id: string) => setOpenFloors((p) => ({ ...p, [id]: !p[id] }));

  /* ---------- IMAGE HANDLERS ---------- */
  const addBuildingImages = async (buildingId: string, files: File[]) => {
    const building = buildings.find((b) => b.id === buildingId);
    if (!building) return;

    const newB64 = await Promise.all(files.map((f) => fileToBase64(f)));
    const allImages = [...building.images.map((img) => img.url), ...newB64];

    await apiUpdateBuildingImages(buildingId, allImages);
  };

  const removeBuildingImage = async (buildingId: string, imageId: string) => {
    const building = buildings.find((b) => b.id === buildingId);
    if (!building) return;

    const allImages = building.images.filter((i) => i.id !== imageId).map((img) => img.url);

    await apiUpdateBuildingImages(buildingId, allImages);
  };

  const addRoomImages = async (
    buildingId: string,
    floorId: string,
    roomId: string,
    files: File[]
  ) => {
    const building = buildings.find((b) => b.id === buildingId);
    const floor = building?.floors.find((f) => f.id === floorId);
    const room = floor?.rooms.find((r) => r.id === roomId);
    if (!room) return;

    const newB64 = await Promise.all(files.map((f) => fileToBase64(f)));
    const allImages = [...room.images.map((img) => img.url), ...newB64];

    await apiUpdateRoomImages(roomId, allImages);
  };

  const removeRoomImage = async (
    buildingId: string,
    floorId: string,
    roomId: string,
    imageId: string
  ) => {
    const building = buildings.find((b) => b.id === buildingId);
    const floor = building?.floors.find((f) => f.id === floorId);
    const room = floor?.rooms.find((r) => r.id === roomId);
    if (!room) return;

    const allImages = room.images.filter((i) => i.id !== imageId).map((img) => img.url);

    await apiUpdateRoomImages(roomId, allImages);
  };

  /* ---------- BED HANDLERS ---------- */
  const toggleBed = (
    _buildingId: string,
    _floorId: string,
    _roomId: string,
    bed: MockBed
  ) => {
    if (bed.isOccupied) {
      Swal.fire({
        title: "Vacate Bed?",
        text: "Mark this bed as vacant?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#C0392B",
        cancelButtonColor: "#888",
        confirmButtonText: "Yes, Vacate",
      }).then((r) => {
        if (r.isConfirmed) {
          apiToggleBed(bed.id, false);
        }
      });
    } else {
      apiToggleBed(bed.id, true, "Occupied");
    }
  };

  const addBed = (_buildingId: string, _floorId: string, roomId: string) =>
    apiAddBed(roomId);

  const removeBed = (_buildingId: string, _floorId: string, _roomId: string, bedId: string) =>
    Swal.fire({
      title: "Remove Bed?",
      text: "This will delete the bed from the room.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, remove",
    }).then((r) => {
      if (!r.isConfirmed) return;
      apiDeleteBed(bedId);
    });

  /* ---------- ROOM / FLOOR / BUILDING ADD + REMOVE ---------- */
  const addFloor = (buildingId: string) => {
    const b = buildings.find((x) => x.id === buildingId);
    const nextFloor = (b?.floors[b.floors.length - 1]?.floorNumber || 0) + 1;
    apiAddFloor(buildingId, nextFloor);
  };

  const removeFloor = (_buildingId: string, floorId: string) =>
    Swal.fire({
      title: "Remove Floor?",
      text: "All rooms & beds on this floor will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, remove",
    }).then((r) => {
      if (!r.isConfirmed) return;
      apiDeleteFloor(floorId);
    });

  const addRoom = (_buildingId: string, floorId: string) =>
    Swal.fire({
      title: "Add Room",
      input: "text",
      inputLabel: "Room number",
      inputPlaceholder: "e.g. 104",
      showCancelButton: true,
      confirmButtonColor: "#C0392B",
      confirmButtonText: "Add",
      inputValidator: (v) => (!v ? "Room number is required" : null),
    }).then((result) => {
      if (!result.isConfirmed || !result.value) return;
      Swal.fire({
        title: "Number of Beds",
        input: "number",
        inputLabel: "How many beds in this room?",
        inputAttributes: { min: "1", max: "20" },
        inputValue: "2",
        showCancelButton: true,
        confirmButtonColor: "#C0392B",
        confirmButtonText: "Create",
      }).then((r2) => {
        if (!r2.isConfirmed) return;
        const bedCount = Math.max(1, parseInt(String(r2.value || "1"), 10));
        apiAddRoom(floorId, String(result.value), bedCount);
      });
    });

  const removeRoom = (_buildingId: string, _floorId: string, roomId: string) =>
    Swal.fire({
      title: "Remove Room?",
      text: "This will delete the room and its beds.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, remove",
    }).then((r) => {
      if (!r.isConfirmed) return;
      apiDeleteRoom(roomId);
    });

  const addBuilding = () =>
    Swal.fire({
      title: "Add Building",
      input: "text",
      inputLabel: "Building name",
      inputPlaceholder: "e.g. New Wing",
      showCancelButton: true,
      confirmButtonColor: "#C0392B",
      confirmButtonText: "Next",
      inputValidator: (v) => (!v ? "Name is required" : null),
    }).then((r1) => {
      if (!r1.isConfirmed || !r1.value) return;
      Swal.fire({
        title: "Gender",
        input: "select",
        inputOptions: { Boys: "Boys Only", Girls: "Girls Only", "Co-ed": "Co-ed" },
        inputValue: "Boys",
        showCancelButton: true,
        confirmButtonColor: "#C0392B",
        confirmButtonText: "Create",
      }).then(async (r2) => {
        if (!r2.isConfirmed) return;
        const newB = await apiAddBuilding(String(r1.value), r2.value || "Boys");
        if (newB) setOpenBuildings((p) => ({ ...p, [newB.id]: true }));
      });
    });

  const removeBuilding = (buildingId: string) =>
    Swal.fire({
      title: "Delete Building?",
      text: "All floors, rooms, and beds will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete",
    }).then((r) => {
      if (!r.isConfirmed) return;
      apiDeleteBuilding(buildingId);
    });

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div>
      {/* PAGE HEADER */}
      <div
        style={{
          marginBottom: 32,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
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
            Hostel Structure
          </h1>
          <p
            style={{
              color: "#666",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 15,
            }}
          >
            Manage the full hierarchy — buildings, floors, rooms, and beds — in one place.
          </p>
        </div>
        <button
          onClick={addBuilding}
          className="wizard-btn wizard-btn-submit"
          style={{ padding: "10px 20px" }}
        >
          <IconPlus size={16} /> Add New Building
        </button>
      </div>

      {/* PORTFOLIO SUMMARY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {[
          {
            label: "Buildings",
            value: buildings.length,
            icon: <IconBuilding size={20} />,
            color: "#C0392B",
          },
          {
            label: "Floors",
            value: buildings.reduce((s, b) => s + b.floors.length, 0),
            icon: <IconLayers size={20} />,
            color: "#3b82f6",
          },
          {
            label: "Rooms",
            value: buildings.reduce((s, b) => s + countRooms(b), 0),
            icon: <IconHash size={20} />,
            color: "#8b5cf6",
          },
          {
            label: "Beds",
            value: buildings.reduce((s, b) => s + countBeds(b), 0),
            icon: <IconBed size={20} />,
            color: "#f59e0b",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "white",
              borderRadius: 14,
              padding: "16px 20px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: `${s.color}15`,
                color: s.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {s.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#2C2C2C",
                  fontFamily: "var(--font-plus-jakarta), sans-serif",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BUILDING LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {buildings.map((b) => {
          const isOpen = openBuildings[b.id] === true;
          const rooms = countRooms(b);
          const beds = countBeds(b);
          const occupied = countOccupied(b);
          const occupancyPct = beds > 0 ? Math.round((occupied / beds) * 100) : 0;

          return (
            <div
              key={b.id}
              className="wizard-card"
              style={{ margin: 0, padding: 0, overflow: "hidden" }}
            >
              {/* ===== BUILDING HEADER ===== */}
              <div
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  borderBottom: isOpen ? "1px solid #f0f0f0" : "none",
                  cursor: "pointer",
                  background: "linear-gradient(180deg,#fff,#fafbfc)",
                }}
                onClick={() => toggleBuilding(b.id)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: "rgba(192,57,43,0.08)",
                      color: "var(--wizard-red, #C0392B)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <IconBuilding size={24} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-plus-jakarta), sans-serif",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#2C2C2C",
                        margin: "0 0 4px",
                      }}
                    >
                      {b.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        fontSize: 13,
                        color: "#888",
                        fontWeight: 600,
                        flexWrap: "wrap",
                      }}
                    >
                      <span>{b.gender} Only</span>
                      <span>•</span>
                      <span>{b.floors.length} Floors</span>
                      <span>•</span>
                      <span>{rooms} Rooms</span>
                      <span>•</span>
                      <span>{beds} Beds</span>
                      <span>•</span>
                      <span style={{ color: occupancyPct > 80 ? "#dc2626" : "#16a34a" }}>
                        {occupancyPct}% Occupied
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="wizard-btn wizard-btn-back"
                    style={{ padding: "8px 14px", fontSize: 13 }}
                    onClick={() => addFloor(b.id)}
                  >
                    <IconPlus size={14} /> Add Floor
                  </button>
                  <button
                    className="wizard-btn wizard-btn-back"
                    style={{
                      padding: "8px 14px",
                      fontSize: 13,
                      color: "#dc2626",
                      borderColor: "#fecaca",
                    }}
                    onClick={() => removeBuilding(b.id)}
                  >
                    <IconTrash size={14} /> Delete
                  </button>
                  <button
                    onClick={() => toggleBuilding(b.id)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      border: "1px solid #e5e7eb",
                      background: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                    }}
                  >
                    <IconChevronDown size={18} />
                  </button>
                </div>
              </div>

              {/* ===== BUILDING BODY (collapsible) ===== */}
              {isOpen && (
                <div style={{ padding: 24, background: "#fafbfc" }}>
                  {/* Building Images */}
                  <SectionTitle>Building Cover Images</SectionTitle>
                  <ImageGrid
                    images={b.images}
                    onRemove={(imgId) => removeBuildingImage(b.id, imgId)}
                    onUpload={(files) => addBuildingImages(b.id, files)}
                    uploadKey={`b-${b.id}`}
                    fileInputs={fileInputs}
                    tileSize={120}
                    emptyLabel="Add Image"
                  />

                  {/* Floors */}
                  <div style={{ marginTop: 28 }}>
                    <SectionTitle>
                      <IconLayers size={14} /> Floors
                    </SectionTitle>

                    {b.floors.length === 0 && (
                      <EmptyState
                        msg="No floors yet."
                        actionLabel="+ Add First Floor"
                        onAction={() => addFloor(b.id)}
                      />
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {b.floors.map((f) => {
                        const fOpen = openFloors[f.id] === true;
                        return (
                          <div
                            key={f.id}
                            style={{
                              background: "white",
                              border: "1px solid #ececec",
                              borderRadius: 12,
                              overflow: "hidden",
                            }}
                          >
                            {/* FLOOR HEADER */}
                            <div
                              onClick={() => toggleFloor(f.id)}
                              style={{
                                padding: "14px 18px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                borderBottom: fOpen ? "1px solid #f0f0f0" : "none",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div
                                  style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 8,
                                    background: "#eef2ff",
                                    color: "#4f46e5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <IconLayers size={16} />
                                </div>
                                <div>
                                  <div
                                    style={{
                                      fontFamily: "var(--font-plus-jakarta), sans-serif",
                                      fontWeight: 700,
                                      fontSize: 15,
                                      color: "#2C2C2C",
                                    }}
                                  >
                                    Floor {f.floorNumber}
                                  </div>
                                  <div style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>
                                    {floorRoomCount(f)} Rooms • {floorBedCount(f)} Beds
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{ display: "flex", gap: 8, alignItems: "center" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="wizard-btn wizard-btn-back"
                                  style={{ padding: "6px 12px", fontSize: 12 }}
                                  onClick={() => addRoom(b.id, f.id)}
                                >
                                  <IconPlus size={12} /> Add Room
                                </button>
                                <button
                                  className="wizard-btn wizard-btn-back"
                                  style={{
                                    padding: "6px 10px",
                                    fontSize: 12,
                                    color: "#dc2626",
                                    borderColor: "#fecaca",
                                  }}
                                  onClick={() => removeFloor(b.id, f.id)}
                                >
                                  <IconTrash size={12} />
                                </button>
                                <button
                                  onClick={() => toggleFloor(f.id)}
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                    background: "white",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#666",
                                    transition: "transform 0.2s",
                                    transform: fOpen ? "rotate(0deg)" : "rotate(-90deg)",
                                  }}
                                >
                                  <IconChevronDown size={16} />
                                </button>
                              </div>
                            </div>

                            {/* FLOOR BODY */}
                            {fOpen && (
                              <div
                                style={{
                                  padding: 18,
                                  background: "#fafbfc",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 14,
                                }}
                              >
                                {f.rooms.length === 0 && (
                                  <EmptyState
                                    msg="No rooms on this floor."
                                    actionLabel="+ Add First Room"
                                    onAction={() => addRoom(b.id, f.id)}
                                  />
                                )}

                                {f.rooms.map((r) => (
                                  <RoomBlock
                                    key={r.id}
                                    room={r}
                                    onToggleBed={(bed) => toggleBed(b.id, f.id, r.id, bed)}
                                    onAddBed={() => addBed(b.id, f.id, r.id)}
                                    onRemoveBed={(bedId) => removeBed(b.id, f.id, r.id, bedId)}
                                    onAddImages={(files) => addRoomImages(b.id, f.id, r.id, files)}
                                    onRemoveImage={(imgId) =>
                                      removeRoomImage(b.id, f.id, r.id, imgId)
                                    }
                                    onRemoveRoom={() => removeRoom(b.id, f.id, r.id)}
                                    fileInputs={fileInputs}
                                    uploadKey={`r-${r.id}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
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

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: "#666",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 12,
        fontFamily: "var(--font-plus-jakarta), sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {children}
    </h4>
  );
}

function EmptyState({
  msg,
  actionLabel,
  onAction,
}: {
  msg: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div
      style={{
        padding: "22px 18px",
        borderRadius: 10,
        border: "1px dashed #d1d5db",
        background: "white",
        textAlign: "center",
        color: "#888",
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      <div style={{ marginBottom: actionLabel ? 10 : 0 }}>{msg}</div>
      {actionLabel && (
        <button
          onClick={onAction}
          style={{
            background: "transparent",
            border: "1.5px solid var(--wizard-red, #C0392B)",
            color: "var(--wizard-red, #C0392B)",
            padding: "6px 14px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "var(--font-dm-sans), sans-serif",
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function ImageGrid({
  images,
  onRemove,
  onUpload,
  uploadKey,
  fileInputs,
  tileSize = 110,
  emptyLabel = "Add Photo",
}: {
  images: MockImage[];
  onRemove: (id: string) => void;
  onUpload: (files: File[]) => void;
  uploadKey: string;
  fileInputs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  tileSize?: number;
  emptyLabel?: string;
}) {
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
          <img
            src={img.url}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button
            onClick={() => onRemove(img.id)}
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "white",
              color: "#dc2626",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <IconTrash size={12} />
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
          gap: 6,
          cursor: "pointer",
          transition: "all 0.2s",
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
        <IconImage size={22} color="#ccc" />
        <span style={{ fontSize: 11, fontWeight: 600, color: "#999" }}>{emptyLabel}</span>
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

function RoomBlock({
  room,
  onToggleBed,
  onAddBed,
  onRemoveBed,
  onAddImages,
  onRemoveImage,
  onRemoveRoom,
  fileInputs,
  uploadKey,
}: {
  room: MockRoom;
  onToggleBed: (bed: MockBed) => void;
  onAddBed: () => void;
  onRemoveBed: (bedId: string) => void;
  onAddImages: (files: File[]) => void;
  onRemoveImage: (id: string) => void;
  onRemoveRoom: () => void;
  fileInputs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  uploadKey: string;
}) {
  const occupied = room.beds.filter((b) => b.isOccupied).length;
  return (
    <div
      style={{
        background: "white",
        border: "1px solid #ececec",
        borderRadius: 12,
        padding: 18,
      }}
    >
      {/* Room Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#fff7ed",
              color: "#ea580c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconBed size={18} />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-plus-jakarta), sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#2C2C2C",
              }}
            >
              Room {room.roomNumber}
            </div>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 600 }}>
              {room.beds.length} Beds • {occupied} Occupied • {room.beds.length - occupied} Available
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onAddBed}
            className="wizard-btn wizard-btn-back"
            style={{ padding: "6px 12px", fontSize: 12 }}
          >
            <IconPlus size={12} /> Add Bed
          </button>
          <button
            onClick={onRemoveRoom}
            className="wizard-btn wizard-btn-back"
            style={{
              padding: "6px 10px",
              fontSize: 12,
              color: "#dc2626",
              borderColor: "#fecaca",
            }}
          >
            <IconTrash size={12} />
          </button>
        </div>
      </div>

      {/* Beds */}
      <div
        style={{
          background: "#fafafa",
          borderRadius: 10,
          padding: 14,
          border: "1px solid #f0f0f0",
          marginBottom: 14,
        }}
      >
        <SectionTitle>Bed Status</SectionTitle>
        {room.beds.length === 0 ? (
          <div style={{ fontSize: 13, color: "#888" }}>No beds yet — click "Add Bed" above.</div>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {room.beds.map((bed, i) => (
              <div
                key={bed.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: `1.5px solid ${bed.isOccupied ? "#fee2e2" : "#dcfce7"}`,
                  background: bed.isOccupied ? "#fffafa" : "#fafff9",
                  minWidth: 180,
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                }}
              >
                <div
                  onClick={() => onToggleBed(bed)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: bed.isOccupied ? "#ef4444" : "#22c55e",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 4px 12px ${bed.isOccupied ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`,
                    }}
                  >
                    {bed.isOccupied ? <IconX size={14} /> : <IconCheck size={14} />}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: bed.isOccupied ? "#991b1b" : "#166534",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      Bed {i + 1}
                      {bed.isOccupied && <span style={{ fontSize: 10, background: "#fee2e2", padding: "1px 6px", borderRadius: 100 }}>Occupied</span>}
                    </div>
                    <div style={{ fontSize: 11, color: bed.isOccupied ? "#7f1d1d" : "#166534", opacity: 0.8, marginTop: 2 }}>
                      {bed.isOccupied ? (bed.occupantName || "Occupied") : "Available"}
                      {bed.isOccupied && bed.occupiedDate && ` • ${bed.occupiedDate}`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveBed(bed.id)}
                  title="Remove bed"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "white",
                    border: "1px solid #e5e7eb",
                    color: "#888",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconTrash size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room Images */}
      <div>
        <SectionTitle>Room Photos</SectionTitle>
        <ImageGrid
          images={room.images}
          onRemove={onRemoveImage}
          onUpload={onAddImages}
          uploadKey={uploadKey}
          fileInputs={fileInputs}
          tileSize={90}
          emptyLabel="Add Photo"
        />
      </div>
    </div>
  );
}
