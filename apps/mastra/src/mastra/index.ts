import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { redditSearchAgent } from "./agents/reddit-agent";
import { redditWorkflow } from "./workflows/reddit-workflow";

export const mastra = new Mastra({
	agents: { redditSearchAgent },
	workflows: { redditWorkflow },
	storage: new LibSQLStore({
		url: "file:../../mastra.db",
	}),
	logger: new PinoLogger({
		name: "Mastra",
		level: "debug",
	}),
});
