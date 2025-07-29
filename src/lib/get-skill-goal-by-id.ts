// app/actions/getSkillGoalById.ts
'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function getSkillGoalById(id: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const goal = await db.skillGoal.findUnique({
    where: { id },
    include: {
      topics: {
        include: {
          subtopics: {
            include: {
              completions: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  return goal;
}
