'use server';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function toggleCompletion(subtopicId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const existing = await db.completion.findUnique({
    where: { userId_subtopicId: { userId, subtopicId } },
  });

  if (existing) {
    await db.completion.delete({ where: { id: existing.id } });
    return false;
  } else {
    await db.completion.create({ data: { userId, subtopicId } });
    return true;
  }
}
