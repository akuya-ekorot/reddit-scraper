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
- **Weather Agent**: Provides weather information for location-based content
- **Reddit Workflow**: Orchestrates the complete Reddit scraping and processing pipeline
- **MCP Integration**: Model Context Protocol server for external integrations

### Cron Scheduler (`apps/cron-scheduler`)

Automated scheduling system that:
- Triggers Reddit workflows every 24 hours (configurable)
- Monitors Mastra API health
- Provides comprehensive logging and error handling
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
- `MASTRA_API_URL`: URL of the running Mastra API (default: http://localhost:4000)
- `WORKFLOW_ID`: ID of the workflow to trigger (default: reddit-workflow)
- `CRON_SCHEDULE`: Cron expression for scheduling (default: "0 0 * * *" - daily at midnight)
- `LOG_LEVEL`: Logging level (error, warn, info, debug)

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

### Test Integration
```bash
# Test cron scheduler integration with Mastra API
cd apps/cron-scheduler
npm run test
```

## Workflow Architecture

1. **Mastra Application** runs the Reddit workflow server
2. **Cron Scheduler** triggers workflows on a schedule via HTTP API calls
3. **Reddit Agent** processes Reddit content and interactions
4. **Weather Agent** provides contextual weather information
5. **MCP Server** enables external tool integrations

## API Integration

The cron scheduler integrates with Mastra using these endpoints:
- `GET /api` - Health check
- `GET /api/networks` - List available workflows
- `POST /api/networks/{networkId}/generate` - Trigger workflow execution

## Monitoring and Logging

Both applications provide structured logging with:
- Timestamped log entries
- Configurable log levels
- Error tracking and reporting
- Performance metrics

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

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure Mastra application is running before starting the cron scheduler
2. **Workflow Not Found**: Verify the `WORKFLOW_ID` matches an existing network in Mastra
3. **Cron Not Triggering**: Validate cron expressions using online validators
4. **API Errors**: Check Mastra application logs for detailed error information

### Logs Location

- **Mastra**: Console output with structured logging
- **Cron Scheduler**: Console output with timestamped entries

## Contributing

1. Follow the existing code structure and patterns
2. Add appropriate error handling and logging
3. Update documentation for new features
4. Test integrations thoroughly

## License

MIT