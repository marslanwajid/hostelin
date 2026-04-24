import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Room from "@/lib/models/Room";
import Bed from "@/lib/models/Bed";
 


// POST /api/hostel/rooms — add a room with beds
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { floorId, roomNumber, bedCount, images, priceMonthly } = await req.json();
    if (!floorId || !roomNumber) return Response.json({ error: "floorId and roomNumber required" }, { status: 400 });

    const room = await Room.create({ floorId, roomNumber, images: images || [], priceMonthly: priceMonthly || 0 });

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
        priceMonthly: room.priceMonthly || 0,
        beds: beds.map((b) => ({ id: b._id.toString(), isOccupied: false })),
        images: (room.images || []).map((url: string) => ({ id: url.slice(-10), url })),
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
    const { roomId, roomNumber, priceMonthly } = await req.json();
    if (!roomId) return Response.json({ error: "roomId required" }, { status: 400 });

    const updateData: any = {};
    if (roomNumber !== undefined) updateData.roomNumber = roomNumber;
    if (priceMonthly !== undefined) updateData.priceMonthly = priceMonthly;

    await Room.findByIdAndUpdate(roomId, updateData);
    return Response.json({ success: true });
  } catch (err: unknown) {
    console.error("PUT room error:", err);
    return Response.json({ error: "Failed to update room" }, { status: 500 });
  }
}

// PATCH /api/hostel/rooms — update room images
export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { roomId, images } = body;
    console.log(`📸 PATCH rooms request for ${roomId}, image count: ${images?.length || 0}`);

    if (!roomId) return Response.json({ error: "roomId required" }, { status: 400 });

    const updated = await Room.findByIdAndUpdate(roomId, { images }, { new: true });
    if (updated) {
      console.log(`✅ Updated room ${updated.roomNumber} with ${updated.images.length} images`);
    } else {
      console.log(`❌ Room ${roomId} not found`);
    }

    return Response.json({ success: true });
  } catch (err: any) {
    console.error("PATCH room error:", err);
    return Response.json({ error: err.message || "Failed to update images" }, { status: 500 });
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
