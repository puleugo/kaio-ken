
export interface EnvValidatorInterface {
	getOrThrow(key: string): string;
	getOrNull(key: string): string | null;
}

export class EnvValidator implements EnvValidatorInterface{

	getOrThrow(key: string): string {
		let value = process.env[key];
		if (!value) {
			throw new Error(`${key}가 필요합니다.`);
		}
		return value.replace(new RegExp("\\\\n", "\g"), "\n"); // 구글 인증 키에서 줄바꿈 문자를 처리하기 위함
	}

	getOrNull(key: string): string | null {
		return process.env[key] ?? null;
	}
}

export const envValidator = new EnvValidator();