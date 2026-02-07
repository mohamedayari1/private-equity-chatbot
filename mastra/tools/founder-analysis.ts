import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Founder Analysis Tool
 *
 * Purpose: Provides comprehensive background analysis on startup founders including
 * education, work history, previous ventures, and track record. Critical for PE
 * analysts in assessing founding team quality during due diligence.
 *
 * Use Cases:
 * - Evaluating founder background and credentials
 * - Analyzing founder track record with previous startups
 * - Assessing founder domain expertise
 * - Understanding founder network and connections
 * - Identifying serial entrepreneurs
 * - Evaluating team composition and complementary skills
 *
 * Database Integration Notes:
 * - TODO: Query founders table for basic profile information
 * - TODO: Join with startups table to get all companies founded
 * - TODO: Track previous exits and outcomes
 * - TODO: Store education and work history data
 * - TODO: Calculate success metrics (exits, total value created)
 * - TODO: Link to social profiles (LinkedIn, Twitter) for enrichment
 * - TODO: Track co-founder relationships across ventures
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const FounderAnalysisInputSchema = z.object({
  founderName: z.string().describe("Name of the founder to analyze"),
  companyName: z
    .string()
    .optional()
    .describe("Current or target company (helps with disambiguation)"),
  includeNetwork: z
    .boolean()
    .optional()
    .default(false)
    .describe("Include co-founder network and connections"),
  includeDetailedHistory: z
    .boolean()
    .optional()
    .default(true)
    .describe("Include detailed work and education history"),
});

/**
 * Output schema - defines what the tool returns
 */
const FounderAnalysisOutputSchema = z.object({
  founder: z
    .object({
      name: z.string().describe("Founder full name"),
      currentCompany: z.string().optional().describe("Current company"),
      currentRole: z.string().optional().describe("Current role/title"),
      location: z.string().optional().describe("Current location"),
      linkedIn: z.string().optional().describe("LinkedIn profile URL"),
      twitter: z.string().optional().describe("Twitter handle"),
    })
    .describe("Basic founder profile"),
  background: z
    .object({
      education: z
        .array(
          z.object({
            institution: z.string().describe("University or institution"),
            degree: z.string().describe("Degree obtained"),
            field: z.string().describe("Field of study"),
            graduationYear: z.number().optional().describe("Year graduated"),
          })
        )
        .describe("Educational background"),
      workHistory: z
        .array(
          z.object({
            company: z.string().describe("Company name"),
            title: z.string().describe("Job title"),
            duration: z.string().describe("Time period (e.g., '2015-2018')"),
            description: z
              .string()
              .optional()
              .describe("Role description or achievements"),
          })
        )
        .describe("Professional work experience"),
      domainExpertise: z
        .array(z.string())
        .describe("Areas of demonstrated expertise"),
      yearsOfExperience: z.number().describe("Total years of relevant experience"),
    })
    .describe("Professional background"),
  entrepreneurialTrackRecord: z
    .object({
      isSerialEntrepreneur: z
        .boolean()
        .describe("Whether founder has started multiple companies"),
      totalVenturesFounded: z.number().describe("Number of companies founded"),
      ventures: z
        .array(
          z.object({
            companyName: z.string().describe("Venture name"),
            role: z.string().describe("Founder role"),
            sector: z.string().describe("Industry/sector"),
            foundedYear: z.number().describe("Year founded"),
            outcome: z
              .enum(["Active", "Acquired", "IPO", "Failed", "Merged"])
              .describe("Venture outcome"),
            exitValue: z
              .string()
              .optional()
              .describe("Exit value if applicable"),
            fundingRaised: z.string().optional().describe("Total funding raised"),
          })
        )
        .describe("Previous ventures"),
      successRate: z.string().describe("Success rate of previous ventures"),
      totalValueCreated: z
        .string()
        .optional()
        .describe("Total value created across ventures"),
    })
    .describe("Entrepreneurial track record"),
  coFounderNetwork: z
    .array(
      z.object({
        name: z.string().describe("Co-founder name"),
        relationship: z.string().describe("Nature of relationship"),
        ventures: z
          .array(z.string())
          .describe("Companies co-founded together"),
        currentCompany: z
          .string()
          .optional()
          .describe("Co-founder's current company"),
      })
    )
    .optional()
    .describe("Network of co-founders and collaborators"),
  strengths: z.array(z.string()).describe("Key strengths and differentiators"),
  riskFactors: z
    .array(z.string())
    .optional()
    .describe("Potential risk factors or concerns"),
  keyInsights: z.array(z.string()).describe("Notable insights about the founder"),
  dataSource: z
    .enum(["database", "external", "hybrid"])
    .describe("Source of the data"),
});

type FounderAnalysisInput = z.infer<typeof FounderAnalysisInputSchema>;
type FounderAnalysisOutput = z.infer<typeof FounderAnalysisOutputSchema>;

/**
 * Founder Analysis Tool Implementation
 */
