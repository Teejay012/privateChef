import { Suspense } from "react";
import BookingClient from "./BookingClient";

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="glass-card w-64 h-32 animate-pulse" /></div>}>
      <BookingClient />
    </Suspense>
  );
}
