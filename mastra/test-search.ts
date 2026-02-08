import { config } from "dotenv";
import { mastra } from "./index";

// Load environment variables
config();

/**
 * Test script for the web search functionality
 * Run with: npx tsx mastra/test-search.ts
 */
async function testWebSearch() {
  console.log("🔍 Testing Web Search Agent\n");

  // Get the calculator agent (which now has search capabilities)
  const agent = mastra.getAgent("calculator-agent");

  if (!agent) {
    console.error("❌ Agent not found!");
    return;
  }

  // Test cases for web search - be explicit about needing current/external info
  const testCases = [
    "Search the web for the latest news about OpenAI",
    "Use web search to find information about TypeScript 5.0 features",
    "Search online: who won the 2026 FIFA World Cup?",
  ];

  // Run each test case
  for (const [index, question] of testCases.entries()) {
    console.log(`\n📝 Test ${index + 1}: ${question}`);
    console.log("─".repeat(70));

    try {
      const response = await agent.generate(question, {
        maxSteps: 5,
      });

      console.log("🤖 Agent:", response.text);
      console.log("\n");
    } catch (error) {
      console.error("❌ Error:", error);
    }
  }

  console.log("\n✅ All tests completed!");
}

// Run the tests
testWebSearch().catch(console.error);
