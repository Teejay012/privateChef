import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chef from "@/models/Chef";
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const mood = searchParams.get("mood");
  const cuisine = searchParams.get("cuisine");
  const sos = searchParams.get("sos");
  const q: Record<string,unknown> = {};
  if (mood) q.moods = { $in: [mood] };
  if (cuisine && cuisine !== "All") q.cuisine = { $in: [cuisine] };
  if (sos === "true") q.availableNow = true;
  const chefs = await Chef.find(q).sort({ rating: -1 });
  return NextResponse.json(chefs);
}
