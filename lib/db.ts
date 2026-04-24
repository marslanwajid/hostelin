import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/hostelin";

// Cache the connection across hot-reloads in dev
let cached = (global as Record<string, unknown>).__mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} | undefined;

if (!cached) {
  cached = (global as Record<string, unknown>).__mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI).then((m) => {
      console.log("✅ MongoDB connected to hostelin");
      return m;
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
