/**
 * @jest-environment jsdom
 *
 * Issue #29 — "Select word from Wordbank without needing to press space".
 *
 * The word bank is checked on every keystroke: the trailing word claims its
 * bubble the moment it matches exactly, and hands it back if further typing
 * breaks the match. The worked example from the issue is a bank holding both
 * "apple" and "applepie", where typing through the shorter word into the longer
 * one has to swap which bubble is held.
 */
import { ChallengeTranslate } from "../src/ChallengeTranslate.js";
import { buildChallenge, textOf } from "./helpers/challengeDom.js";

const BANK = ["apple", "applepie", "cat", "catfish"];

/**
 * Starts an empty challenge over the worked-example word bank.
 * @param {string[]} bankWords
 */
function setup(bankWords = BANK) {
	return buildChallenge(ChallengeTranslate, "translate", bankWords, [], "");
}

/**
 * How many bubbles are still on offer for a word.
 * @param {ChallengeTranslate} challenge
 * @param {string} word
 */
function available(challenge, word) {
	return challenge.remainingChoices.wordMap.get(word)?.length ?? 0;
}

/**
 * Types `text` into the field and runs the live match, as the input listener does.
 * @param {ChallengeTranslate} challenge
 * @param {string} text
 */
function type(challenge, text) {
	challenge.elements.inputField.value = text;
	challenge.handleInput();
}

describe("issue #29 — the word bank is matched without pressing space", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
	});

	test("a partial word claims nothing", () => {
		const { challenge, clicked } = setup();

		type(challenge, "a");

		expect(available(challenge, "apple")).toBe(1);
		expect(clicked).toHaveLength(0);
	});

	test("an exact match claims its bubble as soon as it is typed", () => {
		const { challenge, clicked } = setup();

		type(challenge, "apple");

		expect(available(challenge, "apple")).toBe(0);
		expect(clicked).toHaveLength(1);
		expect(textOf(clicked[0])).toBe("apple");
	});

	test("typing past a match hands the bubble back", () => {
		const { challenge } = setup();

		type(challenge, "apple");
		type(challenge, "applep");

		expect(available(challenge, "apple")).toBe(1);
		expect(available(challenge, "applepie")).toBe(1);
	});

	test("reaching the longer word claims that bubble instead", () => {
		const { challenge } = setup();

		type(challenge, "apple");
		type(challenge, "applep");
		type(challenge, "applepie");

		expect(available(challenge, "apple")).toBe(1);
		expect(available(challenge, "applepie")).toBe(0);
	});

	test("space after an auto-claimed word does not claim it twice", () => {
		const { challenge, clicked } = setup();

		type(challenge, "applepie");
		challenge.handleSpace();

		expect(challenge.elements.inputField.value).toBe("applepie ");
		expect(available(challenge, "applepie")).toBe(0);
		expect(clicked).toHaveLength(1);
	});

	test("the next word is matched independently of the committed one", () => {
		const { challenge } = setup();

		type(challenge, "applepie");
		challenge.handleSpace();
		type(challenge, "applepie cat");

		expect(available(challenge, "applepie")).toBe(0);
		expect(available(challenge, "cat")).toBe(0);
		expect(available(challenge, "catfish")).toBe(1);
	});

	test("typing past the second word returns only that bubble", () => {
		const { challenge } = setup();

		type(challenge, "applepie");
		challenge.handleSpace();
		type(challenge, "applepie cat");
		type(challenge, "applepie catf");

		expect(available(challenge, "applepie")).toBe(0);
		expect(available(challenge, "cat")).toBe(1);
	});

	test("a repeated word claims a second bubble", () => {
		const { challenge } = setup(["el", "el", "perro"]);

		type(challenge, "el");
		challenge.handleSpace();
		type(challenge, "el el");

		expect(available(challenge, "el")).toBe(0);
	});

	test("backspacing a repeated word returns only one bubble", () => {
		const { challenge } = setup(["el", "el", "perro"]);

		type(challenge, "el");
		challenge.handleSpace();
		type(challenge, "el el");
		type(challenge, "el e");

		expect(available(challenge, "el")).toBe(1);
	});

	test("a word absent from the bank claims nothing", () => {
		const { challenge, clicked } = setup();

		type(challenge, "banana");

		expect(clicked).toHaveLength(0);
	});
});
