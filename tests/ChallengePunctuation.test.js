/**
 * @jest-environment jsdom
 *
 * Issue #111 — typing punctuation after a word released the word's bubble.
 * The reporter typed "is it here?" against a bank of
 * is, convenience, here, pizza, it, department, department store: the "?"
 * stuck to "here", the input no longer spelled "here", so the bubble went
 * back to the bank and Space logged "Word here? not found in choices".
 *
 * Bubbles carry no sentence punctuation and Duolingo does not grade it, so it
 * is trimmed off typed words before they are matched.
 */
import { ChallengeTranslate } from "../src/ChallengeTranslate.js";
import { trimPunctuation } from "../src/AccentUtils.js";
import { buildChallenge, textOf } from "./helpers/challengeDom.js";

const BANK = ["is", "convenience", "here", "pizza", "it", "department", "department store"];

function setup(bankWords = BANK) {
	return buildChallenge(ChallengeTranslate, "translate", bankWords, [], "");
}

function available(challenge, word) {
	return challenge.remainingChoices.wordMap.get(word)?.length ?? 0;
}

/** Types `text` into the field and runs the live match, as the input listener does. */
function type(challenge, text) {
	challenge.elements.inputField.value = text;
	challenge.handleInput();
}

const key = name => ({ key: name, ctrlKey: false, altKey: false, preventDefault() {} });

describe("trimPunctuation", () => {
	test("trims sentence punctuation off both ends", () => {
		expect(trimPunctuation("here?")).toBe("here");
		expect(trimPunctuation("¿dónde")).toBe("dónde");
		expect(trimPunctuation("\"hello,\"")).toBe("hello");
		expect(trimPunctuation("すし、")).toBe("すし");
	});

	test("keeps apostrophes, hyphens and punctuation inside a word", () => {
		expect(trimPunctuation("o'clock.")).toBe("o'clock");
		expect(trimPunctuation("'s")).toBe("'s");
		expect(trimPunctuation("est-ce")).toBe("est-ce");
		expect(trimPunctuation("3.5")).toBe("3.5");
	});

	test("leaves nothing of a word that is only punctuation", () => {
		expect(trimPunctuation("?!")).toBe("");
	});
});

describe("issue #111 — punctuation after a word", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
		window.ignoreApostrophesEnabled = false;
	});

	test("typing a question mark keeps the word's bubble", () => {
		const { challenge } = setup();

		type(challenge, "is it here");
		expect(available(challenge, "here")).toBe(0);

		type(challenge, "is it here?");

		expect(available(challenge, "here")).toBe(0);
		expect(available(challenge, "is")).toBe(0);
		expect(available(challenge, "it")).toBe(0);
	});

	test("a word typed with its punctuation in one go still claims its bubble", () => {
		const { challenge, clicked } = setup();

		type(challenge, "is it here?");

		expect(available(challenge, "here")).toBe(0);
		expect(clicked.map(textOf)).toEqual(["is", "it", "here"]);
	});

	test("Space after the punctuation adds the space without flagging the word", () => {
		const { challenge } = setup();
		type(challenge, "is it here?");

		challenge.handleSpace();

		expect(challenge.elements.inputField.value).toBe("is it here? ");
		expect(challenge.elements.inputField.style.border).not.toContain("red");
	});

	test("Space after a word that has not claimed its bubble yet claims it", () => {
		const { challenge } = setup(["department", "department store", "is"]);
		// "department" may still grow into "department store", so live matching waits.
		type(challenge, "department,");
		expect(available(challenge, "department")).toBe(1);

		challenge.handleSpace();

		expect(available(challenge, "department")).toBe(0);
		expect(challenge.elements.inputField.value).toBe("department, ");
	});

	test("Space after punctuation standing on its own just adds the space", () => {
		const { challenge } = setup();
		type(challenge, "is it here ?");

		challenge.handleSpace();

		expect(challenge.elements.inputField.value).toBe("is it here ? ");
		expect(challenge.elements.inputField.style.border).not.toContain("red");
		expect(available(challenge, "here")).toBe(0);
	});

	test("Enter submits an answer that ends in punctuation", () => {
		const { challenge } = setup();
		const submit = jest.fn();
		challenge.elements.submitButton.click = submit;
		type(challenge, "is it here?");

		challenge.handleKeyEvent(key("Enter"));

		expect(submit).toHaveBeenCalledTimes(1);
	});

	test("Enter submits when the punctuation stands on its own", () => {
		const { challenge } = setup();
		const submit = jest.fn();
		challenge.elements.submitButton.click = submit;
		type(challenge, "is it here ?");

		challenge.handleKeyEvent(key("Enter"));

		expect(available(challenge, "here")).toBe(0);
		expect(submit).toHaveBeenCalledTimes(1);
	});

	test("an opening ¿ does not stop the word matching", () => {
		const { challenge } = setup(["dónde", "está", "el", "baño"]);

		type(challenge, "¿dónde");

		expect(available(challenge, "dónde")).toBe(0);
	});

	test("Japanese punctuation after a word keeps its bubble", () => {
		const { challenge } = setup(["すし", "みず", "と"]);

		type(challenge, "すし、");

		expect(available(challenge, "すし")).toBe(0);
	});

	test("a bubble that holds punctuation itself still matches exactly", () => {
		const { challenge } = setup(["mr.", "smith", "is", "here"]);

		type(challenge, "mr.");

		expect(available(challenge, "mr.")).toBe(0);
	});

	test("backspacing over the punctuation keeps the word's bubble", () => {
		const { challenge } = setup();
		type(challenge, "is it here?");

		challenge.handleKeyEvent(key("Backspace"));

		expect(challenge.elements.inputField.value).toBe("is it here");
		expect(available(challenge, "here")).toBe(0);
	});
});
