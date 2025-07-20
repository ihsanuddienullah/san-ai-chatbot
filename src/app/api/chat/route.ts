import { createOpenAI } from "@ai-sdk/openai";
import { streamText, smoothStream } from "ai";

export const maxDuration = 30;

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const openai = createOpenAI({
    baseURL: 'https://models.inference.ai.azure.com',
    apiKey: process.env.GITHUB_TOKEN,
  })

  const result = streamText({
    model: openai("gpt-4.1"),
    system: "You are a helpful AI assistant named 'San'.",
    messages,
    experimental_transform: smoothStream(),
  })

  return new Response(result.toDataStream(), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}