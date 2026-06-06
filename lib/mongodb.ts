// lib/mongodb.ts
import mongoose from "mongoose";

/* Next.js executes server re-compilations during local development. 
   We cache the database connection globally to prevent your app from 
   opening a brand new connection pool on every single file save.
*/
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  // Moving this string check inside the function ensures it never trips up the compiler during build passes.
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error(
      "CRITICAL: The MONGODB_URI environment variable is missing from the active runtime configuration setup."
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Initialize connection using the explicitly verified connection string
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("▲ [Database Engine] Connected to MongoDB Atlas successfully.");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Flush failed promise cache
    console.error("[Database Engine] Connection runtime failure:", error);
    throw error;
  }

  return cached.conn;
}