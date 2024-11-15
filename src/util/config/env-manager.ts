import {githubActionLogger, LoggerInterface} from "../logger/github-action.logger";

export interface EnvManagerInterface {
	getOrThrow(key: string): string;
	getOrNull(key: string): string | null;
}

export class EnvManager implements EnvManagerInterface{
	constructor(private readonly logger: LoggerInterface) {}

	getOrThrow(key: string): string {
		this.logger.debug(`${key}를 가져옵니다.`);
		const value = process.env[key];
		if (!value || value.length === 0) {
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

	static isvalidPem(value: string): boolean {
		const trimmedValue = value.trim();

		const pemRegex = /^-----BEGIN (CERTIFICATE|PRIVATE KEY|PUBLIC KEY)-----\n([A-Za-z0-9+/=\n]+)-----END \1-----$/;
		if (!pemRegex.test(trimmedValue)) {
			throw new Error('올바른 PEM 형식이 아닙니다.');
		}
		// Base64 인코딩된 본문을 추출하여 각 줄 길이도 검사 (PEM 표준은 64자 길이의 줄로 나뉨)
		const lines = value.trim().split('\n').slice(1, -2); // 첫 번째와 마지막 라인 제거
		return lines.every(line => line.length === 64 || line.length === 0); // 마지막 줄은 64자보다 짧을 수 있음
	}
}

export const envManager = new EnvManager(githubActionLogger);
