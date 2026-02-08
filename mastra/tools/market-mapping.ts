import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
  getMarketMap,
  getTopCompaniesBySector,
  getUniqueIndustries,
} from "../db/queries/pe-queries";

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
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const MarketMappingInputSchema = z.object({
  sector: z
    .string()
    .describe(
      'The market sector to map (e.g., "Fintech", "Healthtech", "Enterprise Software")',
    ),
  includeSubSectors: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether to include detailed sub-sector breakdown"),
  limit: z
    .number()
    .optional()
    .default(10)
    .describe("Maximum number of top companies to return per sub-sector"),
});

/**
 * Output schema - defines what the tool returns
 */
const MarketMappingOutputSchema = z.object({
  found: z.boolean().describe("Whether any companies were found in the sector"),
  sector: z.string().describe("The sector analyzed"),
  marketSize: z
    .object({
      totalCompanies: z
        .number()
        .describe("Total number of companies in sector"),
      totalFunding: z.string().describe("Total funding raised across sector"),
      activeInvestors: z
        .number()
        .describe("Number of active investors in sector"),
    })
    .describe("Overall market metrics"),
  subSectors: z
    .array(
      z.object({
        name: z.string().describe("Sub-sector name"),
        companyCount: z.number().describe("Number of companies"),
        totalFunding: z.string().describe("Total funding in sub-sector"),
        avgFunding: z.string().describe("Average funding per company"),
        topCompanies: z
          .array(z.string())
          .describe("Top company names in this sub-sector"),
      }),
    )
    .describe("Breakdown by sub-sector segments"),
  topPlayers: z
    .array(
      z.object({
        name: z.string().describe("Company name"),
        subVertical: z.string().optional().describe("Specific sub-vertical"),
        city: z.string().optional().describe("Location"),
        totalRaised: z.string().describe("Total amount raised"),
        lastStage: z.string().optional().describe("Most recent funding stage"),
        roundCount: z.number().describe("Number of funding rounds"),
      }),
    )
    .describe("Top companies by funding in the sector"),
  keyInsights: z
    .array(z.string())
    .describe("Actionable insights about the market"),
  dataSource: z
    .enum(["database", "external", "not_found"])
    .describe("Source of the data returned"),
  availableSectors: z
    .array(z.string())
    .optional()
    .describe(
      "List of available sectors in the database (if sector not found)",
    ),
});

type MarketMappingInput = z.infer<typeof MarketMappingInputSchema>;
type MarketMappingOutput = z.infer<typeof MarketMappingOutputSchema>;

/**
 * Format USD amount for display
 */
function formatUSD(amount: number | string | null): string {
  if (!amount) return "Undisclosed";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "Undisclosed";

  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(0)}K`;
  }
  return `$${num.toFixed(0)}`;
}

/**
 * Parse PostgreSQL array format
 */
function parseArray(arr: any): string[] {
  if (!arr) return [];
  if (Array.isArray(arr)) return arr.filter(Boolean);
  if (typeof arr === "string") {
    const cleaned = arr.replace(/[{}]/g, "");
    return cleaned
      ? cleaned
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];
  }
  return [];
}

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
    - "Map the fintech market"
    - "Show me the enterprise software landscape"
    - "What are the sub-sectors in healthtech?"
    - "Analyze the SaaS market structure"
  `.trim(),

  inputSchema: MarketMappingInputSchema,
  outputSchema: MarketMappingOutputSchema,

  execute: async (input: MarketMappingInput): Promise<MarketMappingOutput> => {
    try {
      console.log(`[MarketMappingTool] Mapping sector: "${input.sector}"`);

      // Query the database for market map
      const marketResults = await getMarketMap(input.sector);
      const topCompanies = await getTopCompaniesBySector(
        input.sector,
        input.limit,
      );

      if (
        (!marketResults || marketResults.length === 0) &&
        (!topCompanies || topCompanies.length === 0)
      ) {
        console.log(
          `[MarketMappingTool] No companies found for sector: "${input.sector}"`,
        );

        // Get available sectors to help the user
        const industries = await getUniqueIndustries();
        const availableSectors = (industries as any[]).map(
          (i: any) => i.industry,
        );

        return {
          found: false,
          sector: input.sector,
          marketSize: {
            totalCompanies: 0,
            totalFunding: "$0",
            activeInvestors: 0,
          },
          subSectors: [],
          topPlayers: [],
          keyInsights: [
            `No companies found in the "${input.sector}" sector in the dataset.`,
            "Consider using external search for market information.",
            availableSectors.length > 0
              ? `Available sectors in database: ${availableSectors.slice(0, 10).join(", ")}`
              : "No sectors available in database.",
          ],
          dataSource: "not_found",
          availableSectors: availableSectors.slice(0, 20),
        };
      }

      // Calculate market totals
      let totalCompanies = 0;
      let totalFunding = 0;
      let totalInvestors = 0;

      // Format sub-sectors
      const subSectors = (marketResults as any[]).map((s: any) => {
        const companyCount = parseInt(s.company_count) || 0;
        const funding = parseFloat(s.total_funding) || 0;
        const investorCount = parseInt(s.investor_count) || 0;
        const companies = parseArray(s.companies);

        totalCompanies += companyCount;
        totalFunding += funding;
        totalInvestors += investorCount;

        return {
          name: s.sub_vertical || "General",
          companyCount,
          totalFunding: formatUSD(funding),
          avgFunding: formatUSD(parseFloat(s.avg_funding) || 0),
          topCompanies: companies.slice(0, 5),
        };
      });

      // Format top players
      const topPlayers = (topCompanies as any[]).map((c: any) => ({
        name: c.name,
        subVertical: c.sub_vertical || undefined,
        city: c.city || undefined,
        totalRaised: formatUSD(c.total_raised),
        lastStage: c.last_stage || undefined,
        roundCount: parseInt(c.round_count) || 0,
      }));

      // Generate insights
      const keyInsights: string[] = [];

      keyInsights.push(
        `${input.sector} sector has ${totalCompanies} companies with total funding of ${formatUSD(totalFunding)}.`,
      );

      if (subSectors.length > 0) {
        const topSubSector = subSectors[0];
        keyInsights.push(
          `Leading sub-sector is "${topSubSector.name}" with ${topSubSector.companyCount} companies and ${topSubSector.totalFunding} in funding.`,
        );
      }

      if (topPlayers.length > 0) {
        const leader = topPlayers[0];
        keyInsights.push(
          `Market leader is ${leader.name} with ${leader.totalRaised} raised across ${leader.roundCount} rounds.`,
        );
      }

      if (subSectors.length > 3) {
        keyInsights.push(
          `Market is diversified across ${subSectors.length} sub-sectors.`,
        );
      }

      console.log(
        `[MarketMappingTool] Found ${totalCompanies} companies in ${subSectors.length} sub-sectors`,
      );

      return {
        found: true,
        sector: input.sector,
        marketSize: {
          totalCompanies,
          totalFunding: formatUSD(totalFunding),
          activeInvestors: totalInvestors,
        },
        subSectors: input.includeSubSectors ? subSectors : [],
        topPlayers,
        keyInsights,
        dataSource: "database",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[MarketMappingTool] Error:`, error);
      throw new Error(`Market mapping failed: ${errorMessage}`);
    }
  },
});
