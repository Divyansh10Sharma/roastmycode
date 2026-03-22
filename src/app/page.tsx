import RepoForm from "@/components/RepoForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">

      {/* Background ember glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(255,69,0,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Noise texture */}
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
          <span className="text-2xl animate-flicker">🔥</span>
          <span
            className="text-lg font-bold tracking-widest uppercase text-flame"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.15em" }}
          >
            RoastMyCode
          </span>
        </div>
        <nav className="flex items-center gap-6 text-xs text-white/30 tracking-widest uppercase">
          <a href="#" className="hover:text-flame transition-colors">Examples</a>
          <a href="#" className="hover:text-flame transition-colors">GitHub</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center px-6 py-16 text-center">

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-flame/30 bg-flame/5 text-flame text-xs tracking-widest uppercase anim-1">
          <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
          AI-Powered Code Roasts
        </div>

        <h1
          className="flame-glow text-[clamp(3rem,10vw,7rem)] leading-none tracking-tight text-white mb-4 anim-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          YOUR CODE
          <br />
          <span className="text-flame animate-flicker">DESERVES</span>
          <br />
          THE TRUTH.
        </h1>

        <p className="max-w-xl text-white/40 text-sm leading-relaxed mb-12 tracking-wide anim-3">
          Paste a GitHub repo. Our AI senior engineer will{" "}
          <span className="text-ember">roast it mercilessly</span> — then tell
          you exactly how to fix it.
        </p>

        {/* Live form */}
        <div className="anim-4 w-full max-w-3xl">
          <RepoForm />
        </div>

      </section>

      {/* Footer */}
      <footer className="relative z-10 mt-auto px-6 py-5 border-t border-white/5 flex items-center justify-between text-xs text-white/20 tracking-widest uppercase">
        <span>© 2026 RoastMyCode</span>
        <span className="flex items-center gap-2">
          Built with <span className="text-flame">🔥</span> and zero mercy
        </span>
      </footer>
    </main>
  );
}