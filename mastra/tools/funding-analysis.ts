import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
  getCompanyFundingHistory,
  getFundingByStage,
  getFundingStats,
  getFundingTrends,
} from "../db/queries/pe-queries";

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
 * - Time-to-next-round analysis for investment timing
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
    .describe(
      "Sector to analyze funding trends (e.g., 'Fintech', 'Healthcare')",
    ),
  startDate: z
    .string()
    .optional()
    .describe("Start date for analysis (YYYY-MM-DD format)"),
  endDate: z
    .string()
    .optional()
    .describe("End date for analysis (YYYY-MM-DD format)"),
});

/**
 * Output schema - defines what the tool returns
 */
const FundingAnalysisOutputSchema = z.object({
  found: z.boolean().describe("Whether funding data was found"),
  analysisType: z
    .enum(["company", "sector", "overall"])
    .describe("Type of analysis performed"),
  subject: z.string().describe("Company name or sector analyzed"),
  fundingHistory: z
    .array(
      z.object({
        date: z.string().describe("Funding round date"),
        stage: z.string().optional().describe("Investment stage"),
        amount: z.string().describe("Amount raised"),
        investor: z.string().optional().describe("Investor name"),
      }),
    )
    .optional()
    .describe("Chronological funding history (for company analysis)"),
  metrics: z
    .object({
      totalRounds: z.number().describe("Total number of funding rounds"),
      totalFunding: z.string().describe("Total amount raised"),
      avgRoundSize: z.string().describe("Average funding round size"),
      uniqueCompanies: z
        .number()
        .optional()
        .describe("Number of unique companies"),
      uniqueInvestors: z
        .number()
        .optional()
        .describe("Number of unique investors"),
      earliestDate: z.string().optional().describe("Earliest funding date"),
      latestDate: z.string().optional().describe("Latest funding date"),
    })
    .describe("Key funding metrics"),
  trendsByPeriod: z
    .array(
      z.object({
        period: z.string().describe("Time period (month)"),
        dealCount: z.number().describe("Number of deals"),
        totalAmount: z.string().describe("Total funding in period"),
        avgAmount: z.string().describe("Average deal size"),
      }),
    )
    .optional()
    .describe("Funding trends over time"),
  stageBreakdown: z
    .array(
      z.object({
        stage: z.string().describe("Investment stage"),
        dealCount: z.number().describe("Number of deals"),
        totalAmount: z.string().describe("Total funding"),
        avgAmount: z.string().describe("Average round size"),
      }),
    )
    .optional()
    .describe("Breakdown by investment stage"),
  keyInsights: z.array(z.string()).describe("Key insights from the analysis"),
  dataSource: z
    .enum(["database", "external", "not_found"])
    .describe("Source of the data"),
});

type FundingAnalysisInput = z.infer<typeof FundingAnalysisInputSchema>;
type FundingAnalysisOutput = z.infer<typeof FundingAnalysisOutputSchema>;

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
 * Format date for display
 */
