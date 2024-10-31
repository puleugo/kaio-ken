import {githubActionLogger, LoggerInterface} from "../logger/github-action.logger";

export interface EnvManagerInterface {
	getOrThrow(key: string): string;
	getOrNull(key: string): string | null;
}

export class EnvManager implements EnvManagerInterface{
	constructor(private readonly logger: LoggerInterface) {}

	getOrThrow(key: string): string {
		this.logger.debug(`${key}를 가져옵니다.`);
		let value = process.env[key];
		if (!value) {
			throw new Error(`${key}가 빈값입니다.`);
		}
		return value.replace(new RegExp("\\\\n", "\g"), "\n"); // 구글 인증 키에서 줄바꿈 문자를 처리하기 위함
	}

	getOrNull(key: string): string | null {
		return process.env[key] ?? null;
	}

	putOrThrow(key: string, value: string) {
		this.logger.debug(`환경변수 ${key}에 ${value}를 저장합니다.`);
		if (!key) {
			throw new Error('key가 필요합니다.');
		}
		if (!value) {
			throw new Error(`${key}에 빈값을 저장할 수 없습니다.`);
		}
		process.env[key] = value;
	}

	loadDotEnv() {
		this.logger.debug('.env 파일을 로드합니다.');
		require('dotenv').config();
	}

	put(key: string, value: string | null) {
		this.logger.debug(`환경변수 ${key}에 ${value}를 저장합니다.`);
		if (!key) {
			throw new Error('key가 필요합니다.');
		}
		process.env[key] = value;
	}
}

export const envManager = new EnvManager(githubActionLogger);
