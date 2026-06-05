// app/api/user/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Point this to your main database-connected auth.ts file
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

/**
 * GET // Retrieves authenticated user profile
 */
export const GET = auth(async function GET(req) {
  // NextAuth v5 automatically injects the session into req.auth when wrapped
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized access vector" }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findById(req.auth.user.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User identity ledger not found" }, { status: 404 });
    }

    /* DEFENSIVE NORMALIZATION
       We map the database values into a clean fallback layout. If a user record
       doesn't have an explicit array initialized, we hand back clean defaults 
       ([] or null) so your frontend dashboard never chokes on undefined checks.
    */
    return NextResponse.json({
      _id: user._id.toString(),
      name: user.name || "Valued Diner",
      email: user.email,
      role: user.role || "diner",
      flavorDNA: user.flavorDNA || null,
      passportBadges: user.passportBadges || [],
    });
  } catch (error) {
    console.error("Profile API GET Failure:", error);
    return NextResponse.json({ error: "Internal operational failure" }, { status: 500 });
  }
});

/**
 * PATCH // Updates profile metadata configurations
 */
export const PATCH = auth(async function PATCH(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized modification attempt" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();

    // Safety Gate: Prevent malicious injection overrides of critical schema fields
    delete body.password;
    delete body.email;
    delete body._id;

    const updatedUser = await User.findByIdAndUpdate(
      req.auth.user.id,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User target execution failed" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile API PATCH Failure:", error);
    return NextResponse.json({ error: "Data write transaction declined" }, { status: 500 });
  }
});