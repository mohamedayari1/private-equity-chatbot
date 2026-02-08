#!/usr/bin/env tsx
/**
 * PE Tools Test Script
 *
 * Tests all 4 core PE analyst tools against the Neon database.
 *
 * Usage:
 *   npx tsx test-tools.ts
 *
 * Environment Variables Required:
 *   DATABASE_URL - Neon PostgreSQL connection string
 */

import { companyLookupTool } from "./tools/company-lookup";
import { externalSearchTool } from "./tools/external-search";
import { fundingAnalysisTool } from "./tools/funding-analysis";
import { investorIntelligenceTool } from "./tools/investor-intelligence";
import { marketMappingTool } from "./tools/market-mapping";

async function testTools() {
  console.log("=".repeat(60));
  console.log("🧪 PE Tools Test Suite");
  console.log("=".repeat(60));

  // Test 1: Company Lookup
  console.log("\n📋 Test 1: Company Lookup Tool");
  console.log("-".repeat(40));
  try {
    // Try with a generic search term that might match data
    const companyResult = await companyLookupTool.execute({
      companyName: "tech", // Broad search to find something
      includeFinancials: true,
    });
    console.log("Result:", JSON.stringify(companyResult, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }

  // Test 2: Investor Intelligence
  console.log("\n📋 Test 2: Investor Intelligence Tool");
  console.log("-".repeat(40));
  try {
    const investorResult = await investorIntelligenceTool.execute({
      investorName: "capital", // Broad search
      includePortfolio: true,
    });
    console.log("Result:", JSON.stringify(investorResult, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }

  // Test 3: Market Mapping
  console.log("\n📋 Test 3: Market Mapping Tool");
  console.log("-".repeat(40));
  try {
    const marketResult = await marketMappingTool.execute({
      sector: "fintech",
      includeSubSectors: true,
      limit: 5,
    });
    console.log("Result:", JSON.stringify(marketResult, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }

  // Test 4: Funding Analysis
  console.log("\n📋 Test 4: Funding Analysis Tool");
  console.log("-".repeat(40));
  try {
    const fundingResult = await fundingAnalysisTool.execute({
      // Overall analysis (no company or sector specified)
    });
    console.log("Result:", JSON.stringify(fundingResult, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }

  // Test 5: External Search (Tavily)
  console.log("\n📋 Test 5: External Search Tool");
  console.log("-".repeat(40));
  try {
    const searchResult = await externalSearchTool.execute({
      query: "fintech startup funding trends 2024",
      maxResults: 3,
    });
    console.log("Result:", JSON.stringify(searchResult, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Test Suite Complete");
  console.log("=".repeat(60));

  // Exit cleanly
  process.exit(0);
}

testTools().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
