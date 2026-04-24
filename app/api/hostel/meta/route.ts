import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Hostel from "@/lib/models/Hostel";
import { Types } from "mongoose";

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { hostelId, ...updates } = body;

    if (!hostelId || !Types.ObjectId.isValid(hostelId)) {
      return Response.json({ error: "Invalid Hostel ID" }, { status: 400 });
    }

    const hostel = await Hostel.findByIdAndUpdate(hostelId, { $set: updates }, { new: true });
    
    if (!hostel) {
      return Response.json({ error: "Hostel not found" }, { status: 404 });
    }

    // Propagate hostelType to all buildings if it was updated
    if (updates.hostelType) {
      const Building = (await import("@/lib/models/Building")).default;
      await Building.updateMany(
        { hostelId },
        { $set: { gender: updates.hostelType } }
      );
    }

    return Response.json({ success: true, hostel });
  } catch (err: any) {
    console.error("Update meta error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
