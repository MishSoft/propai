type PrismaAuthor = {
  name: string | null;
  phone: string | null;
  image?: string | null;
};

export function serializeListing<
  T extends {
    price: bigint;
    createdAt: Date;
    updatedAt: Date;
    author: PrismaAuthor;
  },
>(l: T) {
  return {
    ...l,
    price: Number(l.price),
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
    author: {
      fullName: l.author.name ?? "",
      phone: l.author.phone ?? "",
    },
  };
}
