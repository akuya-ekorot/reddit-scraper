import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import {
	categorizationAgent,
	redditSearchAgent,
	reportGenerationAgent,
	slackNotificationAgent,
} from "../agents/reddit-agent";

const SearchRedditInputSchema = z.object({ keyword: z.string() });
const SearchRedditOutputSchema = z.object({
	response: z.string(),
});

const searchReddit = createStep(redditSearchAgent);
const categorizePosts = createStep(categorizationAgent);
const generateReport = createStep(reportGenerationAgent);
const sendSlackNotification = createStep(slackNotificationAgent);

export const redditWorkflow = createWorkflow({
	id: "redditWorkflow",
	inputSchema: SearchRedditInputSchema.array(),
	outputSchema: SearchRedditOutputSchema.array(),
})
	.map(({ inputData }) => {
		return new Promise((resolve) =>
			resolve(
				inputData.map(({ keyword }) => ({
					prompt: `Search Reddit for this keyword: ${keyword}.
Provide all the necessary details of the posts and make sure to include the links, score, title and description of the posts
Search for posts made in the past 24 hours.
`,
				})),
			),
		);
	})
	.foreach(searchReddit, { concurrency: 5 })
	.map(({ inputData }) => {
		return new Promise((resolve) =>
			resolve(inputData.map(({ text }) => ({ prompt: text }))),
		);
	})
	.foreach(categorizePosts, { concurrency: 5 })
	.map(({ inputData }) => {
		return new Promise((resolve) =>
			resolve({
				prompt: `Generate a comprehensive report from the following categorized Reddit posts:

${inputData.map(({ text }) => text).join("\n\n---\n\n")}

Create a structured analysis report that organizes these findings by keyword and category, providing actionable insights and strategic recommendations.`,
			}),
		);
	})
	.then(generateReport)
	.map(({ inputData }) => {
		return new Promise((resolve) =>
			resolve({
				prompt: `Send the following Reddit analysis report to the Slack channel:

${inputData.text}

Format it appropriately for Slack with proper markdown and include today's date in the header.`,
			}),
		);
	})
	.then(sendSlackNotification)
	.commit();
