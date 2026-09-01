/**
 * @jest-environment jsdom
 *
 * Issue #30 — typing "dont" or "Hanas bag" should still match the word bank's
 * "don't" and "hana's", the same way accents can already be ignored.
 */
import {
	normalizeApostrophes,
	normalizeForMatch,
	getMatchingKey
} from "../src/AccentUtils.js";
import { ChallengeTranslate } from "../src/ChallengeTranslate.js";
import { buildChallenge } from "./helpers/challengeDom.js";

describe("issue #30 — apostrophes can be ignored while matching", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
		window.ignoreApostrophesEnabled = false;
	});

	describe("normalizeApostrophes", () => {
		test("strips the straight apostrophe", () => {
			expect(normalizeApostrophes("don't")).toBe("dont");
		});

		test("strips the typographic apostrophe Duolingo renders", () => {
			expect(normalizeApostrophes("don’t")).toBe("dont");
		});

		test("leaves a word without apostrophes untouched", () => {
			expect(normalizeApostrophes("perro")).toBe("perro");
		});
	});

	describe("normalizeForMatch", () => {
		test("applies neither transform by default", () => {
			expect(normalizeForMatch("L'Año")).toBe("l'año");
		});

		test("applies both transforms together", () => {
			expect(normalizeForMatch("L'Año", { ignoreAccents: true, ignoreApostrophes: true }))
				.toBe("lano");
		});
	});

	describe("getMatchingKey", () => {
		const bank = () => new Map([["don't", 1], ["hana's", 1], ["bag", 1]]);

		test("does not match a missing apostrophe when the option is off", () => {
			expect(getMatchingKey(bank(), "dont", false, false)).toBeNull();
		});

		test("matches a missing apostrophe when the option is on", () => {
			expect(getMatchingKey(bank(), "dont", false, true)).toBe("don't");
		});

		test("matches a possessive typed without the apostrophe", () => {
			expect(getMatchingKey(bank(), "hanas", false, true)).toBe("hana's");
		});

		test("still matches an exact spelling when the option is on", () => {
			expect(getMatchingKey(bank(), "don't", false, true)).toBe("don't");
		});

		test("leaves unrelated words unmatched", () => {
			expect(getMatchingKey(bank(), "cat", false, true)).toBeNull();
		});

		test("combines with accent folding", () => {
			const map = new Map([["l'año", 1]]);
			expect(getMatchingKey(map, "lano", true, true)).toBe("l'año");
		});

		test("keeps the existing three-argument behaviour", () => {
			const map = new Map([["está", 1]]);
			expect(getMatchingKey(map, "esta", true)).toBe("está");
			expect(getMatchingKey(map, "esta", false)).toBeNull();
		});
	});

	describe("in a challenge", () => {
		const setup = (typed) => buildChallenge(
			ChallengeTranslate, "translate", ["don't", "hana's", "bag"], [], typed
		);

		test("typing without the apostrophe claims the bubble when enabled", () => {
			window.ignoreApostrophesEnabled = true;
			const { challenge, clicked } = setup("");

			challenge.elements.inputField.value = "dont";
			challenge.handleInput();

			expect(clicked).toHaveLength(1);
			expect(challenge.remainingChoices.wordMap.get("don't")).toHaveLength(0);
		});

		test("typing without the apostrophe claims nothing when disabled", () => {
			const { challenge, clicked } = setup("");

			challenge.elements.inputField.value = "dont";
			challenge.handleInput();

			expect(clicked).toHaveLength(0);
			expect(challenge.remainingChoices.wordMap.get("don't")).toHaveLength(1);
		});

		test("backspacing releases the bubble claimed without an apostrophe", () => {
			window.ignoreApostrophesEnabled = true;
			const { challenge } = setup("");

			challenge.elements.inputField.value = "dont";
			challenge.handleInput();
			expect(challenge.remainingChoices.wordMap.get("don't")).toHaveLength(0);

			challenge.handleBackspace();

			expect(challenge.elements.inputField.value).toBe("don");
			expect(challenge.remainingChoices.wordMap.get("don't")).toHaveLength(1);
		});

		test("a possessive typed without the apostrophe commits on space", () => {
			window.ignoreApostrophesEnabled = true;
			const { challenge } = setup("");

			challenge.elements.inputField.value = "hanas";
			challenge.handleInput();
			challenge.handleSpace();

			expect(challenge.elements.inputField.value).toBe("hanas ");
			expect(challenge.remainingChoices.wordMap.get("hana's")).toHaveLength(0);
		});
	});
});
