import {
	DEFAULT_REDDIT_SCRAPER_CONFIG,
	type RedditScraperConfig,
} from "./reddit-scraper-config";

/**
 * Environment variable names for Reddit Scraper configuration
 */
export const ENV_VARS = {
	KEYWORDS: "REDDIT_SCRAPER_KEYWORDS",
	COMPETITORS: "REDDIT_SCRAPER_COMPETITORS",
	TIME_RANGE_HOURS: "REDDIT_SCRAPER_TIME_RANGE_HOURS",
	SLACK_WEBHOOK_URL: "REDDIT_SCRAPER_SLACK_WEBHOOK_URL",
	SLACK_CHANNEL: "REDDIT_SCRAPER_SLACK_CHANNEL",
	IMPORTANT_THRESHOLD: "REDDIT_SCRAPER_IMPORTANT_THRESHOLD",
	TEAM_MEMBERS: "REDDIT_SCRAPER_TEAM_MEMBERS",
	REDDIT_CLIENT_ID: "REDDIT_CLIENT_ID",
	REDDIT_CLIENT_SECRET: "REDDIT_CLIENT_SECRET",
};

/**
 * Loads configuration from environment variables, falling back to default values
 * @returns The loaded configuration
 */
export function loadRedditScraperConfig(): RedditScraperConfig {
	return {
		keywords:
			parseArrayFromEnv(ENV_VARS.KEYWORDS) ||
			DEFAULT_REDDIT_SCRAPER_CONFIG.keywords,
		competitors:
			parseArrayFromEnv(ENV_VARS.COMPETITORS) ||
			DEFAULT_REDDIT_SCRAPER_CONFIG.competitors,
		timeRangeHours:
			parseInt(process.env[ENV_VARS.TIME_RANGE_HOURS] || "", 10) ||
			DEFAULT_REDDIT_SCRAPER_CONFIG.timeRangeHours,
		slackWebhookUrl:
			process.env[ENV_VARS.SLACK_WEBHOOK_URL] ||
			DEFAULT_REDDIT_SCRAPER_CONFIG.slackWebhookUrl,
		slackChannel:
			process.env[ENV_VARS.SLACK_CHANNEL] ||
			DEFAULT_REDDIT_SCRAPER_CONFIG.slackChannel,
		importantThreshold:
			parseInt(process.env[ENV_VARS.IMPORTANT_THRESHOLD] || "", 10) ||
			DEFAULT_REDDIT_SCRAPER_CONFIG.importantThreshold,
		teamMembers:
			parseArrayFromEnv(ENV_VARS.TEAM_MEMBERS) ||
			DEFAULT_REDDIT_SCRAPER_CONFIG.teamMembers,
	};
}

/**
 * Validates the Reddit Scraper configuration
 * @param config The configuration to validate
 * @returns Validation result with errors if any
 */
export function validateRedditScraperConfig(config: RedditScraperConfig): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!config.keywords || config.keywords.length === 0) {
		errors.push("Keywords list cannot be empty");
	}

	if (!config.competitors || config.competitors.length === 0) {
		errors.push("Competitors list cannot be empty");
	}

	if (config.timeRangeHours <= 0) {
		errors.push("Time range must be greater than 0");
	}

	// Slack webhook URL is optional, but if provided, it should be a valid URL
	if (config.slackWebhookUrl && !isValidUrl(config.slackWebhookUrl)) {
		errors.push("Invalid Slack webhook URL");
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

/**
 * Merges runtime configuration overrides with the base configuration
 * @param baseConfig The base configuration
 * @param overrides Configuration overrides to apply
 * @returns The merged configuration
 */
export function mergeConfigurations(
	baseConfig: RedditScraperConfig,
	overrides?: Partial<RedditScraperConfig>,
): RedditScraperConfig {
	if (!overrides) {
		return baseConfig;
	}

	return {
		...baseConfig,
		...overrides,
		// Handle arrays specially to avoid partial overwrites
		keywords: overrides.keywords || baseConfig.keywords,
		competitors: overrides.competitors || baseConfig.competitors,
		teamMembers: overrides.teamMembers || baseConfig.teamMembers,
	};
}

/**
 * Gets the Reddit Scraper configuration with optional runtime overrides
 * @param overrides Optional runtime configuration overrides
 * @returns The final configuration
 */
export function getRedditScraperConfig(
	overrides?: Partial<RedditScraperConfig>,
): RedditScraperConfig {
	const envConfig = loadRedditScraperConfig();
	const finalConfig = mergeConfigurations(envConfig, overrides);

	const validation = validateRedditScraperConfig(finalConfig);
	if (!validation.isValid) {
		console.warn(
			"Reddit Scraper configuration validation failed:",
			validation.errors,
		);
	}

	return finalConfig;
}

/**
 * Helper function to parse comma-separated array from environment variable
 * @param envVarName The environment variable name
 * @returns Array of strings or undefined if not found
 */
function parseArrayFromEnv(envVarName: string): string[] | undefined {
	const value = process.env[envVarName];
	if (!value) {
		return undefined;
	}
	return value.split(",").map((item) => item.trim());
}

/**
 * Helper function to validate URLs
 * @param url The URL to validate
 * @returns Whether the URL is valid
 */
function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}
