import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Room from "@/lib/models/Room";
import Bed from "@/lib/models/Bed";

// POST /api/hostel/rooms — add a room with beds
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { floorId, roomNumber, bedCount } = await req.json();
    if (!floorId || !roomNumber) return Response.json({ error: "floorId and roomNumber required" }, { status: 400 });

    const room = await Room.create({ floorId, roomNumber });

    // Create beds
    const count = bedCount || 2;
    const bedDocs = Array.from({ length: count }, () => ({
      roomId: room._id,
      isOccupied: false,
      occupantName: "",
      occupiedDate: null,
    }));
    const beds = await Bed.insertMany(bedDocs);

    return Response.json({
      success: true,
      room: {
        id: room._id.toString(),
        roomNumber: room.roomNumber,
        beds: beds.map((b) => ({ id: b._id.toString(), isOccupied: false })),
        images: [],
      },
    });
  } catch (err: unknown) {
    console.error("POST room error:", err);
    return Response.json({ error: "Failed to create room" }, { status: 500 });
  }
}

// PUT /api/hostel/rooms — edit a room
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { roomId, roomNumber } = await req.json();
    if (!roomId) return Response.json({ error: "roomId required" }, { status: 400 });

    await Room.findByIdAndUpdate(roomId, { roomNumber });
    return Response.json({ success: true });
  } catch (err: unknown) {
    console.error("PUT room error:", err);
    return Response.json({ error: "Failed to update room" }, { status: 500 });
  }
}

// DELETE /api/hostel/rooms — delete room + beds
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { roomId } = await req.json();
    if (!roomId) return Response.json({ error: "roomId required" }, { status: 400 });

    await Bed.deleteMany({ roomId });
    await Room.findByIdAndDelete(roomId);
    return Response.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE room error:", err);
    return Response.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
