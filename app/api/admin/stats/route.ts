import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Chef from "@/models/Chef";
import Booking from "@/models/Booking";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // For demo: any logged-in user can view admin. In prod, check role === "admin"

    await connectDB();

    const [totalUsers, totalChefs, allBookings, allChefs] = await Promise.all([
      User.countDocuments(),
      Chef.countDocuments(),
      Booking.find().sort({ createdAt: -1 }).limit(50),
      Chef.find().sort({ totalBookings: -1 }),
    ]);

    const totalRevenue = allBookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const pendingBookings = allBookings.filter((b) => b.status === "pending").length;
    const confirmedBookings = allBookings.filter((b) => b.status === "confirmed").length;
    const completedBookings = allBookings.filter((b) => b.status === "completed").length;
    const cancelledBookings = allBookings.filter((b) => b.status === "cancelled").length;

    // Revenue by day (last 7 days)
    const now = new Date();
    const revenueByDay = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
      const dayRevenue = allBookings
        .filter((b) => {
          const bd = new Date(b.createdAt);
          return bd.toDateString() === d.toDateString() && b.paymentStatus === "paid";
        })
        .reduce((s, b) => s + b.totalAmount, 0);
      return { day: dayStr, revenue: dayRevenue };
    });

    return NextResponse.json({
      stats: { totalUsers, totalChefs, totalRevenue, pendingBookings, confirmedBookings, completedBookings, cancelledBookings, totalBookings: allBookings.length },
      recentBookings: allBookings.slice(0, 20),
      topChefs: allChefs.slice(0, 6),
      revenueByDay,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
