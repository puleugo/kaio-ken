import { NullGuard } from "../../core/null-guard";
import { Result } from "../../core/result";
import { ValueObject } from "../../core/value-object";
import { DateUtil } from "../../shared/util/date.util";

interface EventDateProperties {
	value: Date;
}

export class PostUploadedDate extends ValueObject<EventDateProperties> {
	private constructor(value: EventDateProperties) {
		super(value);
	}

	isSame(date: Date): boolean {
		return DateUtil.isSameDate(this.props.value, date);
	}

	toString(): string {
		return DateUtil.formatYYYYMMDD(this.props.value);
	}

	static from(value: Date | string): Result<PostUploadedDate> {
		const nullGuard = NullGuard.againstNullOrUndefined({
			argument: value,
			argumentName: "postUploadedDate",
		});
		if (nullGuard.isFailed) return Result.fail(nullGuard.getReason());
		if (value instanceof Date) return Result.success(new PostUploadedDate({ value: DateUtil.fromDate(value) }));

		if (!DateUtil.isYYYYMMDD(value)) return Result.fail("PostUploadedDate must be a valid date string");

		const date = DateUtil.fromYYYYMMDD(value);

		if (!date) return Result.fail(nullGuard.getReason());
		return Result.success(new PostUploadedDate({ value: date }));
	}

	static now(): PostUploadedDate {
		return new PostUploadedDate({ value: DateUtil.fromDate(new Date()) });
	}
}
