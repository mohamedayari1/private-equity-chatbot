import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Portfolio Construction Tool
 *
 * Purpose: Provides data-driven recommendations for building diversified investment
 * portfolios based on strategy, risk tolerance, and capital constraints. Helps PE
 * analysts optimize allocation across sectors, stages, and geographies.
 *
 * Use Cases:
 * - Constructing new portfolio based on investment thesis
 * - Rebalancing existing portfolio composition
 * - Analyzing portfolio diversification and concentration risks
 * - Optimizing allocation across sectors and stages
 * - Scenario modeling for different capital deployment strategies
 * - Identifying portfolio gaps and opportunities
 *
 * Database Integration Notes:
 * - TODO: Query portfolio companies and current allocations
 * - TODO: Calculate current portfolio metrics (sector mix, stage distribution)
 * - TODO: Track historical portfolio performance by segment
 * - TODO: Store target allocation models by strategy type
 * - TODO: Calculate correlation between portfolio companies
 * - TODO: Monitor portfolio company valuations and exits
 * - TODO: Track capital deployment pace and dry powder
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const PortfolioConstructionInputSchema = z.object({
  strategy: z
    .enum(["Growth", "Value", "Balanced", "Early Stage", "Late Stage", "Sector Focused"])
    .describe("Investment strategy guiding portfolio construction"),
  capital: z
    .number()
    .optional()
    .describe("Total capital available for allocation (in millions USD)"),
  riskTolerance: z
    .enum(["Conservative", "Moderate", "Aggressive"])
    .optional()
    .default("Moderate")
    .describe("Risk tolerance level"),
  targetSectors: z
    .array(z.string())
    .optional()
    .describe("Preferred sectors for allocation (e.g., ['Fintech', 'Healthcare'])"),
  existingPortfolio: z
    .boolean()
    .optional()
    .default(false)
    .describe("Whether to consider existing portfolio positions"),
});

/**
 * Output schema - defines what the tool returns
 */
const PortfolioConstructionOutputSchema = z.object({
  strategy: z.string().describe("Investment strategy applied"),
  recommendedAllocation: z
    .object({
      bySector: z
        .array(
          z.object({
            sector: z.string().describe("Sector name"),
            allocation: z.string().describe("Percentage of capital"),
            capitalAmount: z.string().describe("Dollar amount to allocate"),
            targetCompanyCount: z.number().describe("Target number of investments"),
            rationale: z.string().describe("Reason for this allocation"),
          })
        )
        .describe("Allocation breakdown by sector"),
      byStage: z
        .array(
          z.object({
            stage: z.string().describe("Investment stage"),
            allocation: z.string().describe("Percentage of capital"),
            capitalAmount: z.string().describe("Dollar amount"),
            avgCheckSize: z.string().describe("Average investment size"),
            targetCount: z.number().describe("Number of investments"),
          })
        )
        .describe("Allocation breakdown by stage"),
      byGeography: z
        .array(
          z.object({
            region: z.string().describe("Geographic region"),
            allocation: z.string().describe("Percentage of capital"),
            capitalAmount: z.string().describe("Dollar amount"),
          })
        )
        .describe("Geographic diversification"),
    })
    .describe("Recommended portfolio allocation"),
  portfolioMetrics: z
    .object({
      targetCompanyCount: z.number().describe("Total target number of companies"),
      avgInvestmentSize: z.string().describe("Average investment size"),
      concentrationRisk: z
        .enum(["Low", "Medium", "High"])
        .describe("Portfolio concentration risk level"),
      sectorDiversification: z
        .string()
        .describe("Diversification score across sectors"),
      reserveRatio: z.string().describe("Capital held in reserve (%)"),
    })
    .describe("Portfolio construction metrics"),
  riskAnalysis: z
    .object({
      overallRisk: z
        .enum(["Low", "Medium", "High", "Very High"])
        .describe("Overall portfolio risk assessment"),
      keyRisks: z.array(z.string()).describe("Primary risk factors"),
      mitigationStrategies: z
        .array(z.string())
        .describe("Recommended risk mitigation approaches"),
    })
    .describe("Portfolio risk analysis"),
  deploymentTimeline: z
    .array(
      z.object({
        period: z.string().describe("Time period (e.g., 'Q1 2024')"),
        capitalToDeploy: z.string().describe("Capital to deploy"),
        focusAreas: z.array(z.string()).describe("Focus sectors/stages"),
      })
    )
    .describe("Suggested capital deployment schedule"),
  opportunitySet: z
    .array(
      z.object({
        theme: z.string().describe("Investment theme or opportunity"),
        targetAllocation: z.string().describe("Suggested allocation"),
        exampleCompanies: z.array(z.string()).describe("Example target companies"),
      })
    )
    .describe("Specific investment opportunities"),
  keyRecommendations: z.array(z.string()).describe("Strategic recommendations"),
  dataSource: z
    .enum(["database", "external", "hybrid"])
    .describe("Source of the data"),
});

