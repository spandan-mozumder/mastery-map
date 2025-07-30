import { getUserSkillGoals } from "@/actions/get-user-skill-goals";
import DashboardHeader from "./_components/dashboard-header";
import SkillGoalCard from "./_components/skill-goal-card";

export default async function DashboardPage() {
  const skillGoals = await getUserSkillGoals();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardHeader />

      <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {skillGoals.length > 0 ? (
          skillGoals.map((goal) => (
            <SkillGoalCard
              key={goal.id}
              goal={{
                ...goal,
                deadline: goal.deadline ? goal.deadline.toISOString() : "",
              }}
            />
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center text-lg">
            No skill goals yet. Time to level up 🚀
          </p>
        )}
      </div>
    </div>
  );
}
