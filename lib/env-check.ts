// Only variables the auth and database layers need. Google, Facebook and GROQ are optional here.
const requiredEnv = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
];

export function validateEnv() {
  const missing = requiredEnv.filter((env) => !process.env[env]);

  if (missing.length > 0) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`CRITICAL: Missing required environment variables: ${missing.join(", ")}`);
    } else {
      console.warn(`[WARN] Missing environment variables: ${missing.join(", ")}`);
    }
  }
}
