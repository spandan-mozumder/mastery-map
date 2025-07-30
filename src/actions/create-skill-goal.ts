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

type SkillGoalInput = z.infer<typeof SkillGoalSchema>;

export async function createSkillGoal(formData: SkillGoalInput) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Sanitize subtopics
  formData.topics = formData.topics.map((topic) => ({
    ...topic,
    subtopics: topic.subtopics.filter((sub) => sub.trim().length > 0),
  }));

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
      deadline: deadline ? new Date(deadline) : undefined,
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

  revalidatePath("/dashboard");
  return newSkillGoal;
}

