import type { GenerateResponse } from "@/app/types";
import { QuestionCard } from "./QuestionCard";

interface ResultsSectionProps {
  data: GenerateResponse;
}

export function ResultsSection({ data }: ResultsSectionProps) {
  return (
    <div className="mt-16 space-y-6 fade-in">
      <div className="rounded-3xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-6 shadow-xl text-white card-hover animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{data.course}</h2>
            <p className="mt-1 text-blue-100">
              {data.chapter} • {data.examType.toUpperCase()}
            </p>
          </div>
          <div className="rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <span className="text-sm font-semibold">
              {data.items.length} Questions
            </span>
          </div>
        </div>
      </div>

      {data.items.map((item, index) => (
        <QuestionCard key={index} item={item} index={index} />
      ))}
    </div>
  );
}
