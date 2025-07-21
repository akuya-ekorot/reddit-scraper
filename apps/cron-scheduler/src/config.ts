import dotenv from "dotenv";

dotenv.config();

export const config = {
  mastraApiUrl: process.env.MASTRA_API_URL || "http://localhost:4111",
  workflowId: process.env.WORKFLOW_ID || "reddit-workflow",
  cronSchedule: process.env.CRON_SCHEDULE || "0 0 * * *", // Daily at midnight
  logLevel: process.env.LOG_LEVEL || "info",
  keywords: process.env.WORKFLOW_KEYWORDS
    ? process.env.WORKFLOW_KEYWORDS.split(",").map((word) => ({
        keyword: word.trim(),
      }))
    : [
        { keyword: "langchain" },
        { keyword: "langgraph" },
        {
          keyword: "crewai",
        },
        { keyword: "mastra" },
      ],
} as const;

export function validateConfig() {
	const required = ["MASTRA_API_URL", "WORKFLOW_ID"];
	const missing = required.filter((key) => !process.env[key]);

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(", ")}`,
		);
	}
}
