import { getSkillGoalById } from "@/actions/get-skill-goal-by-id";
import SkillGoalDetail from "./_components/skill-goal-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SkillGoalPage({ params }: PageProps) {

  const { id } = await params;

  const goal = await getSkillGoalById(id);

  if (!goal) {
    return (
      <div className="max-w-xl mx-auto mt-10 px-4 text-center text-red-500">
        Skill goal not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SkillGoalDetail goal={goal} />
    </div>
  );
}
