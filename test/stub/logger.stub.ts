import {LoggerInterface} from "../../src/util/logger/github-action.logger";

export class LoggerStub implements LoggerInterface{
	private _errorCount = 0;
	private _debugCount = 0;
	private _warningCount = 0;
	private _infoCount = 0;

    error(message: string): void {
		this._errorCount++;
    }
    debug(message: string): void {
		this._debugCount++;
    }
    warn(message: string): void {
		this._warningCount++;
    }
    info(message: string): void {
		this._infoCount++;
    }
	reset() {
		this._errorCount = 0;
		this._debugCount = 0;
		this._warningCount = 0;
		this._infoCount = 0;
	}
}
