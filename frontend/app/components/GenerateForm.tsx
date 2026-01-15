"use client";

import { useState } from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";
import { Alert } from "./ui/Alert";
import type { Difficulty, ExamType, GenerateRequest } from "@/app/types";

interface GenerateFormProps {
  onGenerate: (params: GenerateRequest) => Promise<void>;
  isLoading: boolean;
}

const EXAM_TYPE_OPTIONS = [
  { value: "quiz", label: "Quiz" },
  { value: "mid", label: "Mid Term" },
  { value: "final", label: "Final Exam" },
];

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export function GenerateForm({ onGenerate, isLoading }: GenerateFormProps) {
  const [course, setCourse] = useState("CSE 260");
  const [chapter, setChapter] = useState("Boolean Algebra");
  const [examType, setExamType] = useState<ExamType>("quiz");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!course.trim() || !chapter.trim()) {
      setError("Course and chapter are required");
      return;
    }

    try {
      await onGenerate({ course, chapter, examType, difficulty });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate questions");
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl border-2 border-gray-200 card-hover slide-up">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="e.g., CSE 260"
            required
          />

          <Input
            label="Chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            placeholder="e.g., Boolean Algebra"
            required
          />

          <Select
            label="Exam Type"
            value={examType}
            onChange={(e) => setExamType(e.target.value as ExamType)}
            options={EXAM_TYPE_OPTIONS}
          />

          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            options={DIFFICULTY_OPTIONS}
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="mt-8">
          Generate Questions
        </Button>

        {error && (
          <div className="mt-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}
      </form>
    </div>
  );
}
