import db from "@/lib/db";

export const PLAN_LIMITS = {
  lite: 5,
  pro: 25,
  ultimate: 100,
};

export async function checkAndIncrementAiUsage(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    // @ts-ignore
    select: { aiUsageCount: true, lastAiReset: true, plan: true },
  });

  if (!user) throw new Error("User not found");

  const now = new Date();
  // @ts-ignore
  const lastReset = new Date(user.lastAiReset);
  // Reset if it's a new day (UTC)
  const isNewDay =
    now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
    now.getUTCMonth() !== lastReset.getUTCMonth() ||
    now.getUTCDate() !== lastReset.getUTCDate();

  // @ts-ignore
  let currentCount = user.aiUsageCount;
  if (isNewDay) {
    currentCount = 0;
    await db.user.update({
      where: { id: userId },
      // @ts-ignore
      data: { aiUsageCount: 0, lastAiReset: now },
    });
  }

  const limit =
    PLAN_LIMITS[user.plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.lite;

  if (currentCount >= limit) {
    throw new Error(
      `Daily AI limit reached (${limit} requests). Upgrade your plan for more!`,
    );
  }

  // Increment usage
  await db.user.update({
    where: { id: userId },
    // @ts-ignore
    data: { aiUsageCount: { increment: 1 } },
  });

  return { count: currentCount + 1, limit };
}