export const founderAnalysisTool = createTool({
  id: "founder-analysis",

  description: `
    Analyzes founder background, track record, education, and professional history.
    Essential for assessing founding team quality during due diligence.

    Use this tool when:
    - Evaluating a founding team
    - Questions like "Tell me about [Founder]'s background"
    - Assessing founder domain expertise
    - Understanding founder track record
    - Analyzing team composition

    Examples:
    - "What's the background of the Stripe founders?"
    - "Analyze the founding team of [Company]"
    - "Has this founder started companies before?"
    - "What's the track record of [Founder]?"
  `.trim(),

  inputSchema: FounderAnalysisInputSchema,
  outputSchema: FounderAnalysisOutputSchema,

  execute: async (input: FounderAnalysisInput): Promise<FounderAnalysisOutput> => {
    try {
      // TODO: Database Integration
      // const founderProfile = await db.query(`
      //   SELECT
      //     f.name, f.current_company, f.current_role,
      //     f.location, f.linkedin_url, f.twitter_handle
      //   FROM founders f
      //   WHERE LOWER(f.name) = LOWER(?)
      //     AND (? IS NULL OR LOWER(f.current_company) = LOWER(?))
      //   LIMIT 1
      // `, [input.founderName, input.companyName, input.companyName]);
      //
      // const education = await db.query(`
      //   SELECT institution, degree, field, graduation_year
      //   FROM founder_education
      //   WHERE founder_id = ?
      //   ORDER BY graduation_year DESC
      // `, [founderId]);
      //
      // const workHistory = await db.query(`
      //   SELECT company, title, start_date, end_date, description
      //   FROM founder_work_history
      //   WHERE founder_id = ?
      //   ORDER BY start_date DESC
      // `, [founderId]);
      //
      // const ventures = await db.query(`
      //   SELECT
      //     s.name, ff.role, s.industry, s.founded_year,
      //     s.outcome, s.exit_value, SUM(i.amount) as total_raised
      //   FROM founder_startups ff
      //   JOIN startups s ON ff.startup_id = s.id
      //   LEFT JOIN investments i ON s.id = i.startup_id
      //   WHERE ff.founder_id = ?
      //   GROUP BY s.id, ff.role
      //   ORDER BY s.founded_year DESC
      // `, [founderId]);

      // Mock data showing expected structure
      const mockEducation = [
        {
          institution: "Stanford University",
          degree: "MS",
          field: "Computer Science",
          graduationYear: 2015,
        },
        {
          institution: "MIT",
          degree: "BS",
          field: "Electrical Engineering",
          graduationYear: 2013,
        },
      ];

      const mockWorkHistory = [
        {
          company: "Google",
          title: "Senior Software Engineer",
          duration: "2015-2018",
          description: "Led payments infrastructure team",
        },
        {
          company: "Facebook",
          title: "Software Engineer",
          duration: "2013-2015",
          description: "Worked on Messenger platform",
        },
      ];

      const mockVentures = [
        {
          companyName: input.companyName || "CurrentCo",
          role: "Co-Founder & CEO",
          sector: "Fintech",
          foundedYear: 2019,
          outcome: "Active" as const,
          exitValue: undefined,
          fundingRaised: "$50M",
        },
        {
          companyName: "PreviousStartup",
          role: "Co-Founder & CTO",
          sector: "SaaS",
          foundedYear: 2016,
          outcome: "Acquired" as const,
          exitValue: "$15M",
          fundingRaised: "$5M",
        },
      ];

      const mockCoFounderNetwork = input.includeNetwork
        ? [
            {
              name: "Jane Smith",
              relationship: "Co-Founder (2x)",
              ventures: ["CurrentCo", "PreviousStartup"],
              currentCompany: "CurrentCo",
            },
            {
              name: "Bob Johnson",
              relationship: "College Friend & Previous Co-Founder",
              ventures: ["PreviousStartup"],
              currentCompany: "Stripe",
            },
          ]
        : undefined;

      const strengths = [
        "Strong technical background from top institutions (MIT, Stanford)",
        "Deep domain expertise in payments and financial infrastructure (5+ years)",
        "Prior successful exit demonstrates ability to build and scale",
        "Well-connected in Silicon Valley tech ecosystem",
        "Track record of attracting top-tier talent",
      ];

      const riskFactors = [
        "Limited experience as CEO (first time in this role)",
        "Previous startup was acquired relatively early (pre-scale)",
      ];

      const keyInsights = [
        `${input.founderName} is a serial entrepreneur with 1 successful exit`,
        "Strong technical pedigree with experience at major tech companies",
        "Has raised $55M total across ventures, indicating investor confidence",
        "Domain expertise aligns well with current venture focus",
        "Maintains strong co-founder relationships across multiple ventures",
      ];

      return {
        founder: {
          name: input.founderName,
          currentCompany: input.companyName || "CurrentCo",
          currentRole: "Co-Founder & CEO",
          location: "San Francisco, CA",
          linkedIn: "https://linkedin.com/in/example",
          twitter: "@examplefounder",
        },
        background: {
          education: mockEducation,
          workHistory: input.includeDetailedHistory ? mockWorkHistory : [],
          domainExpertise: ["Payments", "Financial Infrastructure", "Distributed Systems"],
          yearsOfExperience: 11,
        },
        entrepreneurialTrackRecord: {
          isSerialEntrepreneur: true,
          totalVenturesFounded: 2,
          ventures: mockVentures,
          successRate: "50% successful exits",
          totalValueCreated: "$15M+",
        },
        coFounderNetwork: mockCoFounderNetwork,
        strengths,
        riskFactors,
        keyInsights,
        dataSource: "database", // Will be 'hybrid' when external enrichment is added
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[FounderAnalysisTool] Error:`, error);
      throw new Error(`Founder analysis failed: ${errorMessage}`);
    }
  },
});
