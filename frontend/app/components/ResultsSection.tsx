import type { GenerateResponse } from "@/app/types";
import { QuestionCard } from "./QuestionCard";

interface ResultsSectionProps {
  data: GenerateResponse;
}

export function ResultsSection({ data }: ResultsSectionProps) {
  return (
    <div className="mt-16 space-y-6 fade-in">
      <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-transparent p-[1px] shadow-sm">
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground tracking-tight">{data.course}</h2>
              <p className="mt-1 text-muted-foreground font-medium">
                {data.chapter} • <span className="text-primary">{data.examType.toUpperCase()}</span>
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 px-4 py-2 border border-primary/20">
              <span className="text-sm font-semibold text-primary">
                {data.items.length} Questions
              </span>
            </div>
          </div>
        </div>
      </div>

      {data.items.map((item, index) => (
        <QuestionCard key={index} item={item} index={index} />
      ))}
    </div>
  );
}
