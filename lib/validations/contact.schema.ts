import { z } from "zod";

const positiveInteger = z
  .union([z.string().trim().regex(/^\d+$/), z.number()])
  .pipe(z.coerce.number().int().min(1).max(20));

const positiveBudget = z
  .union([
    z
      .string()
      .trim()
      .regex(/^\d+(\.\d+)?$/),
    z.number(),
  ])
  .pipe(z.coerce.number().positive().finite());

export const descriptionSchema = z
  .string()
  .trim()
  .max(2000, "Description must not exceed 2,000 characters.")



export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number"),
  category: z.enum(["Buy", "Rent"]),
  propertyType: z.enum(["Apartment", "House"]),
  floor: positiveInteger,
  minRooms: positiveInteger,
  minBaths: positiveInteger,
  budget: positiveBudget,
  location: z.string().trim().max(150).default(""),
  description: descriptionSchema.default(""),
});

