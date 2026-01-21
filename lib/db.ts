import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. გლობალური ტიპის განსაზღვრა, რომ TypeScript-მა არ იწუწუნოს
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// 2. კავშირის აუზის (Pool) შექმნა PostgreSQL-ისთვის
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 3. Prisma-ს ინიციალიზაცია:
// თუ გლობალურ ცვლადში უკვე გვაქვს Prisma, ვიყენებთ მას, თუ არა - ვქმნით ახალს.
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['error', "warn"],
  });

// 4. Development რეჟიმში ვინახავთ ინსტანსს გლობალურად
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;
