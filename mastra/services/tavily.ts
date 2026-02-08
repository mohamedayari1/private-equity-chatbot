import { TavilyClient } from "tavily";

/**
 * Tavily Search Service
 *
 * Provides web search functionality using the Tavily API.
 * Tavily is optimized for LLM agents and provides high-quality, relevant search results.
 *
 * @see https://tavily.com
 */

interface TavilySearchOptions {
  query: string;
  searchDepth?: "basic" | "advanced";
  maxResults?: number;
  includeAnswer?: boolean;
  includeImages?: boolean;
}

interface TavilySearchResult {
  url: string;
  title: string;
  content: string;
  score: string;
  raw_content?: string;
}

interface TavilySearchResponse {
  query: string;
  results: TavilySearchResult[];
  answer?: string;
  images?: string[];
  follow_up_questions?: string[];
  response_time: string;
}

/**
 * Search the web using Tavily API
 *
 * @param query - The search query string
 * @param options - Optional search configuration
 * @returns Search results from Tavily
 */
export const searchTavily = async (
  query: string,
  options?: Omit<TavilySearchOptions, "query">,
): Promise<TavilySearchResponse> => {
  // Hardcoded API key for testing (TODO: Move to environment variables)
  const apiKey = "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";

  try {
    // Initialize Tavily client
    const tvly = new TavilyClient({ apiKey });

    // Perform search with options - only text results for now
    const response = await tvly.search({
      query,
      search_depth: options?.searchDepth || "basic",
      max_results: options?.maxResults || 5,
      include_answer: options?.includeAnswer || false,
      include_images: false, // Only text for now as requested
    });

    console.log(
      `[Tavily] Search completed for: "${query}" (${response.response_time})`,
    );

    return response as TavilySearchResponse;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`[Tavily] Search failed for query "${query}":`, error);
    throw new Error(`Tavily search failed: ${errorMessage}`);
  }
};
