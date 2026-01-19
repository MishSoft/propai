import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "@/lib/db";

const handler = NextAuth({
  // PrismaAdapter ავტომატურად შექმნის მომხმარებელს ბაზაში, თუ ის პირველად შედის
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/login', // ჩვენი login გვერდი
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
   async jwt({ token, user }) {
      // როცა იუზერი პირველად შედის, ბაზიდან ამოვიღოთ მონაცემები
      if (user) {
        const dbUser = await db.user.findUnique({
          where: { email: user.email! }
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.plan = dbUser.plan;
          token.id = dbUser.id;
        }
      }
      return token;
    },
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
});

export { handler as GET, handler as POST };
