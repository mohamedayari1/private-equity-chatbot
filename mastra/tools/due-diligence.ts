import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Due Diligence Checklist Tool
 *
 * Purpose: Generates comprehensive due diligence checklists and tracks completion
 * status across multiple diligence areas (financial, legal, technical, commercial).
 * Essential for PE analysts to ensure thorough investigation before investment.
 *
 * Use Cases:
 * - Generating initial due diligence checklist for a target company
 * - Tracking diligence progress and identifying gaps
 * - Organizing findings by focus area
 * - Identifying red flags and areas requiring deeper investigation
 * - Creating standardized diligence processes
 * - Documenting diligence findings for investment committee
 *
 * Database Integration Notes:
 * - TODO: Store due diligence templates by deal type/sector
 * - TODO: Track checklist item completion status in deals table
 * - TODO: Link findings to specific companies and investment rounds
 * - TODO: Store supporting documents and references
 * - TODO: Track assignees and due dates for each checklist item
 * - TODO: Generate reports on diligence coverage and gaps
 * - TODO: Flag high-risk items based on historical patterns
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const DueDiligenceInputSchema = z.object({
  companyName: z.string().describe("Company under due diligence review"),
  focusArea: z
    .enum([
      "All",
      "Financial",
      "Legal",
      "Technical",
      "Commercial",
      "Team",
      "Market",
    ])
    .optional()
    .default("All")
    .describe("Specific diligence area to focus on"),
  dealStage: z
    .enum(["Preliminary", "Full", "Final"])
    .optional()
    .default("Full")
    .describe("Stage of due diligence (determines depth)"),
  includeRedFlags: z
    .boolean()
    .optional()
    .default(true)
    .describe("Include identified red flags and concerns"),
});

/**
 * Output schema - defines what the tool returns
 */
const DueDiligenceOutputSchema = z.object({
  companyName: z.string().describe("Company being reviewed"),
  dealStage: z.string().describe("Stage of due diligence"),
  generatedDate: z.string().describe("Date checklist was generated"),
  checklist: z
    .array(
      z.object({
        category: z.string().describe("Diligence category"),
        items: z
          .array(
            z.object({
              id: z.string().describe("Unique item identifier"),
              item: z.string().describe("Checklist item description"),
              priority: z
                .enum(["Critical", "High", "Medium", "Low"])
                .describe("Priority level"),
              status: z
                .enum(["Not Started", "In Progress", "Completed", "Blocked"])
                .describe("Completion status"),
              assignee: z
                .string()
                .optional()
                .describe("Person responsible"),
              findings: z
                .string()
                .optional()
                .describe("Key findings or notes"),
              documentsRequired: z
                .array(z.string())
                .describe("Documents needed"),
            })
          )
          .describe("Items in this category"),
      })
    )
    .describe("Structured due diligence checklist"),
  redFlags: z
    .array(
      z.object({
        severity: z
          .enum(["Critical", "High", "Medium", "Low"])
          .describe("Severity of concern"),
        category: z.string().describe("Category where identified"),
        description: z.string().describe("Description of red flag"),
        recommendation: z.string().describe("Recommended action"),
      })
    )
    .optional()
    .describe("Identified red flags and concerns"),
  completionSummary: z
    .object({
      totalItems: z.number().describe("Total checklist items"),
      completed: z.number().describe("Completed items"),
      inProgress: z.number().describe("Items in progress"),
      notStarted: z.number().describe("Items not started"),
      percentComplete: z.number().describe("Completion percentage"),
    })
    .describe("Progress summary"),
  keyRecommendations: z
    .array(z.string())
    .describe("Key recommendations based on findings"),
  dataSource: z
    .enum(["database", "external", "hybrid"])
    .describe("Source of the data"),
});

type DueDiligenceInput = z.infer<typeof DueDiligenceInputSchema>;
type DueDiligenceOutput = z.infer<typeof DueDiligenceOutputSchema>;

/**
 * Due Diligence Checklist Tool Implementation
 */
