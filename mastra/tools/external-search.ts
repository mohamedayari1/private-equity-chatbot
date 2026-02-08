import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { searchTavily } from "../services/tavily";

/**
 * External Search Tool
 *
 * Purpose: Retrieves real-time information from external sources (web, news, APIs)
 * when data is not available in the internal database. Essential for PE analysts
 * who need current market information, recent company news, or emerging trends.
 *
 * Use Cases:
 * - Finding information about companies not in the database
 * - Getting recent news about a company or market
 * - Researching emerging technologies or business models
 * - Validating or enriching existing database information
 * - Competitive intelligence on private companies
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const ExternalSearchInputSchema = z.object({
  query: z
    .string()
    .describe(
      "Search query for external knowledge (e.g., company name, market trend, technology)",
    ),
  maxResults: z
    .number()
    .optional()
    .default(5)
    .describe("Maximum number of results to return"),
});

/**
 * Output schema - simplified to match Tavily's response
 */
const ExternalSearchOutputSchema = z.object({
  query: z.string().describe("The search query that was executed"),
  results: z
    .array(
      z.object({
        title: z.string().describe("Title of the search result"),
        url: z.string().describe("URL of the source"),
        content: z.string().describe("Main content/snippet from the page"),
        score: z.number().describe("Relevance score (0-1)"),
      }),
    )
    .describe("Array of search results from Tavily"),
  resultCount: z.number().describe("Total number of results returned"),
});

type ExternalSearchInput = z.infer<typeof ExternalSearchInputSchema>;
type ExternalSearchOutput = z.infer<typeof ExternalSearchOutputSchema>;

/**
 * External Search Tool Implementation
 */
export const externalSearchTool = createTool({
  id: "external-search",

  description: `
    Searches the web for current information using Tavily search API.
    Use this tool when information is not available in your knowledge or you need current data.

    Use this tool when:
    - A company or topic is not in your knowledge base
    - Recent news or updates are needed
    - Researching emerging trends or technologies
    - Questions like "What's the latest news about [Company]?"
    - Validating or enriching information

    Examples:
    - "Search for recent news about Stripe's product launches"
    - "Find information about WebAssembly adoption in enterprises"
    - "What are experts saying about the current state of AI regulation?"
    - "Look up recent funding rounds for companies in the climate tech space"
  `.trim(),

  inputSchema: ExternalSearchInputSchema,
  outputSchema: ExternalSearchOutputSchema,

  execute: async (
    input: ExternalSearchInput,
  ): Promise<ExternalSearchOutput> => {
    try {
      console.log(
        `[ExternalSearchTool] Executing search for: "${input.query}"`,
      );

      // Call Tavily service
      const tavilyResults = await searchTavily(input.query, {
        maxResults: input.maxResults,
      });

      console.log(
        `[ExternalSearchTool] Tavily returned ${tavilyResults.results.length} results`,
      );

      // Transform Tavily results to match our schema
      const results = tavilyResults.results.map((result) => ({
        title: result.title,
        url: result.url,
        content: result.content,
        score: parseFloat(result.score),
      }));

      console.log(
        `[ExternalSearchTool] Returning ${results.length} formatted results`,
      );

      return {
        query: input.query,
        results,
        resultCount: results.length,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[ExternalSearchTool] Error:`, error);
      throw new Error(`External search failed: ${errorMessage}`);
    }
  },
});
