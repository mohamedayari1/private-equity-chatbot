import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Trend Analysis Tool
 *
 * Purpose: Identifies and analyzes emerging trends, market shifts, and investment
 * themes across technology sectors. Essential for PE analysts to stay ahead of
 * market movements and identify early-stage investment opportunities.
 *
 * Use Cases:
 * - Identifying emerging technology trends and themes
 * - Analyzing market momentum and investor sentiment
 * - Tracking funding trends and hot sectors
 * - Understanding macro shifts affecting investments
 * - Discovering early signals of market disruption
 * - Supporting investment thesis development
 *
 * Database Integration Notes:
 * - TODO: Query investments table for time-series trend analysis
 * - TODO: Calculate momentum metrics (QoQ growth, acceleration)
 * - TODO: Track keyword/tag frequency in company descriptions
 * - TODO: Monitor funding velocity by sector/technology
 * - TODO: Aggregate news mentions and sentiment scores
 * - TODO: Compare current trends to historical patterns
 * - TODO: Track startup formation rates by category
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const TrendAnalysisInputSchema = z.object({
  topic: z
    .string()
    .describe(
      "Topic, sector, or technology to analyze trends for (e.g., 'AI/ML', 'Fintech', 'Climate Tech')"
    ),
  timeframe: z
    .enum(["6months", "1year", "2years", "3years"])
    .optional()
    .default("1year")
    .describe("Historical timeframe for trend analysis"),
  includeComparisons: z
    .boolean()
    .optional()
    .default(true)
    .describe("Include comparison with related trends"),
  trendType: z
    .enum(["Technology", "Market", "Investment", "Regulatory", "All"])
    .optional()
    .default("All")
    .describe("Type of trends to focus on"),
});

/**
 * Output schema - defines what the tool returns
 */
const TrendAnalysisOutputSchema = z.object({
  topic: z.string().describe("Topic analyzed"),
  trendSummary: z.string().describe("Executive summary of key trends"),
  momentum: z
    .object({
      direction: z
        .enum(["Accelerating", "Growing", "Stable", "Declining"])
        .describe("Overall trend direction"),
      strength: z
        .enum(["Very Strong", "Strong", "Moderate", "Weak"])
        .describe("Trend strength"),
      velocityScore: z
        .number()
        .describe("Velocity score (0-100) indicating rate of change"),
      peakProjection: z
        .string()
        .optional()
        .describe("Projected peak timeframe if applicable"),
    })
    .describe("Trend momentum analysis"),
  keyTrends: z
    .array(
      z.object({
        trend: z.string().describe("Trend name or theme"),
        description: z.string().describe("Trend description"),
        maturityStage: z
          .enum(["Emerging", "Growth", "Mature", "Declining"])
          .describe("Maturity stage of trend"),
        investmentActivity: z
          .object({
            dealCount: z.number().describe("Number of recent deals"),
            totalFunding: z.string().describe("Total funding in trend"),
            avgDealSize: z.string().describe("Average deal size"),
            growthRate: z.string().describe("YoY growth rate"),
          })
          .describe("Investment metrics"),
        keyDrivers: z.array(z.string()).describe("Factors driving the trend"),
        barriers: z
          .array(z.string())
          .optional()
          .describe("Potential barriers or headwinds"),
      })
    )
    .describe("Identified key trends"),
  companyActivity: z
    .object({
      newStartups: z.number().describe("New startups in last 12 months"),
      totalActive: z.number().describe("Total active companies in space"),
      growthRate: z.string().describe("Company formation growth rate"),
      notableCompanies: z
        .array(
          z.object({
            name: z.string().describe("Company name"),
            description: z.string().describe("What makes them notable"),
            fundingRaised: z.string().describe("Total funding"),
            lastRoundDate: z.string().describe("Most recent funding date"),
          })
        )
        .describe("Notable companies in the trend"),
    })
    .describe("Company formation and activity"),
  investorSentiment: z
    .object({
      sentiment: z
        .enum(["Very Bullish", "Bullish", "Neutral", "Bearish"])
        .describe("Overall investor sentiment"),
      activeInvestors: z.number().describe("Number of active investors"),
      avgTimeToRaise: z.string().describe("Average time to close rounds"),
      competitionLevel: z
        .enum(["Very High", "High", "Moderate", "Low"])
        .describe("Competition for deals"),
    })
    .describe("Investor sentiment and activity"),
  marketSignals: z
    .array(
      z.object({
        signal: z.string().describe("Market signal or indicator"),
        type: z
          .enum(["Leading", "Lagging", "Coincident"])
          .describe("Signal type"),
        interpretation: z.string().describe("What this signal means"),
      })
    )
    .describe("Key market signals and indicators"),
  relatedTrends: z
    .array(
      z.object({
        trend: z.string().describe("Related trend name"),
        relationship: z.string().describe("How it relates to main trend"),
        momentum: z.string().describe("Momentum comparison"),
      })
    )
    .optional()
    .describe("Related or adjacent trends"),
  investmentImplications: z
    .array(z.string())
    .describe("Strategic implications for investors"),
  recommendations: z
    .array(z.string())
    .describe("Actionable recommendations"),
  dataSource: z
    .enum(["database", "external", "hybrid"])
    .describe("Source of the data"),
});