export const dueDiligenceTool = createTool({
  id: "due-diligence-checklist",

  description: `
    Generates comprehensive due diligence checklists and tracks completion status
    across financial, legal, technical, and commercial areas.

    Use this tool when:
    - Starting due diligence on a target company
    - Questions like "What should I check for [Company] diligence?"
    - Tracking diligence progress and identifying gaps
    - Organizing diligence findings by category
    - Identifying areas requiring deeper investigation

    Examples:
    - "Generate a due diligence checklist for [Company]"
    - "What are the key financial diligence items?"
    - "Show me technical due diligence requirements"
    - "What red flags should I look for?"
  `.trim(),

  inputSchema: DueDiligenceInputSchema,
  outputSchema: DueDiligenceOutputSchema,

  execute: async (input: DueDiligenceInput): Promise<DueDiligenceOutput> => {
    try {
      // TODO: Database Integration
      // const existingDiligence = await db.query(`
      //   SELECT dd.*, ddi.status, ddi.findings
      //   FROM due_diligence dd
      //   LEFT JOIN due_diligence_items ddi ON dd.id = ddi.due_diligence_id
      //   WHERE dd.company_name = ?
      //     AND (? = 'All' OR ddi.category = ?)
      //   ORDER BY ddi.priority DESC, ddi.id
      // `, [input.companyName, input.focusArea, input.focusArea]);
      //
      // const redFlags = await db.query(`
      //   SELECT severity, category, description, recommendation
      //   FROM due_diligence_red_flags
      //   WHERE company_name = ?
      //   ORDER BY FIELD(severity, 'Critical', 'High', 'Medium', 'Low')
      // `, [input.companyName]);

      // Mock comprehensive checklist structure
      const mockChecklist = [
        {
          category: "Financial",
          items: [
            {
              id: "FIN-001",
              item: "Review last 3 years of audited financial statements",
              priority: "Critical" as const,
              status: "Completed" as const,
              assignee: "CFO Team",
              findings: "Clean audits, revenue growth 45% YoY",
              documentsRequired: ["P&L", "Balance Sheet", "Cash Flow Statement"],
            },
            {
              id: "FIN-002",
              item: "Analyze unit economics and contribution margins",
              priority: "Critical" as const,
              status: "In Progress" as const,
              assignee: "Finance Analyst",
              findings: "CAC payback period ~18 months, LTV:CAC ratio 3.2:1",
              documentsRequired: ["Cohort Analysis", "Unit Economics Model"],
            },
            {
              id: "FIN-003",
              item: "Review revenue concentration (top 10 customers)",
              priority: "High" as const,
              status: "Completed" as const,
              assignee: "Finance Analyst",
              findings: "Top 10 customers = 35% of revenue (acceptable risk)",
              documentsRequired: ["Customer Revenue Report"],
            },
            {
              id: "FIN-004",
              item: "Verify accounts receivable aging and collectability",
              priority: "Medium" as const,
              status: "Not Started" as const,
              documentsRequired: ["AR Aging Report", "Bad Debt History"],
            },
          ],
        },
        {
          category: "Legal",
          items: [
            {
              id: "LEG-001",
              item: "Review cap table and all outstanding equity/options",
              priority: "Critical" as const,
              status: "Completed" as const,
              assignee: "Legal Counsel",
              findings: "Clean cap table, 15% reserved for employee options",
              documentsRequired: ["Cap Table", "Stock Option Agreements"],
            },
            {
              id: "LEG-002",
              item: "Verify all IP ownership and patent filings",
              priority: "Critical" as const,
              status: "In Progress" as const,
              assignee: "IP Attorney",
              documentsRequired: ["Patent Filings", "IP Assignment Agreements"],
            },
            {
              id: "LEG-003",
              item: "Review material contracts and customer agreements",
              priority: "High" as const,
              status: "In Progress" as const,
              assignee: "Legal Counsel",
              documentsRequired: ["Contract Repository", "MSAs"],
            },
          ],
        },
        {
          category: "Technical",
          items: [
            {
              id: "TECH-001",
              item: "Assess technology stack and architecture scalability",
              priority: "High" as const,
              status: "Completed" as const,
              assignee: "Tech DD Lead",
              findings: "Modern stack (React, Node.js, AWS), well-architected",
              documentsRequired: ["Architecture Diagrams", "Tech Stack Documentation"],
            },
            {
              id: "TECH-002",
              item: "Review code quality and technical debt",
              priority: "Medium" as const,
              status: "In Progress" as const,
              assignee: "Tech DD Lead",
              documentsRequired: ["Code Quality Reports", "Security Audits"],
            },
            {
              id: "TECH-003",
              item: "Verify data security and compliance (SOC 2, GDPR)",
              priority: "Critical" as const,
              status: "Not Started" as const,
              documentsRequired: ["SOC 2 Report", "Security Policies"],
            },
          ],
        },
        {
          category: "Commercial",
          items: [
            {
              id: "COM-001",
              item: "Validate market size and growth projections",
              priority: "Critical" as const,
              status: "Completed" as const,
              assignee: "Market Analyst",
              findings: "TAM $50B, growing 25% annually, validated by 3rd party",
              documentsRequired: ["Market Research Reports"],
            },
            {
              id: "COM-002",
              item: "Assess competitive positioning and moat",
              priority: "High" as const,
              status: "Completed" as const,
              assignee: "Market Analyst",
              findings: "Strong network effects, 2-3 year tech lead",
              documentsRequired: ["Competitive Analysis"],
            },
            {
              id: "COM-003",
              item: "Conduct customer reference calls (10+ customers)",
              priority: "High" as const,
              status: "In Progress" as const,
              assignee: "BD Team",
              documentsRequired: ["Customer References", "NPS Scores"],
            },
          ],
        },
      ];

      // Filter by focus area if specified
      const filteredChecklist =
        input.focusArea === "All"
          ? mockChecklist
          : mockChecklist.filter((cat) => cat.category === input.focusArea);

      // Mock red flags
      const mockRedFlags = input.includeRedFlags
        ? [
            {
              severity: "High" as const,
              category: "Legal",
              description: "Pending patent dispute with competitor",
              recommendation:
                "Obtain legal opinion on likelihood of adverse outcome and potential liability",
            },
            {
              severity: "Medium" as const,
              category: "Financial",
              description: "Burn rate increased 40% in last quarter",
              recommendation:
                "Review spending drivers and validate path to profitability timeline",
            },
            {
              severity: "Low" as const,
              category: "Team",
              description: "CTO joined only 6 months ago",
              recommendation:
                "Assess technical team stability and knowledge transfer",
            },
          ]
        : undefined;

      // Calculate completion summary
      const allItems = filteredChecklist.flatMap((cat) => cat.items);
      const completed = allItems.filter((i) => i.status === "Completed").length;
      const inProgress = allItems.filter((i) => i.status === "In Progress").length;
      const notStarted = allItems.filter((i) => i.status === "Not Started").length;

      const keyRecommendations = [
        "Prioritize completion of Critical items in Technical and Legal categories",
        "Address High-severity red flag regarding patent dispute before proceeding",
        "Schedule customer reference calls to complete Commercial due diligence",
        "Financial metrics are strong; recommend moving to term sheet discussion",
      ];

      return {
        companyName: input.companyName,
        dealStage: input.dealStage,
        generatedDate: new Date().toISOString().split("T")[0],
        checklist: filteredChecklist,
        redFlags: mockRedFlags,
        completionSummary: {
          totalItems: allItems.length,
          completed,
          inProgress,
          notStarted,
          percentComplete: Math.round((completed / allItems.length) * 100),
        },
        keyRecommendations,
        dataSource: "database", // Will be 'hybrid' when external docs are integrated
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[DueDiligenceTool] Error:`, error);
      throw new Error(`Due diligence checklist generation failed: ${errorMessage}`);
    }
  },
});
