import { createTool } from "@mastra/core";
import { z } from "zod";
import { searchTavily } from "../services/tavily";

export const externalSearchTool = createTool({
  label: "External Search",
  schema: z.object({
    query: z.string().describe("Search query for external knowledge"),
    provider: z.enum(["tavily", "serper"]).optional().default("tavily"),
  }),
  description:
    "Searches the web for current information using external providers.",
  execute: async ({ context }) => {
    // Basic integration with the services we created
    if (context.provider === "tavily") {
      const results = await searchTavily(context.query);
      return { source: "tavily", data: results };
    } else {
      // Mock for serper or call imported function if integrated
      return { source: "serper", data: { results: [] } };
    }
  },
});
