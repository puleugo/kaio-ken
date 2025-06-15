import { UniqueEntityId } from "@src/core/unique-identifier";

export class AutoIncrementManager {
	private static _instance: AutoIncrementManager;
	private static idMap: Map<string, number> = new Map();

	private constructor() {}

	static get instance(): AutoIncrementManager {
		if (!AutoIncrementManager._instance) {
			AutoIncrementManager._instance = new AutoIncrementManager();
		}
		return AutoIncrementManager._instance;
	}

	getNextId(key: string): number {
		const current = AutoIncrementManager.idMap.get(key) || 0;
		const nextId = current + 1;
		AutoIncrementManager.idMap.set(key, nextId);
		return nextId;
	}

	getCurrentId(key: string): UniqueEntityId {
		const current = AutoIncrementManager.idMap.get(key) || 0;
		return UniqueEntityId.create(current);
	}

	register(key: string, startFrom = 0): void {
		if (AutoIncrementManager.idMap.has(key)) throw new Error(`Key ${key} is already registered.`);

		AutoIncrementManager.idMap.set(key, startFrom);
	}
}
