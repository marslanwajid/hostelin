import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Hostel from "@/lib/models/Hostel";
import Building from "@/lib/models/Building";
import Floor from "@/lib/models/Floor";
import Room from "@/lib/models/Room";
import Bed from "@/lib/models/Bed";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    console.log(`[DETAIL API] ID received: "${id}"`);

    if (!Types.ObjectId.isValid(id)) {
      console.log(`[DETAIL API] Invalid ObjectId: "${id}"`);
      return Response.json({ error: "Invalid ID" }, { status: 400 });
    }

    const hostel: any = await Hostel.findById(id).lean();
    if (!hostel) {
      console.log(`[DETAIL API] Not found for ID: "${id}"`);
      return Response.json({ error: "Hostel not found" }, { status: 404 });
    }
    console.log(`[DETAIL API] Found: "${hostel.hostelName}"`);

    // Fetch related data targeted to this hostel
    const buildings = await Building.find({ hostelId: id }).lean();
    const bIds = buildings.map(b => b._id);

    const floors = await Floor.find({ buildingId: { $in: bIds } }).lean();
    const fIds = floors.map(f => f._id);

    const rooms = await Room.find({ floorId: { $in: fIds } }).lean();
    const rIds = rooms.map(r => r._id);

    const beds = await Bed.find({ roomId: { $in: rIds } }).lean();

    console.log(`[DETAIL API] ${buildings.length} buildings, ${floors.length} floors, ${rooms.length} rooms, ${beds.length} beds`);

    // Assemble hierarchy
    const buildingsWithData = buildings.map((b: any) => {
      const bId = b._id.toString();
      const bFloors = floors
        .filter((f: any) => f.buildingId?.toString() === bId)
        .map((f: any) => {
          const fId = f._id.toString();
          const fRooms = rooms
            .filter((r: any) => r.floorId?.toString() === fId)
            .map((r: any) => {
              const rId = r._id.toString();
              const rBeds = beds.filter((bed: any) => bed.roomId?.toString() === rId);
              return { ...r, _id: rId, beds: rBeds };
            });
          return { ...f, _id: fId, rooms: fRooms };
        });
      return { ...b, _id: bId, floors: bFloors };
    });

    // Calculate starting price from room data
    let minPrice = Infinity;
    rooms.forEach((r: any) => {
      if (r.priceMonthly && r.priceMonthly > 0 && r.priceMonthly < minPrice) {
        minPrice = r.priceMonthly;
      }
    });

    return Response.json({
      ...hostel,
      id: hostel._id.toString(),
      buildings: buildingsWithData,
      startingPrice: minPrice === Infinity ? 0 : minPrice
    });
  } catch (err: any) {
    console.error("[DETAIL API ERROR]", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
