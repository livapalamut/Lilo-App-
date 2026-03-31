import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildUserPrompt } from "@/lib/lilo/prompts";

export const runtime = "edge";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu.";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message?: string; text?: string };
    const message = body.text?.trim() ?? body.message?.trim() ?? "";

    if (!message) {
      return new Response(JSON.stringify({ error: "Mesaj boş olamaz." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY eksik!");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        maxOutputTokens: 2200,
        temperature: 0.75,
      },
    });

    const result = await model.generateContent(buildUserPrompt(message));
    const text = result.response.text();

    const encoder = new TextEncoder();
    const sendSse = (text: string) =>
      encoder.encode(
        `${text
          .split("\n")
          .map((line) => `data: ${line}`)
          .join("\n")}\n\n`,
      );

    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (text) controller.enqueue(sendSse(text));
          controller.enqueue(sendSse("__LILO_STREAM_DONE__"));
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Lilo Detaylı Hata:", error);
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
