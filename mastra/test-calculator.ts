import { config } from "dotenv";
import { mastra } from "./index";

// Load environment variables
config();

/**
 * Test script for the calculator agent
 * Run with: npx tsx mastra/test-calculator.ts
 */
async function testCalculatorAgent() {
  console.log("🧮 Testing Calculator Agent\n");

  // Get the calculator agent
  // Get the PE Analyst Agent
  const agent = mastra.getAgent("PE Analyst Agent");

  if (!agent) {
    console.error("❌ PE Analyst Agent not found!");
    return;
  }

  // Test cases
  const testCases = [
    "What is 15 + 27?",
    "Calculate 100 divided by 4",
    "Multiply 8 by 9",
    "What's 50 minus 23?",
    "Can you add 123 and 456 for me?",
  ];

  // Run each test case
  for (const [index, question] of testCases.entries()) {
    console.log(`\n📝 Test ${index + 1}: ${question}`);
    console.log("─".repeat(50));

    try {
      const response = await agent.generate(question, {
        maxSteps: 5,
      });

      console.log("🤖 Agent:", response.text);
    } catch (error) {
      console.error("❌ Error:", error);
    }
  }

  console.log("\n✅ All tests completed!");
}

// Run the tests
testCalculatorAgent().catch(console.error);
