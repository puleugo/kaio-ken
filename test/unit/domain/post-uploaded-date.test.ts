import { PostUploadedDate } from "@src/module/domain/post-uploaded-date";
import { DateUtil } from "@src/shared/util/date.util";

describe("PostUploadedDate", () => {
	it("should create a valid post uploaded date from Date object", () => {
		const date = new Date("2024-03-20");
		const result = PostUploadedDate.from(date);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().isSame(date));
	});

	it("should create a valid post uploaded date from YYYYMMDD string", () => {
		const result = PostUploadedDate.from("2024-03-20");
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().isSame(DateUtil.fromYYYYMMDD("2024-03-20"))).toBe(true);
	});

	it("should not create a post uploaded date with null or undefined value", () => {
		const nullResult = PostUploadedDate.from(null as unknown as Date);
		expect(nullResult.isSucceed).toBe(false);
		expect(nullResult.getReason()).toContain("postUploadedDate");

		const undefinedResult = PostUploadedDate.from(undefined as unknown as Date);
		expect(undefinedResult.isSucceed).toBe(false);
		expect(undefinedResult.getReason()).toContain("postUploadedDate");
	});

	it("should not create a post uploaded date with invalid date string", () => {
		const result = PostUploadedDate.from("invalid-date");
		expect(result.isSucceed).toBe(false);
	});

	it("should format date as YYYYMMDD when toString is called", () => {
		const date = new Date("2024-03-20");
		const result = PostUploadedDate.from(date);
		expect(result.isSucceed).toBe(true);
		expect(result.getValue().toString()).toBe("2024-03-20");
	});

	it("should handle dates with different formats", () => {
		const isoDate1 = DateUtil.fromString("2024-03-20T12:00:00Z");
		const result1 = PostUploadedDate.from(isoDate1);
		expect(result1.isSucceed).toBe(true);
		expect(result1.getValue().toString()).toBe("2024-03-20");

		const isoDate2 = DateUtil.fromString("2024-03-20T23:59:59Z");
		const result2 = PostUploadedDate.from(isoDate2);
		expect(result2.isSucceed).toBe(true);
		expect(result2.getValue().toString()).toBe("2024-03-20");
	});

	it("should handle edge cases of month and year boundaries", () => {
		const date1 = DateUtil.fromYYYYMMDD("2024-12-31");
		const result1 = PostUploadedDate.from(date1);
		expect(result1.isSucceed).toBe(true);
		expect(result1.getValue().toString()).toBe("2024-12-31");

		const date2 = DateUtil.fromYYYYMMDD("2024-01-01");
		const result2 = PostUploadedDate.from(date2);
		expect(result2.isSucceed).toBe(true);
		expect(result2.getValue().toString()).toBe("2024-01-01");
	});
});
