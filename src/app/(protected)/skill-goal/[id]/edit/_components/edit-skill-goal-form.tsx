"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateSkillGoal } from "@/actions/update-skill-goal";
import { Card } from "@/components/ui/card";

type Subtopic = { name: string };
type Topic = { name: string; subtopics: Subtopic[] };

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
    goal.topics.map((topic) => ({
      name: topic.name,
      subtopics: topic.subtopics.map((sub) => sub.name),
    }))
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
    <div className="space-y-6">
      {/* Title, Description, Deadline */}
      <div className="grid gap-4">
        <Input
          placeholder="Skill Goal Title"
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
      </div>

      {/* Topics & Subtopics */}
      <div className="space-y-6">
        {topics.map((topic, i) => (
          <Card key={i} className="p-4 space-y-4">
            {/* Topic */}
            <Input
              className="text-large font-medium"
              placeholder="Topic"
              value={topic.name}
              onChange={(e) => updateTopicName(i, e.target.value)}
            />

            <div className="pl-2 border-l-2 border-muted/30 space-y-2">
              {topic.subtopics.map((sub, j) => (
                <Input
                  key={j}
                  className="text-sm"
                  placeholder="Subtopic"
                  value={sub}
                  onChange={(e) => updateSubtopic(i, j, e.target.value)}
                />
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => addSubtopic(i)}
                className="text-xs ml-2"
              >
                + Add Subtopic
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-wrap gap-3 justify-end pt-4">
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
