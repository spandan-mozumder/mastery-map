'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SkillGoalForm({
  skillGoal,
  setSkillGoal,
}: {
  skillGoal: { title: string; description: string; deadline: string };
  setSkillGoal: (goal: { title: string; description: string; deadline: string }) => void;
}) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Skill goal title (e.g. Learn Web Development)"
        value={skillGoal.title}
        onChange={(e) => setSkillGoal({ ...skillGoal, title: e.target.value })}
      />
      <Textarea
        placeholder="Optional description..."
        value={skillGoal.description}
        onChange={(e) => setSkillGoal({ ...skillGoal, description: e.target.value })}
      />
      <Input
        type="date"
        value={skillGoal.deadline ?? ''}
        onChange={(e) => setSkillGoal({ ...skillGoal, deadline: e.target.value })}
      />
    </div>
  );
}
