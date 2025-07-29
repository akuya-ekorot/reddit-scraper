import { MCPClient } from "@mastra/mcp";

if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
  throw new Error("Reddit env vars missing");
}

if (
  !process.env.SLACK_BOT_TOKEN ||
  !process.env.SLACK_TEAM_ID ||
  !process.env.SLACK_CHANNEL_IDS
) {
  throw new Error("Slack environment variables are required");
}

export const mcp = new MCPClient({
  servers: {
    reddit: {
      command: "npx",
      args: ["-y", "reddit-mcp-server"],
      env: {
        REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
        REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
      },
    },
    slack: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-slack"],
      env: {
        SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
        SLACK_TEAM_ID: process.env.SLACK_TEAM_ID,
        SLACK_CHANNEL_IDS: process.env.SLACK_CHANNEL_IDS,
      },
    },
  },
});
