import { createTool } from "@mastra/core";
import { z } from "zod";

export const dueDiligenceTool = createTool({
  label: "Due Diligence Checklist",
  schema: z.object({
    companyName: z.string().describe("Company under due diligence"),
    focusArea: z
      .string()
      .optional()
      .describe('Specific area like "Legal", "Financial", etc.'),
  }),
  description:
    "Generates or processes a due diligence checklist for a company.",
  execute: async ({ context }) => {
    return {
      message: `Due diligence context for ${context.companyName}`,
      data: { checklist: [] },
    };
  },
});
