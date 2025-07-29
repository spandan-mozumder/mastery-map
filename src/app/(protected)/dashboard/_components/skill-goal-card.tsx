"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteSkillGoal } from "@/lib/delete-skill-goal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from "lucide-react";

type SkillGoal = {
  id: string;
  title: string;
  description?: string | null;
  topics: {
    subtopics: {
      name: string;
      completions: { id: string }[];
    }[];
  }[];
};

export default function SkillGoalCard({ goal }: { goal: SkillGoal }) {
  const allSubtopics = goal.topics.flatMap((t) => t.subtopics);
  const totalSubtopics = allSubtopics.length;
  const completedSubtopics = allSubtopics.filter(
    (s) => s.completions.length > 0
  ).length;
  const progress =
    totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    startTransition(() => {
      deleteSkillGoal(goal.id)
        .then(() => {
          toast.success("Skill goal deleted");
          router.refresh();
        })
        .catch(() => {
          toast.error("Failed to delete skill goal");
        });
    });
  };

  return (
    <div className="relative group">
      <Link href={`/skill-goal/${goal.id}`} className="block">
        <Card className="hover:shadow-md transition cursor-pointer h-full">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-lg">{goal.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progress)}% complete
            </p>
          </CardContent>
        </Card>
      </Link>

      <Button
        size="icon"
        variant="ghost"
        onClick={handleDelete}
        disabled={isPending}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>

      <Link href={`/skill-goal/${goal.id}/edit`}>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition"
        >
          ✏️
        </Button>
      </Link>
    </div>
  );
}
