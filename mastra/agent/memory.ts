import { Memory } from "@mastra/memory";

/**
 * Conversation memory that keeps track of the last 100 messages
 * This allows the agent to maintain context across multiple interactions
 */
const conversationMemory = new Memory({
  options: {
    lastMessages: 100, // Keep last 100 messages in memory
  },
});

export default conversationMemory;