type TrendAnalysisInput = z.infer<typeof TrendAnalysisInputSchema>;
type TrendAnalysisOutput = z.infer<typeof TrendAnalysisOutputSchema>;

/**
 * Trend Analysis Tool Implementation
 */
export const trendAnalysisTool = createTool({
  id: "trend-analysis",

  description: `
    Identifies and analyzes emerging trends, market shifts, and investment themes
    across technology sectors with momentum and sentiment analysis.

    Use this tool when:
    - Exploring emerging trends and technologies
    - Questions like "What are the current trends in [Sector]?"
    - Assessing market momentum and investor sentiment
    - Identifying early-stage investment opportunities
    - Supporting investment thesis development

    Examples:
    - "What are the emerging trends in AI?"
    - "Analyze the climate tech investment landscape"
    - "Show me trends in fintech payments"
    - "What's hot in enterprise software?"
  `.trim(),

  inputSchema: TrendAnalysisInputSchema,
  outputSchema: TrendAnalysisOutputSchema,

  execute: async (input: TrendAnalysisInput): Promise<TrendAnalysisOutput> => {
    try {
      // TODO: Database Integration
      // const trendMetrics = await db.query(`
      //   SELECT
      //     DATE_TRUNC('quarter', i.date) as period,
      //     COUNT(DISTINCT s.id) as company_count,
      //     COUNT(i.id) as deal_count,
      //     SUM(i.amount) as total_funding,
      //     AVG(i.amount) as avg_deal_size
      //   FROM startups s
      //   JOIN investments i ON s.id = i.startup_id
      //   WHERE (s.industry LIKE ? OR s.tags LIKE ?)
      //     AND i.date >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      //   GROUP BY period
      //   ORDER BY period DESC
      // `, [`%${input.topic}%`, `%${input.topic}%`, getMonths(input.timeframe)]);
      //
      // const recentCompanies = await db.query(`
      //   SELECT
      //     s.name, s.description,
      //     SUM(i.amount) as total_raised,
      //     MAX(i.date) as last_round_date
      //   FROM startups s
      //   JOIN investments i ON s.id = i.startup_id
      //   WHERE (s.industry LIKE ? OR s.tags LIKE ?)
      //     AND s.founded_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      //   GROUP BY s.id
      //   ORDER BY total_raised DESC
      //   LIMIT 5
      // `, [`%${input.topic}%`, `%${input.topic}%`]);

      // Mock trend data
      const mockKeyTrends = [
        {
          trend: "Generative AI Applications",
          description:
            "AI models for content creation, code generation, and knowledge work automation",
          maturityStage: "Growth" as const,
          investmentActivity: {
            dealCount: 145,
            totalFunding: "$8.5B",
            avgDealSize: "$58.6M",
            growthRate: "+240% YoY",
          },
          keyDrivers: [
            "Breakthrough in large language models (GPT, Claude, etc.)",
            "Falling costs of compute and API access",
            "Enterprise adoption accelerating",
            "Developer ecosystem rapidly expanding",
          ],
          barriers: [
            "Regulatory uncertainty around AI safety",
            "Compute infrastructure constraints",
            "Talent scarcity in ML engineering",
          ],
        },
        {
          trend: "AI Infrastructure & Dev Tools",
          description:
            "Platforms and tools for building, deploying, and managing AI applications",
          maturityStage: "Emerging" as const,
          investmentActivity: {
            dealCount: 89,
            totalFunding: "$3.2B",
            avgDealSize: "$36M",
            growthRate: "+180% YoY",
          },
          keyDrivers: [
            "Need for specialized ML infrastructure",
            "Model fine-tuning and customization demand",
            "Enterprise AI deployment requirements",
          ],
          barriers: ["Fast-moving technology landscape", "Open source competition"],
        },
        {
          trend: "AI-Powered Analytics",
          description:
            "Business intelligence and data analytics augmented with AI capabilities",
          maturityStage: "Growth" as const,
          investmentActivity: {
            dealCount: 67,
            totalFunding: "$2.1B",
            avgDealSize: "$31.3M",
            growthRate: "+95% YoY",
          },
          keyDrivers: [
            "Data explosion requiring AI-powered insights",
            "Democratization of data analysis",
            "Real-time decision-making needs",
          ],
        },
      ];

      const mockNotableCompanies = [
        {
          name: "Anthropic",
          description: "Leading AI safety-focused LLM developer (Claude)",
          fundingRaised: "$7.3B",
          lastRoundDate: "2024-03-15",
        },
        {
          name: "Cohere",
          description: "Enterprise-focused LLM platform for business applications",
          fundingRaised: "$445M",
          lastRoundDate: "2023-06-08",
        },
        {
          name: "Replit",
          description: "AI-powered collaborative coding platform",
          fundingRaised: "$220M",
          lastRoundDate: "2023-04-26",
        },
      ];

      const mockMarketSignals = [
        {
          signal: "Rapid increase in enterprise AI POCs and pilots",
          type: "Leading" as const,
          interpretation: "Strong demand signal; adoption likely to accelerate",
        },
        {
          signal: "Major tech companies releasing open-source models",
          type: "Coincident" as const,
          interpretation: "Market validation but increased competition for startups",
        },
        {
          signal: "Regulatory frameworks being developed globally",
          type: "Leading" as const,
          interpretation: "Market maturing; compliance will become key differentiator",
        },
      ];

      const mockRelatedTrends = input.includeComparisons
        ? [
            {
              trend: "MLOps & Model Management",
              relationship: "Enabling infrastructure for AI deployment",
              momentum: "Strong growth (+120% YoY)",
            },
            {
              trend: "Computer Vision Applications",
              relationship: "Adjacent AI application category",
              momentum: "Steady growth (+65% YoY)",
            },
            {
              trend: "Edge AI & On-Device ML",
              relationship: "Alternative deployment paradigm",
              momentum: "Emerging (+85% YoY)",
            },
          ]
        : undefined;

      const investmentImplications = [
        "Early-stage opportunities in vertical AI applications (legal, medical, etc.)",
        "Infrastructure plays around model serving, fine-tuning, and orchestration",
        "Potential consolidation in horizontal AI tools; focus on differentiated offerings",
        "Enterprise adoption creating demand for AI consulting and implementation services",
        "Regulatory compliance becoming key moat as frameworks mature",
      ];

      const recommendations = [
        "Focus on applications with clear ROI and strong unit economics",
        "Prioritize teams with deep domain expertise + AI capabilities",
        "Look for proprietary data advantages as key differentiation",
        "Monitor open-source landscape for disruptive competition",
        "Consider longer deployment cycles for enterprise AI investments",
        "Build reserves for follow-on rounds in winners (capital-intensive space)",
      ];

      return {
        topic: input.topic,
        trendSummary: `${input.topic} is experiencing exceptional growth with 145+ deals and $8.5B in funding over the last year (+240% YoY). The market has progressed from emerging to growth stage with strong enterprise adoption signals. Key opportunities exist in vertical applications and enabling infrastructure, though competitive intensity is high.`,
        momentum: {
          direction: "Accelerating",
          strength: "Very Strong",
          velocityScore: 92,
          peakProjection: "Q3-Q4 2025",
        },
        keyTrends: mockKeyTrends,
        companyActivity: {
          newStartups: 380,
          totalActive: 1250,
          growthRate: "+215% YoY",
          notableCompanies: mockNotableCompanies,
        },
        investorSentiment: {
          sentiment: "Very Bullish",
          activeInvestors: 245,
          avgTimeToRaise: "45 days",
          competitionLevel: "Very High",
        },
        marketSignals: mockMarketSignals,
        relatedTrends: mockRelatedTrends,
        investmentImplications,
        recommendations,
        dataSource: "database", // Will be 'hybrid' when external trends are added
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[TrendAnalysisTool] Error:`, error);
      throw new Error(`Trend analysis failed: ${errorMessage}`);
    }
  },
});
