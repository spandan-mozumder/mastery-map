"use client";

import { useState, useTransition } from "react";
import { Progress } from "@/components/ui/progress";
import { toggleCompletion } from "@/actions/toggle-completion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

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
      completions: { id: string }[];
    }[];
  }[];
};

export default function SkillGoalDetail({ goal }: { goal: Goal }) {
  const [localGoal, setLocalGoal] = useState(goal);
  const [isPending, startTransition] = useTransition();

  const allSubtopics = localGoal.topics.flatMap((t) => t.subtopics);
  const completedCount = allSubtopics.filter(
    (s) => s.completions.length > 0
  ).length;
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
                          completions: completed ? [{ id: "temp" }] : [],
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
      {/* Title & Description */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{goal.title}</h1>
        <p className="text-muted-foreground mt-2 text-base">
          {goal.description || "No description provided."}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={progress} className="h-3 rounded-full" />
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>

      {/* Topics */}
      <div className="space-y-6">
        {localGoal.topics.map((topic) => {
          const topicCompleted = topic.subtopics.every(
            (s) => s.completions.length > 0
          );

          return (
            <div
              key={topic.id}
              className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm transition"
            >
              {/* Topic Title */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={topicCompleted}
                    onCheckedChange={() => {
                      topic.subtopics.forEach((sub) =>
                        handleToggle(topic.id, sub.id)
                      );
                    }}
                    disabled={isPending}
                  />
                  <h2
                    className={cn(
                      "text-lg sm:text-xl font-semibold",
                      topicCompleted && "line-through text-muted-foreground"
                    )}
                  >
                    {topic.name}
                  </h2>
                </div>
              </div>

              {/* Subtopics */}
              <ul className="space-y-3 ml-6">
                {topic.subtopics.map((sub) => {
                  const isComplete = sub.completions.length > 0;

                  return (
                    <li key={sub.id} className="flex items-center gap-3">
                      <Checkbox
                        checked={isComplete}
                        onCheckedChange={() =>
                          handleToggle(topic.id, sub.id)
                        }
                        disabled={isPending}
                      />
                      <span
                        className={cn(
                          "text-base",
                          isComplete && "line-through text-muted-foreground"
                        )}
                      >
                        {sub.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
