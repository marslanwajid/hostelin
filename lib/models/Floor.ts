import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFloor extends Document {
  buildingId: Types.ObjectId;
  floorNumber: number;
}

const FloorSchema = new Schema<IFloor>(
  {
    buildingId: { type: Schema.Types.ObjectId, ref: "Building", required: true },
    floorNumber: { type: Number, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Floor as Model<IFloor>) || mongoose.model<IFloor>("Floor", FloorSchema);
