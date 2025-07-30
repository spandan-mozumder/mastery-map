"use server";

import { db } from "../lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";

const SkillGoalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  deadline: z.date().optional(),
  topics: z.array(
    z.object({
      name: z.string().min(1),
      subtopics: z.array(z.string().min(1)),
    })
  ),
});

export async function createSkillGoal(formData: any) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const parsed = SkillGoalSchema.safeParse(formData);
  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid input");
  }

  const { title, description, deadline, topics } = parsed.data;

  const newSkillGoal = await db.skillGoal.create({
    data: {
      title,
      description,
      userId,
      deadline: deadline ? new Date(deadline) : undefined, // ✅ Parse date string
      topics: {
        create: topics.map((topic) => ({
          name: topic.name,
          subtopics: {
            create: topic.subtopics.map((sub) => ({ name: sub })),
          },
        })),
      },
    },
  });

  revalidatePath("/dashboard"); // or wherever your skill goals are listed
  return newSkillGoal;
}
