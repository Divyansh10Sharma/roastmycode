// src/components/RepoForm.tsx

"use client";

import { useState, FormEvent } from "react";

interface RepoFile {
  path: string;
  content: string;
  size: number;
}

interface FetchResult {
  owner: string;
  repo: string;
  files: RepoFile[];
}

interface ApiError {
  type: string;
  message: string;
}

export default function RepoForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/fetch-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? { type: "unknown", message: "Unknown error." });
        return;
      }

      setResult(data);
    } catch {
      setError({ type: "unknown", message: "Network error. Are you online?" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-8">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="github.com/owner/repo"
          className="input-roast flex-1 rounded-lg px-4 py-3 text-sm text-white/80 placeholder-white/20 font-mono"
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="btn-roast rounded-lg px-6 py-3 text-sm font-bold tracking-widest uppercase text-white whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Fetching...
            </span>
          ) : (
            "🔥 Fetch Repo"
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <p className="text-xs text-red-400 font-mono">
            <span className="text-red-300 font-bold uppercase tracking-wider">
              [{error.type}]
            </span>{" "}
            {error.message}
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Repo header */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/8">
            <span className="text-flame text-xs font-mono tracking-widest uppercase">
              ✓ Fetched
            </span>
            <span className="text-white/60 text-sm font-mono">
              {result.owner}/{result.repo}
            </span>
            <span className="ml-auto text-white/20 text-xs">
              {result.files.length} files selected
            </span>
          </div>

          {/* File list */}
          {result.files.map((file) => (
            <div
              key={file.path}
              className="rounded-lg border border-white/8 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              {/* File header */}
              <button
                onClick={() =>
                  setExpandedFile(expandedFile === file.path ? null : file.path)
                }
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-xs text-ember font-mono">{file.path}</span>
                <span className="flex items-center gap-3 text-xs text-white/20">
                  <span>{(file.size / 1024).toFixed(1)} KB</span>
                  <span className="text-white/40">
                    {expandedFile === file.path ? "▲" : "▼"}
                  </span>
                </span>
              </button>

              {/* File content */}
              {expandedFile === file.path && (
                <div className="border-t border-white/5">
                  <pre className="p-4 text-xs text-white/50 font-mono overflow-x-auto leading-relaxed max-h-96 overflow-y-auto">
                    <code>{file.content}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}

          {/* Next step hint */}
          <p className="text-center text-xs text-white/15 pt-4 tracking-widest uppercase">
            — Day 3: feed these files to GPT-4o and get roasted —
          </p>
        </div>
      )}
    </div>
  );
}