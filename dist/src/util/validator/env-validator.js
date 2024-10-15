export class EnvValidator {
    getOrThrow(key) {
        let value = process.env[key];
        if (!value) {
            throw new Error(`${key}가 필요합니다.`);
        }
        return value.replace(new RegExp("\\\\n", "\g"), "\n"); // 구글 인증 키에서 줄바꿈 문자를 처리하기 위함
    }
    getOrNull(key) {
        return process.env[key] ?? null;
    }
    put(key, value) {
        process.env[key] = value;
    }
}
export const envValidator = new EnvValidator();
