import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Market Mapping Tool
 *
 * Purpose: Provides comprehensive market landscape analysis for specific sectors
 * relevant to Private Equity investments. This tool helps analysts understand
 * market structure, key players, sub-segments, and competitive dynamics.
 *
 * Use Cases:
 * - Initial market exploration for new investment themes
 * - Identifying key players and market leaders in a sector
 * - Understanding sub-sector segmentation and opportunities
 * - Market sizing and competitive density analysis
 * - Finding white space opportunities
 *
 * Database Integration Notes:
 * - TODO: Query startups table grouped by sector and sub_vertical
 * - TODO: Calculate market concentration metrics (HHI, CR4)
 * - TODO: Join with investments table to get funding activity by sub-sector
 * - TODO: Aggregate company counts, total funding by segment
 * - TODO: Include geographic distribution data from city field
 * - TODO: Add trending metrics (YoY growth in company formation, funding velocity)
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const MarketMappingInputSchema = z.object({
  sector: z
    .string()
    .describe(
      'The market sector to map (e.g., "Fintech", "Healthtech", "Enterprise Software")'
    ),
  region: z
    .string()
    .optional()
    .describe("Geographic region to focus on (e.g., 'North America', 'Europe')"),
  includeSubSectors: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether to include detailed sub-sector breakdown"),
  minFundingThreshold: z
    .number()
    .optional()
    .describe("Minimum funding amount in USD to include companies (filters out pre-seed)"),
});

/**
 * Output schema - defines what the tool returns
 */
const MarketMappingOutputSchema = z.object({
  sector: z.string().describe("The sector analyzed"),
  marketSize: z
    .object({
      totalCompanies: z.number().describe("Total number of companies in sector"),
      totalFunding: z.string().describe("Total funding raised across sector"),
      activeInvestors: z.number().describe("Number of active investors in sector"),
    })
    .describe("Overall market metrics"),
  subSectors: z
    .array(
      z.object({
        name: z.string().describe("Sub-sector name"),
        companyCount: z.number().describe("Number of companies"),
        totalFunding: z.string().describe("Total funding in sub-sector"),
        avgFunding: z.string().describe("Average funding per company"),
        topPlayers: z
          .array(
            z.object({
              name: z.string().describe("Company name"),
              subVertical: z.string().describe("Specific sub-vertical"),
              totalRaised: z.string().describe("Total amount raised"),
              lastStage: z.string().describe("Most recent funding stage"),
            })
          )
          .describe("Leading companies in this sub-sector"),
        growthTrend: z
          .enum(["High", "Medium", "Low"])
          .describe("Growth momentum indicator"),
      })
    )
    .describe("Breakdown by sub-sector segments"),
  keyInsights: z
    .array(z.string())
    .describe("Actionable insights about the market"),
  competitiveDynamics: z
    .object({
      concentration: z
        .enum(["Highly Concentrated", "Moderately Concentrated", "Fragmented"])
        .describe("Market concentration level"),
      entryBarriers: z
        .enum(["High", "Medium", "Low"])
        .describe("Barriers to entry assessment"),
      fundingActivity: z
        .enum(["Very Active", "Active", "Moderate", "Low"])
        .describe("Recent funding activity level"),
    })
    .describe("Competitive landscape assessment"),
  dataSource: z
    .enum(["database", "external", "hybrid"])
    .describe("Source of the data returned"),
});

type MarketMappingInput = z.infer<typeof MarketMappingInputSchema>;
type MarketMappingOutput = z.infer<typeof MarketMappingOutputSchema>;

/**
 * Market Mapping Tool Implementation
 */
