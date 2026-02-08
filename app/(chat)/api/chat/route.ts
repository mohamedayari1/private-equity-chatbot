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

    // Generate response using the agent (non-streaming)
    const result = await agent.generate(lastMessage.content, {
      threadId: `chat-${Date.now()}`,
      resourceId: "user-web-client",
    });

    // Return the response as JSON
    return Response.json({
      id: Date.now().toString(),
      role: "assistant",
      content: result.text,
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
