import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Input schema - defines what parameters the tool accepts
 */
const CalculatorInputSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The mathematical operation to perform"),
  a: z.number().describe("First number"),
  b: z.number().describe("Second number"),
});

/**
 * Output schema - defines what the tool returns
 */
const CalculatorOutputSchema = z.object({
  result: z.number().describe("The result of the calculation"),
  operation: z.string().describe("The operation that was performed"),
});

type CalculatorInput = z.infer<typeof CalculatorInputSchema>;

/**
 * Calculator Tool
 * A simple tool that performs basic mathematical operations
 */
export const calculatorTool = createTool({
  id: "calculator",

  description: `
    Performs basic mathematical operations (add, subtract, multiply, divide).
    Use this tool when the user asks for calculations.
    
    Examples:
    - "What is 5 + 3?" → use operation: "add", a: 5, b: 3
    - "Calculate 10 divided by 2" → use operation: "divide", a: 10, b: 2
  `.trim(),

  inputSchema: CalculatorInputSchema,
  outputSchema: CalculatorOutputSchema,

  execute: async (input: CalculatorInput) => {
    try {
      let result: number;

      switch (input.operation) {
        case "add":
          result = input.a + input.b;
          break;
        case "subtract":
          result = input.a - input.b;
          break;
        case "multiply":
          result = input.a * input.b;
          break;
        case "divide":
          if (input.b === 0) {
            throw new Error("Cannot divide by zero");
          }
          result = input.a / input.b;
          break;
      }

      return {
        result,
        operation: input.operation,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(`[CalculatorTool] Error:`, error);
      throw new Error(`Calculation failed: ${errorMessage}`);
    }
  },
});
