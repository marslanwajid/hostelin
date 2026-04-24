import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IBed extends Document {
  roomId: Types.ObjectId;
  isOccupied: boolean;
  occupantName: string;
  occupiedDate: Date | null;
}

const BedSchema = new Schema<IBed>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    isOccupied: { type: Boolean, default: false },
    occupantName: { type: String, default: "" },
    occupiedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default (mongoose.models.Bed as Model<IBed>) || mongoose.model<IBed>("Bed", BedSchema);
