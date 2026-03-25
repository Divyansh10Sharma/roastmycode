"use client";

import { RoastResult } from "@/lib/types";
import { getSeverityColor, getSeverityEmoji, getSeverityLabel } from "@/lib/severity";

interface Props {
  result: RoastResult;
  repoName: string;
}

export default function RoastDisplay({ result, repoName }: Props) {
  const color = getSeverityColor(result.severity);
  const emoji = getSeverityEmoji(result.severity);
  const label = getSeverityLabel(result.severity);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 anim-1">

      {/* Repo label */}
      <div className="flex items-center gap-2 text-xs text-white/30 font-mono tracking-widest uppercase">
        <span className="text-flame">🔥</span>
        <span>Roast for</span>
        <span className="text-white/60">{repoName}</span>
      </div>

      {/* Severity score */}
      <div
        className="rounded-xl border p-6 flex items-center justify-between"
        style={{
          borderColor: `${color}40`,
          background: `${color}08`,
        }}
      >
        <div>
          <p className="text-xs text-white/30 tracking-widest uppercase mb-1">
            Severity Score
          </p>
          <p
            className="text-6xl font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color,
              textShadow: `0 0 20px ${color}60`,
            }}
          >
            {result.severity}
            <span className="text-2xl text-white/20">/10</span>
          </p>
          <p className="text-sm mt-1" style={{ color }}>
            {label}
          </p>
        </div>
        <span className="text-6xl">{emoji}</span>
      </div>

      {/* Roast paragraph */}
      <div
        className="rounded-xl border border-white/8 p-6"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <p className="text-xs text-white/30 tracking-widest uppercase mb-4 flex items-center gap-2">
          <span>🎤</span> The Roast
        </p>
        <p className="text-white/80 text-sm leading-relaxed font-mono">
          {result.roast}
        </p>
      </div>

      {/* Fixes */}
      <div className="space-y-3">
        <p className="text-xs text-white/30 tracking-widest uppercase flex items-center gap-2">
          <span>🔧</span> Actionable Fixes
        </p>
        {result.fixes.map((fix, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/8 p-5"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex items-start gap-4">
              <span
                className="text-sm font-bold mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${color}20`,
                  color,
                  fontFamily: "var(--font-display)",
                }}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-white/90 mb-1">{fix.title}</p>
                <p className="text-xs text-white/50 leading-relaxed font-mono">
                  {fix.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}