// app/create/ai/page.tsx OR components/AiEditableTopicBuilder.tsx

"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X } from "lucide-react";

// Action to generate topics (from Step 1)
import { generateTopicsFromAI } from "@/actions/generate-skill-goal-with-ai";
// Your existing action to save the final goal
import { createSkillGoal } from "@/actions/create-skill-goal";

export default function AiEditableTopicBuilder() {
  // State for AI generation phase
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the form data and saving phase
  const [savedGoal, setSavedGoal] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [topics, setTopics] = useState<{ name: string; subtopics: string[] }[]>(
    []
  );
  const [isSaving, startTransition] = useTransition();
  const router = useRouter();

  // Effect to generate topics when the component mounts
  useEffect(() => {
    const goalData = localStorage.getItem("skillGoal");
    if (!goalData) {
      toast.error("Skill goal data not found. Redirecting...");
      router.push("/create");
      return;
    }

    const parsedGoal = JSON.parse(goalData);
    setSavedGoal(parsedGoal);

    const fetchTopics = async () => {
      setIsLoading(true);
      setError(null);
      const result = await generateTopicsFromAI(parsedGoal.title);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result.data) {
        setTopics(result.data);
        toast.success("🚀 AI has generated a starting plan for you to review!");
      }
      setIsLoading(false);
    };

    fetchTopics();
  }, [router]);

  // Handlers for editing the form (similar to your manual builder)
  const updateTopicName = (topicIndex: number, name: string) => {
    const newTopics = [...topics];
    newTopics[topicIndex].name = name;
    setTopics(newTopics);
  };

  const updateSubtopic = (
    topicIndex: number,
    subtopicIndex: number,
    value: string
  ) => {
    const newTopics = [...topics];
    newTopics[topicIndex].subtopics[subtopicIndex] = value;
    setTopics(newTopics);
  };

  const addTopic = () => setTopics([...topics, { name: "", subtopics: [""] }]);

  const addSubtopic = (topicIndex: number) => {
    const newTopics = [...topics];
    newTopics[topicIndex].subtopics.push("");
    setTopics(newTopics);
  };

  const removeTopic = (topicIndex: number) => {
    setTopics(topics.filter((_, i) => i !== topicIndex));
  };

  const removeSubtopic = (topicIndex: number, subtopicIndex: number) => {
    const newTopics = [...topics];
    newTopics[topicIndex].subtopics = newTopics[topicIndex].subtopics.filter(
      (_, i) => i !== subtopicIndex
    );
    setTopics(newTopics);
  };

  // Final save handler using your existing server action
  const handleSave = () => {
    if (!savedGoal.title) {
      toast.error("Missing skill goal data.");
      return;
    }

    // Filter out empty topics or subtopics before saving
    const cleanedTopics = topics
      .map((topic) => ({
        ...topic,
        subtopics: topic.subtopics.filter((sub) => sub.trim() !== ""),
      }))
      .filter(
        (topic) => topic.name.trim() !== "" && topic.subtopics.length > 0
      );

    if (cleanedTopics.length === 0) {
      toast.error("Please define at least one topic and subtopic.");
      return;
    }

    const payload = {
      title: savedGoal.title,
      description: savedGoal.description || undefined,
      deadline: savedGoal.deadline ? new Date(savedGoal.deadline) : undefined,
      topics: cleanedTopics,
    };

    startTransition(() => {
      createSkillGoal(payload)
        .then(() => {
          toast.success("Skill goal created successfully!");
          localStorage.removeItem("skillGoal");
          router.push("/dashboard"); // Navigate to a relevant page
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to save skill goal. Please check the inputs.");
        });
    });
  };

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-semibold mb-4 animate-pulse">
          🤖 Generating Your Learning Plan...
        </h2>
        <p>
          Our AI is crafting a personalized roadmap. This may take a moment.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-semibold mb-4 text-destructive">
          Oops! Something went wrong.
        </h2>
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Review Your AI-Generated Plan</h1>
      <p className="text-muted-foreground mb-6">
        Here&apos;s a starting point for &quot;{savedGoal.title}&quot;. Feel free to edit, add,
  or remove anything before saving.
      </p>
      <div className="space-y-4">
        {topics.map((topic, i) => (
          <div key={i} className="border rounded-lg p-4 bg-card space-y-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder={`Topic ${i + 1} Name`}
                value={topic.name}
                onChange={(e) => updateTopicName(i, e.target.value)}
                className="font-bold text-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTopic(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="pl-4 space-y-2">
              {topic.subtopics.map((sub, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Input
                    placeholder={`Subtopic ${j + 1}`}
                    value={sub}
                    onChange={(e) => updateSubtopic(i, j, e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSubtopic(i, j)}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSubtopic(i)}
              >
                + Add Subtopic
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-6">
        <Button variant="outline" onClick={addTopic}>
          + Add Topic
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Create Skill Goal"}
        </Button>
      </div>
    </div>
  );
}
