"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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

/* ============================================================
   HELPERS
   ============================================================ */

export const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

export const makeBeds = (n: number, occupiedIdx: number[] = []): MockBed[] =>
  Array.from({ length: n }, (_, i) => ({
    id: uid("bed"),
    isOccupied: occupiedIdx.includes(i),
    occupantName: occupiedIdx.includes(i) ? "Occupant" : undefined,
  }));

/* ============================================================
   INITIAL MOCK DATA
   ============================================================ */

const INITIAL_DATA: MockBuilding[] = [
  {
    id: "b1",
    name: "Main Boys Hostel",
    gender: "Boys",
    images: [],
    floors: [
      {
        id: "fl_b1_1",
        floorNumber: 1,
        rooms: [
          { id: "rm_b1_101", roomNumber: "101", beds: [
            { id: "bed_b1_101_1", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b1_101_2", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b1_101_3", isOccupied: false },
          ], images: [] },
          { id: "rm_b1_102", roomNumber: "102", beds: [
            { id: "bed_b1_102_1", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b1_102_2", isOccupied: false },
          ], images: [] },
          { id: "rm_b1_103", roomNumber: "103", beds: [
            { id: "bed_b1_103_1", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b1_103_2", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b1_103_3", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b1_103_4", isOccupied: false },
          ], images: [] },
        ],
      },
      {
        id: "fl_b1_2",
        floorNumber: 2,
        rooms: [
          { id: "rm_b1_201", roomNumber: "201", beds: [
            { id: "bed_b1_201_1", isOccupied: false },
            { id: "bed_b1_201_2", isOccupied: false },
          ], images: [] },
          { id: "rm_b1_202", roomNumber: "202", beds: [
            { id: "bed_b1_202_1", isOccupied: false },
            { id: "bed_b1_202_2", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b1_202_3", isOccupied: false },
          ], images: [] },
        ],
      },
      {
        id: "fl_b1_3",
        floorNumber: 3,
        rooms: [
          { id: "rm_b1_301", roomNumber: "301", beds: [
            { id: "bed_b1_301_1", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b1_301_2", isOccupied: true, occupantName: "Occupant" },
          ], images: [] },
        ],
      },
    ],
  },
  {
    id: "b2",
    name: "Girls Annex",
    gender: "Girls",
    images: [],
    floors: [
      {
        id: "fl_b2_1",
        floorNumber: 1,
        rooms: [
          { id: "rm_b2_101", roomNumber: "101", beds: [
            { id: "bed_b2_101_1", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b2_101_2", isOccupied: false },
          ], images: [] },
          { id: "rm_b2_102", roomNumber: "102", beds: [
            { id: "bed_b2_102_1", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b2_102_2", isOccupied: true, occupantName: "Occupant" },
            { id: "bed_b2_102_3", isOccupied: false },
          ], images: [] },
        ],
      },
      {
        id: "fl_b2_2",
        floorNumber: 2,
        rooms: [
          { id: "rm_b2_201", roomNumber: "201", beds: [
            { id: "bed_b2_201_1", isOccupied: false },
            { id: "bed_b2_201_2", isOccupied: false },
          ], images: [] },
        ],
      },
    ],
  },
];


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
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

/* ============================================================
   PROVIDER
   ============================================================ */

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [buildings, setBuildings] = useState<MockBuilding[]>(INITIAL_DATA);

  return (
    <AdminDataContext.Provider value={{ buildings, setBuildings }}>
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
