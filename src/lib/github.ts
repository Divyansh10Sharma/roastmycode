import axios, { AxiosError } from "axios";

const GITHUB_API = "https://api.github.com";

const gh = axios.create({
  baseURL: GITHUB_API,
  headers: {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RepoFile {
  path: string;
  content: string;
  size: number;
}

export interface GithubError {
  type: "not_found" | "private" | "rate_limit" | "invalid_url" | "unknown";
  message: string;
}

// ─── URL Parser ───────────────────────────────────────────────────────────────

export function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const clean = url.trim().replace(/\.git$/, "");
    const match = clean.match(
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/
    );
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  } catch {
    return null;
  }
}

// ─── File Priority Scorer ─────────────────────────────────────────────────────

const PRIORITY_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs", ".java"];
const PRIORITY_NAMES = ["index", "main", "app", "server", "api", "core", "utils", "lib"];
const SKIP_PATHS = [
  "node_modules", ".next", "dist", "build", "coverage",
  ".git", "public", "assets", "static", "vendor",
  "__pycache__", ".pytest_cache",
];
const SKIP_EXTENSIONS = [
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp",
  ".mp4", ".mp3", ".woff", ".woff2", ".ttf", ".eot",
  ".pdf", ".zip", ".lock", ".log",
];

function scoreFile(path: string): number {
  const lower = path.toLowerCase();
  const fileName = lower.split("/").pop() ?? "";
  const ext = "." + fileName.split(".").pop();
  const nameWithoutExt = fileName.replace(/\.[^.]+$/, "");

  // Skip entirely
  if (SKIP_PATHS.some((s) => lower.includes(s + "/"))) return -1;
  if (SKIP_EXTENSIONS.includes(ext)) return -1;
  if (fileName.startsWith(".")) return -1;
  if (!fileName.includes(".")) return -1; // no extension

  let score = 0;

  // Extension bonus
  const extIndex = PRIORITY_EXTENSIONS.indexOf(ext);
  if (extIndex === -1) return -1; // not a code file we care about
  score += (PRIORITY_EXTENSIONS.length - extIndex) * 10;

  // Name bonus
  if (PRIORITY_NAMES.some((n) => nameWithoutExt === n)) score += 30;
  if (PRIORITY_NAMES.some((n) => nameWithoutExt.includes(n))) score += 10;

  // Prefer shallower paths
  const depth = path.split("/").length;
  score -= depth * 3;

  // Prefer shorter file names (less likely to be a generated file)
  score -= Math.min(fileName.length, 20);

  return score;
}

// ─── Main Fetcher ─────────────────────────────────────────────────────────────

export async function fetchRepoFiles(
  owner: string,
  repo: string,
  maxFiles = 5
): Promise<RepoFile[]> {
  // 1. Get default branch
  const repoMeta = await gh.get(`/repos/${owner}/${repo}`);
  const branch: string = repoMeta.data.default_branch ?? "main";

  // 2. Get full file tree (recursive)
  const treeRes = await gh.get(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );

  if (treeRes.data.truncated) {
    console.warn("GitHub tree was truncated — large repo");
  }

  const allFiles: Array<{ path: string; size: number }> = treeRes.data.tree
    .filter((f: { type: string }) => f.type === "blob")
    .map((f: { path: string; size: number }) => ({
      path: f.path,
      size: f.size ?? 0,
    }));

  // 3. Score and sort
  const scored = allFiles
    .map((f) => ({ ...f, score: scoreFile(f.path) }))
    .filter((f) => f.score >= 0 && f.size < 100_000) // skip huge files
    .sort((a, b) => b.score - a.score)
    .slice(0, maxFiles);

  // 4. Fetch file contents in parallel
  const files = await Promise.all(
    scored.map(async (f) => {
      const res = await gh.get(
        `/repos/${owner}/${repo}/contents/${f.path}`,
        { headers: { Accept: "application/vnd.github.raw+json" } }
      );
      return {
        path: f.path,
        content: typeof res.data === "string" ? res.data : JSON.stringify(res.data),
        size: f.size,
      };
    })
  );

  return files;
}

// ─── Error Classifier ─────────────────────────────────────────────────────────

export function classifyGithubError(err: unknown): GithubError {
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    const message = err.response?.data?.message ?? "";

    if (status === 404) {
      return {
        type: "not_found",
        message: "Repo not found. It may be private or the URL is wrong.",
      };
    }
    if (status === 403 && message.toLowerCase().includes("rate limit")) {
      return {
        type: "rate_limit",
        message: "GitHub API rate limit hit. Add a GITHUB_TOKEN to your .env.local to get 5,000 req/hr.",
      };
    }
    if (status === 403) {
      return {
        type: "private",
        message: "This repo is private. Only public repos are supported right now.",
      };
    }
    if (status === 401) {
      return {
        type: "private",
        message: "Authentication failed. Check your GITHUB_TOKEN.",
      };
    }
  }
  return {
    type: "unknown",
    message: "Something went wrong fetching the repo. Check the URL and try again.",
  };
}