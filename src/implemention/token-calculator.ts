export interface TokenCalculatorInterface {
	addText(text: string): void;
	canBeRequest(text: string): boolean;
}

export class BpeTokenCalculator implements TokenCalculatorInterface {
	// 토큰 사전
	private vocabulary = new Map<string, number>();

	constructor(private readonly tokenCountPerOneCall: number) {}

	/**
	 * 텍스트를 토큰화하고, 각 토큰의 빈도수를 사전에 추가합니다.
	 */
	addText(text: string): void {
		if (!this.canBeRequest(text)) {
			return;
		}

		const tokens = this.tokenize(text);
		for (const token of tokens) {
			this.vocabulary.set(token, (this.vocabulary.get(token) || 0) + 1);
		}
	}

	/**
	 * 텍스트를 주어진 최대 토큰 수 기준으로 번역 가능한지 확인합니다.
	 */
	canBeRequest(text: string): boolean {
		const tokens = this.tokenize(text);

		// 가상 사전 생성
		const virtualVocabulary = new Map<string, number>(this.vocabulary);

		// 가상 사전에 새로운 텍스트의 토큰을 추가
		for (const token of tokens) {
			virtualVocabulary.set(token, (virtualVocabulary.get(token) || 0) + 1);
		}

		// 가상 사전의 총 토큰 수 계산
		const virtualVocabularyTokenCount = Array.from(virtualVocabulary.values()).reduce(
			(sum, count) => sum + count,
			0
		);

		return virtualVocabularyTokenCount <= this.tokenCountPerOneCall;
	}

	/**
	 * 텍스트를 개별 문자로 나누고 공백으로 구분하여 토큰화합니다.
	 */
	private tokenize(text: string): string[] {
		return text.split('').map((char) => char + ' ');
	}
}

