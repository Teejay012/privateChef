// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    // 1. Validate incoming parameters
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 2. Normalize inputs to prevent whitespace or casing lookup mismatches
    const normalizedEmail = email.toLowerCase().trim();

    // 3. Connect to MongoDB Atlas cluster explicitly
    await connectDB();

    // 4. Check for duplicate registrations
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    /* 5. Serverless-Safe Hashing
       We change the salt factor to 10. This executes dramatically faster 
       on serverless environments, avoiding cold-start processing time limits.
    */
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    /* 6. Database Document Generation
       We explicitly populate your passport and flavor arrays with defaults
       to ensure no strict Mongoose schema validation rules fail.
    */
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashed,
      role: role || "diner",
      passportBadges: [],
      flavorDNA: null
    });

    return NextResponse.json({ id: user._id.toString() }, { status: 201 });

  } catch (error: any) {
    console.error("PRODUCTION REGISTRATION REJECTION:", error);

    return NextResponse.json(
      { 
        error: "Server error during registration execution pipeline", 
        details: error.message || "Unknown schema constraint exception"
      }, 
      { status: 500 }
    );
  }
}