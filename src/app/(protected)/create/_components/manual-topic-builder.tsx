"use client";

import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createSkillGoal } from "@/actions/create-skill-goal";
import { useRouter } from "next/navigation";

export default function ManualTopicBuilder() {
  const [savedGoal, setSavedGoal] = useState<{
    title: string;
    description?: string;
    deadline?: string;
  }>({ title: "", description: "", deadline: "" });

  const [topics, setTopics] = useState([{ name: "", subtopics: [""] }]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const goal = localStorage.getItem("skillGoal");
    if (goal) {
      setSavedGoal(JSON.parse(goal));
    }
  }, []);

  const updateTopicName = (i: number, name: string) => {
    const newTopics = [...topics];
    newTopics[i].name = name;
    setTopics(newTopics);
  };

  const updateSubtopic = (i: number, j: number, sub: string) => {
    const newTopics = [...topics];
    newTopics[i].subtopics[j] = sub;
    setTopics(newTopics);
  };

  const addTopic = () => setTopics([...topics, { name: "", subtopics: [""] }]);

  const addSubtopic = (i: number) => {
    const newTopics = [...topics];
    newTopics[i].subtopics.push("");
    setTopics(newTopics);
  };

  const handleSave = () => {
    if (!savedGoal.title) {
      toast.error("Missing skill goal data.");
      return;
    }

    const payload = {
      title: savedGoal.title,
      description: savedGoal.description,
      deadline: savedGoal.deadline ? new Date(savedGoal.deadline) : undefined, // ✅ send deadline
      topics,
    };

    startTransition(() => {
      createSkillGoal(payload)
        .then(() => {
          toast.success("Skill goal created successfully!");
          router.push("/create");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to save skill goal.");
        });
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manual Topic Builder</h2>
      {topics.map((topic, i) => (
        <div key={i} className="border rounded p-4 mb-4">
          <Input
            placeholder={`Topic ${i + 1}`}
            value={topic.name}
            onChange={(e) => updateTopicName(i, e.target.value)}
            className="mb-2"
          />
          {topic.subtopics.map((sub, j) => (
            <Input
              key={j}
              placeholder={`Subtopic ${j + 1}`}
              value={sub}
              onChange={(e) => updateSubtopic(i, j, e.target.value)}
              className="mb-1"
            />
          ))}
          <Button variant="outline" size="sm" onClick={() => addSubtopic(i)} className="cursor-pointer">
            + Add Subtopic
          </Button>
        </div>
      ))}
      <div className="flex gap-2">
        <Button variant="outline" onClick={addTopic} className="cursor-pointer">
          + Add Topic
        </Button>
        <Button onClick={handleSave} disabled={isPending} className="cursor-pointer">
          {isPending ? "Saving..." : "Save Skill Goal"}
        </Button>
      </div>
    </div>
  );
}
