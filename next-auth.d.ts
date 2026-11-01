// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      plan: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    error?: string
  }

  interface User {
    id: string
    plan: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    plan: string
    role: string
    // Unix seconds of the original sign-in; never refreshed.
    authAt?: number
    error?: string
  }
}
