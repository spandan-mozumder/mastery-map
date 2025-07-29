// app/dashboard/page.tsx
import { getUserSkillGoals } from '@/lib/get-user-skill-goals';
import DashboardHeader from './_components/dashboard-header';
import SkillGoalCard from './_components/skill-goal-card';

export default async function DashboardPage() {
  const skillGoals = await getUserSkillGoals();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <DashboardHeader />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {skillGoals.length > 0 ? (
          skillGoals.map((goal) => (
            <SkillGoalCard key={goal.id} goal={goal} />
          ))
        ) : (
          <p className="text-muted-foreground col-span-full">No skill goals yet. Time to level up 🚀</p>
        )}
      </div>
    </div>
  );
}