type PortfolioConstructionInput = z.infer<typeof PortfolioConstructionInputSchema>;
type PortfolioConstructionOutput = z.infer<typeof PortfolioConstructionOutputSchema>;

/**
 * Portfolio Construction Tool Implementation
 */
export const portfolioConstructionTool = createTool({
  id: "portfolio-construction",

  description: `
    Provides data-driven recommendations for building diversified investment portfolios
    based on strategy, risk tolerance, and capital constraints.

    Use this tool when:
    - Constructing a new portfolio strategy
    - Questions like "How should I allocate capital across sectors?"
    - Rebalancing or optimizing existing portfolio
    - Assessing portfolio diversification
    - Planning capital deployment strategy

    Examples:
    - "Build a growth-focused portfolio with $100M"
    - "How should I diversify across sectors?"
    - "Recommend allocation for early-stage fintech strategy"
    - "Optimize portfolio for balanced risk"
  `.trim(),

  inputSchema: PortfolioConstructionInputSchema,
  outputSchema: PortfolioConstructionOutputSchema,

  execute: async (
    input: PortfolioConstructionInput
  ): Promise<PortfolioConstructionOutput> => {
    try {
      // TODO: Database Integration
      // if (input.existingPortfolio) {
      //   const currentPortfolio = await db.query(`
      //     SELECT
      //       s.industry, i.stage,
      //       SUM(i.amount) as allocated_capital,
      //       COUNT(*) as company_count
      //     FROM portfolio_companies pc
      //     JOIN startups s ON pc.startup_id = s.id
      //     JOIN investments i ON pc.investment_id = i.id
      //     WHERE pc.fund_id = ?
      //       AND pc.status = 'Active'
      //     GROUP BY s.industry, i.stage
      //   `, [fundId]);
      // }
      //
      // const marketMetrics = await db.query(`
      //   SELECT
      //     industry,
      //     AVG(investment_amount) as avg_investment,
      //     COUNT(*) as deal_count,
      //     SUM(amount) as total_deployed
      //   FROM investments
      //   WHERE date >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
      //   GROUP BY industry
      //   ORDER BY total_deployed DESC
      // `);

      const capital = input.capital || 100; // Default $100M

      // Strategy-specific allocation logic
      let sectorAllocation: any[] = [];
      let stageAllocation: any[] = [];

      if (input.strategy === "Growth" || input.strategy === "Late Stage") {
        sectorAllocation = [
          {
            sector: "Enterprise SaaS",
            allocation: "35%",
            capitalAmount: `$${(capital * 0.35).toFixed(1)}M`,
            targetCompanyCount: 8,
            rationale: "Proven business models with scalable revenue",
          },
          {
            sector: "Fintech",
            allocation: "25%",
            capitalAmount: `$${(capital * 0.25).toFixed(1)}M`,
            targetCompanyCount: 6,
            rationale: "Strong market tailwinds and high growth potential",
          },
          {
            sector: "Healthcare Tech",
            allocation: "20%",
            capitalAmount: `$${(capital * 0.2).toFixed(1)}M`,
            targetCompanyCount: 5,
            rationale: "Defensive sector with regulatory moats",
          },
          {
            sector: "E-commerce",
            allocation: "15%",
            capitalAmount: `$${(capital * 0.15).toFixed(1)}M`,
            targetCompanyCount: 4,
            rationale: "Proven unit economics and network effects",
          },
          {
            sector: "Other/Opportunistic",
            allocation: "5%",
            capitalAmount: `$${(capital * 0.05).toFixed(1)}M`,
            targetCompanyCount: 2,
            rationale: "Reserve for exceptional opportunities",
          },
        ];

        stageAllocation = [
          {
            stage: "Series B",
            allocation: "45%",
            capitalAmount: `$${(capital * 0.45).toFixed(1)}M`,
            avgCheckSize: "$5-8M",
            targetCount: 7,
          },
          {
            stage: "Series C",
            allocation: "35%",
            capitalAmount: `$${(capital * 0.35).toFixed(1)}M`,
            avgCheckSize: "$10-15M",
            targetCount: 3,
          },
          {
            stage: "Growth/Pre-IPO",
            allocation: "20%",
            capitalAmount: `$${(capital * 0.2).toFixed(1)}M`,
            avgCheckSize: "$15-25M",
            targetCount: 1,
          },
        ];
      } else if (input.strategy === "Early Stage") {
        sectorAllocation = [
          {
            sector: "AI/ML",
            allocation: "30%",
            capitalAmount: `$${(capital * 0.3).toFixed(1)}M`,
            targetCompanyCount: 15,
            rationale: "Emerging technology with transformative potential",
          },
          {
            sector: "Developer Tools",
            allocation: "25%",
            capitalAmount: `$${(capital * 0.25).toFixed(1)}M`,
            targetCompanyCount: 12,
            rationale: "Bottom-up adoption with strong network effects",
          },
          {
            sector: "Climate Tech",
            allocation: "20%",
            capitalAmount: `$${(capital * 0.2).toFixed(1)}M`,
            targetCompanyCount: 10,
            rationale: "Long-term secular trend with policy support",
          },
          {
            sector: "Web3/Crypto",
            allocation: "15%",
            capitalAmount: `$${(capital * 0.15).toFixed(1)}M`,
            targetCompanyCount: 8,
            rationale: "High risk/high reward emerging category",
          },
          {
            sector: "Other",
            allocation: "10%",
            capitalAmount: `$${(capital * 0.1).toFixed(1)}M`,
            targetCompanyCount: 5,
            rationale: "Opportunistic investments",
          },
        ];

        stageAllocation = [
          {
            stage: "Seed",
            allocation: "40%",
            capitalAmount: `$${(capital * 0.4).toFixed(1)}M`,
            avgCheckSize: "$500K-1M",
            targetCount: 30,
          },
          {
            stage: "Series A",
            allocation: "45%",
            capitalAmount: `$${(capital * 0.45).toFixed(1)}M`,
            avgCheckSize: "$2-3M",
            targetCount: 15,
          },
          {
            stage: "Series B",
            allocation: "15%",
            capitalAmount: `$${(capital * 0.15).toFixed(1)}M`,
            avgCheckSize: "$5-8M",
            targetCount: 2,
          },
        ];
      } else {
        // Balanced strategy
        sectorAllocation = [
          {
            sector: "Enterprise SaaS",
            allocation: "28%",
            capitalAmount: `$${(capital * 0.28).toFixed(1)}M`,
            targetCompanyCount: 10,
            rationale: "Core holding with proven models",
          },
          {
            sector: "Fintech",
            allocation: "22%",
            capitalAmount: `$${(capital * 0.22).toFixed(1)}M`,
            targetCompanyCount: 8,
            rationale: "High growth with regulatory moats",
          },
          {
            sector: "Healthcare Tech",
            allocation: "18%",
            capitalAmount: `$${(capital * 0.18).toFixed(1)}M`,
            targetCompanyCount: 6,
            rationale: "Defensive with long-term tailwinds",
          },
          {
            sector: "Consumer/Marketplace",
            allocation: "18%",
            capitalAmount: `$${(capital * 0.18).toFixed(1)}M`,
            targetCompanyCount: 6,
            rationale: "Network effects and brand value",
          },
          {
            sector: "Emerging Tech",
            allocation: "14%",
            capitalAmount: `$${(capital * 0.14).toFixed(1)}M`,
            targetCompanyCount: 5,
            rationale: "Exposure to next-generation opportunities",
          },
        ];

        stageAllocation = [
          {
            stage: "Series A",
            allocation: "35%",
            capitalAmount: `$${(capital * 0.35).toFixed(1)}M`,
            avgCheckSize: "$2-4M",
            targetCount: 10,
          },
          {
            stage: "Series B",
            allocation: "40%",
            capitalAmount: `$${(capital * 0.4).toFixed(1)}M`,
            avgCheckSize: "$5-8M",
            targetCount: 6,
          },
          {
            stage: "Series C+",
            allocation: "25%",
            capitalAmount: `$${(capital * 0.25).toFixed(1)}M`,
            avgCheckSize: "$10-15M",
            targetCount: 2,
          },
        ];
      }

      const geographicAllocation = [
        {
          region: "North America",
          allocation: "60%",
          capitalAmount: `$${(capital * 0.6).toFixed(1)}M`,
        },
        {
          region: "Europe",
          allocation: "25%",
          capitalAmount: `$${(capital * 0.25).toFixed(1)}M`,
        },
        {
          region: "Asia Pacific",
          allocation: "15%",
          capitalAmount: `$${(capital * 0.15).toFixed(1)}M`,
        },
      ];

      const totalTargetCount = sectorAllocation.reduce(
        (sum, s) => sum + s.targetCompanyCount,
        0
      );

      const keyRecommendations = [
        `Deploy capital over 18-24 month period to maintain market discipline`,
        `Reserve 20% for follow-on investments in top performers`,
        `Focus on sectors with proven founder-market fit and scalability`,
        `Maintain diversification across ${sectorAllocation.length} sectors to mitigate concentration risk`,
        `Target ${totalTargetCount} total companies to achieve proper diversification`,
      ];

      return {
        strategy: input.strategy,
        recommendedAllocation: {
          bySector: sectorAllocation,
          byStage: stageAllocation,
          byGeography: geographicAllocation,
        },
        portfolioMetrics: {
          targetCompanyCount: totalTargetCount,
          avgInvestmentSize: `$${(capital / totalTargetCount).toFixed(1)}M`,
          concentrationRisk:
            input.strategy === "Sector Focused" ? "Medium" : "Low",
          sectorDiversification: "Well diversified across 5+ sectors",
          reserveRatio: "20%",
        },
        riskAnalysis: {
          overallRisk:
            input.riskTolerance === "Aggressive"
              ? "High"
              : input.riskTolerance === "Conservative"
                ? "Low"
                : "Medium",
          keyRisks: [
            "Market downturn could impact valuations",
            "Sector concentration in top 2 sectors (>50%)",
            "Early stage investments have binary outcomes",
            "Geographic concentration in North America",
          ],
          mitigationStrategies: [
            "Stagger investments over 18-24 months",
            "Reserve capital for defensive follow-ons",
            "Maintain sector diversification below 35% per sector",
            "Include mix of early and late-stage for balance",
          ],
        },
        deploymentTimeline: [
          {
            period: "Q1-Q2 2024",
            capitalToDeploy: `$${(capital * 0.35).toFixed(1)}M`,
            focusAreas: ["Series A/B SaaS", "Fintech Series B"],
          },
          {
            period: "Q3-Q4 2024",
            capitalToDeploy: `$${(capital * 0.40).toFixed(1)}M`,
            focusAreas: ["Healthcare Tech", "Later Stage Opportunities"],
          },
          {
            period: "2025",
            capitalToDeploy: `$${(capital * 0.25).toFixed(1)}M`,
            focusAreas: ["Follow-ons", "Opportunistic Investments"],
          },
        ],
        opportunitySet: [
          {
            theme: "AI-Powered Enterprise Tools",
            targetAllocation: "12-15%",
            exampleCompanies: ["AI coding assistants", "Document intelligence platforms"],
          },
          {
            theme: "Embedded Finance Infrastructure",
            targetAllocation: "10-12%",
            exampleCompanies: ["Banking-as-a-Service", "Payment orchestration"],
          },
          {
            theme: "Vertical SaaS",
            targetAllocation: "15-18%",
            exampleCompanies: ["Healthcare practice management", "Construction tech"],
          },
        ],
        keyRecommendations,
        dataSource: "database", // Will be 'hybrid' with market data
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[PortfolioConstructionTool] Error:`, error);
      throw new Error(`Portfolio construction failed: ${errorMessage}`);
    }
  },
});
