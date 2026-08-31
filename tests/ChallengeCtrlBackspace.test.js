/**
 * @jest-environment jsdom
 *
 * Issue #28 — "Ctrl + Backspace to delete an entire word".
 *
 * The whole trailing word goes away in one press and its bubble returns to the
 * word bank, leaving the space that separated it from the previous word.
 */
import { ChallengeTranslate } from "../src/ChallengeTranslate.js";
import { buildChallenge, textOf } from "./helpers/challengeDom.js";

describe("issue #28 — ctrl+backspace deletes a whole word", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
	});

	test("deletes the trailing word and returns its bubble", () => {
		const { challenge, answerTokens, clicked } = buildChallenge(
			ChallengeTranslate,
			"translate",
			["yo", "como", "pan", "agua"],
			["yo", "como", "pan"],
			"yo como pan "
		);

		challenge.handleCtrlBackspace();

		expect(challenge.elements.inputField.value).toBe("yo como ");
		expect(clicked).toHaveLength(1);
		expect(textOf(clicked[0])).toBe("pan");
		expect(clicked[0]).toBe(answerTokens[2]);
	});

	test("works when the trailing word has no space after it", () => {
		const { challenge, clicked } = buildChallenge(
			ChallengeTranslate,
			"translate",
			["yo", "como", "pan"],
			["yo", "como", "pan"],
			"yo como pan"
		);

		challenge.handleCtrlBackspace();

		expect(challenge.elements.inputField.value).toBe("yo como ");
		expect(clicked).toHaveLength(1);
		expect(textOf(clicked[0])).toBe("pan");
	});

	test("deletes a partially typed word without releasing a bubble", () => {
		const { challenge, clicked } = buildChallenge(
			ChallengeTranslate,
			"translate",
			["yo", "como", "pan"],
			["yo", "como"],
			"yo como pa"
		);

		challenge.handleCtrlBackspace();

		expect(challenge.elements.inputField.value).toBe("yo como ");
		expect(clicked).toHaveLength(0);
	});

	test("clears the input when only one word remains", () => {
		const { challenge, clicked } = buildChallenge(
			ChallengeTranslate,
			"translate",
			["yo", "como"],
			["yo"],
			"yo "
		);

		challenge.handleCtrlBackspace();

		expect(challenge.elements.inputField.value).toBe("");
		expect(clicked).toHaveLength(1);
		expect(textOf(clicked[0])).toBe("yo");
	});

	test("is a no-op on empty input", () => {
		const { challenge, clicked } = buildChallenge(
			ChallengeTranslate,
			"translate",
			["yo"],
			[],
			""
		);

		challenge.handleCtrlBackspace();

		expect(challenge.elements.inputField.value).toBe("");
		expect(clicked).toHaveLength(0);
	});

	test("releases a repeated word's most recent bubble", () => {
		const { challenge, answerTokens, clicked } = buildChallenge(
			ChallengeTranslate,
			"translate",
			["el", "el", "perro"],
			["el", "perro", "el"],
			"el perro el "
		);

		challenge.handleCtrlBackspace();

		expect(challenge.elements.inputField.value).toBe("el perro ");
		expect(clicked).toHaveLength(1);
		expect(clicked[0]).toBe(answerTokens[2]);
	});

	describe("key routing", () => {
		/** @returns {{challenge: ChallengeTranslate}} */
		function setup() {
			return buildChallenge(
				ChallengeTranslate,
				"translate",
				["yo", "como"],
				["yo"],
				"yo "
			);
		}

		test("ctrl+backspace routes to the whole-word delete", () => {
			const { challenge } = setup();
			const wholeWord = jest.spyOn(challenge, "handleCtrlBackspace");
			const singleChar = jest.spyOn(challenge, "handleBackspace");

			challenge.handleKeyEvent({ key: "Backspace", ctrlKey: true });

			expect(wholeWord).toHaveBeenCalled();
			expect(singleChar).not.toHaveBeenCalled();
		});

		test("alt+backspace routes to the whole-word delete for macOS muscle memory", () => {
			const { challenge } = setup();
			const wholeWord = jest.spyOn(challenge, "handleCtrlBackspace");

			challenge.handleKeyEvent({ key: "Backspace", altKey: true });

			expect(wholeWord).toHaveBeenCalled();
		});

		test("plain backspace still deletes a single character", () => {
			const { challenge } = setup();
			const wholeWord = jest.spyOn(challenge, "handleCtrlBackspace");
			const singleChar = jest.spyOn(challenge, "handleBackspace");

			challenge.handleKeyEvent({ key: "Backspace" });

			expect(singleChar).toHaveBeenCalled();
			expect(wholeWord).not.toHaveBeenCalled();
		});
	});
});
