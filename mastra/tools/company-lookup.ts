import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getStartupProfile } from "../db/queries/pe-queries";

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
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const CompanyLookupInputSchema = z.object({
  companyName: z.string().describe("Name of the company/startup to look up"),
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
      totalRaised: z.string().optional().describe("Total amount raised in USD"),
      lastInvestmentStage: z
        .string()
        .optional()
        .describe("Most recent investment stage"),
      investors: z
        .array(z.string())
        .optional()
        .describe("List of investor names"),
      fundingRoundsCount: z
        .number()
        .optional()
        .describe("Number of funding rounds"),
    })
    .optional()
    .describe("Company profile data"),
  dataSource: z
    .enum(["database", "external", "not_found"])
    .describe("Source of the data"),
  externalSearchRequired: z
    .boolean()
    .describe("Whether external search is needed for missing data"),
  matchedCompanies: z
    .array(z.string())
    .optional()
    .describe("Other companies matching the search if multiple found"),
});

type CompanyLookupInput = z.infer<typeof CompanyLookupInputSchema>;
type CompanyLookupOutput = z.infer<typeof CompanyLookupOutputSchema>;

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
      console.log(`\n${"=".repeat(60)}`);
      console.log(`🔧 [CompanyLookupTool] STARTED`);
      console.log(
        `📥 Input: companyName="${input.companyName}", includeFinancials=${input.includeFinancials}`,
      );
      console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
      console.log(`${"=".repeat(60)}\n`);

      // Query the database for startup profile
      const results = await getStartupProfile(input.companyName);

      if (!results || results.length === 0) {
        console.log(
          `[CompanyLookupTool] Company not found: "${input.companyName}"`,
        );
        return {
          found: false,
          dataSource: "not_found",
          externalSearchRequired: true,
          company: undefined,
        };
      }

      // Take the first (best) match
      const company = results[0] as any;

      // Parse arrays from PostgreSQL (they come as strings like "{item1,item2}")
      const parseArray = (arr: any): string[] => {
        if (!arr) return [];
        if (Array.isArray(arr)) return arr.filter(Boolean);
        if (typeof arr === "string") {
          // Handle PostgreSQL array format
          const cleaned = arr.replace(/[{}]/g, "");
          return cleaned
            ? cleaned
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [];
        }
        return [];
      };

      const foundersArray = parseArray(company.founders);
      const investorsArray = parseArray(company.investors);

      // Determine if external search might be beneficial
      const missingCriticalData =
        foundersArray.length === 0 || !company.industry || !company.city;

      // Format the response
      const formattedCompany = {
        name: company.name,
        subVertical: company.sub_vertical || undefined,
        industry: company.industry || undefined,
        city: company.city || undefined,
        foundingDate: company.founding_date
          ? new Date(company.founding_date).toISOString().split("T")[0]
          : undefined,
        founders: foundersArray.length > 0 ? foundersArray : undefined,
        totalRaised: formatUSD(company.total_raised_usd),
        lastInvestmentStage: company.last_investment_stage || undefined,
        investors: investorsArray.length > 0 ? investorsArray : undefined,
        fundingRoundsCount: parseInt(company.funding_rounds_count) || 0,
      };

      // If multiple companies matched, include them
      const matchedCompanies =
        results.length > 1
          ? results.slice(1).map((r: any) => r.name)
          : undefined;

      console.log(
        `[CompanyLookupTool] Found company: "${company.name}" with ${formattedCompany.fundingRoundsCount} funding rounds`,
      );

      return {
        found: true,
        company: formattedCompany,
        dataSource: "database",
        externalSearchRequired: missingCriticalData,
        matchedCompanies,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[CompanyLookupTool] Error:`, error);
      throw new Error(`Company lookup failed: ${errorMessage}`);
    }
  },
});
