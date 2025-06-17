import { Result } from "../../../src/core/result";

describe("Result", () => {
	describe("success cases", () => {
		it("should create a successful result with value", () => {
			const result = Result.success(42);
			expect(result.isSucceed).toBe(true);
			expect(result.isFailed).toBe(false);
			expect(result.getValue()).toBe(42);
		});

		it("should create a complete result", () => {
			const result = Result.complete();
			expect(result.isSucceed).toBe(true);
			expect(result.isFailed).toBe(false);
		});

		it("should throw error when getting value from failed result", () => {
			const result = Result.fail("error");
			expect(() => result.getValue()).toThrow("Can't get the value of an error result.");
		});
	});

	describe("failure cases", () => {
		it("should create a failed result with reason", () => {
			const result = Result.fail("error message");
			expect(result.isSucceed).toBe(false);
			expect(result.isFailed).toBe(true);
			expect(result.getReason()).toBe("error message");
		});

		it("should throw error when getting reason from success result", () => {
			const result = Result.success(42);
			expect(() => result.getReason()).toThrow("Can't get the reason of a success result.");
		});
	});

	describe("static methods", () => {
		it("should detect failure in array of results", () => {
			const results = [Result.success(1), Result.fail("error"), Result.success(2)];
			expect(Result.containsFailure(results)).toBe(true);
		});

		it("should return first failure from array of results", () => {
			const results = [Result.success(1), Result.fail("first error"), Result.fail("second error")];
			const firstFailure = Result.getFirstFailure(results);
			expect(firstFailure?.getReason()).toBe("first error");
		});

		it("should return null when no failures in array", () => {
			const results = [Result.success(1), Result.success(2)];
			expect(Result.getFirstFailure(results)).toBeNull();
		});
	});
});
