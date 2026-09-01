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
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";
import { WordBank } from "../src/WordBank.js";

/**
 * Builds a token button carrying the word bubble's text.
 * @param {string} word
 * @param {boolean} enabled
 * @returns {HTMLButtonElement}
 */
function createToken(word, enabled) {
	const btn = document.createElement("button");
	btn.setAttribute("data-test", "challenge-tap-token");
	btn.setAttribute("aria-disabled", enabled ? "false" : "true");

	const span = document.createElement("span");
	span.setAttribute("data-test", "challenge-tap-token-text");
	span.textContent = word;
	btn.appendChild(span);

	return btn;
}

/**
 * Renders a challenge whose bank holds `bankWords` and whose answer area already
 * holds `placedWords`, then wires up a challenge instance against it.
 *
 * @param {typeof ChallengeTranslate | typeof ChallengeTapComplete} ChallengeClass
 * @param {string} challengeType
 * @param {string[]} bankWords - every bubble in the word bank, in DOM order
 * @param {string[]} placedWords - words already typed, in the order typed
 * @param {string} typedText - current textarea contents
 */
function buildChallenge(ChallengeClass, challengeType, bankWords, placedWords, typedText) {
	document.body.innerHTML = "";

	const challengeDiv = document.createElement("div");
	challengeDiv.setAttribute("data-test", `challenge challenge-${challengeType}`);

	const header = document.createElement("h1");
	header.setAttribute("data-test", "challenge-header");
	header.textContent = "Regression question";
	challengeDiv.appendChild(header);

	// A word bank bubble is greyed out once its word sits in the answer.
	const remainingPlacements = [...placedWords];
	const bank = document.createElement("div");
	bank.dataset.test = "word-bank";
	for (const word of bankWords) {
		const placedIndex = remainingPlacements.indexOf(word);
		if (placedIndex !== -1) {
			remainingPlacements.splice(placedIndex, 1);
			bank.appendChild(createToken(word, false));
		} else {
			bank.appendChild(createToken(word, true));
		}
	}
	challengeDiv.appendChild(bank);

	// The answer area renders after the bank, so its tokens come later in DOM order.
	const answer = document.createElement("div");
	answer.dataset.test = "challenge-answer";
	const answerTokens = placedWords.map((word) => {
		const token = createToken(word, true);
		answer.appendChild(token);
		return token;
	});
	challengeDiv.appendChild(answer);

	document.body.appendChild(challengeDiv);

	const submitBtn = document.createElement("button");
	submitBtn.dataset.test = "player-next";
	document.body.appendChild(submitBtn);

	const challenge = new ChallengeClass(challengeDiv, new ExtensionEventManager());
	challenge.wordBank = new WordBank(bank);
	challenge.remainingChoices = new WordBank(bank);

	// Mirror the placements onto the LIFO pool the challenge reads from.
	for (const word of placedWords) {
		challenge.remainingChoices.selectWord(word.toLowerCase());
	}

	challenge.elements.inputField = document.createElement("textarea");
	challenge.elements.inputField.value = typedText;

	const clicked = [];
	for (const token of [...bank.children, ...answer.children]) {
		token.click = jest.fn(() => clicked.push(token));
	}

	return { challenge, answerTokens, bankTokens: [...bank.children], clicked };
}

/** @param {HTMLElement} token */
function textOf(token) {
	return token.querySelector("[data-test='challenge-tap-token-text']").textContent;
}

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
