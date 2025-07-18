/**
 * Configuration interface and default values for the Reddit Scraper workflow
 */

/**
 * Configuration interface for the Reddit Scraper workflow
 */
export interface RedditScraperConfig {
	/**
	 * List of keywords to search for on Reddit
	 */
	keywords: string[];

	/**
	 * List of competitor names to track
	 */
	competitors: string[];

	/**
	 * Time range in hours for searching recent content (default: 24 hours)
	 */
	timeRangeHours: number;

	/**
	 * Slack webhook URL for sending notifications
	 */
	slackWebhookUrl: string;

	/**
	 * Slack channel to send notifications to
	 */
	slackChannel: string;

	/**
	 * Score threshold for tagging team members (posts with score above this will tag team members)
	 */
	importantThreshold: number;

	/**
	 * List of Slack user IDs to tag for important items
	 */
	teamMembers: string[];
}

/**
 * Default configuration for the Reddit Scraper workflow
 */
export const DEFAULT_REDDIT_SCRAPER_CONFIG: RedditScraperConfig = {
	keywords: [
		"langgraph",
		"langchain",
		"n8n",
		"crewAI",
		"autogen",
		"llamaindex",
		"mastra",
		"agent workflow",
		"AI agent framework",
	],
	competitors: [
		"langgraph",
		"langchain",
		"n8n",
		"crewAI",
		"autogen",
		"llamaindex",
	],
	timeRangeHours: 24,
	slackWebhookUrl: "",
	slackChannel: "#reddit-monitoring",
	importantThreshold: 50, // Posts with score > 50 will tag team members
	teamMembers: [],
};
