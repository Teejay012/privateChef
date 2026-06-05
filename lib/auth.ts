// @/lib/auth.ts (or wherever your main auth setup is saved)
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import User from "@/models/User";
import { authConfig } from "./auth.config"; // Import your shared config file

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // Spreads options safely into the full Node.js runtime environment
  providers: [
    Google({ 
      clientId: process.env.GOOGLE_CLIENT_ID ?? "", 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "" 
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(c) {
        if (!c?.email || !c?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: (c.email as string).toLowerCase() });
        if (!user || !user.password) return null;
        const ok = await bcrypt.compare(c.password as string, user.password);
        if (!ok) return null;
        return { id: user._id.toString(), email: user.email, name: user.name, image: user.image, role: user.role };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks, // Pulls in the session mapper callback
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const ex = await User.findOne({ email: user.email });
        if (!ex) await User.create({ name: user.name, email: user.email, image: user.image, role: "diner" });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        const db = await User.findOne({ email: token.email });
        if (db) { 
          token.id = db._id.toString(); 
          token.role = db.role; 
        }
      }
      return token;
    },
  },
});