import { createTool } from "@mastra/core";
import { z } from "zod";

export const founderAnalysisTool = createTool({
  label: "Founder Analysis",
  schema: z.object({
    founderName: z.string().describe("Name of the founder"),
    companyName: z.string().optional(),
  }),
  description: "Analyzes founder background, track record, and social graph.",
  execute: async ({ context }) => {
    return {
      message: `Analyzing founder: ${context.founderName}`,
      data: { founder: context.founderName, history: [] },
    };
  },
});
