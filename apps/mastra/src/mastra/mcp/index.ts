import { MCPClient } from "@mastra/mcp";

if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_CLIENT_SECRET) {
	throw new Error("Reddit env vars missing");
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
				SLACK_BOT_TOKEN: "",
				SLACK_TEAM_ID: "T06CB4A5FT9",
				SLACK_CHANNEL_IDS: "C0961N79V6K",
			},
		},
	},
});
