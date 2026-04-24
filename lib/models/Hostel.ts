import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHostel extends Document {
  hostelName: string;
  city: string;
  town: string;
  registrationNumber: string;
  fullAddress: string;
  adminFullName: string;
  adminEmail: string;
  adminPassword: string; // bcrypt hashed
  createdAt: Date;
}

const HostelSchema = new Schema<IHostel>(
  {
    hostelName: { type: String, required: true },
    city: { type: String, required: true },
    town: { type: String, default: "" },
    registrationNumber: { type: String, default: "" },
    fullAddress: { type: String, default: "" },
    adminFullName: { type: String, required: true },
    adminEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    adminPassword: { type: String, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Hostel as Model<IHostel>) || mongoose.model<IHostel>("Hostel", HostelSchema);
