"use client";

import { useState, useTransition } from "react";
import { Progress } from "@/components/ui/progress";
import { toggleCompletion } from "@/actions/toggle-completion";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Goal = {
  id: string;
  title: string;
  description?: string | null;
  topics: {
    id:string;
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
  const [activeQuoteSubtopicId, setActiveQuoteSubtopicId] = useState<
    string | null
  >(null);

  const quotes = [
    "You're crushing it! Keep going 💪",
    "Small steps lead to big gains 🚀",
    "Just one more—you're on fire 🔥",
    "Every check is a victory ✅",
  ];

  const topicQuotes = [
    "🎉 You crushed this topic! Time to tackle the next one!",
    "🏆 Victory! You're mastering this skill one topic at a time.",
    "🔥 That topic didn’t stand a chance. Keep up the heat!",
    "💥 Boom! Another one down. You’re unstoppable.",
  ];

  const allSubtopics = localGoal.topics.flatMap((t) => t.subtopics);
  const completedCount = allSubtopics.filter(
    (s) => s.completions.length > 0
  ).length;
  const totalCount = allSubtopics.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggle = (topicId: string, subtopicId: string) => {
    startTransition(() => {
      toggleCompletion(subtopicId).then((completed) => {
        setLocalGoal((prev) => {
          const updatedTopics = prev.topics.map((topic) =>
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
          );

          const updatedGoal = { ...prev, topics: updatedTopics };

          const topic = updatedTopics.find((t) => t.id === topicId);
          const topicSubtopics = topic?.subtopics || [];

          // Check if the topic is now complete
          const isTopicComplete = topicSubtopics.every(
            (s) => s.completions.length > 0
          );

          if (completed && isTopicComplete) {
            // A subtopic check just completed the whole topic
            setActiveQuoteSubtopicId(null); // Hide any subtopic popovers
            toast.success(
              topicQuotes[Math.floor(Math.random() * topicQuotes.length)]
            );
          } else if (completed) {
            // A subtopic was checked, but the topic is not yet complete
            setActiveQuoteSubtopicId(subtopicId);
            setTimeout(() => setActiveQuoteSubtopicId(null), 2500);
          }

          return updatedGoal;
        });
      });
    });
  };

  const handleTopicToggle = (topicId: string, subtopicIds: string[]) => {
    startTransition(() => {
      // Create an array of promises, one for each subtopic completion
      const togglePromises = subtopicIds.map((id) => toggleCompletion(id));

      // Wait for all server actions to complete successfully
      Promise.all(togglePromises)
        .then(() => {
          // Once all promises resolve, update the local state and show a single toast
          setLocalGoal((prev) => {
            const updatedTopics = prev.topics.map((topic) =>
              topic.id === topicId
                ? {
                    ...topic,
                    subtopics: topic.subtopics.map((sub) => ({
                      ...sub,
                      // Optimistically mark all as complete
                      completions: [{ id: "temp" }],
                    })),
                  }
                : topic
            );
            return { ...prev, topics: updatedTopics };
          });

          // Hide any active popovers and show the topic completion toast
          setActiveQuoteSubtopicId(null);
          toast.success(
            topicQuotes[Math.floor(Math.random() * topicQuotes.length)]
          );
        })
        .catch(() => {
          // If any of the promises fail, show an error
          toast.error("Oops! Something went wrong. Please try again.");
        });
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{goal.title}</h1>
        <p className="text-muted-foreground mt-2 text-base">
          {goal.description || "No description provided."}
        </p>
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-3 rounded-full" />
        <p className="text-sm text-muted-foreground mt-2">
          {Math.round(progress)}% complete
        </p>
      </div>

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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={topicCompleted}
                    onCheckedChange={() =>
                      handleTopicToggle(
                        topic.id,
                        topic.subtopics.map((s) => s.id)
                      )
                    }
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

              <ul className="space-y-3 ml-6">
                {topic.subtopics.map((sub) => {
                  const isComplete = sub.completions.length > 0;

                  return (
                    <li key={sub.id} className="flex items-center gap-3">
                      <Popover open={activeQuoteSubtopicId === sub.id}>
                        <PopoverTrigger asChild>
                          <Checkbox
                            checked={isComplete}
                            onCheckedChange={() =>
                              handleToggle(topic.id, sub.id)
                            }
                            disabled={isPending}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="text-sm text-center max-w-xs">
                          {quotes[Math.floor(Math.random() * quotes.length)]}
                        </PopoverContent>
                      </Popover>
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