/**
 * Shared fixtures that build the DOM the way Duolingo renders a word-bank
 * challenge: the word bank and the answer area both hold
 * `button[data-test="challenge-tap-token"]` elements, so that attribute alone
 * cannot identify a specific word. Tokens already placed in the answer are
 * disabled in the bank and clickable in the answer.
 *
 * Not a test file — jest's default testMatch only picks up `*.test.js`.
 */
import { ExtensionEventManager } from "../../src/ExtensionEventManager.js";
import { WordBank } from "../../src/WordBank.js";

/**
 * Builds a token button carrying the word bubble's text.
 * @param {string} word
 * @param {boolean} enabled
 * @returns {HTMLButtonElement}
 */
export function createToken(word, enabled) {
	const btn = document.createElement("button");
	// Duolingo prefixes the token's word onto the attribute, e.g.
	// data-test="gato-challenge-tap-token" — verified against a live lesson.
	// WordBank's `[data-test*='challenge-tap-token']` substring match is what
	// copes with that.
	btn.setAttribute("data-test", `${word}-challenge-tap-token`);
	btn.setAttribute("aria-disabled", enabled ? "false" : "true");

	const span = document.createElement("span");
	span.setAttribute("data-test", "challenge-tap-token-text");
	span.textContent = word;
	btn.appendChild(span);

	return btn;
}

/**
 * Reads a token's word.
 * @param {HTMLElement} token
 * @returns {string}
 */
export function textOf(token) {
	return token.querySelector("[data-test='challenge-tap-token-text']").textContent;
}

/**
 * Renders a challenge whose bank holds `bankWords` and whose answer area already
 * holds `placedWords`, then wires up a challenge instance against it.
 *
 * Every token's `click` is replaced with a spy that records into `clicked`, so a
 * test can assert exactly which bubble was pressed.
 *
 * @param {Function} ChallengeClass - Challenge subclass to instantiate
 * @param {string} challengeType - value used in the `data-test` challenge marker
 * @param {string[]} bankWords - every bubble in the word bank, in DOM order
 * @param {string[]} placedWords - words already typed, in the order typed
 * @param {string} typedText - current textarea contents
 */
export function buildChallenge(ChallengeClass, challengeType, bankWords, placedWords, typedText) {
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
