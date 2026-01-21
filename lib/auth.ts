// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db";

export const authOptions: NextAuthOptions = {
  // PrismaAdapter-ს გადავცემთ ჩვენს სინგლტონ db ინსტანსს
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // დავამატე აქაც უსაფრთხოებისთვის
    }),
  ],
  callbacks: {
    // JWT ქოლბექი ეშვება ტოკენის შექმნისას ან განახლებისას
    async jwt({ token, user }) {
      if (user) {
        // აქ user-ს უკვე აქვს შენს .d.ts ფაილში აღწერილი ველები
        token.id = user.id;
        token.plan = user.plan;
        token.role = user.role;
      }
      return token;
    },
    // Session ქოლბექი განსაზღვრავს რა მონაცემები იყოს ხელმისაწვდომი ფრონტზე
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.plan = token.plan;
        session.user.role = token.role;
      }
      return session;
    },
  },
  // დამატებითი უსაფრთხოებისთვის შეგვიძლია მივუთითოთ გვერდები
  pages: {
    signIn: '/login', // თუ გაქვს პერსონალური ლოგინის გვერდი
  }
};
