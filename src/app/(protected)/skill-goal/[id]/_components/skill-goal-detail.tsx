'use client';

import { useTransition, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { toggleCompletion } from '@/lib/toggle-completion';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type Goal = {
  id: string;
  title: string;
  description?: string | null;
  topics: {
    id: string;
    name: string;
    subtopics: {
      id: string;
      name: string;
      completions: { id: string }[]; // ✅ Match what Prisma returns
    }[];
  }[];
};

export default function SkillGoalDetail({ goal }: { goal: Goal }) {
  const [localGoal, setLocalGoal] = useState(goal);
  const [isPending, startTransition] = useTransition();

  const allSubtopics = localGoal.topics.flatMap((t) => t.subtopics);
  const completedCount = allSubtopics.filter((s) => s.completions.length > 0).length;
  const totalCount = allSubtopics.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggle = (topicId: string, subtopicId: string) => {
    startTransition(() => {
      toggleCompletion(subtopicId).then((completed) => {
        setLocalGoal((prev) => ({
          ...prev,
          topics: prev.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  subtopics: topic.subtopics.map((sub) =>
                    sub.id === subtopicId
                      ? {
                          ...sub,
                          completions: completed ? [{ id: 'temp' }] : [],
                        }
                      : sub
                  ),
                }
              : topic
          ),
        }));
      });
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{goal.title}</h1>
      {goal.description && <p className="text-muted-foreground mb-4">{goal.description}</p>}
      <Progress value={progress} className="h-2 mb-4" />
      <p className="text-sm text-muted-foreground mb-6">{Math.round(progress)}% complete</p>

      <div className="space-y-6">
        {localGoal.topics.map((topic) => (
          <div key={topic.id}>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={topic.subtopics.every((s) => s.completions.length > 0)}
                onCheckedChange={() => {
                  topic.subtopics.forEach((sub) => handleToggle(topic.id, sub.id));
                }}
              />
              <h2
                className={cn(
                  'text-lg font-semibold',
                  topic.subtopics.every((s) => s.completions.length > 0) && 'line-through text-muted-foreground'
                )}
              >
                {topic.name}
              </h2>
            </div>

            <ul className="ml-6 mt-2 space-y-1">
              {topic.subtopics.map((sub) => (
                <li key={sub.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={sub.completions.length > 0}
                    onCheckedChange={() => handleToggle(topic.id, sub.id)}
                  />
                  <span className={cn(sub.completions.length > 0 && 'line-through text-muted-foreground')}>
                    {sub.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
