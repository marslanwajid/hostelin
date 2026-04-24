import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Hostel from "@/lib/models/Hostel";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password required." }, { status: 400 });
    }

    const hostel = await Hostel.findOne({ adminEmail: email.toLowerCase() });
    if (!hostel) {
      return Response.json({ error: "No hostel found with this email." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, hostel.adminPassword);
    if (!isMatch) {
      return Response.json({ error: "Invalid password." }, { status: 401 });
    }

    return Response.json({
      success: true,
      hostelId: hostel._id.toString(),
      hostelName: hostel.hostelName,
      adminFullName: hostel.adminFullName,
      adminEmail: hostel.adminEmail,
      city: hostel.city,
      town: hostel.town,
    });
  } catch (err: unknown) {
    console.error("Login error:", err);
    const message = err instanceof Error ? err.message : "Login failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
