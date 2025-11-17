import { db } from "@/app/_lib/prisma";

export async function getGoalsByUser(userId: string) {
  return db.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
