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

  private async executeWorkflow(): Promise<void> {
    const workflow = this.mastraClient.getWorkflow(config.workflowId);

    const { runId } = await workflow.createRun();

    this.runId = runId;
    this.workflow = workflow;

    await workflow.startAsync({
      runId,
      inputData: config.keywords,
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
        await this.executeWorkflow();
      },
      {
        scheduled: false,
      },
    );

    this.task.start();

    if (config.runImmediately) {
      logger.info("RUN_IMMEDIATELY is true, executing workflow now...");
      await this.executeWorkflow();
    }
  }

  async status() {
    if (this.runId && this.workflow) {
      const run = await this.workflow.runById(this.runId);

      logger.info("Workflow status:", JSON.stringify(run, null, 2));
    } else {
      logger.info("No workflow running");
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
