import { NextRequest, NextResponse } from "next/server";
import { parseGithubUrl, fetchRepoFiles, classifyGithubError } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: { type: "invalid_url", message: "No URL provided." } },
        { status: 400 }
      );
    }

    const parsed = parseGithubUrl(url);
    if (!parsed) {
      return NextResponse.json(
        {
          error: {
            type: "invalid_url",
            message: "Couldn't parse that as a GitHub URL. Try: github.com/owner/repo",
          },
        },
        { status: 400 }
      );
    }

    const files = await fetchRepoFiles(parsed.owner, parsed.repo, 5);

    return NextResponse.json({
      owner: parsed.owner,
      repo: parsed.repo,
      files,
    });
  } catch (err) {
    const classified = classifyGithubError(err);
    const statusMap = {
      not_found: 404,
      private: 403,
      rate_limit: 429,
      invalid_url: 400,
      unknown: 500,
    };
    return NextResponse.json(
      { error: classified },
      { status: statusMap[classified.type] }
    );
  }
}