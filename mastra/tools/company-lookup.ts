import { createTool } from "@mastra/core";
import { z } from "zod";

export const companyLookupTool = createTool({
  label: "Company Lookup",
  schema: z.object({
    companyName: z.string().describe("Name of the company to look up"),
  }),
  description: "Looks up detailed information about a specific company.",
  execute: async ({ context }) => {
    return {
      message: `Looking up company: ${context.companyName}`,
      data: {
        name: context.companyName,
        industry: "Unknown",
        founded: "Unknown",
      },
    };
  },
});
