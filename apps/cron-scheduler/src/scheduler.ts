import { MastraClient } from "@mastra/client-js";
import * as cron from "node-cron";
import { config } from "./config";
import { logger } from "./logger";

export class WorkflowScheduler {
	private mastraClient: MastraClient;
	private task: cron.ScheduledTask | null = null;
	private workflow: ReturnType<MastraClient["getWorkflow"]> | null = null;
	private runId: string | null = null;

	constructor() {
		this.mastraClient = new MastraClient({
			baseUrl: config.mastraApiUrl,
		});
	}

	async start(): Promise<void> {
		logger.info("Starting workflow scheduler...");
		logger.info(`Schedule: ${config.cronSchedule}`);
		logger.info(`Workflow ID: ${config.workflowId}`);
		logger.info(`Mastra API URL: ${config.mastraApiUrl}`);

		if (!cron.validate(config.cronSchedule)) {
			throw new Error(`Invalid cron expression: ${config.cronSchedule}`);
		}

		this.task = cron.schedule(
			config.cronSchedule,
			async () => {
				const workflow = this.mastraClient.getWorkflow(config.workflowId);

				const { runId } = await workflow.createRun();

				this.runId = runId;
				this.workflow = workflow;

				await workflow.startAsync({
					runId,
					inputData: config.keywords,
				});
			},
			{
				scheduled: false,
			},
		);

		this.task.start();
	}

	async executeWorkflow(): Promise<void> {
		logger.info("Executing scheduled workflow...");

		try {
			const workflow = this.mastraClient.getWorkflow(config.workflowId);
			const { runId } = await workflow.createRun();
			const result = await workflow.startAsync({
				runId,
				inputData: config.keywords,
			});

			if (result.status === "success") {
				logger.debug("Workflow result:", result.result);
			}
		} catch (error: any) {
			logger.error(`Workflow execution error:`, error.message);
		}
	}

	async status() {
		if (this.runId && this.workflow) {
			const run = await this.workflow.runById(this.runId);

			logger.info("Workflow status:", JSON.stringify(run, null, 2));
		}
	}

	stop(): void {
		if (this.task) {
			this.task.stop();
			this.task = null;
			logger.info("Workflow scheduler stopped");
		}
	}
}
