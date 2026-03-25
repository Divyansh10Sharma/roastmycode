"use client";

interface Props {
  partial: string;
}

export default function StreamingIndicator({ partial }: Props) {
  // Try to extract how far along the JSON is building
  const hasRoast = partial.includes('"roast"');
  const hasSeverity = partial.includes('"severity"');
  const hasFixes = partial.includes('"fixes"');

  const steps = [
    { label: "Analyzing your code...", done: hasRoast },
    { label: "Calculating severity...", done: hasSeverity },
    { label: "Generating fixes...", done: hasFixes },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className="rounded-xl border border-flame/20 p-8"
        style={{ background: "rgba(255,69,0,0.04)" }}
      >
        {/* Animated fire */}
        <div className="text-center mb-8">
          <span className="text-5xl animate-flicker inline-block">🔥</span>
          <p
            className="text-flame text-xl mt-3 tracking-widest"
            style={{ fontFamily: "var(--font-display)" }}
          >
            GETTING ROASTED
          </p>
        </div>

        {/* Progress steps */}
        <div className="space-y-3 mb-8">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                style={{
                  background: step.done ? "#FF4500" : "rgba(255,255,255,0.05)",
                  border: step.done ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {step.done ? (
                  <span className="text-white text-xs">✓</span>
                ) : (
                  <span
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                  />
                )}
              </div>
              <span
                className="text-xs tracking-widest uppercase transition-colors duration-500"
                style={{
                  color: step.done ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                }}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Raw streaming JSON preview — shows the typing effect */}
        {partial && (
          <div className="rounded-lg border border-white/5 p-4 bg-black/20">
            <p className="text-xs text-white/15 tracking-widest uppercase mb-2">
              Raw output
            </p>
            <pre className="text-xs text-white/25 font-mono leading-relaxed overflow-hidden max-h-32 overflow-y-auto">
              {partial}
              <span className="inline-block w-2 h-3 bg-flame/60 ml-0.5 animate-pulse" />
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}