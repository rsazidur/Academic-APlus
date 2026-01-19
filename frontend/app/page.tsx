"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "./components/PageHeader";
import { GenerateForm } from "./components/GenerateForm";
import { UploadSection } from "./components/UploadSection";
import { ResultsSection } from "./components/ResultsSection";
import { Alert } from "./components/ui/Alert";
import { generateQuestions, trackVisit, ApiError } from "./lib/api";
import type { GenerateRequest, GenerateResponse } from "./types";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GenerateResponse | null>(null);
  useEffect(() => {
    // Track site visit
    trackVisit().catch(err => console.error("Tracking failed", err));
  }, []);

  async function handleGenerate(params: GenerateRequest) {

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateQuestions(params);
      setData(result);
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        setError("Session expired or unauthorized generation.");
        // setIsAuthenticated(false);
        // removeToken();
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
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

        {/* Admin Navigation 
        <div className="absolute top-6 right-6">
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            Admin
          </Link>
        </div>
        */}

        <PageHeader />

        <div className="mt-16">
          {/* Generation Form */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-6">Generate Questions</h2>
            <GenerateForm onGenerate={handleGenerate} isLoading={loading} />
          </section>

          {/* Uploads Section */}
          <section className="mt-16">
            <h2 className="text-xl font-semibold text-white mb-6">Manage Material</h2>
            <UploadSection />
          </section>
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
