import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { createCalculatorAgent } from "./agent/agent";

const calculatorAgent = createCalculatorAgent();

export const mastra = new Mastra({
  // Register all agents from the registry
  agents: { [calculatorAgent.name]: calculatorAgent },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
    id: "mastra",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
