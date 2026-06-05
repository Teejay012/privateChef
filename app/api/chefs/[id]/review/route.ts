import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Chef from "@/models/Chef";
import Booking from "@/models/Booking";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const { bookingId, rating, comment, mood } = await req.json();

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.userId !== session.user.id || booking.reviewLeft)
      return NextResponse.json({ error: "Invalid booking" }, { status: 400 });

    const chef = await Chef.findById(id);
    if (!chef) return NextResponse.json({ error: "Chef not found" }, { status: 404 });

    chef.reviews.push({
      userId: session.user.id,
      userName: session.user.name ?? "Anonymous",
      rating,
      comment,
      date: new Date(),
      mood,
    });

    const total = chef.reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0);
    chef.rating = Math.round((total / chef.reviews.length) * 100) / 100;
    chef.totalReviews = chef.reviews.length;
    await chef.save();

    booking.reviewLeft = true;
    await booking.save();

    return NextResponse.json({ message: "Review submitted" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
