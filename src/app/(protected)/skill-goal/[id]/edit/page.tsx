import { getSkillGoalById } from "@/actions/get-skill-goal-by-id";
import EditSkillGoalForm from "./_components/edit-skill-goal-form";

export default async function EditPage({ params }: { params: { id: string } }) {
  const goal = await getSkillGoalById(params.id);

  if (!goal) {
    return (
      <div className="text-center text-red-500 mt-10">
        Skill goal not found
      </div>
    );
  }

  const transformedGoal = {
    ...goal,
    deadline: goal.deadline ? goal.deadline.toISOString().split("T")[0] : null,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Skill Goal</h1>
      <EditSkillGoalForm goal={transformedGoal} />
    </div>
  );
}
