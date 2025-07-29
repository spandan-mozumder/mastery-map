// lib/get-user-skill-goals.ts
'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function getUserSkillGoals() {
  const { userId } = await auth();
  if (!userId) return [];

  return db.skillGoal.findMany({
    where: { userId },
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
