import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { AuroraBackground } from "@/components/AuroraBackground";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "AuraChefs — Private Dining, Reimagined",
  description: "Book world-class private chefs matched by AI, curated by mood.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          <AuroraBackground>
            <Navigation />
            {children}
            <Footer />
          </AuroraBackground>
        </SessionProvider>
      </body>
    </html>
  );
}
