export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">

      {/* Background: radial ember glow */}
      <div
        className="pointer-events-none fixed inset-0 anim-fade"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(255,69,0,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-flicker" role="img" aria-label="fire">🔥</span>
          <span
            className="text-lg font-bold tracking-widest uppercase text-flame"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.15em" }}
          >
            RoastMyCode
          </span>
        </div>

        <nav className="flex items-center gap-6 text-xs text-white/30 tracking-widest uppercase">
          <a href="#" className="hover:text-flame transition-colors duration-200">Examples</a>
          <a href="#" className="hover:text-flame transition-colors duration-200">GitHub</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">

        {/* Badge */}
        <div className="anim-1 inline-flex items-center gap-2 px-3 py-1 mb-10 rounded-full border border-flame/30 bg-flame/5 text-flame text-xs tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
          AI-Powered Code Roasts
        </div>

        {/* Headline */}
        <h1
          className="anim-2 flame-glow text-[clamp(3.5rem,12vw,9rem)] leading-none tracking-tight text-white mb-4"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "0.02em" }}
        >
          YOUR CODE
          <br />
          <span className="text-flame animate-flicker">DESERVES</span>
          <br />
          THE TRUTH.
        </h1>

        {/* Subheadline */}
        <p className="anim-3 max-w-xl text-white/40 text-sm leading-relaxed mb-14 tracking-wide">
          Paste your GitHub repo or a code snippet. Our AI senior engineer will{" "}
          <span className="text-ember">roast it mercilessly</span> — then tell
          you exactly how to fix it. No sugarcoating. No feelings. Just results.
        </p>

        {/* Input Card */}
        <div className="anim-4 w-full max-w-2xl">
          <div
            className="rounded-xl border border-white/8 p-1"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="flex flex-col sm:flex-row gap-2 p-3">
              <input
                type="text"
                placeholder="github.com/you/your-project  or paste code below ↓"
                className="input-roast flex-1 rounded-lg px-4 py-3 text-sm text-white/80 placeholder-white/20 font-mono"
                disabled
              />
              <button
                className="btn-roast rounded-lg px-6 py-3 text-sm font-bold tracking-widest uppercase text-white whitespace-nowrap"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}
                disabled
              >
                🔥 Roast It
              </button>
            </div>

            {/* Textarea for code */}
            <div className="px-3 pb-3">
              <textarea
                rows={5}
                placeholder={`// Or paste your code directly...\nfunction getUserData(id) {\n  // TODO: add error handling lol\n  return db.query("SELECT * FROM users WHERE id = " + id)\n}`}
                className="input-roast w-full rounded-lg px-4 py-3 text-xs text-white/50 placeholder-white/15 font-mono resize-none"
                disabled
              />
            </div>

            {/* Coming soon notice */}
            <div className="px-4 pb-4 text-center">
              <span className="text-xs text-white/20 tracking-widest uppercase">
                — Submission coming Day 2 —
              </span>
            </div>
          </div>
        </div>

        {/* Social proof strip */}
        <div className="anim-5 mt-14 flex flex-wrap justify-center gap-8 text-xs text-white/20 tracking-widest uppercase">
          {[
            { label: "Roasts served", value: "0" },
            { label: "Egos destroyed", value: "0" },
            { label: "PRs rejected", value: "∞" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-flame/60" style={{ fontFamily: "var(--font-display)" }}>
                {value}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-5 border-t border-white/5 flex items-center justify-between text-xs text-white/20 tracking-widest uppercase">
        <span>© 2026 RoastMyCode</span>
        <span className="flex items-center gap-2">
          Built with <span className="text-flame">🔥</span> and zero mercy
        </span>
      </footer>
    </main>
  );
}