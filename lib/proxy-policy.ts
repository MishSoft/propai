// Route classification for proxy.ts. Pure functions only, so the rules can be tested without Next.js.

export type RouteAccess = "static" | "public" | "protected";

// Pages reachable without a session. /login and /register redirect signed-in users to /.
const PUBLIC_PAGE_PREFIXES = ["/login", "/register", "/agent", "/listings"];

// Auth endpoints and public registration.
const PUBLIC_API_PREFIXES = ["/api/auth", "/api/register"];

// Public agent contact form. Only the POST handler is public; other methods require a session.
const PUBLIC_CONTACT_API = /^\/api\/agent\/[^/]+\/contact$/;

// Public-folder files served from the site root, e.g. /placeholder.jpg. Nested or /api paths never match.
const ROOT_STATIC_FILE =
  /^\/[^/]+\.(?:svg|png|jpe?g|gif|webp|avif|ico|txt|xml|woff2?)$/i;

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function getRouteAccess(pathname: string, method: string): RouteAccess {
  if (ROOT_STATIC_FILE.test(pathname)) {
    return "static";
  }

  if (
    matchesPrefix(pathname, PUBLIC_PAGE_PREFIXES) ||
    matchesPrefix(pathname, PUBLIC_API_PREFIXES)
  ) {
    return "public";
  }

  if (method === "POST" && PUBLIC_CONTACT_API.test(pathname)) {
    return "public";
  }

  return "protected";
}
