import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Hostel from "@/lib/models/Hostel";
import Building from "@/lib/models/Building";
import Floor from "@/lib/models/Floor";
import Room from "@/lib/models/Room";
import Bed from "@/lib/models/Bed";
 
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const {
      hostelName, city, town, registrationNumber, fullAddress,
      adminFullName, adminEmail, adminPassword,
      buildings, rooms, pricing
    } = body;

    // Check if email already exists
    const existing = await Hostel.findOne({ adminEmail: adminEmail.toLowerCase() });
    if (existing) {
      return Response.json({ error: "A hostel with this email already exists." }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create hostel
    const hostel = await Hostel.create({
      hostelName, city, town, registrationNumber, fullAddress,
      adminFullName,
      adminEmail: adminEmail.toLowerCase(),
      adminPassword: hashedPassword,
      images: body.hostelImages || [],
    });

    // Create buildings, floors, rooms, beds
    for (const wb of buildings || []) {
      const building = await Building.create({
        hostelId: hostel._id,
        name: wb.name,
        gender: mapGender(wb.gender),
        images: [], // Buildings don't have separate images in wizard yet
      });

      // Find rooms for this building and group by floor
      const buildingRooms = (rooms || []).filter((r: { buildingId: string }) => r.buildingId === wb.id);
      const floorMap = new Map<number, typeof buildingRooms>();
      for (const r of buildingRooms) {
        if (!floorMap.has(r.floor)) floorMap.set(r.floor, []);
        floorMap.get(r.floor)!.push(r);
      }

      // Create floors (at least as many as declared, even if no rooms)
      const maxFloor = Math.max(wb.floors || 1, ...Array.from(floorMap.keys()), 1);
      for (let i = 1; i <= maxFloor; i++) {
        const floor = await Floor.create({
          buildingId: building._id,
          floorNumber: i,
        });

        // Create rooms and beds for this floor
        const floorRooms = floorMap.get(i) || [];
        for (const wr of floorRooms) {
          const p = (pricing || []).find((pr: any) => pr.roomId === wr.id) || {};
          const room = await Room.create({
            floorId: floor._id,
            roomNumber: wr.roomNumber,
            images: (body.roomImages || {})[wr.id] || [],
            priceMonthly: p.monthly ? (parseInt(p.monthlyPrice) || 0) : 0,
            priceWeekly: p.weekly ? (parseInt(p.weeklyPrice) || 0) : 0,
            priceDaily: p.daily ? (parseInt(p.dailyPrice) || 0) : 0,
          });

          // Create beds
          const bedCount = wr.beds || 2;
          const bedDocs = Array.from({ length: bedCount }, () => ({
            roomId: room._id,
            isOccupied: false,
            occupantName: "",
            occupiedDate: null,
          }));
          await Bed.insertMany(bedDocs);
        }
      }
    }

    return Response.json({
      success: true,
      hostelId: hostel._id.toString(),
      hostelName: hostel.hostelName,
      adminFullName: hostel.adminFullName,
      adminEmail: hostel.adminEmail,
    });
  } catch (err: unknown) {
    console.error("Register error:", err);
    const message = err instanceof Error ? err.message : "Registration failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

function mapGender(g: string): "Boys" | "Girls" | "Co-ed" {
  const lower = (g || "").toLowerCase();
  if (lower === "boys" || lower === "male") return "Boys";
  if (lower === "girls" || lower === "female") return "Girls";
  return "Co-ed";
}
