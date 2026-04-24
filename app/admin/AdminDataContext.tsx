"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

/* ============================================================
   SHARED TYPES
   ============================================================ */

export interface MockImage {
  id: string;
  url: string;
}

export interface MockBed {
  id: string;
  isOccupied: boolean;
  occupantName?: string;
  occupiedDate?: string;
}

export interface MockRoom {
  id: string;
  roomNumber: string;
  beds: MockBed[];
  images: MockImage[];
  priceMonthly?: number;
}

export interface MockFloor {
  id: string;
  floorNumber: number;
  rooms: MockRoom[];
}

export interface MockBuilding {
  id: string;
  name: string;
  gender: "Male" | "Female" | "Both";
  images: MockImage[];
  floors: MockFloor[];
}

export interface HostelMeta {
  hostelName: string;
  city: string;
  town: string;
  adminFullName: string;
  adminEmail: string;
  hostelId: string;
  images: string[];
  hostelType: "Male" | "Female" | "Both";
  description: string;
}

/* ============================================================
   DERIVED STAT HELPERS
   ============================================================ */

export const countRooms = (b: MockBuilding) =>
  b.floors.reduce((s, f) => s + f.rooms.length, 0);

export const countBeds = (b: MockBuilding) =>
  b.floors.reduce((s, f) => s + f.rooms.reduce((s2, r) => s2 + r.beds.length, 0), 0);

export const countOccupied = (b: MockBuilding) =>
  b.floors.reduce(
    (s, f) => s + f.rooms.reduce((s2, r) => s2 + r.beds.filter((bd) => bd.isOccupied).length, 0),
    0
  );

export const floorRoomCount = (f: MockFloor) => f.rooms.length;
export const floorBedCount = (f: MockFloor) => f.rooms.reduce((s, r) => s + r.beds.length, 0);

/* ============================================================
   CONTEXT INTERFACE
   ============================================================ */

