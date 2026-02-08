import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { createPEAnalystAgent } from "./agent/agent";

const peAnalystAgent = createPEAnalystAgent();

import { storage } from "./storage";

export const mastra = new Mastra({
  // Register all agents from the registry
  agents: { [peAnalystAgent.name]: peAnalystAgent },
  storage,
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
