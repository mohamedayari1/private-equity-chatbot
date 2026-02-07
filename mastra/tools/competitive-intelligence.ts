import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Competitive Intelligence Tool
 *
 * Purpose: Provides comprehensive competitive landscape analysis for target companies
 * including direct competitors, competitive positioning, market share, and strategic
 * threats. Essential for PE analysts in market assessment and investment thesis.
 *
 * Use Cases:
 * - Identifying direct and indirect competitors
 * - Analyzing competitive positioning and differentiation
 * - Assessing market share and competitive dynamics
 * - Understanding competitive threats and barriers to entry
 * - Evaluating product/feature comparisons
 * - Tracking competitive funding and M&A activity
 *
 * Database Integration Notes:
 * - TODO: Query startups table for companies in same sub_vertical
 * - TODO: Calculate relative market positioning based on funding/metrics
 * - TODO: Track competitive feature matrices in separate table
 * - TODO: Monitor competitive funding rounds and announcements
 * - TODO: Link to external news sources for competitive intelligence
 * - TODO: Calculate market share estimates based on available metrics
 * - TODO: Track competitive hiring patterns and team size
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const CompetitiveIntelligenceInputSchema = z.object({
  targetCompany: z
    .string()
    .describe("Company to analyze competitors for"),
  includeIndirect: z
    .boolean()
    .optional()
    .default(false)
    .describe("Include indirect/adjacent competitors"),
  maxCompetitors: z
    .number()
    .optional()
    .default(5)
    .describe("Maximum number of competitors to return"),
  includeFeatureComparison: z
    .boolean()
    .optional()
    .default(true)
    .describe("Include product/feature comparison matrix"),
});

/**
 * Output schema - defines what the tool returns
 */
const CompetitiveIntelligenceOutputSchema = z.object({
  targetCompany: z.string().describe("Company being analyzed"),
  marketSegment: z.string().describe("Primary market segment"),
  competitors: z
    .array(
      z.object({
        name: z.string().describe("Competitor name"),
        competitorType: z
          .enum(["Direct", "Indirect", "Emerging"])
          .describe("Type of competitive threat"),
        similarityScore: z
          .number()
          .describe("Similarity score (0-100) to target company"),
        strengths: z.array(z.string()).describe("Competitive strengths"),
        weaknesses: z.array(z.string()).describe("Competitive weaknesses"),
        marketPosition: z
          .enum(["Leader", "Challenger", "Niche", "Emerging"])
          .describe("Market position"),
        fundingRaised: z.string().describe("Total funding raised"),
        lastFundingDate: z.string().optional().describe("Most recent funding date"),
        employeeCount: z
          .number()
          .optional()
          .describe("Approximate employee count"),
        website: z.string().optional().describe("Company website"),
      })
    )
    .describe("List of competitors"),
  competitivePositioning: z
    .object({
      targetStrengths: z
        .array(z.string())
        .describe("Target company's competitive advantages"),
      targetWeaknesses: z
        .array(z.string())
        .describe("Areas where target is disadvantaged"),
      differentiators: z
        .array(z.string())
        .describe("Key differentiation points"),
      marketShareEstimate: z
        .string()
        .optional()
        .describe("Estimated market share if available"),
    })
    .describe("Competitive positioning analysis"),
  featureComparison: z
    .array(
      z.object({
        feature: z.string().describe("Product feature or capability"),
        target: z
          .enum(["Available", "Partial", "Planned", "Not Available"])
          .describe("Feature status for target company"),
        competitorA: z
          .enum(["Available", "Partial", "Planned", "Not Available"])
          .describe("Feature status for top competitor"),
        competitorB: z
          .enum(["Available", "Partial", "Planned", "Not Available"])
          .describe("Feature status for second competitor"),
      })
    )
    .optional()
    .describe("Feature comparison matrix"),
  marketDynamics: z
    .object({
      concentration: z
        .enum(["Highly Concentrated", "Moderately Concentrated", "Fragmented"])
        .describe("Market concentration level"),
      competitiveIntensity: z
        .enum(["Very High", "High", "Moderate", "Low"])
        .describe("Level of competitive intensity"),
      barriersToEntry: z
        .enum(["High", "Medium", "Low"])
        .describe("Barriers to entry assessment"),
      switchingCosts: z
        .enum(["High", "Medium", "Low"])
        .describe("Customer switching costs"),
    })
    .describe("Overall market competitive dynamics"),
  strategicThreats: z
    .array(z.string())
    .describe("Key strategic threats and concerns"),
  keyInsights: z
    .array(z.string())
    .describe("Strategic insights from competitive analysis"),
  dataSource: z
    .enum(["database", "external", "hybrid"])
    .describe("Source of the data"),
});

type CompetitiveIntelligenceInput = z.infer<typeof CompetitiveIntelligenceInputSchema>;
type CompetitiveIntelligenceOutput = z.infer<typeof CompetitiveIntelligenceOutputSchema>;

/**
 * Competitive Intelligence Tool Implementation
 */
