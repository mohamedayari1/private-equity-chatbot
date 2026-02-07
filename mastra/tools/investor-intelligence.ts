import { createTool } from "@mastra/core/tools";
import { z } from "zod";

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
 * - Understanding investor network effects
 *
 * Database Integration Notes:
 * - TODO: Query investors table for firm profile and metadata
 * - TODO: Join with investments table to get portfolio companies
 * - TODO: Calculate sector concentration and stage preferences
 * - TODO: Track investment velocity (deals per quarter)
 * - TODO: Aggregate average check sizes by stage
 * - TODO: Identify co-investment patterns and network
 * - TODO: Calculate portfolio performance metrics (exits, valuations)
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
  timeRange: z
    .enum(["1year", "3years", "5years", "all"])
    .optional()
    .default("3years")
    .describe("Time period for investment activity analysis"),
  focusSector: z
    .string()
    .optional()
    .describe("Filter investments by specific sector"),
});

/**
 * Output schema - defines what the tool returns
 */
const InvestorIntelligenceOutputSchema = z.object({
  investor: z
    .object({
      name: z.string().describe("Official investor/firm name"),
      type: z
        .enum(["VC", "Corporate VC", "Angel", "PE Fund", "Family Office"])
        .describe("Type of investor"),
      headquarters: z.string().optional().describe("Location of headquarters"),
      foundedYear: z.number().optional().describe("Year firm was established"),
      aum: z
        .string()
        .optional()
        .describe("Assets under management (AUM) if available"),
      website: z.string().optional().describe("Firm website"),
    })
    .describe("Basic investor profile"),
  investmentThesis: z
    .object({
      focusSectors: z.array(z.string()).describe("Primary investment sectors"),
      stagePreferences: z
        .array(z.string())
        .describe("Preferred investment stages"),
      geographicFocus: z
        .array(z.string())
        .describe("Geographic regions of focus"),
      typicalCheckSize: z.string().describe("Typical investment amount range"),
      investmentCriteria: z
        .array(z.string())
        .optional()
        .describe("Key investment criteria or preferences"),
    })
    .describe("Investment strategy and thesis"),
  portfolio: z
    .object({
      totalInvestments: z.number().describe("Total number of portfolio companies"),
      activeInvestments: z.number().describe("Number of active investments"),
      companies: z
        .array(
          z.object({
            name: z.string().describe("Portfolio company name"),
            sector: z.string().describe("Company sector"),
            stage: z.string().describe("Stage when invested"),
            investmentDate: z.string().describe("Date of investment"),
            amount: z.string().optional().describe("Investment amount"),
            currentStatus: z
              .enum(["Active", "Exited", "Acquired", "IPO", "Failed"])
              .describe("Current status"),
          })
        )
        .describe("Portfolio companies"),
      sectorDistribution: z
        .record(z.number())
        .describe("Distribution of investments by sector"),
    })
    .describe("Portfolio composition"),
  recentActivity: z
    .object({
      lastInvestmentDate: z.string().describe("Date of most recent investment"),
      dealsLast12Months: z.number().describe("Number of deals in last 12 months"),
      investmentVelocity: z.string().describe("Average deals per quarter"),
      trendingFocus: z
        .array(z.string())
        .describe("Sectors with increased activity"),
    })
    .describe("Recent investment activity metrics"),
  coInvestors: z
    .array(
      z.object({
        name: z.string().describe("Co-investor name"),
        coInvestmentCount: z.number().describe("Number of co-investments"),
        commonSectors: z.array(z.string()).describe("Shared sector focus"),
      })
    )
    .optional()
    .describe("Frequent co-investment partners"),
  keyInsights: z.array(z.string()).describe("Strategic insights about investor"),
  dataSource: z
    .enum(["database", "external", "hybrid"])
    .describe("Source of the data"),
});

