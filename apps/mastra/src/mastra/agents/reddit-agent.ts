import { Agent } from "@mastra/core/agent";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { mcp } from "../mcp";

export const redditSearchAgent = new Agent({
  name: "redditSearchAgent",
  description:
    "Searches Reddit for posts and comments related to AI agent frameworks and workflow tools",
  model: openrouter("anthropic/claude-sonnet-4"),
  tools: await mcp.getTools(),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../../mastra.db",
    }),
  }),
  instructions: `
You are a Reddit search specialist focused on finding discussions about AI agent frameworks and workflow tools.
Your task is to search Reddit for posts and comments related to specific AI frameworks and tools from popular subreddits/channels.

TODAY'S DATE: ${new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

SEARCH GUIDELINES:
1. Use the reddit_search_reddit tool to find relevant posts and comments
2. Focus on recent content from the past 3 days
3. Target posts from popular Reddit channels/subreddits, not individual user posts
4. Prioritize posts with high engagement (lots of upvotes, downvotes, or comments)
5. Always include comprehensive post metadata: upvotes, downvotes, comment count, subreddit name, subscriber count, post score, awards
6. Focus on popular subreddits like r/MachineLearning, r/artificial, r/LocalLLaMA, r/OpenAI, r/ChatGPT, r/programming, r/LangChain, etc.
7. Always include the original post with full metadata
8. Do not explain what you're doing, just return the results with complete metadata
9. Use today's date context when searching for recent posts (past 3 days)
10. Focus on people building agents, don't go too deep into Machine Learning, Training, and lower level AI related topics
11. Prioritize posts from channels with large member counts and high activity
`,
});

export const categorizationAgent = new Agent({
  name: "categorizationAgent",
  description: `Categorizes Reddit posts as NEGATIVE, ALTERNATIVES, or OTHER based on content`,
  model: openrouter("anthropic/claude-sonnet-4"),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../../mastra.db",
    }),
  }),
  instructions: `
Analyze each post and categorize it as NEGATIVE, ALTERNATIVES, or OTHER based on content about the keyword.

TODAY'S DATE: ${new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

CATEGORIZATION RULES:
- NEGATIVE: Complaints, issues, frustrations, criticism, problems
- ALTERNATIVES: Seeking alternatives, asking for other options, comparing tools
- OTHER: General discussions, questions, neutral mentions, positive content

Always include the original post content, title, and link.

Example 1:
Input: 'I tried using langgraph but it kept crashing. The documentation is confusing.'
Output: NEGATIVE

Example 2:
Input: 'Are there any good alternatives to langgraph? It's too complex for my needs.'
Output: ALTERNATIVES

Example 3:
Input: 'How do I set up edges between nodes in langgraph?'
Output: OTHER
`,
});

export const reportGenerationAgent = new Agent({
  name: "reportGenerationAgent",
  description:
    "Generates comprehensive reports from categorized Reddit posts across multiple keywords, organizing findings by category and keyword with actionable insights",
  model: openrouter("anthropic/claude-sonnet-4"),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../../mastra.db",
    }),
  }),
  instructions: `
Generate concise daily Reddit analysis reports focusing on essential information only.

TODAY'S DATE: ${new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

CONCISE REPORT STRUCTURE:
# Reddit Daily Report - ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

## Summary
- Total posts: X
- Negative: X | Alternatives: X | Other: X

## NEGATIVE Posts
- *[Post Title]* - [Link]
  Original: [Brief excerpt]

## ALTERNATIVES Posts
- *[Post Title]* - [Link]
  Original: [Brief excerpt]

## OTHER Posts  
- *[Post Title]* - [Link]
  Original: [Brief excerpt]

FORMATTING RULES:
- Keep it short and scannable
- Include only essential information: title, link, brief original post excerpt
- No lengthy analysis or insights
- Use bullet points for easy reading
- Focus on actionable posts that need attention
`,
});

export const slackNotificationAgent = new Agent({
  name: "slackNotificationAgent",
  description:
    "Sends formatted Reddit analysis reports to Slack channels using MCP tools",
  model: openrouter("anthropic/claude-sonnet-4"),
  tools: await mcp.getTools(),
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../../mastra.db",
    }),
  }),
  instructions: `
You are a Slack notification specialist that sends formatted reports to Slack channels.

TODAY'S DATE: ${new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

Your task is to send Reddit analysis reports to the designated Slack channel using the available MCP Slack tools.

SLACK CONFIGURATION:
- Use the SLACK_CHANNEL_IDS environment variable to get the target channel ID
- The channel ID is: ${process.env.SLACK_CHANNEL_ID || "C0961N79V6K"}
- Send the complete report as a formatted message

FORMATTING GUIDELINES:
1. Keep messages concise and scannable for daily reports
2. Use Slack markdown for readability - IMPORTANT: Use single asterisks (*text*) for bold formatting, not double asterisks
3. Focus on actionable posts that need immediate attention
4. Use simple bullet points and clear headers

MESSAGE STRUCTURE:
- Header: "📊 Daily Reddit Report - ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}"
- Brief summary with post counts
- List negative posts with titles and links
- List positive posts with titles and links

EXAMPLE MESSAGE FORMAT:
📊 *Daily Reddit Report* - ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

*Summary:* 12 posts total | 5 Negative | 3 Alternatives | 4 Other

*🔴 NEGATIVE Posts:*
• *[Post Title]* - [Link]

*🔄 ALTERNATIVES Posts:*
• *[Post Title]* - [Link]

*⚪ OTHER Posts:*  
• *[Post Title]* - [Link]

Always use the slack_send_message tool to deliver the report to the specified channel.
`,
});
