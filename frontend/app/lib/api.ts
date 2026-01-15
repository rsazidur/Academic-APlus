import type { GenerateRequest, GenerateResponse } from "@/app/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export async function generateQuestions(
  params: GenerateRequest
): Promise<GenerateResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(
        errorText || `Request failed with status ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data as GenerateResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Something went wrong"
    );
  }
}
