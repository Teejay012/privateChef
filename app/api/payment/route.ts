import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Chef from "@/models/Chef";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { bookingId } = await req.json();
  const b = await Booking.findById(bookingId);
  if (!b || b.userId !== session.user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (b.paymentStatus === "paid") return NextResponse.json({ error: "Already paid" }, { status: 400 });
  await new Promise(r => setTimeout(r, 800));
  const paymentId = `mock_${Date.now()}`;
  b.paymentStatus = "paid"; b.paymentId = paymentId; b.status = "confirmed";
  await b.save();
  await Chef.findByIdAndUpdate(b.chefId, { $inc: { earnings: Math.round(b.totalAmount * 0.8), reviews: 1 } });
  return NextResponse.json({ success: true, paymentId, amount: b.totalAmount });
}
