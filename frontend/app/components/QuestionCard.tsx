import type { QAItem } from "@/app/types";

interface QuestionCardProps {
  item: QAItem;
  index: number;
}

export function QuestionCard({ item, index }: QuestionCardProps) {
  return (
    <div className="clean-card rounded-2xl p-8 transition-shadow hover:shadow-md animate-in">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-bold text-foreground">Question {index + 1}</h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="rounded-md bg-muted px-2.5 py-1 font-medium text-muted-foreground uppercase text-xs tracking-wider border border-border">
            {item.difficulty}
          </span>
          <span className="rounded-md bg-primary/10 px-2.5 py-1 font-medium text-primary border border-primary/20 text-xs">
            {item.marks} marks
          </span>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-slate-300 font-normal">{item.question}</p>

      <div className="mt-6 rounded-xl bg-secondary/10 p-5 border border-secondary/20">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-secondary"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div className="text-sm font-semibold text-secondary">Solution</div>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {item.solution}
        </p>
      </div>

      {item.common_mistakes && item.common_mistakes.length > 0 && (
        <div className="mt-6 rounded-xl bg-orange-500/10 p-5 border border-orange-500/20">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-orange-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div className="text-sm font-semibold text-orange-400">Common Mistakes</div>
          </div>
          <ul className="mt-3 list-disc pl-6 text-sm text-slate-300 space-y-2">
            {item.common_mistakes.map((mistake, i) => (
              <li key={i}>{mistake}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
