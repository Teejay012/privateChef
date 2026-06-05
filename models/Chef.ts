import mongoose, { Schema, Document } from "mongoose";
export type Mood = "Romantic"|"Celebration"|"Comfort"|"Adventure";
export interface IChef extends Document {
  userId: string; name: string; bio: string; location: string;
  cuisine: string[]; moods: Mood[]; price: number;
  rating: number; reviews: number; availableNow: boolean;
  imageUrl: string; acceptsSOS: boolean; offersTheater: boolean; offersLiveCam: boolean;
  signatureDish: { name: string; description: string; imageUrl: string };
  lockedSignatureDish: { name: string; description: string; imageUrl: string; bookingsRequired: number };
  reviewsList: Array<{ userId: string; userName: string; rating: number; comment: string; date: Date }>;
  earnings: number;
}
const S = new Schema<IChef>({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, bio: String, location: String,
  cuisine: [String], moods: [String],
  price: { type: Number, default: 150 },
  rating: { type: Number, default: 5.0 }, reviews: { type: Number, default: 0 },
  availableNow: { type: Boolean, default: true },
  imageUrl: { type: String, default: "" },
  acceptsSOS: { type: Boolean, default: false },
  offersTheater: { type: Boolean, default: false },
  offersLiveCam: { type: Boolean, default: false },
  signatureDish: { name: String, description: String, imageUrl: String },
  lockedSignatureDish: { name: String, description: String, imageUrl: String, bookingsRequired: { type: Number, default: 3 } },
  reviewsList: [{ userId: String, userName: String, rating: Number, comment: String, date: { type: Date, default: Date.now } }],
  earnings: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.models.Chef || mongoose.model<IChef>("Chef", S);