export const competitiveIntelligenceTool = createTool({
  id: "competitive-intelligence",

  description: `
    Provides comprehensive competitive landscape analysis including direct competitors,
    positioning, market share, and strategic threats.

    Use this tool when:
    - Analyzing competitive landscape for a target company
    - Questions like "Who are [Company]'s main competitors?"
    - Assessing competitive positioning and differentiation
    - Understanding market dynamics and intensity
    - Evaluating competitive threats

    Examples:
    - "Who are Stripe's main competitors?"
    - "Analyze the competitive landscape for [Company]"
    - "How does [Company] compare to its competitors?"
    - "What are the competitive threats in this market?"
  `.trim(),

  inputSchema: CompetitiveIntelligenceInputSchema,
  outputSchema: CompetitiveIntelligenceOutputSchema,

  execute: async (
    input: CompetitiveIntelligenceInput
  ): Promise<CompetitiveIntelligenceOutput> => {
    try {
      // TODO: Database Integration
      // const targetCompanyData = await db.query(`
      //   SELECT s.*, s.sub_vertical, s.industry
      //   FROM startups s
      //   WHERE LOWER(s.name) = LOWER(?)
      //   LIMIT 1
      // `, [input.targetCompany]);
      //
      // const competitors = await db.query(`
      //   SELECT
      //     s.name, s.sub_vertical,
      //     SUM(i.amount) as total_funding,
      //     MAX(i.date) as last_funding_date,
      //     s.employee_count, s.website
      //   FROM startups s
      //   LEFT JOIN investments i ON s.id = i.startup_id
      //   WHERE s.sub_vertical = ?
      //     AND s.id != ?
      //     AND s.status = 'Active'
      //   GROUP BY s.id
      //   ORDER BY total_funding DESC
      //   LIMIT ?
      // `, [targetSubVertical, targetId, input.maxCompetitors]);

      // Mock competitor data
      const mockCompetitors = [
        {
          name: "Square",
          competitorType: "Direct" as const,
          similarityScore: 85,
          strengths: [
            "Strong brand recognition",
            "Integrated hardware + software solution",
            "Large SMB customer base",
          ],
          weaknesses: [
            "Less developer-friendly than target",
            "Higher pricing for enterprise",
          ],
          marketPosition: "Leader" as const,
          fundingRaised: "$590M",
          lastFundingDate: "2014-10-06",
          employeeCount: 8000,
          website: "https://squareup.com",
        },
        {
          name: "Adyen",
          competitorType: "Direct" as const,
          similarityScore: 78,
          strengths: [
            "Global presence in 200+ countries",
            "Enterprise-focused",
            "Single unified platform",
          ],
          weaknesses: [
            "Complex implementation",
            "Limited SMB focus",
          ],
          marketPosition: "Challenger" as const,
          fundingRaised: "$266M",
          lastFundingDate: "2015-09-23",
          employeeCount: 3500,
          website: "https://adyen.com",
        },
        {
          name: "PayPal/Braintree",
          competitorType: "Direct" as const,
          similarityScore: 72,
          strengths: [
            "Massive user base",
            "Brand trust",
            "Consumer + merchant network effects",
          ],
          weaknesses: [
            "Legacy technology stack",
            "Complex product suite",
          ],
          marketPosition: "Leader" as const,
          fundingRaised: "N/A (Public)",
          employeeCount: 30000,
          website: "https://paypal.com",
        },
      ];

      // Mock feature comparison
      const mockFeatureComparison = input.includeFeatureComparison
        ? [
            {
              feature: "API-First Architecture",
              target: "Available" as const,
              competitorA: "Available" as const,
              competitorB: "Partial" as const,
            },
            {
              feature: "Global Multi-Currency",
              target: "Available" as const,
              competitorA: "Available" as const,
              competitorB: "Available" as const,
            },
            {
              feature: "Advanced Fraud Detection",
              target: "Available" as const,
              competitorA: "Partial" as const,
              competitorB: "Available" as const,
            },
            {
              feature: "Embedded Finance Tools",
              target: "Available" as const,
              competitorA: "Planned" as const,
              competitorB: "Not Available" as const,
            },
            {
              feature: "No-Code Integration",
              target: "Available" as const,
              competitorA: "Available" as const,
              competitorB: "Partial" as const,
            },
          ]
        : undefined;

      const strategicThreats = [
        "Large incumbents (Square, PayPal) have significant brand recognition",
        "Emerging fintech startups with niche focus could capture segments",
        "Big tech (Apple, Google) entering payments space with own solutions",
        "Regulatory changes could favor established players",
      ];

      const keyInsights = [
        `${input.targetCompany} has strong differentiation through developer experience`,
        "Market is moderately concentrated with 3-4 major players",
        "High switching costs create defensible market positions",
        "Competition is intensifying in embedded finance segment",
        "Feature parity exists in core capabilities; differentiation is in integration ease",
      ];

      return {
        targetCompany: input.targetCompany,
        marketSegment: "Payment Processing & Infrastructure",
        competitors: mockCompetitors.slice(0, input.maxCompetitors),
        competitivePositioning: {
          targetStrengths: [
            "Best-in-class developer experience and documentation",
            "Modern API-first architecture",
            "Strong focus on platform extensibility",
            "Rapid feature innovation cycle",
          ],
          targetWeaknesses: [
            "Smaller brand recognition vs incumbents",
            "Less extensive offline/hardware presence",
            "Relatively newer in enterprise segment",
          ],
          differentiators: [
            "Developer-first approach",
            "Comprehensive embedded finance toolkit",
            "Superior API design and documentation",
            "Fast time-to-market for integrations",
          ],
          marketShareEstimate: "12-15% of online payment processing",
        },
        featureComparison: mockFeatureComparison,
        marketDynamics: {
          concentration: "Moderately Concentrated",
          competitiveIntensity: "Very High",
          barriersToEntry: "High",
          switchingCosts: "High",
        },
        strategicThreats,
        keyInsights,
        dataSource: "database", // Will be 'hybrid' when external intel is added
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[CompetitiveIntelligenceTool] Error:`, error);
      throw new Error(`Competitive intelligence analysis failed: ${errorMessage}`);
    }
  },
});
