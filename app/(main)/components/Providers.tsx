"use client";
import { SessionProvider } from "next-auth/react";
import SessionExpiryGuard from "./SessionExpiryGuard";

// Session refetches never extend the absolute deadline, so focus and interval refetches are disabled.
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <SessionExpiryGuard />
      {children}
    </SessionProvider>
  );
};
