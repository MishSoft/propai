// lib/auth.ts — the single NextAuth configuration shared by the route handler and getServerSession.
import type { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { GoogleProfile } from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import type { FacebookProfile } from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { logger } from "@/lib/logger";
import { normalizeEmail } from "@/lib/auth-shared";
import {
  currentAuthTime,
  getSessionDeadlineMs,
  isAuthTimeValid,
  SESSION_EXPIRED_ERROR,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session-policy";

const isDevelopment = process.env.NODE_ENV !== "production";

function authDebug(message: string, data?: Record<string, unknown>) {
  if (isDevelopment) console.log(`[AUTH_DEBUG] ${message}`, data ?? "");
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile: GoogleProfile) {
              // role and plan are filled by Prisma defaults when the adapter creates the user.
              return {
                id: profile.sub,
                name: profile.name,
                email: normalizeEmail(profile.email),
                image: profile.picture,
              } as User;
            },
          }),
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            profile(profile: FacebookProfile) {
              return {
                id: profile.id,
                name: profile.name,
                email: normalizeEmail(profile.email),
                image: profile.picture?.data?.url ?? null,
              } as User;
            },
          }),
        ]
      : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Thrown messages are error codes; next-auth passes them to the client as ?error=<code>.
      async authorize(credentials) {
        const email = normalizeEmail(
          typeof credentials?.email === "string" ? credentials.email : null,
        );
        const password = credentials?.password;

        if (!email || typeof password !== "string" || !password) {
          throw new Error("CredentialsSignin");
        }

        let user: Awaited<ReturnType<typeof db.user.findUnique>>;
        try {
          user = await db.user.findUnique({ where: { email } });
        } catch (error) {
          logger.error("AUTH_USER_LOOKUP_FAILED", {
            name: error instanceof Error ? error.name : typeof error,
          });
          throw new Error("AuthUnavailable");
        }

        if (!user) {
          throw new Error("CredentialsSignin");
        }

        if (!user.password) {
          throw new Error("OAuthOnlyAccount");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
          throw new Error("CredentialsSignin");
        }

        // Return only the fields the token needs; never carry the password hash forward.
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          plan: user.plan,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.plan = user.plan;
        // Set once at sign-in and never refreshed, so the 24-hour limit is absolute.
        token.authAt = currentAuthTime();
        delete token.error;
        return token;
      }

      if (!isAuthTimeValid(token.authAt)) {
        token.error = SESSION_EXPIRED_ERROR;
        return token;
      }

      const tokenEmail = normalizeEmail(token.email);
      if (!token.id && tokenEmail) {
        const dbUser = await db.user.findUnique({
          where: { email: tokenEmail },
          select: { id: true, role: true, plan: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.plan = dbUser.plan;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.error || !isAuthTimeValid(token.authAt)) {
        // No user here, so getServerSession callers treat the request as unauthenticated.
        return {
          expires: new Date(0).toISOString(),
          error: SESSION_EXPIRED_ERROR,
        } as Session;
      }

      session.user.id = token.id;
      session.user.role = token.role;
      session.user.plan = token.plan;
      session.expires = new Date(
        getSessionDeadlineMs(token.authAt),
      ).toISOString();
      return session;
    },
  },
  // Cookie names, httpOnly, sameSite and secure flags use next-auth defaults (__Secure- when NEXTAUTH_URL is https).
  events: {
    async signIn({ user, account }) {
      authDebug("signIn", { user: user?.id, provider: account?.provider });
    },
    async createUser({ user }) {
      authDebug("createUser", { user: user.id });
    },
    async linkAccount({ user, account }) {
      authDebug("linkAccount", { user: user.id, provider: account.provider });
    },
  },
  pages: {
    signIn: "/login",
    // Route OAuth and other next-auth errors to the login form instead of the default error page.
    error: "/login",
  },
  debug: isDevelopment,
};
