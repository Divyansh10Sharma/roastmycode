import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ROAST_SYSTEM_PROMPT, buildUserPrompt } from "@/lib/roast";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { owner, repo, files } = body;

    if (!owner || !repo || !files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "Missing owner, repo, or files." },
        { status: 400 }
      );
    }

    const userPrompt = buildUserPrompt(owner, repo, files);

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const anthropicStream = anthropic.messages.stream({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1024,
            system: ROAST_SYSTEM_PROMPT,
            messages: [{ role: "user", content: userPrompt }],
          });

          for await (const chunk of anthropicStream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }

          controller.close();
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Anthropic stream failed.";
          controller.enqueue(encoder.encode(`\n__ERROR__:${message}`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}