import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db";

const handler = NextAuth({
  adapter: PrismaAdapter(db),
  // აუცილებელია მივუთითოთ secret აქაც
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login', // შეცდომის შემთხვევაშიც აქ დარჩეს
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 დღე
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // როცა იუზერი პირველად შედის (Initial sign in)
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.plan = user.plan;
      }

      // ხანდახან საჭიროა მონაცემების განახლება ბაზიდან, თუ რამე შეიცვალა
      return token;
    },
    // თუ არ მუშაობს, ჩართე და ტერმინალში დეტალებს დაგიწერს
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.plan = token.plan;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    }
  },
  debug: true, // თუ ისევ არ იმუშავა, ეს ჩართე და ტერმინალში დეტალებს დაგიწერს
});

export { handler as GET, handler as POST };
