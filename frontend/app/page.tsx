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
    <main className="min-h-screen relative bg-background selection:bg-primary/20 selection:text-primary">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-12 md:py-24">
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

        <footer className="mt-24 text-center text-sm text-slate-500">
          <p>Practice tool only — not for live exams.</p>
          <p className="mt-1">© 2026 Academic A+ Plus. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
