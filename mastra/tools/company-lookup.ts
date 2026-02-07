import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Company Lookup Tool
 *
 * Purpose: Retrieves comprehensive information about a specific startup or company
 * from the dataset. This is the primary tool for PE analysts to gather detailed
 * company profiles during market mapping and due diligence.
 *
 * Use Cases:
 * - Quick company profile retrieval
 * - Checking if a company exists in the dataset
 * - Gathering founding information, investors, and funding history
 * - Identifying data gaps that require external search
 *
 * Database Integration Notes:
 * - TODO: Query startups table by company name (consider fuzzy matching)
 * - TODO: Join with investments table to get funding rounds and amounts
 * - TODO: Join with investors table to get investor details
 * - TODO: Join with founders table to get founder information
 * - TODO: Add caching layer for frequently accessed companies
 * - TODO: Implement external fallback when company not found in database
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const CompanyLookupInputSchema = z.object({
  companyName: z
    .string()
    .describe("Name of the company/startup to look up"),
  includeFinancials: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether to include detailed funding information"),
});

/**
 * Output schema - defines what the tool returns
 */
const CompanyLookupOutputSchema = z.object({
  found: z.boolean().describe("Whether the company was found in the dataset"),
  company: z
    .object({
      name: z.string().describe("Official company name"),
      subVertical: z.string().optional().describe("Sub-sector classification"),
      industry: z.string().optional().describe("Primary industry/vertical"),
      city: z.string().optional().describe("Headquarters city"),
      foundingDate: z.string().optional().describe("Date company was founded"),
      founders: z
        .array(z.string())
        .optional()
        .describe("List of founder names"),
      totalRaised: z
        .string()
        .optional()
        .describe("Total amount raised in USD"),
      lastInvestmentStage: z
        .string()
        .optional()
        .describe("Most recent investment stage"),
      investors: z
        .array(
          z.object({
            name: z.string().describe("Investor name"),
            stage: z.string().describe("Stage at which they invested"),
            amount: z.string().optional().describe("Investment amount"),
          })
        )
        .optional()
        .describe("List of investors"),
    })
    .optional()
    .describe("Company profile data"),
  dataSource: z
    .enum(["database", "external", "not_found"])
    .describe("Source of the data"),
  externalSearchRequired: z
    .boolean()
    .describe("Whether external search is needed for missing data"),
  missingFields: z
    .array(z.string())
    .optional()
    .describe("Fields that are missing and may need external lookup"),
});

type CompanyLookupInput = z.infer<typeof CompanyLookupInputSchema>;
type CompanyLookupOutput = z.infer<typeof CompanyLookupOutputSchema>;

/**
 * Company Lookup Tool Implementation
 */
export const companyLookupTool = createTool({
  id: "company-lookup",

  description: `
    Retrieves detailed information about a specific company/startup from the dataset.
    This is the PRIMARY tool for gathering company profiles.

    Use this tool when:
    - An analyst asks "Tell me about [Company]"
    - Looking up basic company information
    - Verifying if a company exists in the dataset
    - Gathering data before deeper analysis

    Examples:
    - "Look up Stripe"
    - "What do we know about Airbnb?"
    - "Find information on Notion"
    - "Tell me about the founders of Figma"
  `.trim(),

  inputSchema: CompanyLookupInputSchema,
  outputSchema: CompanyLookupOutputSchema,

  execute: async (input: CompanyLookupInput): Promise<CompanyLookupOutput> => {
    try {
      // TODO: Database Integration
      // const company = await db.query(`
      //   SELECT
      //     s.name, s.sub_vertical, s.industry, s.city, s.founding_date,
      //     ARRAY_AGG(DISTINCT f.name) as founders,
      //     SUM(i.amount) as total_raised,
      //     MAX(i.stage) as last_stage
      //   FROM startups s
      //   LEFT JOIN founders f ON s.id = f.startup_id
      //   LEFT JOIN investments i ON s.id = i.startup_id
      //   WHERE LOWER(s.name) = LOWER(?)
      //   GROUP BY s.id
      // `, [input.companyName]);

      // Mock: Simulate company found in database
      const companyFound = Math.random() > 0.3; // 70% found rate

      if (companyFound) {
        const mockCompany = {
          name: input.companyName,
          subVertical: "B2B SaaS",
          industry: "Enterprise Software",
          city: "San Francisco",
          foundingDate: "2019-03-15",
          founders: ["John Doe", "Jane Smith"],
          totalRaised: "$25M",
          lastInvestmentStage: "Series B",
          investors: [
            {
              name: "Sequoia Capital",
              stage: "Series A",
              amount: "$10M",
            },
            {
              name: "Andreessen Horowitz",
              stage: "Series B",
              amount: "$15M",
            },
          ],
        };

        const missingFields: string[] = [];
        if (!mockCompany.founders || mockCompany.founders.length === 0) {
          missingFields.push("founders");
        }
        if (!mockCompany.totalRaised) {
          missingFields.push("funding_amount");
        }

        return {
          found: true,
          company: mockCompany,
          dataSource: "database",
          externalSearchRequired: missingFields.length > 0,
          missingFields:
            missingFields.length > 0 ? missingFields : undefined,
        };
      } else {
        // Company not found in database - needs external search
        return {
          found: false,
          dataSource: "not_found",
          externalSearchRequired: true,
          company: undefined,
          missingFields: ["all"],
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[CompanyLookupTool] Error:`, error);
      throw new Error(`Company lookup failed: ${errorMessage}`);
    }
  },
});
