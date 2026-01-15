"use client";

import { useState } from "react";
import { PageHeader } from "./components/PageHeader";
import { GenerateForm } from "./components/GenerateForm";
import { ResultsSection } from "./components/ResultsSection";
import { Alert } from "./components/ui/Alert";
import { generateQuestions } from "./lib/api";
import type { GenerateRequest, GenerateResponse } from "./types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GenerateResponse | null>(null);

  async function handleGenerate(params: GenerateRequest) {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateQuestions(params);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <PageHeader />

        <div className="mt-16">
          <GenerateForm onGenerate={handleGenerate} isLoading={loading} />
        </div>

        {error && (
          <div className="mt-8">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {data && <ResultsSection data={data} />}

        <footer className="mt-24 text-center text-xs text-gray-500">
          <p>Practice tool only — not for live exams.</p>
          <p className="mt-1">© 2026 Academic A+ Plus. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
