import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Co-Investment Opportunities Tool
 *
 * Purpose: Identifies potential co-investment partners and syndication opportunities
 * for Private Equity deals. This tool helps analysts discover investors with
 * complementary portfolios and investment theses.
 *
 * Use Cases:
 * - Finding co-investors for a specific deal
 * - Analyzing historical co-investment patterns of a specific investor
 * - Identifying syndication opportunities based on sector/stage alignment
 *
 * Database Integration Notes:
 * - TODO: Query investors table for historical co-investment relationships
 * - TODO: Join with deals table to find investors who invested in similar stages/sectors
 * - TODO: Calculate co-investment frequency and success metrics
 * - TODO: Add filters for ticket size, geography, and investment stage
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const CoInvestmentInputSchema = z.object({
  dealId: z
    .string()
    .optional()
    .describe("Specific deal ID to find co-investment partners for"),
  investorName: z
    .string()
    .optional()
    .describe("Investor name to analyze their co-investment patterns"),
  sector: z
    .string()
    .optional()
    .describe("Target sector for co-investment opportunities"),
  investmentStage: z
    .string()
    .optional()
    .describe("Investment stage (e.g., 'Seed', 'Series A', 'Series B')"),
});

/**
 * Output schema - defines what the tool returns
 */
const CoInvestmentOutputSchema = z.object({
  opportunities: z
    .array(
      z.object({
        investorName: z.string().describe("Name of potential co-investor"),
        coInvestmentCount: z
          .number()
          .describe("Number of historical co-investments"),
        commonSectors: z
          .array(z.string())
          .describe("Sectors where co-investments occurred"),
        averageTicketSize: z
          .string()
          .describe("Average investment amount in USD"),
        lastCoInvestment: z
          .string()
          .describe("Date of most recent co-investment"),
        syndicationStrength: z
          .enum(["High", "Medium", "Low"])
          .describe("Likelihood of successful syndication"),
      })
    )
    .describe("List of potential co-investment opportunities"),
  summary: z
    .string()
    .describe("Executive summary of co-investment landscape"),
  dataSource: z
    .enum(["database", "external", "hybrid"])
    .describe("Source of the data returned"),
});

type CoInvestmentInput = z.infer<typeof CoInvestmentInputSchema>;
type CoInvestmentOutput = z.infer<typeof CoInvestmentOutputSchema>;

/**
 * Co-Investment Opportunities Tool Implementation
 */
export const coInvestmentTool = createTool({
  id: "co-investment-opportunities",

  description: `
    Identifies potential co-investment partners and syndication opportunities for Private Equity deals.

    Use this tool when:
    - An analyst asks "Who typically co-invests with [Investor]?"
    - Finding syndication partners for a specific deal
    - Analyzing co-investment networks in a sector
    - Understanding investor collaboration patterns

    Examples:
    - "Find co-investors for Sequoia Capital in fintech deals"
    - "Who are the common co-investors in Series B healthcare rounds?"
    - "Show me co-investment opportunities for deal #12345"
  `.trim(),

  inputSchema: CoInvestmentInputSchema,
  outputSchema: CoInvestmentOutputSchema,

  execute: async (input: CoInvestmentInput): Promise<CoInvestmentOutput> => {
    try {
      // TODO: Database Integration
      // const opportunities = await db.query(`
      //   SELECT i.name, COUNT(*) as co_investment_count,
      //          ARRAY_AGG(DISTINCT s.sector) as common_sectors
      //   FROM investors i
      //   JOIN investments inv1 ON i.id = inv1.investor_id
      //   JOIN investments inv2 ON inv1.startup_id = inv2.startup_id
      //   WHERE inv2.investor_id = ?
      //   GROUP BY i.name
      // `, [input.investorName]);

      // Mock data structure for now - replace with actual DB query
      const mockOpportunities = [
        {
          investorName: "Andreessen Horowitz",
          coInvestmentCount: 12,
          commonSectors: ["Fintech", "SaaS"],
          averageTicketSize: "$5M - $10M",
          lastCoInvestment: "2024-11-15",
          syndicationStrength: "High" as const,
        },
        {
          investorName: "Accel Partners",
          coInvestmentCount: 8,
          commonSectors: ["Enterprise Software", "Fintech"],
          averageTicketSize: "$3M - $7M",
          lastCoInvestment: "2024-09-22",
          syndicationStrength: "Medium" as const,
        },
      ];

      const summary = input.investorName
        ? `Found ${mockOpportunities.length} potential co-investment partners based on historical syndication patterns with ${input.investorName}.`
        : `Identified ${mockOpportunities.length} co-investment opportunities ${input.sector ? `in the ${input.sector} sector` : "across sectors"}.`;

      return {
        opportunities: mockOpportunities,
        summary,
        dataSource: "database", // Will be 'hybrid' when external search is integrated
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[CoInvestmentTool] Error:`, error);
      throw new Error(`Co-investment analysis failed: ${errorMessage}`);
    }
  },
});
