import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IRoom extends Document {
  floorId: Types.ObjectId;
  roomNumber: string;
  images: string[];
  priceMonthly?: number;
  priceWeekly?: number;
  priceDaily?: number;
}

const RoomSchema = new Schema<IRoom>(
  {
    floorId: { type: Schema.Types.ObjectId, ref: "Floor", required: true },
    roomNumber: { type: String, required: true },
    images: { type: [String], default: [] },
    priceMonthly: { type: Number, default: 0 },
    priceWeekly: { type: Number, default: 0 },
    priceDaily: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default (mongoose.models.Room as Model<IRoom>) || mongoose.model<IRoom>("Room", RoomSchema);
