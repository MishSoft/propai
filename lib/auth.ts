// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials.password !== "string" ||
          !credentials.email.trim() ||
          !credentials.password
        ) {
          throw new Error("Invalid email or password");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan;
        token.role = (user as any).role;
      } else if (!token.id && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.plan = dbUser.plan;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).plan = token.plan;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  /*
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  */
  events: {
    async signIn({ user, account, profile }) {
      console.log("[AUTH_DEBUG] signIn event:", {
        user: user?.id,
        provider: account?.provider,
      });
    },
    async createUser({ user }) {
      console.log("[AUTH_DEBUG] createUser event:", user.id);
    },
    async linkAccount({ user, account }) {
      console.log("[AUTH_DEBUG] linkAccount event:", {
        user: user.id,
        provider: account.provider,
      });
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
};
