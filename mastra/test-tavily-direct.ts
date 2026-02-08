import { searchTavily } from "./services/tavily";

/**
 * Direct test of Tavily search service
 * Run with: npx tsx mastra/test-tavily-direct.ts
 */
async function testTavilyDirect() {
  console.log("🔍 Testing Tavily Search Service Directly\n");

  try {
    console.log("Searching for: 'Who is Alan Turing?'");
    const result = await searchTavily("Who is Alan Turing?", {
      maxResults: 3,
    });

    console.log("\n✅ Search successful!");
    console.log("Response time:", result.response_time);
    console.log("Number of results:", result.results.length);
    console.log("\nResults:");

    result.results.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.title}`);
      console.log(`   URL: ${item.url}`);
      console.log(`   Score: ${item.score}`);
      console.log(`   Content: ${item.content.substring(0, 200)}...`);
    });

    if (result.answer) {
      console.log("\n📝 Answer:", result.answer);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run the test
testTavilyDirect().catch(console.error);
