#!/usr/bin/env tsx
/**
 * PE Agent Streaming Test
 *
 * Tests the streaming capabilities of the PE analyst agent
 *
 * Usage:
 *   bun run mastra/test-streaming.ts
 */

import { createPEAnalystAgent } from "./agent/agent";

// Run the streaming test
async function runStreamingTest() {
  const agent = createPEAnalystAgent();

  // Define memory context for the test session
  const memoryContext = {
    thread: {
      id: "test-thread-streaming-1",
      title: "PE Analyst Streaming Test Session",
      metadata: { environment: "test" },
    },
    resource: "test-user-streaming-1",
  };

  console.log("🤖 PE Analyst Agent Streaming Test");
  console.log("====================================");

  const query =
    "Summarize the investment strategy of Sequoia Capital and mention some of their notable fintech investments.";
  console.log(`\nQ: '${query}'`);
  console.log("\n🤖 Agent Response (Streaming):\n");

  try {
    const { textStream } = await agent.stream(query, {
      memory: memoryContext,
    });

    // Iterate over the stream and print chunks as they arrive
    for await (const chunk of textStream) {
      process.stdout.write(chunk);
    }

    console.log("\n\n✅ Streaming complete.");
  } catch (error) {
    console.error("\n❌ Error during streaming:", error);
  }
}

runStreamingTest().catch(console.error);
