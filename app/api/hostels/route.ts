import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Hostel from "@/lib/models/Hostel";
import Building from "@/lib/models/Building";
import Floor from "@/lib/models/Floor";
import Room from "@/lib/models/Room";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    console.log("Fetching hostels for public view...");
    
    // Fetch all hostels
    const hostels = await Hostel.find({}).lean();
    console.log(`Found ${hostels.length} hostels in DB`);
    
    const result = await Promise.all(hostels.map(async (h: any) => {
      // Find buildings to determine type (Male/Female/Co-ed)
      const buildings = await Building.find({ hostelId: h._id }).lean();
      
      let type = h.hostelType || "Both";
      if (!h.hostelType) {
        const genders = new Set(buildings.map(b => b.gender));
        if (genders.has("Both") || (genders.has("Male") && genders.has("Female"))) {
          type = "Both";
        } else if (genders.has("Male")) {
          type = "Male";
        } else if (genders.has("Female")) {
          type = "Female";
        }
      }

      // Find all rooms to determine min price
      const bIds = buildings.map(b => b._id);
      const floors = await Floor.find({ buildingId: { $in: bIds } }).lean();
      const fIds = floors.map(f => f._id);
      const rooms = await Room.find({ floorId: { $in: fIds } }).lean();
      
      let minPrice = 0;
      const prices = rooms.map(r => r.priceMonthly || 0).filter(p => p > 0);
      if (prices.length > 0) {
        minPrice = Math.min(...prices);
      }
      
      const grads = [
        "linear-gradient(135deg,#1a1a2e,#16213e)",
        "linear-gradient(135deg,#2d1b69,#11998e)",
        "linear-gradient(135deg,#134e5e,#71b280)",
        "linear-gradient(135deg,#360033,#0b8793)",
        "linear-gradient(135deg,#5c3317,#c0392b)",
        "linear-gradient(135deg,#003973,#e5e5be)"
      ];
      const randomGrad = grads[Math.floor(Math.random() * grads.length)];

      return {
        id: h._id.toString(),
        name: h.hostelName,
        area: h.town || "General Area",
        city: h.city,
        price: minPrice > 0 ? minPrice.toLocaleString() : "Call for Price",
        rating: 4.5,
        reviews: Math.floor(Math.random() * 200) + 50,
        type: type,
        verified: true,
        image: h.images && h.images.length > 0 ? h.images[0] : null,
        grad: randomGrad,
        amenities: ["wifi", "meals", "ac", "security"],
        tags: ["Monthly", "Verified"],
      };
    }));

    return Response.json(result);
  } catch (err: any) {
    console.error("GET hostels error:", err);
    return Response.json({ error: "Failed to fetch hostels" }, { status: 500 });
  }
}
