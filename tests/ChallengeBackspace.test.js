/**
 * @jest-environment jsdom
 *
 * Regression tests for issue #31 — "Deleting a word, removes the wrong Word
 * Bubble position."
 *
 * These build the DOM the way Duolingo actually renders it: the word bank and
 * the answer area both hold `button[data-test="challenge-tap-token"]` elements,
 * so that attribute alone cannot identify a specific word. Tokens already placed
 * in the answer are disabled in the bank and clickable in the answer.
 */
import { ChallengeTranslate } from "../src/ChallengeTranslate.js";
import { ChallengeTapComplete } from "../src/ChallengeTapComplete.js";
import { buildChallenge, textOf } from "./helpers/challengeDom.js";

describe("issue #31 — backspace returns the correct word bubble", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
	});

	test("translate returns the deleted word, not the first enabled bubble", () => {
		// "agua" is still in the bank and enabled, so it is the first enabled token
		// in the document — clicking it would ADD a word instead of removing one.
		const { challenge, answerTokens, clicked } = buildChallenge(
			ChallengeTranslate,
			"translate",
			["yo", "como", "pan", "agua"],
			["yo", "como", "pan"],
			"yo como pan"
		);

		challenge.handleBackspace();

		expect(clicked).toHaveLength(1);
		expect(textOf(clicked[0])).toBe("pan");
		expect(clicked[0]).toBe(answerTokens[2]);
	});

	test("translate releases a duplicate word still present elsewhere in the text", () => {
		// "el" appears twice. Deleting the trailing one must release a bubble even
		// though the word itself is still in the remaining text.
		const { challenge, answerTokens, clicked } = buildChallenge(
			ChallengeTranslate,
			"translate",
			["el", "el", "perro"],
			["el", "perro", "el"],
			"el perro el"
		);

		challenge.handleBackspace();

		expect(clicked).toHaveLength(1);
		expect(textOf(clicked[0])).toBe("el");
		// LIFO: the most recently placed "el" is the one that comes back.
		expect(clicked[0]).toBe(answerTokens[2]);
	});

	test("tapComplete releases a duplicate word still present elsewhere in the text", () => {
		const { challenge, answerTokens, clicked } = buildChallenge(
			ChallengeTapComplete,
			"tapComplete",
			["el", "el", "perro"],
			["el", "perro", "el"],
			"el perro el"
		);

		challenge.handleBackspace();

		expect(clicked).toHaveLength(1);
		expect(textOf(clicked[0])).toBe("el");
		expect(clicked[0]).toBe(answerTokens[2]);
	});

	test("tapComplete returns the last placed bubble, not one picked by typed-word index", () => {
		const { challenge, answerTokens, clicked } = buildChallenge(
			ChallengeTapComplete,
			"tapComplete",
			["yo", "como", "pan", "agua"],
			["yo", "como", "pan"],
			"yo como pan"
		);

		challenge.handleBackspace();

		expect(clicked).toHaveLength(1);
		expect(textOf(clicked[0])).toBe("pan");
		expect(clicked[0]).toBe(answerTokens[2]);
	});

	test("backspace on an empty input releases nothing", () => {
		const { challenge, clicked } = buildChallenge(
			ChallengeTranslate,
			"translate",
			["yo", "como"],
			[],
			""
		);

		challenge.handleBackspace();

		expect(clicked).toHaveLength(0);
	});
});
