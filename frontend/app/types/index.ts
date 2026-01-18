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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface Upload {
  id: number;
  course: string;
  chapter: string;
  visibility: string;
  filename: string;
}

