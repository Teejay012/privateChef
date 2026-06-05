import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Chef from "@/models/Chef";
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const chef = await Chef.findById(id);
  if (!chef) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(chef);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const chef = await Chef.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(chef);
}
