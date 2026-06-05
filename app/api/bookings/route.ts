// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

/**
 * GET // Fetches all experiences assigned to the logged-in user
 * Notice: No second argument ({ params }) here because this isn't a dynamic [id] folder!
 */
export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized access vector" }, { status: 401 });
  }

  try {
    await connectDB();
    
    // Looks up any booking tied directly back to this user's ID
    const userBookings = await Booking.find({ userId: req.auth.user.id }).sort({ date: 1 });

    return NextResponse.json(userBookings || []);
  } catch (error) {
    console.error("Collection Bookings GET Failure:", error);
    return NextResponse.json([], { status: 500 }); 
  }
});