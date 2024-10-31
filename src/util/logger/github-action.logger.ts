
export interface LoggerInterface {
	error(message: string): void;

	debug(message: string): void;

	warn(message: string): void

	info(message: string): void
}

export class GithubActionLogger implements LoggerInterface{
	private readonly core = require('@actions/core');

	error(message: string) {
		this.core.error(message)
	}

	debug(message: string) {
		this.core.debug(message)
	}

	warn(message: string) {
		this.core.warning(message)
	}

	info(message: string) {
		this.core.info(message)
	}
}

export const githubActionLogger = new GithubActionLogger();
