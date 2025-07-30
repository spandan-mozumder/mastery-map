import { getSkillGoalById } from "@/actions/get-skill-goal-by-id";
import EditSkillGoalForm from "./_components/edit-skill-goal-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPage({ params }: PageProps) {
  const { id } = await params;
  
  const goal = await getSkillGoalById(id);

  if (!goal) {
    return (
      <div className="text-center text-red-500 mt-20">
        Skill goal not found
      </div>
    );
  }

  const transformedGoal = {
    ...goal,
    deadline: goal.deadline ? goal.deadline.toISOString().split("T")[0] : null,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-20">
      <h1 className="text-3xl font-bold mb-6">Edit Skill Goal</h1>
      <EditSkillGoalForm goal={transformedGoal} />
    </div>
  );
}