"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateSkillGoal } from "@/lib/update-skill-goal";

type Subtopic = { name: string };
type Topic = {
  name: string;
  subtopics: Subtopic[];
};

interface SkillGoal {
  id: string;
  title: string;
  description?: string | null;
  deadline?: string | null;
  topics: Topic[];
}

type TopicInput = {
  name: string;
  subtopics: string[];
};

export default function EditSkillGoalForm({ goal }: { goal: SkillGoal }) {
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description ?? "");
  const [deadline, setDeadline] = useState(goal.deadline ?? "");
  const [topics, setTopics] = useState<TopicInput[]>(
    goal.topics.map(
      (topic): TopicInput => ({
        name: topic.name,
        subtopics: topic.subtopics.map((sub): string => sub.name),
      })
    )
  );

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
    if (!title) {
      toast.error("Title is required.");
      return;
    }

    const payload = {
      id: goal.id,
      title,
      description,
      deadline,
      topics: topics.map((topic) => ({
        name: topic.name,
        subtopics: topic.subtopics.map((sub) => ({ name: sub })),
      })),
    };

    startTransition(() => {
      updateSkillGoal(payload)
        .then(() => {
          toast.success("Skill goal updated!");
          router.push("/dashboard");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to update skill goal.");
        });
    });
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Edit Skill Goal</h2>

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input
        type="date"
        value={deadline ?? ""}
        onChange={(e) => setDeadline(e.target.value)}
      />

      {topics.map((topic, i) => (
        <div key={i} className="border rounded p-4 space-y-2">
          <Input
            placeholder={`Topic ${i + 1}`}
            value={topic.name}
            onChange={(e) => updateTopicName(i, e.target.value)}
          />
          {topic.subtopics.map((sub, j) => (
            <Input
              key={j}
              placeholder={`Subtopic ${j + 1}`}
              value={sub}
              onChange={(e) => updateSubtopic(i, j, e.target.value)}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSubtopic(i)}
            className="mt-1"
          >
            + Add Subtopic
          </Button>
        </div>
      ))}

      <div className="flex gap-2">
        <Button variant="outline" onClick={addTopic}>
          + Add Topic
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
