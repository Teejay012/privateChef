import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  name: string; email: string; password?: string; image?: string;
  role: "diner" | "chef"; flavorDNA?: { title: string; desc: string; cuisines: string[] };
  passportBadges: string[]; createdAt: Date;
}
const S = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: String, image: String,
  role: { type: String, enum: ["diner","chef"], default: "diner" },
  flavorDNA: { title: String, desc: String, cuisines: [String] },
  passportBadges: [String],
}, { timestamps: true });
export default mongoose.models.User || mongoose.model<IUser>("User", S);
