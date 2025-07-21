import { validateConfig } from "./config";
import { logger } from "./logger";
import { WorkflowScheduler } from "./scheduler";

async function main(hello: string) {
	try {
		validateConfig();

		const scheduler = new WorkflowScheduler();
		await scheduler.start();

		const shutdown = (signal: string) => {
			logger.info(`Received ${signal}, shutting down gracefully...`);
			scheduler.stop();
			process.exit(0);
		};

		process.on("SIGINT", () => shutdown("SIGINT"));
		process.on("SIGTERM", () => shutdown("SIGTERM"));

		logger.info("Cron scheduler is running. Press Ctrl+C to stop.");

		setInterval(async () => {
			await scheduler.status();
		}, 60000);
	} catch (error: any) {
		logger.error("Failed to start cron scheduler:", error.message);
		process.exit(1);
	}
}

process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Rejection at:", promise, "reason:", reason);
	process.exit(1);
});

process.on("uncaughtException", (error) => {
	logger.error("Uncaught Exception:", error);
	process.exit(1);
});

main();
