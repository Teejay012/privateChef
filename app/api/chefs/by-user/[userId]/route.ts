import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chef from "@/models/Chef";
export async function GET(_: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  await connectDB();
  const { userId } = await params;
  const chef = await Chef.findOne({ userId });
  if (!chef) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(chef);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  await connectDB();
  const { userId } = await params;
  const body = await req.json();
  const chef = await Chef.findOneAndUpdate({ userId }, { ...body, userId }, { upsert: true, new: true });
  return NextResponse.json(chef);
}
