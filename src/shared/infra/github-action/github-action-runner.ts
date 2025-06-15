import * as core from "@actions/core";
import type { Handlers, MethodActionHandler } from "./handlers";

type BootstrapHandler = () => void | Promise<void>;

export class GithubActionRunner {
	private static handlers: MethodActionHandler[] = [];
	private static bootstrapHandlers: BootstrapHandler[] = [];

	static addHandlers(handlers: Handlers) {
		for (const handler of handlers.handlers) {
			GithubActionRunner.handlers.push(handler);
		}
	}

	static addBootstrapHandler(handler: BootstrapHandler) {
		GithubActionRunner.bootstrapHandlers.push(handler);
	}

	async runBootstrapHandlers() {
		for (const handler of GithubActionRunner.bootstrapHandlers) {
			try {
				await handler();
			} catch (error) {
				core.error(`Error running bootstrap handler: ${error}`);
			}
		}
	}

	async runHandlers() {
		const methods = new Set(
			core.getMultilineInput("METHOD", { required: true }).map((line) => line.trim().replace(/^- /, "")),
		);
		core.debug(`methods: ${Array.from(methods.values()).join(", ")}`);

		for (const handler of GithubActionRunner.handlers) {
			if (methods.has(handler.method)) {
				core.debug(`Running handler for method: ${handler.method}`);
				for (const action of handler.handlers) {
					try {
						await action();
					} catch (error) {
						core.error(`Error running handler for method ${handler.method}: ${error}`);
					}
				}
			}
		}
	}
}