interface AdminDataContextType {
  buildings: MockBuilding[];
  setBuildings: React.Dispatch<React.SetStateAction<MockBuilding[]>>;
  meta: HostelMeta | null;
  setMeta: React.Dispatch<React.SetStateAction<HostelMeta | null>>;
  loading: boolean;
  refetch: () => Promise<void>;
  // API helpers for CRUD (so pages don't need to manage fetch + state sync)
  apiAddBuilding: (name: string, gender: string) => Promise<MockBuilding | null>;
  apiEditBuilding: (buildingId: string, name: string, gender: string) => Promise<boolean>;
  apiDeleteBuilding: (buildingId: string) => Promise<boolean>;
  apiAddFloor: (buildingId: string, floorNumber: number) => Promise<MockFloor | null>;
  apiEditFloor: (floorId: string, floorNumber: number) => Promise<boolean>;
  apiDeleteFloor: (floorId: string) => Promise<boolean>;
  apiAddRoom: (floorId: string, roomNumber: string, bedCount: number, priceMonthly?: number) => Promise<MockRoom | null>;
  apiEditRoom: (roomId: string, roomNumber: string, priceMonthly?: number) => Promise<boolean>;
  apiDeleteRoom: (roomId: string) => Promise<boolean>;
  apiAddBed: (roomId: string) => Promise<MockBed | null>;
  apiToggleBed: (bedId: string, isOccupied: boolean, occupantName?: string) => Promise<boolean>;
  apiDeleteBed: (bedId: string) => Promise<boolean>;
  apiUpdateBuildingImages: (buildingId: string, images: string[]) => Promise<boolean>;
  apiUpdateRoomImages: (roomId: string, images: string[]) => Promise<boolean>;
  apiUpdateHostelMeta: (updated: Partial<HostelMeta>) => Promise<boolean>;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

/* ============================================================
   PROVIDER
   ============================================================ */

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [buildings, setBuildings] = useState<MockBuilding[]>([]);
  const [meta, setMeta] = useState<HostelMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBuildings = useCallback(async () => {
    try {
      const hostelId = localStorage.getItem("hostelIn_activeHostel");
      if (!hostelId) { setLoading(false); return; }

      // Also load meta from localStorage (set at login time)
      const metaStr = localStorage.getItem("hostelIn_meta");
      if (metaStr) {
        try { setMeta(JSON.parse(metaStr)); } catch {}
      }

      const res = await fetch(`/api/hostel/buildings?hostelId=${hostelId}`);
      const data = await res.json();
      if (data.buildings) {
        setBuildings(data.buildings);
      }
      if (data.hostel) {
        setMeta({
          hostelName: data.hostel.hostelName,
          city: data.hostel.city,
          town: data.hostel.town,
          adminFullName: data.hostel.adminFullName,
          adminEmail: data.hostel.adminEmail,
          hostelId: data.hostel._id,
          images: data.hostel.images || [],
          hostelType: data.hostel.hostelType || "Both",
          description: data.hostel.description || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch buildings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBuildings(); }, [fetchBuildings]);

  // ── API Helpers ──────────────────────────────────────────

  const hostelId = () => localStorage.getItem("hostelIn_activeHostel") || "";

  const apiAddBuilding = async (name: string, gender: string): Promise<MockBuilding | null> => {
    try {
      const res = await fetch("/api/hostel/buildings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostelId: hostelId(), name, gender }),
      });
      const data = await res.json();
      if (data.building) {
        const b = data.building;
        const newB: MockBuilding = {
          id: (b.id || b._id).toString(),
          name: b.name,
          gender: b.gender,
          images: [],
          floors: [],
        };
        setBuildings((prev) => [...prev, newB]);
        return newB;
      }
    } catch (err) { console.error(err); }
    return null;
  };

  const apiEditBuilding = async (buildingId: string, name: string, gender: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/hostel/buildings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildingId, name, gender }),
      });
      const data = await res.json();
      if (data.success) {
        setBuildings((prev) => prev.map((b) => b.id === buildingId ? { ...b, name, gender: gender as MockBuilding["gender"] } : b));
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const apiDeleteBuilding = async (buildingId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/hostel/buildings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildingId }),
      });
      const data = await res.json();
      if (data.success) {
        setBuildings((prev) => prev.filter((b) => b.id !== buildingId));
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const apiAddFloor = async (buildingId: string, floorNumber: number): Promise<MockFloor | null> => {
    try {
      const res = await fetch("/api/hostel/floors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildingId, floorNumber }),
      });
      const data = await res.json();
      if (data.floor) {
        const f = data.floor;
        const newF: MockFloor = {
          id: (f.id || f._id).toString(),
          floorNumber: f.floorNumber,
          rooms: [],
        };
        setBuildings((prev) => prev.map((b) => b.id === buildingId ? { ...b, floors: [...b.floors, newF] } : b));
        return newF;
      }
    } catch (err) { console.error(err); }
    return null;
  };

  const apiEditFloor = async (floorId: string, floorNumber: number): Promise<boolean> => {
    try {
      const res = await fetch("/api/hostel/floors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ floorId, floorNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setBuildings((prev) => prev.map((b) => ({
          ...b,
          floors: b.floors.map((f) => f.id === floorId ? { ...f, floorNumber } : f),
        })));
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const apiDeleteFloor = async (floorId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/hostel/floors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ floorId }),
      });
      const data = await res.json();
      if (data.success) {
        setBuildings((prev) => prev.map((b) => ({
          ...b,
          floors: b.floors.filter((f) => f.id !== floorId),
        })));
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const apiAddRoom = async (floorId: string, roomNumber: string, bedCount: number, priceMonthly?: number): Promise<MockRoom | null> => {
    try {
      const res = await fetch("/api/hostel/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ floorId, roomNumber, bedCount, priceMonthly: priceMonthly || 0 }),
      });
      const data = await res.json();
      if (data.room) {
        const r = data.room;
        const newR: MockRoom = {
          id: (r.id || r._id).toString(),
          roomNumber: r.roomNumber,
          images: [],
          priceMonthly: r.priceMonthly || 0,
          beds: (r.beds || []).map((bd: any) => ({
            id: (bd.id || bd._id).toString(),
            isOccupied: false,
          })),
        };
        setBuildings((prev) => prev.map((b) => ({
          ...b,
          floors: b.floors.map((f) => f.id === floorId ? { ...f, rooms: [...f.rooms, newR] } : f),
        })));
        return newR;
      }
    } catch (err) { console.error(err); }
    return null;
  };

  const apiEditRoom = async (roomId: string, roomNumber: string, priceMonthly?: number): Promise<boolean> => {
    try {
      const res = await fetch("/api/hostel/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, roomNumber, priceMonthly }),
      });
      const data = await res.json();
      if (data.success) {
        setBuildings((prev) => prev.map((b) => ({
          ...b,
          floors: b.floors.map((f) => ({
            ...f,
            rooms: f.rooms.map((r) => r.id === roomId ? { ...r, roomNumber, priceMonthly: priceMonthly ?? r.priceMonthly } : r),
          })),
        })));
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const apiDeleteRoom = async (roomId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/hostel/rooms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      const data = await res.json();
      if (data.success) {
        setBuildings((prev) => prev.map((b) => ({
          ...b,
          floors: b.floors.map((f) => ({
            ...f,
            rooms: f.rooms.filter((r) => r.id !== roomId),
          })),
        })));
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const apiAddBed = async (roomId: string): Promise<MockBed | null> => {
    try {
      const res = await fetch("/api/hostel/beds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      const data = await res.json();
      if (data.bed) {
        const bd = data.bed;
        const newBed: MockBed = {
          id: (bd.id || bd._id).toString(),
          isOccupied: false,
        };
        setBuildings((prev) => prev.map((b) => ({
          ...b,
          floors: b.floors.map((f) => ({
            ...f,
            rooms: f.rooms.map((r) => r.id === roomId ? { ...r, beds: [...r.beds, newBed] } : r),
          })),
        })));
        return newBed;
      }
    } catch (err) { console.error(err); }
    return null;
  };

  const apiToggleBed = async (bedId: string, isOccupied: boolean, occupantName?: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/hostel/beds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bedId, isOccupied, occupantName }),
      });
      const data = await res.json();
      if (data.success) {
        const today = isOccupied
          ? new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
          : undefined;
        setBuildings((prev) => prev.map((b) => ({
          ...b,
          floors: b.floors.map((f) => ({
            ...f,
            rooms: f.rooms.map((r) => ({
              ...r,
              beds: r.beds.map((bd) =>
                bd.id === bedId ? { ...bd, isOccupied, occupantName: isOccupied ? (occupantName || "Occupied") : undefined, occupiedDate: today } : bd
              ),
            })),
          })),
        })));
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const apiDeleteBed = async (bedId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/hostel/beds", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bedId }),
      });
      const data = await res.json();
      if (data.success) {
        setBuildings((prev) => prev.map((b) => ({
          ...b,
          floors: b.floors.map((f) => ({
            ...f,
            rooms: f.rooms.map((r) => ({
              ...r,
              beds: r.beds.filter((bd) => bd.id !== bedId),
            })),
          })),
        })));
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  const apiUpdateBuildingImages = async (buildingId: string, images: string[]): Promise<boolean> => {
    try {
      console.log(`🚀 Sending PATCH to /api/hostel/buildings for building ${buildingId}, images: ${images.length}`);
      const res = await fetch("/api/hostel/buildings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildingId, images }),
      });
      const data = await res.json();
      console.log(`📩 PATCH response:`, data);
      if (data.success) {
        setBuildings((prev) =>
          prev.map((b) =>
            b.id === buildingId
              ? { ...b, images: images.map((url) => ({ id: url.slice(-10), url })) }
              : b
          )
        );
        return true;
      }
    } catch (err) {
      console.error("apiUpdateBuildingImages error:", err);
    }
    return false;
  };

  const apiUpdateRoomImages = async (roomId: string, images: string[]): Promise<boolean> => {
    try {
      console.log(`🚀 Sending PATCH to /api/hostel/rooms for room ${roomId}, images: ${images.length}`);
      const res = await fetch("/api/hostel/rooms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, images }),
      });
      const data = await res.json();
      console.log(`📩 PATCH room response:`, data);
      if (data.success) {
        setBuildings((prev) =>
          prev.map((b) => ({
            ...b,
            floors: b.floors.map((f) => ({
              ...f,
              rooms: f.rooms.map((r) =>
                r.id === roomId
                  ? { ...r, images: images.map((url) => ({ id: url.slice(-10), url })) }
                  : r
              ),
            })),
          }))
        );
        return true;
      }
    } catch (err) {
      console.error("apiUpdateRoomImages error:", err);
    }
    return false;
  };

  const apiUpdateHostelMeta = async (updated: Partial<HostelMeta>): Promise<boolean> => {
    try {
      const res = await fetch("/api/hostel/meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostelId: hostelId(), ...updated }),
      });
      const data = await res.json();
      if (data.success) {
        setMeta(data.hostel);
        if (updated.hostelType) {
          fetchBuildings();
        }
        return true;
      }
    } catch (err) { console.error(err); }
    return false;
  };

  return (
    <AdminDataContext.Provider
      value={{
        buildings, setBuildings, meta, setMeta, loading,
        refetch: fetchBuildings,
        apiAddBuilding, apiEditBuilding, apiDeleteBuilding,
        apiAddFloor, apiEditFloor, apiDeleteFloor,
        apiAddRoom, apiEditRoom, apiDeleteRoom,
        apiAddBed, apiToggleBed, apiDeleteBed,
        apiUpdateBuildingImages, apiUpdateRoomImages,
        apiUpdateHostelMeta,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

/* ============================================================
   HOOK
   ============================================================ */

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
