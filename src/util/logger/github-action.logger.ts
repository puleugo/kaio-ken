
export interface LoggerInterface {
	error(message: string): void;

	warning(message: string): void

	info(message: string): void
}

export class GithubActionLogger implements LoggerInterface{
	private readonly core = require('@actions/core');

	error(message: string) {
		this.core.error(message)
	}

	warning(message: string) {
		this.core.warning(message)
	}

	info(message: string) {
		this.core.info(message)
	}
}

export const githubActionLogger = new GithubActionLogger();
