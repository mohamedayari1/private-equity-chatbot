import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

const CONNECTION_STRING =
  "postgresql://neondb_owner:npg_w2dmcUyDth8F@ep-proud-truth-aiqwhbwf-pooler.c-4.us-east-1.aws.neon.tech/neondb";

// Extend the global type to include our instances
declare global {
  var pgStore: PostgresStore | undefined;
  var memory: Memory | undefined;
}

// Get or create the PostgresStore instance
function getPgStore(): PostgresStore {
  if (!global.pgStore) {
    global.pgStore = new PostgresStore({
      id: "pg-storage",
      connectionString: CONNECTION_STRING,
      ssl: { rejectUnauthorized: false },
    });
  }
  return global.pgStore;
}

// Get or create the Memory instance
function getMemory(): Memory {
  if (!global.memory) {
    global.memory = new Memory({
      storage: getPgStore(),
      options: {
        lastMessages: 100, // Keep last 100 messages in memory as per original memory config
        generateTitle: true,
      },
    });
  }
  return global.memory;
}

export const storage = getPgStore();
export const memory = getMemory();
