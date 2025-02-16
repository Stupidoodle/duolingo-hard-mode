/**
 * @jest-environment jsdom
 */
import{
	normalizeText,
	getMatchingKey
} from "../src/AccentUtils.js";

describe("AccentUtils", () => {
	describe("normalizeText", () => {
		test("removes accents from a string", () => {
			expect(normalizeText("áéíóú")).toBe("aeiou");
		});

		test("removes accents from a string with mixed case", () => {
			expect(normalizeText("ÁÉíÓú")).toBe("AEiOu");
		});

		test("removes accents from a string with punctuation", () => {
			expect(normalizeText("áé,íó!ú")).toBe("ae,io!u");
		});

		test("removes accents from a string with numbers", () => {
			expect(normalizeText("áé1íó2ú")).toBe("ae1io2u");
		});

		test("removes accents from a string with special characters", () => {
			expect(normalizeText("áé@íó#ú")).toBe("ae@io#u");
		});

		test("removes accents from a string with whitespace", () => {
			expect(normalizeText("áé íó ú")).toBe("ae io u");
		});

		test("removes accents from a string with multiple accents", () => {
			expect(normalizeText("áéíóúÁÉÍÓÚ")).toBe("aeiouAEIOU");
		});

		test("removes accents from a string with no accents", () => {
			expect(normalizeText("aeiou")).toBe("aeiou");
		});

		test("removes accents from an empty string", () => {
			expect(normalizeText("")).toBe("");
		});
	});

	describe("getMatchingKey", () => {
		test("returns key from map without accents", () => {
			const map = new Map([
				["hello", 1],
				["world", 2]
			]);
			expect(getMatchingKey(map, "hello", true)).toBe("hello");
		});

		test("returns key from map with accents", () => {
			const map = new Map([
				["hello", 1],
				["world", 2]
			]);
			expect(getMatchingKey(map, "hélló", true)).toBe("hello");
		});

		test("returns null when key not found", () => {
			const map = new Map([
				["hello", 1],
				["world", 2]
			]);
			expect(getMatchingKey(map, "hell", true)).toBeNull();
		});

		test("returns null when key not found with accents", () => {
			const map = new Map([
				["hello", 1],
				["world", 2]
			]);
			expect(getMatchingKey(map, "héll", false)).toBeNull();
		});
	});
});