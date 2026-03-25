"use client";

import { useState } from "react";
import { RoastResult, RepoFile } from "@/lib/types";

type RoastState =
  | { status: "idle" }
  | { status: "loading"; partial: string }
  | { status: "success"; result: RoastResult }
  | { status: "error"; message: string };

export function useRoast() {
  const [state, setState] = useState<RoastState>({ status: "idle" });

  async function roast(owner: string, repo: string, files: RepoFile[]) {
    setState({ status: "loading", partial: "" });

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo, files }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setState({
          status: "error",
          message: data.error ?? "Failed to start roast.",
        });
        return;
      }

      // Stream the response
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Check for streamed error signal
        if (chunk.includes("__ERROR__:")) {
          const msg = chunk.split("__ERROR__:")[1] ?? "Unknown stream error.";
          setState({ status: "error", message: msg.trim() });
          return;
        }

        accumulated += chunk;
        setState({ status: "loading", partial: accumulated });
      }
 
      // Parse final JSON
      try {
        // Strip any accidental markdown fences
        const clean = accumulated
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        const parsed: RoastResult = JSON.parse(clean);
        setState({ status: "success", result: parsed });
      } catch {
        setState({
          status: "error",
          message: "GPT-4o returned malformed JSON. Try again.",
        });
      }
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Network error.",
      });
    }
  }

  function reset() {
    setState({ status: "idle" });
  }

  return { state, roast, reset };
}