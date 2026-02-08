import { mastra } from "@/mastra";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const agent = mastra.getAgent("PE Analyst Agent");

    if (!agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || !lastMessage.content) {
      return Response.json({ error: "No message provided" }, { status: 400 });
    }

    // Generate response using the agent (streaming)
    // We use the same memory structure as seen in test-streaming.ts
    const { textStream } = await agent.stream(lastMessage.content, {
      memory: {
        thread: {
          id: `chat-${Date.now()}`,
          title: "Chat Session",
          metadata: { environment: "production" },
        },
        resource: "user-web-client",
      },
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of textStream) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat route:", error);
    return Response.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
