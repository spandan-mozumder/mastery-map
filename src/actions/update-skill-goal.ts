// app/actions/update-skill-goal.ts
'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

type SubtopicInput = { name: string };
type TopicInput = {
  name: string;
  subtopics: SubtopicInput[];
};

interface UpdateSkillGoalInput {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  topics: TopicInput[];
}

export async function updateSkillGoal(data: UpdateSkillGoalInput) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Optional: verify ownership
  const existingGoal = await db.skillGoal.findUnique({
    where: { id: data.id },
    select: { userId: true },
  });

  if (!existingGoal || existingGoal.userId !== userId) {
    throw new Error('Not allowed');
  }

  // 💣 Delete existing topics and subtopics (cascade will handle completions)
  await db.topic.deleteMany({
    where: { skillGoalId: data.id },
  });

  // 🛠 Update skill goal
  await db.skillGoal.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      deadline: data.deadline ? new Date(data.deadline) : null,
      topics: {
        create: data.topics.map((topic) => ({
          name: topic.name,
          subtopics: {
            create: topic.subtopics.map((sub) => ({
              name: sub.name,
            })),
          },
        })),
      },
    },
  });

  revalidatePath('/dashboard');
}
