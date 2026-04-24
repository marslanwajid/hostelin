import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Bed from "@/lib/models/Bed";

// POST /api/hostel/beds — add a bed to a room
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { roomId } = await req.json();
    if (!roomId) return Response.json({ error: "roomId required" }, { status: 400 });

    const bed = await Bed.create({ roomId, isOccupied: false, occupantName: "", occupiedDate: null });
    return Response.json({
      success: true,
      bed: { id: bed._id.toString(), isOccupied: false },
    });
  } catch (err: unknown) {
    console.error("POST bed error:", err);
    return Response.json({ error: "Failed to create bed" }, { status: 500 });
  }
}

// PUT /api/hostel/beds — toggle occupied/vacant
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const { bedId, isOccupied, occupantName } = await req.json();
    if (!bedId) return Response.json({ error: "bedId required" }, { status: 400 });

    const update: Record<string, unknown> = {
      isOccupied: !!isOccupied,
      occupantName: isOccupied ? (occupantName || "Occupied") : "",
      occupiedDate: isOccupied ? new Date() : null,
    };

    await Bed.findByIdAndUpdate(bedId, update);
    return Response.json({ success: true });
  } catch (err: unknown) {
    console.error("PUT bed error:", err);
    return Response.json({ error: "Failed to update bed" }, { status: 500 });
  }
}

// DELETE /api/hostel/beds — delete a bed
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { bedId } = await req.json();
    if (!bedId) return Response.json({ error: "bedId required" }, { status: 400 });

    await Bed.findByIdAndDelete(bedId);
    return Response.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE bed error:", err);
    return Response.json({ error: "Failed to delete bed" }, { status: 500 });
  }
}
