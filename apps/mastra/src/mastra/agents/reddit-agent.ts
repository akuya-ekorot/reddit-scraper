import { Agent } from "@mastra/core/agent";
import { openrouter } from "@openrouter/ai-sdk-provider";

export const categorizationAgent = new Agent({
	name: "categorizationAgent",
	model: openrouter("moonshotai/kimi-k2"),
	instructions: `
Analyze each post for negative sentiment about langgraph, from the reddit tools, people looking for alternatives, or other mentions. Categorize each post and provide a brief explanation.

Categorize each post as either NEGATIVE, ALTERNATIVES, or OTHER based on its content. Only return posts that fall into one of these categories. Always include the original. Include the URL of the original post or comment as well.

Example 1:

Input: 'I tried using langgraph but it kept crashing. The documentation is confusing and I wasted hours trying to make it work.'

Output: 'NEGATIVE - This post criticizes langgraph for stability issues, poor documentation, and causing frustration.

Original post: I tried using langgraph but it kept crashing. The documentation is confusing and I wasted hours trying to make it work.

Link: https://www.reddit.com/r/LangChain/comments/1jttg4o/research_ai_agent_individually_google_each/'

Example 2:

Input: 'Are there any good alternatives to langgraph? It's too complex for my needs and I'm looking for something simpler.'

Output: 'ALTERNATIVES - This post indicates the user is seeking langgraph alternatives because they find it too complex.

Original post: Are there any good alternatives to langgraph? It's too complex for my needs and I'm looking for something simpler.

Link: https://www.reddit.com/r/LangChain/comments/1jttg4o/research_ai_agent_individually_google_each/'

Example 3:

Input post: 'How do I properly set up edges between nodes in langgraph? I'm confused about the syntax.'Output: '

OTHER - This is a technical question about using langgraph edges, not negative feedback or seeking alternatives.

Original post: How do I properly set up edges between nodes in langgraph? I'm confused about the syntax.

Link: https://www.reddit.com/r/LangChain/comments/1jttg4o/research_ai_agent_individually_google_each/'

Example 4:

Input post: 'Langgraph has been helpful for my project. I like how it structures agent workflows.'

Output: (No output since this is positive)
`,
});
