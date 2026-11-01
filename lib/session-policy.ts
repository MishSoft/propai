// Client- and server-safe session lifetime rules. Keep this file free of server-only imports.

export const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;
export const SESSION_EXPIRED_ERROR = "SessionExpired";

export function currentAuthTime(nowMs: number = Date.now()): number {
  return Math.floor(nowMs / 1000);
}

export function getSessionDeadlineMs(authAt: number): number {
  return (authAt + SESSION_MAX_AGE_SECONDS) * 1000;
}

// Tokens without a valid authAt (issued before this policy) are treated as expired.
export function isAuthTimeValid(
  authAt: unknown,
  nowMs: number = Date.now(),
): authAt is number {
  return (
    typeof authAt === "number" &&
    Number.isFinite(authAt) &&
    nowMs < getSessionDeadlineMs(authAt)
  );
}
