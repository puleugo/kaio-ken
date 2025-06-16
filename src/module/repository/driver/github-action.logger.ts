import type { Logger } from "../logger";

export class GithubActionLogger implements Logger {
	private readonly core = require("@actions/core");

	error(message: string) {
		this.core.error(message);
	}

	debug(message: string) {
		this.core.debug(message);
	}

	warn(message: string) {
		this.core.warning(message);
	}

	info(message: string) {
		this.core.info(message);
	}
}
