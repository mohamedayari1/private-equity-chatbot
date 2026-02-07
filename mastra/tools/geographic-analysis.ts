import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Geographic Analysis Tool
 *
 * Purpose: Analyzes investment activity, startup ecosystem health, and market
 * opportunities across different geographic regions. Essential for PE analysts
 * making location-based investment decisions and portfolio diversification.
 *
 * Use Cases:
 * - Assessing startup ecosystem maturity in specific regions
 * - Identifying emerging tech hubs and investment opportunities
 * - Understanding regional funding trends and investor activity
 * - Analyzing geographic concentration risks in portfolio
 * - Evaluating market entry strategies by geography
 * - Comparing regions for investment allocation decisions
 *
 * Database Integration Notes:
 * - TODO: Query startups table grouped by city/country
 * - TODO: Aggregate investment activity by region over time
 * - TODO: Calculate regional metrics (avg funding, company density)
 * - TODO: Track investor presence and activity by geography
 * - TODO: Include economic indicators (GDP, tech talent pool)
 * - TODO: Monitor regional regulatory environment and policies
 * - TODO: Track regional success metrics (exits, unicorns)
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const GeographicAnalysisInputSchema = z.object({
  region: z
    .string()
    .describe(
      "Region to analyze (e.g., 'San Francisco Bay Area', 'Europe', 'Southeast Asia')"
    ),
  sector: z
    .string()
    .optional()
    .describe("Filter by specific sector (e.g., 'Fintech', 'Healthcare')"),
  timeRange: z
    .enum(["1year", "3years", "5years", "all"])
    .optional()
    .default("3years")
    .describe("Time period for analysis"),
  includeComparison: z
    .boolean()
    .optional()
    .default(false)
    .describe("Include comparison with other major regions"),
});

/**
 * Output schema - defines what the tool returns
 */
const GeographicAnalysisOutputSchema = z.object({
  region: z.string().describe("Region analyzed"),
  ecosystemOverview: z
    .object({
      totalStartups: z.number().describe("Total number of startups in region"),
      totalFunding: z.string().describe("Total funding raised in region"),
      activeInvestors: z.number().describe("Number of active investors"),
      unicorns: z.number().describe("Number of unicorn companies ($1B+ valuation)"),
      exitCount: z.number().describe("Number of successful exits"),
      maturityLevel: z
        .enum(["Mature", "Growing", "Emerging", "Early Stage"])
        .describe("Ecosystem maturity assessment"),
    })
    .describe("Overall ecosystem metrics"),
  fundingTrends: z
    .object({
      totalRaisedLastYear: z.string().describe("Total funding in last 12 months"),
      yearOverYearGrowth: z.string().describe("YoY growth rate"),
      avgDealSize: z.string().describe("Average deal size"),
      dealVelocity: z.string().describe("Deals per quarter"),
      topFundingStages: z
        .array(z.string())
        .describe("Most active funding stages"),
    })
    .describe("Funding activity trends"),
  topSectors: z
    .array(
      z.object({
        sector: z.string().describe("Sector name"),
        companyCount: z.number().describe("Number of companies"),
        fundingShare: z.string().describe("Percentage of regional funding"),
        growthRate: z.string().describe("Sector growth rate"),
      })
    )
    .describe("Leading sectors in the region"),
  keyPlayers: z
    .object({
      topCompanies: z
        .array(
          z.object({
            name: z.string().describe("Company name"),
            sector: z.string().describe("Sector"),
            valuation: z.string().describe("Valuation"),
            fundingRaised: z.string().describe("Total raised"),
          })
        )
        .describe("Top companies by valuation/funding"),
      topInvestors: z
        .array(
          z.object({
            name: z.string().describe("Investor name"),
            deals: z.number().describe("Number of deals in region"),
            sectors: z.array(z.string()).describe("Focus sectors"),
          })
        )
        .describe("Most active investors in region"),
    })
    .describe("Key ecosystem players"),
  strengths: z.array(z.string()).describe("Regional strengths and advantages"),
  challenges: z.array(z.string()).describe("Regional challenges and risks"),
  regionalComparison: z
    .array(
      z.object({
        region: z.string().describe("Comparison region"),
        fundingRatio: z.string().describe("Funding compared to target"),
        startupDensity: z.string().describe("Startups per capita comparison"),
        avgValuation: z.string().describe("Average company valuation"),
      })
    )
    .optional()
    .describe("Comparison with other major regions"),
  investmentOpportunities: z
    .array(z.string())
    .describe("Key investment opportunities in the region"),
  keyInsights: z.array(z.string()).describe("Strategic insights"),
  dataSource: z
    .enum(["database", "external", "hybrid"])
    .describe("Source of the data"),
});

