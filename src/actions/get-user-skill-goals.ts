'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function getUserSkillGoals() {
  const { userId } = await auth();
  if (!userId) return [];

  return db.skillGoal.findMany({
    where: { userId },
    orderBy: {
      deadline: 'asc',
    },
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
}
