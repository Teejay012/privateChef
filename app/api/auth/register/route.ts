import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();
    if (!name||!email||!password) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    await connectDB();
    if (await User.findOne({ email: email.toLowerCase() })) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: email.toLowerCase(), password: hashed, role: role || "diner" });
    return NextResponse.json({ id: user._id.toString() }, { status: 201 });
  } catch(e) { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
