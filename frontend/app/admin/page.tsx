"use client";

import { useState, useEffect } from "react";
import { getStats, uploadOfficial, ApiError } from "../lib/api";

type Stats = {
    total_visits: number;
    questions_generated: number;
};

export default function AdminPage() {
    const [key, setKey] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Simple "login" by just setting state if key seems present
    // In real app, we verify key with backend first
    function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (key.trim().length > 0) {
            setIsAuthorized(true);
            fetchStats();
        }
    }

    async function fetchStats() {
        setLoading(true);
        setError(null);
        try {
            const data = await getStats(key);
            setStats(data);
        } catch (err) {
            setError("Failed to fetch stats. Incorrect Key?");
            setIsAuthorized(false);
        } finally {
            setLoading(false);
        }
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="max-w-md w-full space-y-8 bg-slate-50/50 p-8 rounded-lg border border-slate-200">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
                            Admin Access
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="-space-y-px rounded-md shadow-sm">
                            <div>
                                <label htmlFor="key" className="sr-only">
                                    Admin Key
                                </label>
                                <input
                                    id="key"
                                    name="key"
                                    type="password"
                                    required
                                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                    placeholder="Enter Admin Key"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Access Dashboard
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    </form>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                    <button
                        onClick={() => setIsAuthorized(false)}
                        className="text-sm text-slate-500 hover:text-slate-900"
                    >
                        Exit
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-slate-900/50 border border-indigo-500/20 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-slate-400">Total Site Visits</h3>
                        <p className="text-4xl font-bold text-white mt-2">
                            {loading ? "..." : stats?.total_visits ?? "-"}
                        </p>
                    </div>
                    <div className="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-slate-400">Questions Generated</h3>
                        <p className="text-4xl font-bold text-white mt-2">
                            {loading ? "..." : stats?.questions_generated ?? "-"}
                        </p>
                    </div>
                </div>

                {/* Refresh Button */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={fetchStats}
                        disabled={loading}
                        className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                        Refresh Stats
                    </button>
                </div>
            </div>
        </main>
    );
}
