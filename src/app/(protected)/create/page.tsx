'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';
import SkillGoalForm from './_components/skill-goals-form';
import ActionButtons from './_components/action-buttons';

export default function CreateSkillGoalPage() {
  const [skillGoal, setSkillGoal] = useState({
    title: '',
    description: '',
    deadline: '',
  });
  const router = useRouter();

  const handleNext = (mode: 'manual' | 'ai') => {
    if (!skillGoal.title.trim()) {
      toast.error('Please enter a title for your skill goal');
      return;
    }

    localStorage.setItem('skillGoal', JSON.stringify(skillGoal));
    router.push(`/create/${mode}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <h1 className="text-3xl font-bold mb-4">Create a New Skill Goal</h1>
      <SkillGoalForm skillGoal={skillGoal} setSkillGoal={setSkillGoal} />
      <ActionButtons onSelect={handleNext} />
    </div>
  );
}
