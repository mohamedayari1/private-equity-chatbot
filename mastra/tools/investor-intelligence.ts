import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import {
  getInvestorCompanies,
  getInvestorPortfolio,
} from "../db/queries/pe-queries";

/**
 * Investor Intelligence Tool
 *
 * Purpose: Provides comprehensive intelligence profiles on investors and VC firms
 * including their investment patterns, portfolio companies, sector focus, and
 * investment thesis. Critical for PE analysts in deal sourcing and partnership.
 *
 * Use Cases:
 * - Understanding investor investment thesis and preferences
 * - Identifying potential co-investment partners
 * - Analyzing investor track record and portfolio composition
 * - Finding active investors in specific sectors
 * - Assessing investor check sizes and stage preferences
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const InvestorIntelligenceInputSchema = z.object({
  investorName: z
    .string()
    .describe("Name of the investor or VC firm to analyze"),
  includePortfolio: z
    .boolean()
    .optional()
    .default(true)
    .describe("Include full portfolio breakdown"),
});

/**
 * Output schema - defines what the tool returns
 */
const InvestorIntelligenceOutputSchema = z.object({
  found: z.boolean().describe("Whether the investor was found in the dataset"),
  investor: z
    .object({
      name: z.string().describe("Official investor/firm name"),
      companiesInvested: z.number().describe("Number of portfolio companies"),
      totalInvestedUsd: z.string().describe("Total amount invested"),
      industries: z.array(z.string()).describe("Industries where they invest"),
      stages: z.array(z.string()).describe("Investment stages"),
      firstInvestmentDate: z
        .string()
        .optional()
        .describe("Date of first investment"),
      lastInvestmentDate: z
        .string()
        .optional()
        .describe("Date of most recent investment"),
    })
    .optional()
    .describe("Basic investor profile"),
  portfolio: z
    .array(
      z.object({
        companyName: z.string().describe("Portfolio company name"),
        industry: z.string().optional().describe("Company industry"),
        subVertical: z.string().optional().describe("Sub-sector"),
        city: z.string().optional().describe("Company location"),
        investmentStage: z.string().optional().describe("Stage when invested"),
        amountUsd: z.string().optional().describe("Investment amount"),
        fundingDate: z.string().optional().describe("Date of investment"),
      }),
    )
    .optional()
    .describe("Portfolio companies"),
  keyInsights: z
    .array(z.string())
    .describe("Strategic insights about investor"),
  dataSource: z
    .enum(["database", "external", "not_found"])
    .describe("Source of the data"),
  externalSearchRequired: z
    .boolean()
    .describe("Whether external search is needed for more data"),
  matchedInvestors: z
    .array(z.string())
    .optional()
    .describe("Other investors matching the search if multiple found"),
});

type InvestorIntelligenceInput = z.infer<
  typeof InvestorIntelligenceInputSchema
>;
type InvestorIntelligenceOutput = z.infer<
  typeof InvestorIntelligenceOutputSchema
>;

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
 * Investor Intelligence Tool Implementation
 */
export const investorIntelligenceTool = createTool({
  id: "investor-intelligence",

  description: `
    Retrieves comprehensive intelligence on investors and VC firms including investment
    patterns, portfolio companies, sector focus, and partnership opportunities.

    Use this tool when:
    - Researching a specific investor or VC firm
    - Questions like "Tell me about [Investor]'s investment strategy"
    - Finding potential co-investment partners
    - Understanding investor preferences before pitching
    - Analyzing investor track record and portfolio

    Examples:
    - "What is Sequoia Capital's investment thesis?"
    - "Show me Andreessen Horowitz's recent fintech investments"
    - "Who does Tiger Global typically co-invest with?"
    - "What stage does Accel Partners usually invest at?"
  `.trim(),

  inputSchema: InvestorIntelligenceInputSchema,
  outputSchema: InvestorIntelligenceOutputSchema,

  execute: async (
    input: InvestorIntelligenceInput,
  ): Promise<InvestorIntelligenceOutput> => {
    try {
      console.log(
        `[InvestorIntelligenceTool] Looking up: "${input.investorName}"`,
      );

      // Query the database for investor portfolio
      const portfolioResults = await getInvestorPortfolio(input.investorName);

      if (!portfolioResults || portfolioResults.length === 0) {
        console.log(
          `[InvestorIntelligenceTool] Investor not found: "${input.investorName}"`,
        );
        return {
          found: false,
          dataSource: "not_found",
          externalSearchRequired: true,
          keyInsights: [
            `Investor "${input.investorName}" was not found in the dataset.`,
            "Consider using external search to find information about this investor.",
          ],
        };
      }

      const investorData = portfolioResults[0] as any;

      // Get portfolio companies if requested
      let portfolioCompanies: any[] = [];
      if (input.includePortfolio) {
        const companies = await getInvestorCompanies(input.investorName);
        portfolioCompanies = companies as any[];
      }

      // Parse arrays
      const industries = parseArray(investorData.industries);
      const stages = parseArray(investorData.stages);

      // Format investor profile
      const investor = {
        name: investorData.investor_name,
        companiesInvested: parseInt(investorData.companies_invested) || 0,
        totalInvestedUsd: formatUSD(investorData.total_invested_usd),
        industries,
        stages,
        firstInvestmentDate: investorData.first_investment_date
          ? new Date(investorData.first_investment_date)
              .toISOString()
              .split("T")[0]
          : undefined,
        lastInvestmentDate: investorData.last_investment_date
          ? new Date(investorData.last_investment_date)
              .toISOString()
              .split("T")[0]
          : undefined,
      };

      // Format portfolio
      const portfolio = portfolioCompanies.map((c: any) => ({
        companyName: c.company_name,
        industry: c.industry || undefined,
        subVertical: c.sub_vertical || undefined,
        city: c.city || undefined,
        investmentStage: c.investment_stage || undefined,
        amountUsd: formatUSD(c.amount_usd),
        fundingDate: c.funding_date
          ? new Date(c.funding_date).toISOString().split("T")[0]
          : undefined,
      }));

      // Generate insights
      const keyInsights: string[] = [];

      if (investor.companiesInvested > 0) {
        keyInsights.push(
          `${investor.name} has invested in ${investor.companiesInvested} companies with total investment of ${investor.totalInvestedUsd}.`,
        );
      }

      if (industries.length > 0) {
        const topIndustries = industries.slice(0, 3).join(", ");
        keyInsights.push(`Primary sector focus: ${topIndustries}.`);
      }

      if (stages.length > 0) {
        keyInsights.push(`Active in ${stages.join(", ")} stage investments.`);
      }

      if (investor.lastInvestmentDate) {
        keyInsights.push(
          `Most recent investment was on ${investor.lastInvestmentDate}.`,
        );
      }

      // Check for multiple matches
      const matchedInvestors =
        portfolioResults.length > 1
          ? portfolioResults.slice(1).map((r: any) => r.investor_name)
          : undefined;

      console.log(
        `[InvestorIntelligenceTool] Found investor: "${investor.name}" with ${investor.companiesInvested} portfolio companies`,
      );

      return {
        found: true,
        investor,
        portfolio: input.includePortfolio ? portfolio : undefined,
        keyInsights,
        dataSource: "database",
        externalSearchRequired: industries.length === 0,
        matchedInvestors,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[InvestorIntelligenceTool] Error:`, error);
      throw new Error(`Investor intelligence lookup failed: ${errorMessage}`);
    }
  },
});
