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
 *
 * Database Integration Notes:
 * - TODO: Log all external searches to track information gaps
 * - TODO: Store search results in cache table to avoid repeated API calls
 * - TODO: Track which companies/topics require frequent external lookup
 * - TODO: Implement smart fallback when database queries return incomplete data
 * - dataSource: Always 'external' (this tool specifically fetches external data)
 */

/**
 * Input schema - defines what parameters the tool accepts
 */
const ExternalSearchInputSchema = z.object({
  query: z
    .string()
    .describe(
      "Search query for external knowledge (e.g., company name, market trend, technology)"
    ),
  provider: z
    .enum(["tavily", "serper"])
    .optional()
    .default("tavily")
    .describe("External search provider to use"),
  searchType: z
    .enum(["general", "news", "company", "market"])
    .optional()
    .default("general")
    .describe("Type of search to optimize results"),
  maxResults: z
    .number()
    .optional()
    .default(5)
    .describe("Maximum number of results to return"),
});

/**
 * Output schema - defines what the tool returns
 */
const ExternalSearchOutputSchema = z.object({
  query: z.string().describe("The original search query"),
  results: z
    .array(
      z.object({
        title: z.string().describe("Title of the search result"),
        url: z.string().describe("URL of the source"),
        snippet: z
          .string()
          .describe("Brief excerpt or description of the content"),
        publishedDate: z
          .string()
          .optional()
          .describe("Publication date if available"),
        source: z.string().describe("Source website or publication"),
        relevanceScore: z
          .number()
          .optional()
          .describe("Relevance score from search provider"),
      })
    )
    .describe("Search results from external provider"),
  summary: z
    .string()
    .optional()
    .describe("AI-generated summary of key findings"),
  provider: z.string().describe("Search provider used"),
  dataSource: z
    .literal("external")
    .describe("Always 'external' for this tool"),
  cached: z.boolean().describe("Whether results were retrieved from cache"),
});

type ExternalSearchInput = z.infer<typeof ExternalSearchInputSchema>;
type ExternalSearchOutput = z.infer<typeof ExternalSearchOutputSchema>;

/**
 * External Search Tool Implementation
 */
export const externalSearchTool = createTool({
  id: "external-search",

  description: `
    Searches the web for current information using external providers like Tavily and Serper.
    Use this tool when information is not available in the internal database.

    Use this tool when:
    - A company is not found in the database
    - Recent news or updates are needed
    - Researching emerging trends or technologies
    - Questions like "What's the latest news about [Company]?"
    - Validating or enriching database information

    Examples:
    - "Search for recent news about Stripe's product launches"
    - "Find information about WebAssembly adoption in enterprises"
    - "What are experts saying about the current state of AI regulation?"
    - "Look up recent funding rounds for companies in the climate tech space"
  `.trim(),

  inputSchema: ExternalSearchInputSchema,
  outputSchema: ExternalSearchOutputSchema,

  execute: async (input: ExternalSearchInput): Promise<ExternalSearchOutput> => {
    try {
      // TODO: Check cache first
      // const cachedResults = await db.query(`
      //   SELECT results, created_at
      //   FROM search_cache
      //   WHERE query_hash = MD5(?)
      //     AND created_at > NOW() - INTERVAL '24 hours'
      //   LIMIT 1
      // `, [input.query]);
      //
      // if (cachedResults.length > 0) {
      //   return {
      //     ...cachedResults[0].results,
      //     cached: true
      //   };
      // }

      let searchResults: any;
      let provider = input.provider || "tavily";

      if (provider === "tavily") {
        // Call actual Tavily service
        const tavilyResults = await searchTavily(input.query);
        searchResults = tavilyResults;
      } else {
        // Mock for serper - would be actual API call
        searchResults = {
          results: [],
        };
      }

      // Transform to standardized format
      const formattedResults = Array.isArray(searchResults?.results)
        ? searchResults.results.slice(0, input.maxResults).map((result: any) => ({
            title: result.title || "No title",
            url: result.url || "",
            snippet: result.content || result.snippet || "",
            publishedDate: result.published_date || undefined,
            source: result.source || new URL(result.url || "").hostname,
            relevanceScore: result.score || undefined,
          }))
        : [
            // Mock fallback data
            {
              title: `Search results for: ${input.query}`,
              url: "https://example.com",
              snippet: "External search results would appear here",
              source: "example.com",
            },
          ];

      // Generate simple summary from results
      const summary =
        formattedResults.length > 0
          ? `Found ${formattedResults.length} relevant results about "${input.query}". ${
              input.searchType === "news"
                ? "Recent news and updates included."
                : ""
            }`
          : `No results found for "${input.query}". Try refining your search query.`;

      // TODO: Store in cache
      // await db.query(`
      //   INSERT INTO search_cache (query_hash, query, results, created_at)
      //   VALUES (MD5(?), ?, ?, NOW())
      // `, [input.query, input.query, JSON.stringify(output)]);

      // TODO: Log search for analytics
      // await db.query(`
      //   INSERT INTO search_log (query, search_type, result_count, created_at)
      //   VALUES (?, ?, ?, NOW())
      // `, [input.query, input.searchType, formattedResults.length]);

      return {
        query: input.query,
        results: formattedResults,
        summary,
        provider,
        dataSource: "external",
        cached: false, // Will be true when cache is implemented
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[ExternalSearchTool] Error:`, error);
      throw new Error(`External search failed: ${errorMessage}`);
    }
  },
});
