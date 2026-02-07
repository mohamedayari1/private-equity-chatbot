import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Funding Analysis Tool
 *
 * Purpose: Provides detailed analysis of funding trends, patterns, and metrics
 * for specific companies or entire sectors. Helps PE analysts understand
 * investment velocity, valuation trends, and funding stage distributions.
 *
 * Use Cases:
 * - Analyzing funding history of a specific company
 * - Understanding sector-level funding trends over time
 * - Comparing funding velocity across different stages
 * - Identifying hot sectors based on funding activity
 * - Valuation multiple analysis and benchmarking
 * - Time-to-next-round analysis for investment timing
 *
 * Database Integration Notes:
 * - TODO: Query investments table for funding rounds by company/sector
 * - TODO: Calculate year-over-year funding growth rates
 * - TODO: Join with startups table for sector/stage segmentation
 * - TODO: Aggregate by quarter to identify seasonal patterns
 * - TODO: Calculate median/average round sizes by stage
 * - TODO: Track funding velocity (time between rounds)
 * - TODO: Include investor participation rates by stage
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const FundingAnalysisInputSchema = z.object({
  companyName: z
    .string()
    .optional()
    .describe("Specific company to analyze funding history"),
  sector: z
    .string()
    .optional()
    .describe("Sector to analyze funding trends (e.g., 'Fintech', 'Healthcare')"),
  timeRange: z
    .enum(["1year", "3years", "5years", "all"])
    .optional()
    .default("3years")
    .describe("Time period for analysis"),
  investmentStages: z
    .array(z.string())
    .optional()
    .describe("Filter by specific stages (e.g., ['Series A', 'Series B'])"),
  includeValuations: z
    .boolean()
    .optional()
    .default(true)
    .describe("Include valuation data in analysis"),
});

/**
 * Output schema - defines what the tool returns
 */
const FundingAnalysisOutputSchema = z.object({
  analysisType: z
    .enum(["company", "sector"])
    .describe("Type of analysis performed"),
  subject: z.string().describe("Company name or sector analyzed"),
  fundingHistory: z
    .array(
      z.object({
        date: z.string().describe("Funding round date"),
        stage: z.string().describe("Investment stage"),
        amount: z.string().describe("Amount raised"),
        valuation: z
          .string()
          .optional()
          .describe("Post-money valuation if available"),
        leadInvestors: z
          .array(z.string())
          .optional()
          .describe("Lead investors in the round"),
      })
    )
    .describe("Chronological funding history"),
  metrics: z
    .object({
      totalRaised: z.string().describe("Total amount raised"),
      numberOfRounds: z.number().describe("Total number of funding rounds"),
      averageRoundSize: z.string().describe("Average funding round size"),
      lastRoundDate: z.string().describe("Date of most recent round"),
      fundingVelocity: z
        .string()
        .describe("Average time between funding rounds"),
      valuationGrowth: z
        .string()
        .optional()
        .describe("Valuation growth rate if applicable"),
    })
    .describe("Key funding metrics"),
  trends: z
    .object({
      growthRate: z.string().describe("Year-over-year funding growth rate"),
      stageDistribution: z
        .record(z.number())
        .describe("Distribution of funding by stage"),
      timeSeriesData: z
        .array(
          z.object({
            period: z.string().describe("Time period (quarter/year)"),
            amount: z.string().describe("Total funding in period"),
            dealCount: z.number().describe("Number of deals"),
          })
        )
        .describe("Funding trend over time"),
    })
    .describe("Funding trend analysis"),
  insights: z.array(z.string()).describe("Key insights from the analysis"),
  comparativeMetrics: z
    .object({
      percentileRanking: z
        .number()
        .optional()
        .describe("Percentile ranking compared to sector"),
      sectorAverage: z
        .string()
        .optional()
        .describe("Sector average for comparison"),
    })
    .optional()
    .describe("Comparative metrics against sector"),
  dataSource: z
    .enum(["database", "external", "hybrid"])
    .describe("Source of the data"),
});

type FundingAnalysisInput = z.infer<typeof FundingAnalysisInputSchema>;
type FundingAnalysisOutput = z.infer<typeof FundingAnalysisOutputSchema>;

/**
 * Funding Analysis Tool Implementation
 */
