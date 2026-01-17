import type { GenerateRequest, GenerateResponse, LoginRequest, RegisterRequest, AuthResponse, User } from "@/app/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }
}

// --- Token Management ---
const TOKEN_KEY = "academic_aplus_token";

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// --- Generic Fetch Wrapper ---
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorText = await response.text();
      // Try parsing JSON if possible
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.detail || errorText;
      } catch {
        errorMessage = errorText;
      }
    } catch {
      // ignore
    }

    if (response.status === 401) {
      // Optional: auto-logout on 401?
      // removeToken();
    }
    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}

// --- Auth Endpoints ---

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return fetchWithAuth("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<User> {
  return fetchWithAuth("/me");
}

// --- Uploads ---

export async function uploadFile(course: string, chapter: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  // Note: Content-Type header should NOT be set manually for FormData, 
  // fetch will set it with boundary automatically.
  // So we need a special handling or just omit Content-Type in generic wrapper for FormData?
  // Let's do a custom fetch for upload to avoid Complexity in wrapper.

  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const qs = new URLSearchParams({ course, chapter, visibility: "private" });
  const response = await fetch(`${API_BASE_URL}/uploads/upload?${qs}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const txt = await response.text();
    throw new ApiError(txt, response.status);
  }
  return response.json();
}

// --- Generate ---

export async function generateQuestions(
  params: GenerateRequest
): Promise<GenerateResponse> {
  return fetchWithAuth("/generate", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

