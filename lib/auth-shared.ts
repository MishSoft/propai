// Client- and server-safe auth helpers. Do not import Prisma, bcrypt or other server-only modules here.

const AUTH_ERROR_MESSAGES = new Map<string, string>([
  ["CredentialsSignin", "Invalid email or password."],
  [
    "OAuthOnlyAccount",
    "This account was created with Google or Facebook. Sign in with that provider instead.",
  ],
  [
    "SessionExpired",
    "Your session expired after 24 hours. Please sign in again.",
  ],
  [
    "OAuthAccountNotLinked",
    "We couldn't complete sign-in with this provider. If you have an account, sign in using your original method.",
  ],
  ["CsrfFailure", "Your sign-in form expired. Please try again."],
  ["AuthUnavailable", "Sign-in is temporarily unavailable. Please try again."],
]);

const GENERIC_AUTH_ERROR = "Sign-in could not be completed. Please try again.";

export function normalizeEmail(
  email: string | null | undefined,
): string | null {
  if (typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  return normalized || null;
}

export function getAuthErrorMessage(
  code: string | null | undefined,
): string | null {
  if (!code) return null;
  return AUTH_ERROR_MESSAGES.get(code) ?? GENERIC_AUTH_ERROR;
}

// Returns an error code, or null when the credentials sign-in succeeded.
export function getCredentialsSignInError(
  result:
    | { error?: string | null; ok?: boolean; url?: string | null }
    | null
    | undefined,
): string | null {
  if (!result) return "AuthUnavailable";
  if (result.error) return result.error;
  if (!result.ok || !result.url) return "AuthUnavailable";
  // next-auth returns ".../signin?csrf=true" when the CSRF check fails, with no error param.
  if (new URL(result.url, "http://localhost").searchParams.has("csrf"))
    return "CsrfFailure";
  return null;
}

// Only allow same-origin relative paths as post-login destinations.
export function getSafeCallbackUrl(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return "/";
  }
  return value;
}
