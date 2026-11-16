import z from "zod";

export const password_validation = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .refine((val) => Buffer.byteLength(val, "utf-8") <= 72, {
    message: "Password must not exceed 72 bytes in UTF-8 encoding.",
  });
