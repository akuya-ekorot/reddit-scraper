# Reddit Workflow Cron Scheduler

A Node.js application that schedules and triggers the Reddit workflow every 24 hours using cron jobs.

## Features

- **Automated Scheduling**: Triggers Reddit workflow every 24 hours (configurable)
- **Health Monitoring**: Checks Mastra API health before execution
- **Error Handling**: Comprehensive error handling and logging
- **Graceful Shutdown**: Proper cleanup on process termination
- **Configurable**: Environment-based configuration

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `MASTRA_API_URL`: URL of the running Mastra API (e.g., http://localhost:4000)
   - `WORKFLOW_ID`: ID of the workflow to trigger (e.g., reddit-workflow)

   Optional environment variables:
   - `CRON_SCHEDULE`: Cron expression for scheduling (default: "0 0 * * *" - daily at midnight)
   - `LOG_LEVEL`: Logging level (error, warn, info, debug - default: info)
   - `RUN_IMMEDIATELY`: Set to "true" to run workflow immediately on startup (for testing)

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Cron Schedule Examples

- `0 0 * * *` - Daily at midnight (default)
- `0 */6 * * *` - Every 6 hours
- `0 9 * * *` - Daily at 9 AM
- `0 0 * * 1` - Weekly on Monday at midnight
- `*/30 * * * *` - Every 30 minutes (for testing)

## API Integration

The scheduler integrates with the Mastra API using the following endpoints:

- `GET /api` - Health check
- `GET /api/networks` - List available workflows/networks
- `GET /api/networks/{networkId}` - Get workflow details
- `POST /api/networks/{networkId}/generate` - Trigger workflow execution

## Logging

The application provides structured logging with timestamps and log levels:

```
[2024-01-15T10:00:00.000Z] INFO: Starting workflow scheduler...
[2024-01-15T10:00:00.001Z] INFO: Schedule: 0 0 * * *
[2024-01-15T10:00:00.002Z] INFO: Workflow ID: reddit-workflow
[2024-01-15T10:00:00.003Z] INFO: Workflow scheduler started successfully
```

## Error Handling

- **API Connectivity**: Continues running even if Mastra API is temporarily unavailable
- **Workflow Errors**: Logs errors but continues with the schedule
- **Configuration Errors**: Fails fast on startup with clear error messages
- **Graceful Shutdown**: Handles SIGINT and SIGTERM signals properly

## Monitoring

The scheduler logs:
- Startup and shutdown events
- Workflow execution attempts and results
- API health status
- Execution duration and performance metrics
- Error details for troubleshooting

## Docker Support

You can also run this in a Docker container:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["npm", "start"]
```

## Troubleshooting

1. **Workflow not found**: Check that the `WORKFLOW_ID` matches an existing network in Mastra
2. **API connection issues**: Verify `MASTRA_API_URL` is correct and the Mastra server is running
3. **Cron not triggering**: Validate the cron expression using online cron validators
4. **Permission errors**: Ensure the application has proper file system permissions

## Development

The project structure:
```
src/
├── index.ts          # Main entry point
├── scheduler.ts      # Cron scheduler implementation
├── mastra-client.ts  # Mastra API client
├── config.ts         # Configuration management
└── logger.ts         # Logging utilities
```