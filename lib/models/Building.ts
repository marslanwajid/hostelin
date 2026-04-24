import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBuilding extends Document {
  hostelId: Types.ObjectId;
  name: string;
  gender: "Male" | "Female" | "Both";
  images: string[];
}

const BuildingSchema = new Schema<IBuilding>(
  {
    hostelId: { type: Schema.Types.ObjectId, ref: "Hostel", required: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Both"], default: "Both" },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default (mongoose.models.Building as Model<IBuilding>) || mongoose.model<IBuilding>("Building", BuildingSchema);