type InvestorIntelligenceInput = z.infer<typeof InvestorIntelligenceInputSchema>;
type InvestorIntelligenceOutput = z.infer<typeof InvestorIntelligenceOutputSchema>;

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
    input: InvestorIntelligenceInput
  ): Promise<InvestorIntelligenceOutput> => {
    try {
      // TODO: Database Integration
      // const investorProfile = await db.query(`
      //   SELECT
      //     i.name, i.type, i.headquarters, i.founded_year,
      //     i.aum, i.website
      //   FROM investors i
      //   WHERE LOWER(i.name) = LOWER(?)
      //   LIMIT 1
      // `, [input.investorName]);
      //
      // const portfolioData = await db.query(`
      //   SELECT
      //     s.name, s.industry as sector,
      //     inv.stage, inv.date as investment_date,
      //     inv.amount, inv.status as current_status
      //   FROM investments inv
      //   JOIN startups s ON inv.startup_id = s.id
      //   JOIN investors i ON inv.investor_id = i.id
      //   WHERE LOWER(i.name) = LOWER(?)
      //     AND inv.date >= NOW() - INTERVAL ? YEAR
      //     AND (? IS NULL OR s.industry = ?)
      //   ORDER BY inv.date DESC
      // `, [input.investorName, getYearsFromTimeRange(input.timeRange),
      //     input.focusSector, input.focusSector]);
      //
      // const coInvestorData = await db.query(`
      //   SELECT
      //     i2.name, COUNT(*) as co_investment_count,
      //     ARRAY_AGG(DISTINCT s.industry) as common_sectors
      //   FROM investments inv1
      //   JOIN investments inv2 ON inv1.startup_id = inv2.startup_id
      //   JOIN investors i1 ON inv1.investor_id = i1.id
      //   JOIN investors i2 ON inv2.investor_id = i2.id
      //   JOIN startups s ON inv1.startup_id = s.id
      //   WHERE LOWER(i1.name) = LOWER(?)
      //     AND i1.id != i2.id
      //   GROUP BY i2.id, i2.name
      //   HAVING COUNT(*) >= 3
      //   ORDER BY co_investment_count DESC
      //   LIMIT 10
      // `, [input.investorName]);

      // Mock portfolio data
      const mockPortfolioCompanies = [
        {
          name: "Stripe",
          sector: "Fintech",
          stage: "Series B",
          investmentDate: "2012-07-01",
          amount: "$18M",
          currentStatus: "Active" as const,
        },
        {
          name: "Airbnb",
          sector: "Marketplace",
          stage: "Series A",
          investmentDate: "2011-03-01",
          amount: "$7.2M",
          currentStatus: "IPO" as const,
        },
        {
          name: "DoorDash",
          sector: "On-Demand",
          stage: "Series A",
          investmentDate: "2014-05-01",
          amount: "$2.4M",
          currentStatus: "IPO" as const,
        },
        {
          name: "Instacart",
          sector: "E-commerce",
          stage: "Series B",
          investmentDate: "2013-06-01",
          amount: "$8.5M",
          currentStatus: "Active" as const,
        },
      ];

      const sectorDistribution = mockPortfolioCompanies.reduce(
        (acc, company) => {
          acc[company.sector] = (acc[company.sector] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const keyInsights = [
        `${input.investorName} shows strong preference for Series A and B rounds`,
        "Portfolio heavily weighted towards marketplace and fintech sectors (55%)",
        "Investment velocity of 4-6 deals per quarter, indicating active deployment",
        "Strong track record with 3 successful IPOs in last 5 years",
        "Frequently co-invests with other tier-1 VCs like a16z and Accel",
      ];

      return {
        investor: {
          name: input.investorName,
          type: "VC",
          headquarters: "Menlo Park, CA",
          foundedYear: 1972,
          aum: "$85B",
          website: "https://www.sequoiacap.com",
        },
        investmentThesis: {
          focusSectors: ["Fintech", "Enterprise SaaS", "Healthcare Tech", "Marketplace"],
          stagePreferences: ["Series A", "Series B", "Series C"],
          geographicFocus: ["North America", "Europe", "Asia"],
          typicalCheckSize: "$10M - $50M",
          investmentCriteria: [
            "Strong founding team with domain expertise",
            "Large addressable market ($1B+)",
            "Clear path to profitability",
            "Technology-enabled disruption",
          ],
        },
        portfolio: {
          totalInvestments: input.includePortfolio ? 250 : 0,
          activeInvestments: 180,
          companies: input.includePortfolio ? mockPortfolioCompanies : [],
          sectorDistribution: input.includePortfolio ? sectorDistribution : {},
        },
        recentActivity: {
          lastInvestmentDate: "2024-01-15",
          dealsLast12Months: 18,
          investmentVelocity: "4.5 deals per quarter",
          trendingFocus: ["AI/ML Infrastructure", "Climate Tech", "Web3"],
        },
        coInvestors: [
          {
            name: "Andreessen Horowitz",
            coInvestmentCount: 24,
            commonSectors: ["Fintech", "Enterprise SaaS"],
          },
          {
            name: "Accel Partners",
            coInvestmentCount: 18,
            commonSectors: ["SaaS", "Marketplace"],
          },
          {
            name: "Lightspeed Venture Partners",
            coInvestmentCount: 15,
            commonSectors: ["E-commerce", "Consumer"],
          },
        ],
        keyInsights,
        dataSource: "database", // Will be 'hybrid' when external data is added
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[InvestorIntelligenceTool] Error:`, error);
      throw new Error(`Investor intelligence lookup failed: ${errorMessage}`);
    }
  },
});
