# Requirements Document

## Introduction

This feature will create a Reddit scraping workflow that monitors discussions about competitor AI agent and workflow frameworks similar to Mastra. The system will run daily to collect and analyze the latest posts and comments from Reddit that mention specific keywords like langgraph, langchain, n8n, crewAI, etc. The collected data will be categorized, analyzed for sentiment, and compiled into reports that can be sent to team members via Slack.

## Requirements

### Requirement 1: Reddit Data Collection

**User Story:** As a product manager, I want to collect Reddit posts and comments mentioning competitor AI frameworks, so that I can stay informed about market trends and user sentiment.

#### Acceptance Criteria

1. WHEN the workflow runs THEN the system SHALL search Reddit for posts and comments containing predefined keywords.
2. WHEN searching Reddit THEN the system SHALL prioritize the newest posts and comments from the past 24 hours.
3. WHEN collecting data THEN the system SHALL store the post/comment text, URL, author, subreddit, timestamp, and score.
4. WHEN searching Reddit THEN the system SHALL use a configurable list of keywords including "langgraph", "langchain", "n8n", "crewAI", and other relevant competitors.
5. WHEN the Reddit API rate limit is reached THEN the system SHALL handle the error gracefully and resume when possible.
6. WHEN no results are found THEN the system SHALL log this information and continue the workflow.

### Requirement 2: Content Analysis and Categorization

**User Story:** As a product analyst, I want the collected Reddit content to be categorized and analyzed for sentiment, so that I can quickly identify trends and issues.

#### Acceptance Criteria

1. WHEN posts are collected THEN the system SHALL categorize each post as "NEGATIVE", "ALTERNATIVES", or "OTHER".
2. WHEN categorizing posts THEN the system SHALL analyze the sentiment of the content related to the competitor frameworks.
3. WHEN a post mentions users looking for alternatives THEN the system SHALL flag it as "ALTERNATIVES".
4. WHEN a post contains negative sentiment about a competitor THEN the system SHALL flag it as "NEGATIVE".
5. WHEN a post mentions competitors but doesn't fit the above categories THEN the system SHALL flag it as "OTHER".
6. WHEN categorizing posts THEN the system SHALL include a brief explanation of why the post was assigned to a particular category.

### Requirement 3: Report Generation

**User Story:** As a team member, I want to receive a daily summary report of relevant Reddit discussions, so that I can stay informed without manually searching.

#### Acceptance Criteria

1. WHEN all posts are categorized THEN the system SHALL generate a daily report summarizing the findings.
2. WHEN generating the report THEN the system SHALL include counts of posts by category and competitor.
3. WHEN generating the report THEN the system SHALL highlight the most significant posts based on engagement metrics (upvotes, comments).
4. WHEN generating the report THEN the system SHALL include direct links to the original Reddit posts/comments.
5. WHEN generating the report THEN the system SHALL format the content in a readable, structured manner.
6. WHEN no relevant posts are found for the day THEN the system SHALL generate a report indicating this.

### Requirement 4: Notification Delivery

**User Story:** As a team member, I want to receive the Reddit analysis report via Slack, so that I can easily access it in my daily workflow.

#### Acceptance Criteria

1. WHEN the report is generated THEN the system SHALL send it to a designated Slack channel.
2. WHEN sending to Slack THEN the system SHALL format the message appropriately with sections, formatting, and links.
3. WHEN the Slack notification fails THEN the system SHALL retry and log the error.
4. WHEN sending to Slack THEN the system SHALL include a summary at the top with key metrics.
5. WHEN the report is particularly important (based on configurable criteria) THEN the system SHALL tag relevant team members.

### Requirement 5: System Configuration and Scheduling

**User Story:** As a developer, I want the Reddit scraping workflow to be configurable and run automatically, so that it requires minimal maintenance.

#### Acceptance Criteria

1. WHEN setting up the workflow THEN the system SHALL allow configuration of the keyword list without code changes.
2. WHEN setting up the workflow THEN the system SHALL allow configuration of the Slack webhook/channel without code changes.
3. WHEN the workflow is deployed THEN the system SHALL run automatically once per day using a separate scheduler service.
4. WHEN the workflow runs THEN the system SHALL log execution details for monitoring and debugging.
5. WHEN the workflow encounters errors THEN the system SHALL handle them gracefully and continue execution where possible.

### Requirement 6: Scheduler Implementation

**User Story:** As a developer, I want to implement a reliable scheduler using BullMQ or similar tools, so that the workflow runs automatically at specified intervals without relying on Mastra's scheduling capabilities.

#### Acceptance Criteria

1. WHEN implementing the scheduler THEN the system SHALL use BullMQ or a similar queue management system.
2. WHEN setting up the scheduler THEN the system SHALL allow configuration of the schedule interval (default: daily).
3. WHEN the scheduler runs THEN the system SHALL trigger the Reddit scraping workflow via the Mastra API.
4. WHEN the scheduler encounters errors THEN the system SHALL implement retry logic with exponential backoff.
5. WHEN the scheduler service starts THEN the system SHALL automatically recover and reschedule any missed jobs.
6. WHEN deploying the scheduler THEN the system SHALL be deployable as a separate service in a Node.js runtime environment.