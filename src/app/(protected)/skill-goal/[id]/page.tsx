import { getSkillGoalById } from "@/lib/get-skill-goal-by-id";
import SkillGoalDetail from "./_components/skill-goal-detail";

export default async function SkillGoalPage(context: {
  params: { id: string };
}) {
  const { params } = context;

  const goal = await getSkillGoalById(params.id);

  if (!goal) {
    return (
      <p className="text-center mt-10 text-red-500">Skill goal not found.</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <SkillGoalDetail goal={goal} />
    </div>
  );
}
