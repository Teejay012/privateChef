// app/api/bookings/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Point to your node-safe auth engine
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET // Retrieves a specific booking instance by ID
 */
export const GET = auth(async function GET(req, context) {
  const ctx = context as RouteContext;
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await ctx.params;
    
    const booking = await Booking.findById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking matrix not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error("❌ Booking GET Error:", error);
    return NextResponse.json({ error: "Internal lookup failure" }, { status: 500 });
  }
});

/**
 * PATCH // Updates status, payments, or injects consultation chat streams
 */
export const PATCH = auth(async function PATCH(req, context) {
  const ctx = context as RouteContext;
  if (!req.auth?.user?.id) {
    return NextResponse.json({ error: "Unauthorized operation matrix" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await ctx.params;
    const body = await req.json();

    const b = await Booking.findById(id);
    if (!b) {
      return NextResponse.json({ error: "Target booking not found" }, { status: 404 });
    }

    // Handles your chat messaging push history array
    if (body.message) {
      b.messages.push({
        from: body.from || "user",
        text: body.message,
        timestamp: new Date()
      });
    }

    // Handles transactional status adjustments
    if (body.status) b.status = body.status;
    if (body.paymentStatus) b.paymentStatus = body.paymentStatus;

    await b.save();
    return NextResponse.json(b);
  } catch (error) {
    console.error("Booking PATCH Error:", error);
    return NextResponse.json({ error: "Data mutation transaction rejected" }, { status: 500 });
  }
});