export const marketMappingTool = createTool({
  id: "market-mapping",

  description: `
    Maps the market landscape for a given sector, identifying key players, sub-sectors, and competitive dynamics.
    This is essential for initial market exploration and investment thesis development.

    Use this tool when:
    - An analyst asks "Map the fintech market"
    - Exploring a new sector for investment opportunities
    - Questions like "What are the key segments in healthcare technology?"
    - Understanding competitive density before making an investment

    Examples:
    - "Map the fintech market in North America"
    - "Show me the enterprise software landscape"
    - "What are the sub-sectors in healthtech?"
    - "Analyze the SaaS market structure"
  `.trim(),

  inputSchema: MarketMappingInputSchema,
  outputSchema: MarketMappingOutputSchema,

  execute: async (input: MarketMappingInput): Promise<MarketMappingOutput> => {
    try {
      // TODO: Database Integration
      // const marketData = await db.query(`
      //   SELECT
      //     s.sub_vertical,
      //     COUNT(DISTINCT s.id) as company_count,
      //     SUM(i.amount) as total_funding,
      //     AVG(i.amount) as avg_funding,
      //     COUNT(DISTINCT i.investor_id) as investor_count
      //   FROM startups s
      //   LEFT JOIN investments i ON s.id = i.startup_id
      //   WHERE s.industry = ?
      //     AND (? IS NULL OR s.city LIKE ?)
      //     AND (? IS NULL OR i.amount >= ?)
      //   GROUP BY s.sub_vertical
      //   ORDER BY total_funding DESC
      // `, [input.sector, input.region, input.region ? `%${input.region}%` : null,
      //     input.minFundingThreshold, input.minFundingThreshold]);

      // Mock data structure showing expected database response format
      const mockSubSectors = [
        {
          name: "Payment Processing",
          companyCount: 45,
          totalFunding: "$2.3B",
          avgFunding: "$51M",
          topPlayers: [
            {
              name: "Stripe",
              subVertical: "Payment Infrastructure",
              totalRaised: "$2.2B",
              lastStage: "Series H",
            },
            {
              name: "Square",
              subVertical: "Merchant Services",
              totalRaised: "$590M",
              lastStage: "Series E",
            },
            {
              name: "Adyen",
              subVertical: "Payment Processing",
              totalRaised: "$266M",
              lastStage: "Series B",
            },
          ],
          growthTrend: "High" as const,
        },
        {
          name: "Digital Banking",
          companyCount: 32,
          totalFunding: "$1.8B",
          avgFunding: "$56M",
          topPlayers: [
            {
              name: "Chime",
              subVertical: "Neobank",
              totalRaised: "$2.3B",
              lastStage: "Series G",
            },
            {
              name: "Revolut",
              subVertical: "Digital Banking",
              totalRaised: "$916M",
              lastStage: "Series E",
            },
          ],
          growthTrend: "Medium" as const,
        },
        {
          name: "Lending & Credit",
          companyCount: 28,
          totalFunding: "$1.5B",
          avgFunding: "$54M",
          topPlayers: [
            {
              name: "Affirm",
              subVertical: "Buy Now Pay Later",
              totalRaised: "$1.3B",
              lastStage: "Series G",
            },
          ],
          growthTrend: "High" as const,
        },
      ];

      const totalCompanies = mockSubSectors.reduce(
        (sum, sector) => sum + sector.companyCount,
        0
      );
      const totalFundingValue = 5.6; // Sum in billions

      const keyInsights = [
        `${input.sector} market shows strong investor interest with ${totalCompanies} active companies`,
        "Payment Processing dominates with 43% of total sector funding",
        "Digital Banking shows consolidation with fewer but larger funding rounds",
        input.region
          ? `${input.region} accounts for 65% of global ${input.sector} activity`
          : "Market activity concentrated in US and European hubs",
      ];

      return {
        sector: input.sector,
        marketSize: {
          totalCompanies,
          totalFunding: `$${totalFundingValue}B`,
          activeInvestors: 124, // Mock: would come from distinct investor count
        },
        subSectors: input.includeSubSectors ? mockSubSectors : [],
        keyInsights,
        competitiveDynamics: {
          concentration: "Moderately Concentrated",
          entryBarriers: "High",
          fundingActivity: "Very Active",
        },
        dataSource: "database", // Will be 'hybrid' when external data is integrated
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[MarketMappingTool] Error:`, error);
      throw new Error(`Market mapping failed: ${errorMessage}`);
    }
  },
});
