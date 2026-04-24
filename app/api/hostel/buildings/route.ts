import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Building from "@/lib/models/Building";
import Floor from "@/lib/models/Floor";
import Room from "@/lib/models/Room";
import Bed from "@/lib/models/Bed";

// GET /api/hostel/buildings?hostelId=xxx — returns full nested hierarchy
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const hostelId = req.nextUrl.searchParams.get("hostelId");
    if (!hostelId) return Response.json({ error: "hostelId required" }, { status: 400 });

    const buildings = await Building.find({ hostelId }).lean();

    // Build full nested structure
    const result = [];
    for (const b of buildings) {
      const floors = await Floor.find({ buildingId: b._id }).sort({ floorNumber: 1 }).lean();
      const floorData = [];
      for (const f of floors) {
        const rooms = await Room.find({ floorId: f._id }).lean();
        const roomData = [];
        for (const r of rooms) {
          const beds = await Bed.find({ roomId: r._id }).lean();
          roomData.push({
            id: r._id.toString(),
            roomNumber: r.roomNumber,
            beds: beds.map((bd) => ({
              id: bd._id.toString(),
              isOccupied: bd.isOccupied,
              occupantName: bd.occupantName || undefined,
              occupiedDate: bd.occupiedDate
                ? new Date(bd.occupiedDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
                : undefined,
            })),
            images: [],
          });
        }
        floorData.push({
          id: f._id.toString(),
          floorNumber: f.floorNumber,
          rooms: roomData,
        });
      }
      result.push({
        id: b._id.toString(),
        name: b.name,
        gender: b.gender,
        images: [],
        floors: floorData,
      });
    }

    return Response.json({ buildings: result });
  } catch (err: unknown) {
    console.error("GET buildings error:", err);
    return Response.json({ error: "Failed to fetch buildings" }, { status: 500 });
  }
}

// POST /api/hostel/buildings — add a new building
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { hostelId, name, gender } = await req.json();
    if (!hostelId || !name) return Response.json({ error: "hostelId and name required" }, { status: 400 });

    const building = await Building.create({ hostelId, name, gender: gender || "Co-ed" });

    return Response.json({
      success: true,
      building: { id: building._id.toString(), name: building.name, gender: building.gender, images: [], floors: [] },
    });
  } catch (err: unknown) {
    console.error("POST building error:", err);
    return Response.json({ error: "Failed to create building" }, { status: 500 });
  }
}

// PUT /api/hostel/buildings — edit a building
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { buildingId, name, gender } = await req.json();
    if (!buildingId) return Response.json({ error: "buildingId required" }, { status: 400 });

    const update: Record<string, string> = {};
    if (name) update.name = name;
    if (gender) update.gender = gender;

    await Building.findByIdAndUpdate(buildingId, update);
    return Response.json({ success: true });
  } catch (err: unknown) {
    console.error("PUT building error:", err);
    return Response.json({ error: "Failed to update building" }, { status: 500 });
  }
}

// DELETE /api/hostel/buildings — delete a building + all children
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { buildingId } = await req.json();
    if (!buildingId) return Response.json({ error: "buildingId required" }, { status: 400 });

    // Cascade delete: floors → rooms → beds
    const floors = await Floor.find({ buildingId });
    for (const f of floors) {
      const rooms = await Room.find({ floorId: f._id });
      for (const r of rooms) {
        await Bed.deleteMany({ roomId: r._id });
      }
      await Room.deleteMany({ floorId: f._id });
    }
    await Floor.deleteMany({ buildingId });
    await Building.findByIdAndDelete(buildingId);

    return Response.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE building error:", err);
    return Response.json({ error: "Failed to delete building" }, { status: 500 });
  }
}
