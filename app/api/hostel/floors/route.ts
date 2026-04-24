import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Floor from "@/lib/models/Floor";
import Room from "@/lib/models/Room";
import Bed from "@/lib/models/Bed";

// POST /api/hostel/floors — add a floor
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { buildingId, floorNumber } = await req.json();
    if (!buildingId || !floorNumber) return Response.json({ error: "buildingId and floorNumber required" }, { status: 400 });

    const floor = await Floor.create({ buildingId, floorNumber });
    return Response.json({
      success: true,
      floor: { id: floor._id.toString(), floorNumber: floor.floorNumber, rooms: [] },
    });
  } catch (err: unknown) {
    console.error("POST floor error:", err);
    return Response.json({ error: "Failed to create floor" }, { status: 500 });
  }
}

// PUT /api/hostel/floors — edit a floor
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { floorId, floorNumber } = await req.json();
    if (!floorId) return Response.json({ error: "floorId required" }, { status: 400 });

    await Floor.findByIdAndUpdate(floorId, { floorNumber });
    return Response.json({ success: true });
  } catch (err: unknown) {
    console.error("PUT floor error:", err);
    return Response.json({ error: "Failed to update floor" }, { status: 500 });
  }
}

// DELETE /api/hostel/floors — delete floor + children
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { floorId } = await req.json();
    if (!floorId) return Response.json({ error: "floorId required" }, { status: 400 });

    const rooms = await Room.find({ floorId });
    for (const r of rooms) {
      await Bed.deleteMany({ roomId: r._id });
    }
    await Room.deleteMany({ floorId });
    await Floor.findByIdAndDelete(floorId);

    return Response.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE floor error:", err);
    return Response.json({ error: "Failed to delete floor" }, { status: 500 });
  }
}
