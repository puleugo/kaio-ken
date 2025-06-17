export interface Logger {
	error(message: string): void;

	debug(message: string): void;

	warn(message: string): void;

	info(message: string): void;
}
