import { Buyer as PrismaBuyer } from "@prisma/client";

/**
 * Prisma-ს მოდელიდან ვიღებთ ყველა ველს ავტომატურად.
 * Omit-ს ვიყენებთ მხოლოდ იმიტომ, რომ JSON-ით წამოსული თარიღი
 * ხანდახან string-ია და ხან Date, რაც TypeScript-ს აბნევს.
 */
export type Buyer = Omit<PrismaBuyer, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};
