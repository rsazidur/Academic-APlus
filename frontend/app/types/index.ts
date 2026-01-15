export type Difficulty = "easy" | "medium" | "hard";
export type ExamType = "quiz" | "mid" | "final";

export interface QAItem {
  question: string;
  marks: number;
  difficulty: Difficulty;
  solution: string;
  common_mistakes?: string[];
}

export interface GenerateResponse {
  course: string;
  chapter: string;
  examType: ExamType;
  items: QAItem[];
}

export interface GenerateRequest {
  course: string;
  chapter: string;
  examType: ExamType;
  difficulty: Difficulty;
}
