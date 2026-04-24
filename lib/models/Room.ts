import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IRoom extends Document {
  floorId: Types.ObjectId;
  roomNumber: string;
}

const RoomSchema = new Schema<IRoom>(
  {
    floorId: { type: Schema.Types.ObjectId, ref: "Floor", required: true },
    roomNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Room as Model<IRoom>) || mongoose.model<IRoom>("Room", RoomSchema);
