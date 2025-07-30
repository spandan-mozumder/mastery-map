"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteSkillGoal } from "@/actions/delete-skill-goal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type SkillGoal = {
  id: string;
  title: string;
  deadline: string; // ISO string from Prisma
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
          toast.success(`Deleted "${goal.title}"`);
          router.refresh();
        })
        .catch(() => {
          toast.error("Failed to delete skill goal");
        });
    });
  };

  const daysRemaining = Math.ceil(
    (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  let badgeVariant: "default" | "outline" | "destructive";
  if (daysRemaining > 75) badgeVariant = "default";
  else if (daysRemaining >= 25) badgeVariant = "outline";
  else badgeVariant = "destructive";

  return (
    <div className="relative group h-full">
      <Link href={`/skill-goal/${goal.id}`} className="block h-full">
        <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
          <CardHeader className="flex justify-between items-start gap-2">
            <div className="flex-1 space-y-1">
              <CardTitle className="text-lg leading-snug line-clamp-2">
                {goal.title}
              </CardTitle>
              <Badge variant={badgeVariant}>
                {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {Math.round(progress)}% complete
            </p>
          </CardContent>
        </Card>
      </Link>

      {/* Edit Button */}
      <Link href={`/skill-goal/${goal.id}/edit`}>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          ✏️
        </Button>
      </Link>

      {/* Delete Button with AlertDialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this skill goal?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All related data will be
              permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
