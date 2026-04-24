"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
}

export interface MockFloor {
  id: string;
  floorNumber: number;
  rooms: MockRoom[];
}

export interface MockBuilding {
  id: string;
  name: string;
  gender: "Boys" | "Girls" | "Co-ed";
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
  createdAt: string;
}

/* ============================================================
   HELPERS
   ============================================================ */

let _ctr = 0;
export const uid = (p = "id") => `${p}_${Date.now()}_${++_ctr}`;

export const makeBeds = (n: number): MockBed[] =>
  Array.from({ length: n }, () => ({
    id: uid("bed"),
    isOccupied: false,
  }));

/* ============================================================
   WIZARD → ADMIN DATA TRANSFORMER
   ============================================================ */

interface WizardBuilding {
  id: string;
  name: string;
  floors: number;
  gender: string;
}

interface WizardRoom {
  id: string;
  buildingId: string;
  floor: number;
  roomNumber: string;
  beds: number;
}

interface WizardListing {
  id: string;
  hostelName: string;
  city: string;
  town: string;
  adminFullName: string;
  adminEmail: string;
  adminPassword: string;
  buildings: WizardBuilding[];
  rooms: WizardRoom[];
  createdAt: string;
  // There may be other fields (pricing, images, etc.) we don't need here
  [key: string]: unknown;
}

function mapGender(g: string): "Boys" | "Girls" | "Co-ed" {
  const lower = g.toLowerCase();
  if (lower === "boys" || lower === "male") return "Boys";
  if (lower === "girls" || lower === "female") return "Girls";
  return "Co-ed";
}

function transformWizardToAdmin(listing: WizardListing): MockBuilding[] {
  return listing.buildings.map((wb) => {
    // Find rooms for this building
    const buildingRooms = listing.rooms.filter((r) => r.buildingId === wb.id);

    // Group rooms by floor number
    const floorMap = new Map<number, WizardRoom[]>();
    for (const room of buildingRooms) {
      const floorNum = room.floor;
      if (!floorMap.has(floorNum)) floorMap.set(floorNum, []);
      floorMap.get(floorNum)!.push(room);
    }

    // If no rooms yet, create empty floors based on the building's floor count
    const floors: MockFloor[] = [];
    const maxFloor = Math.max(wb.floors, ...Array.from(floorMap.keys()));
    for (let i = 1; i <= maxFloor; i++) {
      const floorRooms = floorMap.get(i) || [];
      floors.push({
        id: `fl_${wb.id}_${i}`,
        floorNumber: i,
        rooms: floorRooms.map((wr) => ({
          id: wr.id,
          roomNumber: wr.roomNumber,
          beds: makeBeds(wr.beds || 2),
          images: [],
        })),
      });
    }

    return {
      id: wb.id,
      name: wb.name,
      gender: mapGender(wb.gender),
      images: [],
      floors,
    };
  });
}

/* ============================================================
   LOCALSTORAGE KEYS
   ============================================================ */

const LS_LISTINGS = "hostelIn_listings";
const LS_ACTIVE = "hostelIn_activeHostel";
const LS_ADMIN_DATA = "hostelIn_adminData"; // persisted admin state

/* ============================================================
   LOAD DATA FROM LOCALSTORAGE
   ============================================================ */

function loadAdminState(): { buildings: MockBuilding[]; meta: HostelMeta | null } {
  try {
    const activeId = localStorage.getItem(LS_ACTIVE);
    if (!activeId) return { buildings: [], meta: null };

    // First check if admin has made edits (persisted admin data)
    const savedAdmin = localStorage.getItem(LS_ADMIN_DATA);
    if (savedAdmin) {
      const parsed = JSON.parse(savedAdmin);
      if (parsed.hostelId === activeId && parsed.buildings) {
        return {
          buildings: parsed.buildings,
          meta: parsed.meta || null,
        };
      }
    }

    // Otherwise, transform from wizard listings
    const listingsRaw = localStorage.getItem(LS_LISTINGS);
    if (!listingsRaw) return { buildings: [], meta: null };

    const listings: WizardListing[] = JSON.parse(listingsRaw);
    const listing = listings.find((l) => l.id === activeId);
    if (!listing) return { buildings: [], meta: null };

    const buildings = transformWizardToAdmin(listing);
    const meta: HostelMeta = {
      hostelName: listing.hostelName,
      city: listing.city,
      town: listing.town || "",
      adminFullName: listing.adminFullName,
      adminEmail: listing.adminEmail,
      hostelId: listing.id,
      createdAt: listing.createdAt,
    };

    return { buildings, meta };
  } catch (err) {
    console.error("Failed to load admin state:", err);
    return { buildings: [], meta: null };
  }
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
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

/* ============================================================
   PROVIDER
   ============================================================ */

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [buildings, setBuildings] = useState<MockBuilding[]>([]);
  const [meta, setMeta] = useState<HostelMeta | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    const state = loadAdminState();
    setBuildings(state.buildings);
    setMeta(state.meta);
    setLoaded(true);
  }, []);

  // Persist changes to localStorage whenever buildings change
  useEffect(() => {
    if (!loaded) return; // Don't persist the initial empty state
    try {
      const activeId = localStorage.getItem(LS_ACTIVE);
      if (activeId) {
        localStorage.setItem(
          LS_ADMIN_DATA,
          JSON.stringify({ hostelId: activeId, buildings, meta })
        );
      }
    } catch (err) {
      console.error("Failed to persist admin state:", err);
    }
  }, [buildings, meta, loaded]);

  return (
    <AdminDataContext.Provider value={{ buildings, setBuildings, meta, setMeta }}>
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
