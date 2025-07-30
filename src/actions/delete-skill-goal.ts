"use server";

import { db } from "../lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSkillGoal(goalId: string) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const goal = await db.skillGoal.findUnique({ where: { id: goalId } });

  if (!goal || goal.userId !== userId) {
    throw new Error("Skill goal not found or unauthorized");
  }

  await db.skillGoal.delete({ where: { id: goalId } });

  revalidatePath("/dashboard");
}