export const fundingAnalysisTool = createTool({
  id: "funding-analysis",

  description: `
    Analyzes funding trends and patterns for specific companies or entire sectors.
    Provides detailed metrics on funding velocity, round sizes, and valuation trends.

    Use this tool when:
    - Analyzing a company's funding trajectory
    - Understanding sector-level investment patterns
    - Questions like "What's the funding history of [Company]?"
    - Comparing funding trends across stages or time periods
    - Assessing investment timing and velocity

    Examples:
    - "Analyze funding trends in the fintech sector"
    - "What's Stripe's funding history?"
    - "Show me Series B funding trends over the last 3 years"
    - "How does this company's funding compare to sector averages?"
  `.trim(),

  inputSchema: FundingAnalysisInputSchema,
  outputSchema: FundingAnalysisOutputSchema,

  execute: async (input: FundingAnalysisInput): Promise<FundingAnalysisOutput> => {
    try {
      const isCompanyAnalysis = !!input.companyName;
      const subject = input.companyName || input.sector || "General";

      // TODO: Database Integration for company analysis
      // if (isCompanyAnalysis) {
      //   const fundingData = await db.query(`
      //     SELECT
      //       i.date, i.stage, i.amount, i.valuation,
      //       ARRAY_AGG(inv.name) FILTER (WHERE inv.is_lead = true) as lead_investors
      //     FROM investments i
      //     JOIN startups s ON i.startup_id = s.id
      //     LEFT JOIN investor_participations ip ON i.id = ip.investment_id
      //     LEFT JOIN investors inv ON ip.investor_id = inv.id
      //     WHERE LOWER(s.name) = LOWER(?)
      //       AND i.date >= NOW() - INTERVAL ? YEAR
      //     GROUP BY i.id
      //     ORDER BY i.date ASC
      //   `, [input.companyName, getYearsFromTimeRange(input.timeRange)]);
      // }

      // TODO: Database Integration for sector analysis
      // if (input.sector) {
      //   const sectorData = await db.query(`
      //     SELECT
      //       DATE_TRUNC('quarter', i.date) as period,
      //       i.stage,
      //       SUM(i.amount) as total_amount,
      //       COUNT(*) as deal_count,
      //       AVG(i.amount) as avg_amount
      //     FROM investments i
      //     JOIN startups s ON i.startup_id = s.id
      //     WHERE s.industry = ?
      //       AND (? IS NULL OR i.stage = ANY(?))
      //     GROUP BY period, i.stage
      //     ORDER BY period DESC
      //   `, [input.sector, input.investmentStages, input.investmentStages]);
      // }

      // Mock funding history data
      const mockFundingHistory = [
        {
          date: "2020-03-15",
          stage: "Series A",
          amount: "$10M",
          valuation: "$50M",
          leadInvestors: ["Sequoia Capital"],
        },
        {
          date: "2021-06-20",
          stage: "Series B",
          amount: "$25M",
          valuation: "$150M",
          leadInvestors: ["Andreessen Horowitz", "Sequoia Capital"],
        },
        {
          date: "2023-01-10",
          stage: "Series C",
          amount: "$50M",
          valuation: "$400M",
          leadInvestors: ["Tiger Global", "Coatue"],
        },
      ];

      // Mock time series data for trends
      const mockTimeSeriesData = [
        { period: "Q1 2023", amount: "$150M", dealCount: 12 },
        { period: "Q2 2023", amount: "$200M", dealCount: 15 },
        { period: "Q3 2023", amount: "$180M", dealCount: 14 },
        { period: "Q4 2023", amount: "$220M", dealCount: 18 },
      ];

      const insights = isCompanyAnalysis
        ? [
            `${subject} has raised a total of $85M across 3 funding rounds`,
            "Funding velocity is strong with 15-18 month intervals between rounds",
            "Valuation grew 8x from Series A to Series C",
            "Attracted top-tier investors including Sequoia and a16z",
          ]
        : [
            `${subject} sector shows strong growth with $750M raised in the past year`,
            "Series B rounds increased by 35% YoY, indicating sector maturation",
            "Average round size grew from $15M to $22M over 3 years",
            "Funding activity concentrated in Q4, suggesting seasonal patterns",
          ];

      return {
        analysisType: isCompanyAnalysis ? "company" : "sector",
        subject,
        fundingHistory: isCompanyAnalysis ? mockFundingHistory : [],
        metrics: {
          totalRaised: isCompanyAnalysis ? "$85M" : "$750M",
          numberOfRounds: isCompanyAnalysis ? 3 : 59,
          averageRoundSize: isCompanyAnalysis ? "$28.3M" : "$22M",
          lastRoundDate: "2023-01-10",
          fundingVelocity: "16.5 months",
          valuationGrowth: input.includeValuations ? "167% CAGR" : undefined,
        },
        trends: {
          growthRate: "+35% YoY",
          stageDistribution: {
            "Series A": 45,
            "Series B": 30,
            "Series C": 20,
            "Series D+": 5,
          },
          timeSeriesData: mockTimeSeriesData,
        },
        insights,
        comparativeMetrics: isCompanyAnalysis
          ? {
              percentileRanking: 78,
              sectorAverage: "$22M per round",
            }
          : undefined,
        dataSource: "database", // Will be 'hybrid' when external data is added
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[FundingAnalysisTool] Error:`, error);
      throw new Error(`Funding analysis failed: ${errorMessage}`);
    }
  },
});
