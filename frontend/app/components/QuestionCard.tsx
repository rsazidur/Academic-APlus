import type { QAItem } from "@/app/types";

interface QuestionCardProps {
  item: QAItem;
  index: number;
}

export function QuestionCard({ item, index }: QuestionCardProps) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl border-2 border-gray-200 card-hover scale-in">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Question {index + 1}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="rounded-full bg-gray-100 px-3 py-1 font-medium uppercase">
            {item.difficulty}
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">
            {item.marks} marks
          </span>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-gray-800">{item.question}</p>

      <div className="mt-6 rounded-2xl bg-green-50 p-5 border-2 border-green-200">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-green-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div className="text-sm font-semibold text-green-900">Solution</div>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
          {item.solution}
        </p>
      </div>

      {item.common_mistakes && item.common_mistakes.length > 0 && (
        <div className="mt-6 rounded-2xl bg-amber-50 p-5 border-2 border-amber-200">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-amber-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div className="text-sm font-semibold text-amber-900">Common Mistakes</div>
          </div>
          <ul className="mt-3 list-disc pl-6 text-sm text-gray-700 space-y-2">
            {item.common_mistakes.map((mistake, i) => (
              <li key={i}>{mistake}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
