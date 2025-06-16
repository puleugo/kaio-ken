import { faker } from "@faker-js/faker";
import { UniqueEntityId } from "@src/core/unique-identifier";
import { PostTitle } from "@src/module/domain/post-title";

export namespace ValueObjectMother {
	export function createRandomIncrementId(entityName: string): UniqueEntityId {
		return UniqueEntityId.generate({ strategy: "auto-increment", props: { key: entityName } });
	}

	export function createRandomPostTitle(): PostTitle {
		return PostTitle.from(faker.lorem.sentence(5)).getValue();
	}
}
