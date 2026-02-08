#!/usr/bin/env tsx
/**
 * PE Agent Integration Test
 *
 * Tests the PE analyst agent with all integrated tools
 *
 * Usage:
 *   bun run mastra/test-agent.ts
 */

import { createPEAnalystAgent } from "./agent/agent";

// Run the tests
async function runTests() {
  const agent = createPEAnalystAgent();

  // Define memory context for the test session
  const memoryContext = {
    thread: {
      id: "test-thread-pe-analyst-1",
      title: "PE Analyst Test Session",
      metadata: { environment: "test" },
    },
    resource: "test-user-1",
  };

  console.log("🤖 PE Analyst Agent Integration Test");
  console.log("====================================");

  // Test 1: Database Query (Company Lookup)
  console.log("\n📝 Test 1: Database Query (Company Lookup)");
  console.log("Q: 'Tell me about Ola and its funding history'");
  try {
    const response = await agent.generate(
      "Tell me about Ola and its funding history",
      {
        memory: memoryContext,
      },
    );
    console.log("\n🤖 Agent Response:");
    console.log(response.text);
  } catch (error) {
    console.error("❌ Error:", error);
  }

  // Test 2: Database Query (Market Mapping)
  console.log("\n📝 Test 2: Database Query (Market Mapping)");
  console.log("Q: 'Map the fintech market sector'");
  try {
    const response = await agent.generate("Map the fintech market sector", {
      memory: memoryContext,
    });
    console.log("\n🤖 Agent Response:");
    console.log(response.text);
  } catch (error) {
    console.error("❌ Error:", error);
  }

  // Test 3: Hybrid/Analysis (External Search + Analysis)
  console.log("\n📝 Test 3: Hybrid/Analysis (External Search + Analysis)");
  console.log(
    "Q: 'What are the latest funding trends in Generative AI? Compare with historical software trends.'",
  );
  try {
    const response = await agent.generate(
      "What are the latest funding trends in Generative AI? Compare with historical software trends.",
      {
        memory: memoryContext,
      },
    );
    console.log("\n🤖 Agent Response:");
    console.log(response.text);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

runTests().catch(console.error);
