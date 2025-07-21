# Reddit Workflows Project

A monorepo containing Mastra-based Reddit workflows and automated scheduling system.

## Project Structure

This project includes the following applications:

### Apps

- **`mastra`**: Main Mastra application containing Reddit workflows, agents, and MCP integrations
- **`cron-scheduler`**: Automated cron job scheduler that triggers Reddit workflows every 24 hours

## Getting Started

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Set up Environment Variables**:
   - Copy `.env.example` files in each app to `.env`
   - Configure the required environment variables

3. **Start the Mastra Application**:

   ```bash
   cd apps/mastra
   npm run dev
   ```

4. **Start the Cron Scheduler** (in a separate terminal):

   ```bash
   cd apps/cron-scheduler
   npm run dev
   ```

## Applications

### Mastra Application (`apps/mastra`)

Contains the core Reddit workflow implementation with:

- **Reddit Agent**: Handles Reddit API interactions and content processing
- **Reddit Workflow**: Orchestrates the complete Reddit scraping and processing pipeline
- **MCP Integration**: Model Context Protocol client for external tools (slack, reddit) integrations

### Cron Scheduler (`apps/cron-scheduler`)

Automated scheduling system that:

- Triggers Reddit workflows every 24 hours (configurable)
- Supports graceful shutdown and restart

**Key Features:**

- Configurable cron schedules
- API health monitoring
- Structured logging
- Error recovery
- Environment-based configuration

## Configuration

### Mastra Application

See `apps/mastra/README.md` for detailed configuration options.

### Cron Scheduler

Key environment variables:

- `MASTRA_API_URL`: URL of the running Mastra API (default: <http://localhost:4111>)
- `WORKFLOW_ID`: ID of the workflow to trigger (default: reddit-workflow)
- `CRON_SCHEDULE`: Cron expression for scheduling (default: "0 0 \* \* \*" - daily at midnight)
- `LOG_LEVEL`: Logging level (error, warn, info, debug)
- `SLACK_BOT_TOKEN`: Slack bot token

## Development

### Build All Applications

```bash
pnpm build
```

### Run Specific Application

```bash
# Run Mastra in development mode
pnpm --filter mastra dev

# Run cron scheduler in development mode
pnpm --filter cron-scheduler dev
```

## Workflow Architecture

1. **Mastra Application** runs the Reddit workflow server
2. **Cron Scheduler** triggers workflows on a schedule via HTTP API calls
3. **Reddit Agent** processes Reddit content and interactions
4. **MCP Server** enables external tool integrations

## Production Deployment

1. Build all applications:

   ```bash
   pnpm build
   ```

2. Start Mastra application:

   ```bash
   cd apps/mastra && npm start
   ```

3. Start cron scheduler:

   ```bash
   cd apps/cron-scheduler && npm start
   ```

## License

MIT
