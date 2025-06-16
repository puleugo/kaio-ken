import type { Logger } from "@src/module/repository/logger";

export class LoggerStub implements Logger {
	private _errorCount = 0;
	private _debugCount = 0;
	private _warningCount = 0;
	private _infoCount = 0;
	errorLogs: string[] = [];

	error(message: string): void {
		console.error(message);
		this._errorCount++;
	}
	debug(message: string): void {
		console.debug(message);
		this._debugCount++;
	}
	warn(message: string): void {
		console.warn(message);
		this.errorLogs.push(message);
		this._warningCount++;
	}
	info(message: string): void {
		console.info(message);
		this._infoCount++;
	}
	reset() {
		this._errorCount = 0;
		this._debugCount = 0;
		this._warningCount = 0;
		this._infoCount = 0;
	}

	get debugCount() {
		return this._debugCount;
	}
	get errorCount() {
		return this._errorCount;
	}
	get warningCount() {
		return this._warningCount;
	}
	get infoCount() {
		return this._infoCount;
	}
}
