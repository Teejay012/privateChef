import mongoose, { Schema, Document } from "mongoose";
export interface IBooking extends Document {
  userId: string; userName: string; userEmail: string;
  chefId: string; chefName: string; chefImageUrl: string;
  date: Date; time: string; guests: number; mood: string;
  isSOS: boolean; theaterMode: boolean; liveCam: boolean;
  address: string; specialRequests?: string;
  status: "pending"|"confirmed"|"in-progress"|"completed"|"cancelled";
  totalAmount: number; paymentStatus: "pending"|"paid"|"refunded"; paymentId?: string;
  messages: Array<{ from: "user"|"chef"; text: string; timestamp: Date }>;
  reviewLeft: boolean;
}
const S = new Schema<IBooking>({
  userId: { type: String, required: true }, userName: String, userEmail: String,
  chefId: { type: String, required: true }, chefName: String, chefImageUrl: String,
  date: Date, time: String, guests: { type: Number, default: 2 }, mood: String,
  isSOS: { type: Boolean, default: false },
  theaterMode: { type: Boolean, default: false },
  liveCam: { type: Boolean, default: false },
  address: String, specialRequests: String,
  status: { type: String, enum: ["pending","confirmed","in-progress","completed","cancelled"], default: "pending" },
  totalAmount: Number, paymentStatus: { type: String, enum: ["pending","paid","refunded"], default: "pending" }, paymentId: String,
  messages: [{ from: { type: String, enum: ["user","chef"] }, text: String, timestamp: { type: Date, default: Date.now } }],
  reviewLeft: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", S);
