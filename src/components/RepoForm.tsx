"use client";

import { useState, FormEvent } from "react";
import { useRoast } from "@/hooks/useRoast";
import { RepoFile } from "@/lib/types";
import RoastDisplay from "./RoastDisplay";
import StreamingIndicator from "./StreamingIndicator";

interface FetchResult {
  owner: string;
  repo: string;
  files: RepoFile[];
}

interface ApiError {
  type: string;
  message: string;
}

type PageState =
  | { stage: "input" }
  | { stage: "fetched"; data: FetchResult }
  | { stage: "roasting" }
  | { stage: "done" };

export default function RepoForm() {
  const [url, setUrl] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<ApiError | null>(null);
  const [fetchResult, setFetchResult] = useState<FetchResult | null>(null);
  const [, setPageState] = useState<PageState>({ stage: "input" });

  const { state: roastState, roast, reset: resetRoast } = useRoast();

  // ── Fetch repo ──────────────────────────────────────────────────────────────

  async function handleFetch(e: FormEvent) {
    e.preventDefault();
    setFetchLoading(true);
    setFetchResult(null);
    setFetchError(null);
    resetRoast();
    setPageState({ stage: "input" });

    try {
      const res = await fetch("/api/fetch-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFetchError(data.error ?? { type: "unknown", message: "Unknown error." });
        return;
      }

      setFetchResult(data);
      setPageState({ stage: "fetched", data });
    } catch {
      setFetchError({ type: "unknown", message: "Network error. Are you online?" });
    } finally {
      setFetchLoading(false);
    }
  }

  // ── Trigger roast ───────────────────────────────────────────────────────────

  async function handleRoast() {
    if (!fetchResult) return;
    setPageState({ stage: "roasting" });
    await roast(fetchResult.owner, fetchResult.repo, fetchResult.files);
    setPageState({ stage: "done" });
  }

  // ── Reset everything ────────────────────────────────────────────────────────

  function handleReset() {
    setUrl("");
    setFetchResult(null);
    setFetchError(null);
    resetRoast();
    setPageState({ stage: "input" });
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const isRoasting = roastState.status === "loading";
  const isRoastDone = roastState.status === "success";
  const isRoastError = roastState.status === "error";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">

      {/* Input form — always visible unless actively roasting or done */}
      {!isRoasting && !isRoastDone && (
        <form onSubmit={handleFetch} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="github.com/owner/repo"
            className="input-roast flex-1 rounded-lg px-4 py-3 text-sm text-white/80 placeholder-white/20 font-mono"
            disabled={fetchLoading}
            required
          />
          <button
            type="submit"
            disabled={fetchLoading || !url.trim()}
            className="btn-roast rounded-lg px-6 py-3 text-sm font-bold tracking-widest uppercase text-white whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}
          >
            {fetchLoading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Fetching...
              </span>
            ) : (
              "Fetch Repo"
            )}
          </button>
        </form>
      )}

      {/* Fetch error */}
      {fetchError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
          <p className="text-xs text-red-400 font-mono">
            <span className="text-red-300 font-bold uppercase tracking-wider">
              [{fetchError.type}]
            </span>{" "}
            {fetchError.message}
          </p>
        </div>
      )}

      {/* Fetched — show files + roast button */}
      {fetchResult && !isRoasting && !isRoastDone && !isRoastError && (
        <div className="space-y-4">
          {/* File list */}
          <div className="rounded-xl border border-white/8 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <span className="text-xs text-flame font-mono tracking-widest uppercase">
                ✓ {fetchResult.files.length} files ready
              </span>
              <span className="text-xs text-white/20 font-mono">
                {fetchResult.owner}/{fetchResult.repo}
              </span>
            </div>
            {fetchResult.files.map((file) => (
              <div
                key={file.path}
                className="px-4 py-2.5 border-b border-white/5 last:border-0 flex items-center justify-between"
              >
                <span className="text-xs text-white/50 font-mono">{file.path}</span>
                <span className="text-xs text-white/20">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>

          {/* Roast button */}
          <button
            onClick={handleRoast}
            className="btn-roast w-full rounded-xl py-4 text-base font-bold tracking-widest uppercase text-white"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.15em" }}
          >
            🔥 Roast This Code
          </button>
        </div>
      )}

      {/* Streaming in progress */}
      {isRoasting && roastState.status === "loading" && (
        <StreamingIndicator partial={roastState.partial} />
      )}

      {/* Roast error */}
      {isRoastError && (
        <div className="space-y-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-xs text-red-400 font-mono">
              <span className="text-red-300 font-bold uppercase tracking-wider">
                [roast_error]
              </span>{" "}
              {roastState.message}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="w-full rounded-xl py-3 text-xs font-bold tracking-widest uppercase text-white/40 border border-white/10 hover:border-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Roast done */}
      {isRoastDone && roastState.status === "success" && fetchResult && (
        <div className="space-y-6">
          <RoastDisplay
            result={roastState.result}
            repoName={`${fetchResult.owner}/${fetchResult.repo}`}
          />

          {/* Roast another */}
          <button
            onClick={handleReset}
            className="w-full rounded-xl py-3 text-xs font-bold tracking-widest uppercase text-white/40 border border-white/10 hover:border-flame/30 hover:text-flame/60 transition-colors"
          >
            🔥 Roast Another Repo
          </button>

          <p className="text-center text-xs text-white/15 tracking-widest uppercase">
            — Day 4: save to Supabase + shareable links —
          </p>
        </div>
      )}
    </div>
  );
}