"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

export const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

export const makeBeds = (n: number, occupiedIdx: number[] = []): MockBed[] =>
  Array.from({ length: n }, (_, i) => ({
    id: uid("bed"),
    isOccupied: occupiedIdx.includes(i),
    occupantName: occupiedIdx.includes(i) ? "Occupant" : undefined,
  }));

export const INITIAL_DATA: MockBuilding[] = [
  {
    id: "b1",
    name: "Main Boys Hostel",
    gender: "Boys",
    images: [],
    floors: [
      {
        id: uid("fl"),
        floorNumber: 1,
        rooms: [
          { id: uid("rm"), roomNumber: "101", beds: makeBeds(3, [0, 1]), images: [] },
          { id: uid("rm"), roomNumber: "102", beds: makeBeds(2, [0]), images: [] },
          { id: uid("rm"), roomNumber: "103", beds: makeBeds(4, [0, 1, 2]), images: [] },
        ],
      },
      {
        id: uid("fl"),
        floorNumber: 2,
        rooms: [
          { id: uid("rm"), roomNumber: "201", beds: makeBeds(2), images: [] },
          { id: uid("rm"), roomNumber: "202", beds: makeBeds(3, [1]), images: [] },
        ],
      },
      {
        id: uid("fl"),
        floorNumber: 3,
        rooms: [
          { id: uid("rm"), roomNumber: "301", beds: makeBeds(2, [0, 1]), images: [] },
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
        id: uid("fl"),
        floorNumber: 1,
        rooms: [
          { id: uid("rm"), roomNumber: "101", beds: makeBeds(2, [0]), images: [] },
          { id: uid("rm"), roomNumber: "102", beds: makeBeds(3, [0, 1]), images: [] },
        ],
      },
      {
        id: uid("fl"),
        floorNumber: 2,
        rooms: [
          { id: uid("rm"), roomNumber: "201", beds: makeBeds(2), images: [] },
        ],
      },
    ],
  },
];

interface HostelContextType {
  buildings: MockBuilding[];
  setBuildings: React.Dispatch<React.SetStateAction<MockBuilding[]>>;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export function HostelProvider({ children }: { children: React.ReactNode }) {
  const [buildings, setBuildings] = useState<MockBuilding[]>(INITIAL_DATA);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hostel_data");
    if (saved) {
      try {
        setBuildings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse mock data");
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("hostel_data", JSON.stringify(buildings));
    }
  }, [buildings, mounted]);

  if (!mounted) return null;

  return (
    <HostelContext.Provider value={{ buildings, setBuildings }}>
      {children}
    </HostelContext.Provider>
  );
}

export function useHostel() {
  const ctx = useContext(HostelContext);
  if (!ctx) throw new Error("useHostel must be used within HostelProvider");
  return ctx;
}
