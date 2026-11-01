"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { SESSION_EXPIRED_ERROR } from "@/lib/session-policy";

// Signs the user out at the absolute 24-hour deadline, without polling or extending the session.
export default function SessionExpiryGuard() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const expiredRef = useRef(false);

  const hasUser = !!session?.user;
  const expires = session?.expires;
  const sessionError = session?.error;

  useEffect(() => {
    // On /login the stale session is already cleared by the proxy; skipping avoids a sign-out redirect loop.
    if (status !== "authenticated" || pathname === "/login") return;

    const deadline = expires ? Date.parse(expires) : NaN;
    const isExpired = () =>
      !hasUser ||
      sessionError === SESSION_EXPIRED_ERROR ||
      !(deadline > Date.now());

    const expire = () => {
      if (expiredRef.current) return;
      expiredRef.current = true;
      void signOut({ callbackUrl: `/login?error=${SESSION_EXPIRED_ERROR}` });
    };

    if (isExpired()) {
      expire();
      return;
    }

    const timer = window.setTimeout(expire, deadline - Date.now());
    // Browsers can delay timers while a tab is hidden or the device sleeps, so re-check on return.
    const onVisible = () => {
      if (document.visibilityState === "visible" && isExpired()) expire();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [status, pathname, expires, hasUser, sessionError]);

  return null;
}
