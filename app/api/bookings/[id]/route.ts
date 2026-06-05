import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const b = await Booking.findById(id);
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(b);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const b = await Booking.findById(id);
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (body.message) { b.messages.push({ from: body.from, text: body.message, timestamp: new Date() }); }
  if (body.status) b.status = body.status;
  if (body.paymentStatus) b.paymentStatus = body.paymentStatus;
  await b.save();
  return NextResponse.json(b);
}
