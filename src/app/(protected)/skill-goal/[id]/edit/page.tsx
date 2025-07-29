// app/skill-goal/[id]/edit/page.tsx
import { getSkillGoalById } from '@/lib/get-skill-goal-by-id';
import EditSkillGoalForm from './_components/edit-skill-goal-form';

export default async function EditPage({ params }: { params: { id: string } }) {
  const goal = await getSkillGoalById(params.id);

  if (!goal) {
    return <p className="p-6">Skill goal not found</p>;
  }

  const transformedGoal = {
    ...goal,
    deadline: goal.deadline ? goal.deadline.toISOString().split('T')[0] : null, // ✅ convert Date to 'YYYY-MM-DD'
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Skill Goal</h1>
      <EditSkillGoalForm goal={transformedGoal} />
    </div>
  );
}