function formatDate(date: any): string {
  if (!date) return "Unknown";
  const d = new Date(date);
  return isNaN(d.getTime()) ? "Unknown" : d.toISOString().split("T")[0];
}

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

  execute: async (
    input: FundingAnalysisInput,
  ): Promise<FundingAnalysisOutput> => {
    try {
      const isCompanyAnalysis = !!input.companyName;
      const isSectorAnalysis = !!input.sector;
      const subject = input.companyName || input.sector || "Overall";
      const analysisType = isCompanyAnalysis
        ? "company"
        : isSectorAnalysis
          ? "sector"
          : "overall";

      console.log(
        `[FundingAnalysisTool] Analyzing: "${subject}" (${analysisType})`,
      );

      // Get overall stats
      const stats = await getFundingStats();

      if (isCompanyAnalysis) {
        // Company-specific analysis
        const fundingHistory = await getCompanyFundingHistory(
          input.companyName!,
        );

        if (!fundingHistory || fundingHistory.length === 0) {
          console.log(
            `[FundingAnalysisTool] No funding found for: "${input.companyName}"`,
          );
          return {
            found: false,
            analysisType: "company",
            subject: input.companyName!,
            metrics: {
              totalRounds: 0,
              totalFunding: "$0",
              avgRoundSize: "$0",
            },
            keyInsights: [
              `No funding history found for "${input.companyName}" in the dataset.`,
              "Consider using external search for more information.",
            ],
            dataSource: "not_found",
          };
        }

        // Calculate company metrics
        const history = fundingHistory as any[];
        let totalFunding = 0;
        history.forEach((r: any) => {
          totalFunding += parseFloat(r.amount_usd) || 0;
        });

        const formattedHistory = history.map((r: any) => ({
          date: formatDate(r.funding_date),
          stage: r.investment_stage || undefined,
          amount: formatUSD(r.amount_usd),
          investor: r.investor_name || undefined,
        }));

        const keyInsights: string[] = [];
        keyInsights.push(
          `${input.companyName} has raised ${formatUSD(totalFunding)} across ${history.length} funding round(s).`,
        );

        if (history.length > 0) {
          const firstRound = history[0];
          const lastRound = history[history.length - 1];
          keyInsights.push(
            `First funding: ${formatDate(firstRound.funding_date)} (${firstRound.investment_stage || "Unknown stage"}).`,
          );
          keyInsights.push(
            `Most recent: ${formatDate(lastRound.funding_date)} (${lastRound.investment_stage || "Unknown stage"}).`,
          );
        }

        return {
          found: true,
          analysisType: "company",
          subject: input.companyName!,
          fundingHistory: formattedHistory,
          metrics: {
            totalRounds: history.length,
            totalFunding: formatUSD(totalFunding),
            avgRoundSize: formatUSD(
              history.length > 0 ? totalFunding / history.length : 0,
            ),
          },
          keyInsights,
          dataSource: "database",
        };
      }

      // Sector or overall analysis
      const trends = await getFundingTrends({
        industry: input.sector,
        startDate: input.startDate,
        endDate: input.endDate,
      });

      const stageData = await getFundingByStage(input.sector);

      if (
        (!trends || trends.length === 0) &&
        (!stageData || stageData.length === 0)
      ) {
        console.log(
          `[FundingAnalysisTool] No funding data found for: "${subject}"`,
        );
        return {
          found: false,
          analysisType,
          subject,
          metrics: {
            totalRounds: 0,
            totalFunding: "$0",
            avgRoundSize: "$0",
          },
          keyInsights: [
            `No funding data found for "${subject}" in the dataset.`,
            "Try searching for a different sector or use external search.",
          ],
          dataSource: "not_found",
        };
      }

      // Format trends by period
      const trendsByPeriod = (trends as any[]).map((t: any) => ({
        period: formatDate(t.period),
        dealCount: parseInt(t.deal_count) || 0,
        totalAmount: formatUSD(t.total_amount),
        avgAmount: formatUSD(t.avg_amount),
      }));

      // Format stage breakdown
      const stageBreakdown = (stageData as any[]).map((s: any) => ({
        stage: s.investment_stage,
        dealCount: parseInt(s.deal_count) || 0,
        totalAmount: formatUSD(s.total_amount),
        avgAmount: formatUSD(s.avg_amount),
      }));

      // Calculate totals from trends
      let totalDeals = 0;
      let totalFunding = 0;
      (trends as any[]).forEach((t: any) => {
        totalDeals += parseInt(t.deal_count) || 0;
        totalFunding += parseFloat(t.total_amount) || 0;
      });

      // Generate insights
      const keyInsights: string[] = [];
      keyInsights.push(
        `${subject} has ${totalDeals} funding rounds totaling ${formatUSD(totalFunding)}.`,
      );

      if (stageBreakdown.length > 0) {
        const topStage = stageBreakdown[0];
        keyInsights.push(
          `Most active stage: ${topStage.stage} with ${topStage.dealCount} deals and ${topStage.totalAmount} total.`,
        );
      }

      if (trendsByPeriod.length > 0) {
        const latestPeriod = trendsByPeriod[0];
        keyInsights.push(
          `Most recent activity: ${latestPeriod.dealCount} deals in ${latestPeriod.period}.`,
        );
      }

      const statsData = stats as any;
      if (statsData) {
        keyInsights.push(
          `Dataset contains ${statsData.total_companies || 0} companies and ${statsData.total_investors || 0} investors.`,
        );
      }

      console.log(
        `[FundingAnalysisTool] Found ${totalDeals} rounds across ${trendsByPeriod.length} periods`,
      );

      return {
        found: true,
        analysisType,
        subject,
        metrics: {
          totalRounds: totalDeals,
          totalFunding: formatUSD(totalFunding),
          avgRoundSize: formatUSD(
            totalDeals > 0 ? totalFunding / totalDeals : 0,
          ),
          uniqueCompanies: parseInt(statsData?.total_companies) || undefined,
          uniqueInvestors: parseInt(statsData?.total_investors) || undefined,
          earliestDate: statsData?.earliest_date
            ? formatDate(statsData.earliest_date)
            : undefined,
          latestDate: statsData?.latest_date
            ? formatDate(statsData.latest_date)
            : undefined,
        },
        trendsByPeriod,
        stageBreakdown,
        keyInsights,
        dataSource: "database",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[FundingAnalysisTool] Error:`, error);
      throw new Error(`Funding analysis failed: ${errorMessage}`);
    }
  },
});
