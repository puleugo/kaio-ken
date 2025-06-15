type Handler = () => Promise<void>;

export interface MethodActionHandler {
	method: string;
	handlers: Handler[];
}

export class Handlers {
	private readonly _handlers: MethodActionHandler[] = [];

	register(method: string, ...handlers: Handler[]) {
		this._handlers.push({ method, handlers });
	}

	get handlers(): MethodActionHandler[] {
		return this._handlers;
	}
}
