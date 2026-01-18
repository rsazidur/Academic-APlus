"use client";

import { useState, useEffect } from "react";
import { uploadFile, getMyUploads, ApiError } from "@/app/lib/api";
import { Alert } from "@/app/components/ui/Alert";
import type { Upload } from "@/app/types";

export function UploadSection() {
    const [uploads, setUploads] = useState<Upload[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form states
    const [course, setCourse] = useState("");
    const [chapter, setChapter] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetchUploads();
    }, []);

    async function fetchUploads() {
        setFetching(true);
        try {
            const data = await getMyUploads();
            setUploads(data);
        } catch (err) {
            console.error("Failed to load uploads", err);
        } finally {
            setFetching(false);
        }
    }

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        if (!file || !course || !chapter) {
            setError("Please fill all fields");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await uploadFile(course, chapter, file);
            setSuccess("File uploaded successfully");
            setCourse("");
            setChapter("");
            setFile(null);
            // Reset file input manually if needed
            const fileInput = document.getElementById("file-upload") as HTMLInputElement;
            if (fileInput) fileInput.value = "";

            fetchUploads();
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Upload failed");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            {/* Upload Form */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Upload Material</h3>
                <p className="mt-1 text-sm text-slate-500">
                    Upload PDF, DOCX, or TXT files to include in question generation.
                </p>

                {error && <div className="mt-4"><Alert variant="error">{error}</Alert></div>}
                {success && <div className="mt-4"><Alert variant="success">{success}</Alert></div>}

                <form onSubmit={handleUpload} className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-end">
                    <div>
                        <label htmlFor="course" className="block text-sm font-medium leading-6 text-slate-900">
                            Course Name
                        </label>
                        <input
                            type="text"
                            id="course"
                            required
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                            placeholder="e.g. Physics 101"
                        />
                    </div>

                    <div>
                        <label htmlFor="chapter" className="block text-sm font-medium leading-6 text-slate-900">
                            Chapter
                        </label>
                        <input
                            type="text"
                            id="chapter"
                            required
                            value={chapter}
                            onChange={(e) => setChapter(e.target.value)}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-3"
                            placeholder="e.g. Thermodynamics"
                        />
                    </div>

                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium leading-6 text-slate-900">
                            Select File
                        </label>
                        <input
                            type="file"
                            id="file-upload"
                            accept=".pdf,.docx,.txt"
                            required
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            {loading ? "Uploading..." : "Upload File"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Uploads List */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                <h3 className="text-lg font-semibold text-slate-900">My Uploads</h3>

                {fetching ? (
                    <p className="mt-4 text-sm text-slate-500">Loading uploads...</p>
                ) : uploads.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-500">No files uploaded yet.</p>
                ) : (
                    <ul className="mt-4 divide-y divide-slate-200/60">
                        {uploads.map((u) => (
                            <li key={u.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{u.filename}</p>
                                    <p className="text-xs text-slate-500">{u.course} • {u.chapter} • <span className="capitalize">{u.visibility}</span></p>
                                </div>
                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    Available
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
