export abstract class UseCaseException {
	public readonly message: string;

	protected constructor(message: string) {
		this.message = message;
	}
}