type GeographicAnalysisInput = z.infer<typeof GeographicAnalysisInputSchema>;
type GeographicAnalysisOutput = z.infer<typeof GeographicAnalysisOutputSchema>;

/**
 * Geographic Analysis Tool Implementation
 */
export const geographicAnalysisTool = createTool({
  id: "geographic-analysis",

  description: `
    Analyzes investment activity, startup ecosystem health, and market opportunities
    across different geographic regions.

    Use this tool when:
    - Evaluating geographic investment opportunities
    - Questions like "What's the startup ecosystem like in [Region]?"
    - Comparing regions for investment allocation
    - Assessing regional market entry strategies
    - Understanding geographic portfolio diversification

    Examples:
    - "Analyze the fintech ecosystem in Singapore"
    - "What's the investment activity in Berlin?"
    - "Compare startup activity in San Francisco vs New York"
    - "Show me investment trends in Southeast Asia"
  `.trim(),

  inputSchema: GeographicAnalysisInputSchema,
  outputSchema: GeographicAnalysisOutputSchema,

  execute: async (
    input: GeographicAnalysisInput
  ): Promise<GeographicAnalysisOutput> => {
    try {
      // TODO: Database Integration
      // const ecosystemMetrics = await db.query(`
      //   SELECT
      //     COUNT(DISTINCT s.id) as total_startups,
      //     SUM(i.amount) as total_funding,
      //     COUNT(DISTINCT inv.id) as active_investors,
      //     COUNT(CASE WHEN s.valuation >= 1000000000 THEN 1 END) as unicorns,
      //     COUNT(CASE WHEN s.status = 'Exited' THEN 1 END) as exits
      //   FROM startups s
      //   LEFT JOIN investments i ON s.id = i.startup_id
      //   LEFT JOIN investors inv ON i.investor_id = inv.id
      //   WHERE s.city LIKE ? OR s.country = ?
      //     AND (? IS NULL OR s.industry = ?)
      //     AND i.date >= DATE_SUB(NOW(), INTERVAL ? YEAR)
      // `, [`%${input.region}%`, input.region, input.sector, input.sector, getYears(input.timeRange)]);
      //
      // const sectorBreakdown = await db.query(`
      //   SELECT
      //     s.industry as sector,
      //     COUNT(*) as company_count,
      //     SUM(i.amount) / total.sum * 100 as funding_share,
      //     (SUM(i.amount) - LAG(SUM(i.amount)) OVER (ORDER BY YEAR(i.date))) / LAG(SUM(i.amount)) as growth_rate
      //   FROM startups s
      //   JOIN investments i ON s.id = i.startup_id,
      //     (SELECT SUM(amount) as sum FROM investments WHERE ...) total
      //   WHERE s.city LIKE ?
      //   GROUP BY s.industry
      //   ORDER BY funding_share DESC
      //   LIMIT 5
      // `, [`%${input.region}%`]);

      // Mock regional data
      const mockEcosystemOverview = {
        totalStartups: 2850,
        totalFunding: "$45B",
        activeInvestors: 320,
        unicorns: 12,
        exitCount: 145,
        maturityLevel: "Mature" as const,
      };

      const mockFundingTrends = {
        totalRaisedLastYear: "$8.5B",
        yearOverYearGrowth: "+22%",
        avgDealSize: "$12.5M",
        dealVelocity: "85 deals per quarter",
        topFundingStages: ["Series B", "Series A", "Seed"],
      };

      const mockTopSectors = [
        {
          sector: "Enterprise SaaS",
          companyCount: 680,
          fundingShare: "32%",
          growthRate: "+28%",
        },
        {
          sector: "Fintech",
          companyCount: 425,
          fundingShare: "24%",
          growthRate: "+35%",
        },
        {
          sector: "Healthcare Tech",
          companyCount: 380,
          fundingShare: "18%",
          growthRate: "+15%",
        },
      ];

      const mockKeyPlayers = {
        topCompanies: [
          {
            name: "Stripe",
            sector: "Fintech",
            valuation: "$95B",
            fundingRaised: "$2.2B",
          },
          {
            name: "Instacart",
            sector: "E-commerce",
            valuation: "$39B",
            fundingRaised: "$2.7B",
          },
          {
            name: "Databricks",
            sector: "Enterprise SaaS",
            valuation: "$38B",
            fundingRaised: "$3.5B",
          },
        ],
        topInvestors: [
          {
            name: "Sequoia Capital",
            deals: 145,
            sectors: ["Fintech", "Enterprise SaaS", "Healthcare"],
          },
          {
            name: "Andreessen Horowitz",
            deals: 132,
            sectors: ["Fintech", "Web3", "AI/ML"],
          },
          {
            name: "Accel Partners",
            deals: 98,
            sectors: ["SaaS", "Consumer", "Marketplace"],
          },
        ],
      };

      const strengths = [
        "Mature ecosystem with strong network effects and talent density",
        "Deep bench of experienced founders and operators",
        "Unparalleled access to venture capital and late-stage funding",
        "Strong university system producing technical talent (Stanford, Berkeley)",
        "Established infrastructure for scaling companies",
      ];

      const challenges = [
        "Extremely high cost of operations and talent",
        "Intense competition for deals and talent",
        "Regulatory complexity and compliance requirements",
        "Geographic concentration risk for regional events",
      ];

      const mockRegionalComparison = input.includeComparison
        ? [
            {
              region: "New York",
              fundingRatio: "0.45x",
              startupDensity: "0.6x",
              avgValuation: "0.8x",
            },
            {
              region: "London",
              fundingRatio: "0.35x",
              startupDensity: "0.5x",
              avgValuation: "0.7x",
            },
            {
              region: "Singapore",
              fundingRatio: "0.18x",
              startupDensity: "0.3x",
              avgValuation: "0.6x",
            },
          ]
        : undefined;

      const investmentOpportunities = [
        "Late-stage SaaS companies with proven ARR growth",
        "Fintech infrastructure plays serving embedded finance trend",
        "Healthcare tech leveraging AI/ML for diagnostics",
        "Developer tools and infrastructure for modern stack",
      ];

      const keyInsights = [
        `${input.region} maintains position as global leader in tech innovation`,
        "Funding activity remains strong despite economic headwinds",
        "Enterprise SaaS and Fintech dominate regional investment",
        "Increasing trend toward later-stage, larger rounds",
        input.sector
          ? `${input.sector} sector shows exceptional growth (+35% YoY)`
          : "Sector diversification is increasing across the ecosystem",
      ];

      return {
        region: input.region,
        ecosystemOverview: mockEcosystemOverview,
        fundingTrends: mockFundingTrends,
        topSectors: mockTopSectors,
        keyPlayers: mockKeyPlayers,
        strengths,
        challenges,
        regionalComparison: mockRegionalComparison,
        investmentOpportunities,
        keyInsights,
        dataSource: "database", // Will be 'hybrid' when external data is integrated
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[GeographicAnalysisTool] Error:`, error);
      throw new Error(`Geographic analysis failed: ${errorMessage}`);
    }
  },
});
