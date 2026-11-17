/**
 * @jest-environment jsdom
 *
 * Issue #42 — Japanese tokens carry their reading in <rt>, interleaved between
 * the characters, so flattening with textContent splices the reading into the
 * word. Markup below is copied from a live Japanese lesson.
 */
import { readTokenText, readTokenWord } from "../src/TokenText.js";
import { WordBank } from "../src/WordBank.js";
import { ChoiceBank } from "../src/ChoiceBank.js";
import { ChallengeTranslate } from "../src/ChallengeTranslate.js";
import { ChallengeMatch } from "../src/ChallengeMatch.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";
import { buildChallenge, createToken } from "./helpers/challengeDom.js";
import { buildMatch } from "./helpers/matchDom.js";

/** Builds the ruby markup Duolingo renders, e.g. す/su + し/shi. */
function ruby(pairs) {
	return pairs
		.map(([char, reading]) => `<span lang="ja">${char}</span><rt lang="ja-Latn">${reading}</rt>`)
		.join("");
}

function el(html) {
	const span = document.createElement("span");
	span.innerHTML = html;
	return span;
}

/**
 * A token shown with its reading, as a live en→ja lesson rendered it in
 * November 2026: the ruby sits in an unlabelled span next to an empty one, and
 * nothing in the button carries `challenge-tap-token-text`. Duolingo labels the
 * text span only for tokens without a transliteration.
 *
 * @param {string} word
 * @param {Array<[string, string]>} pairs - characters and their readings
 * @param {string|null} hotkey - the number a match tile shows, if any
 * @returns {HTMLButtonElement}
 */
function readingToken(word, pairs, hotkey = null) {
	const btn = document.createElement("button");
	btn.setAttribute("dir", "ltr");
	btn.setAttribute("lang", "ja");
	btn.setAttribute("translate", "no");
	btn.setAttribute("data-test", `${word}-challenge-tap-token`);
	btn.setAttribute("aria-disabled", "false");
	btn.innerHTML = "<span></span>"
		+ (hotkey === null ? "" : `<span>${hotkey}</span>`)
		+ `<span><ruby>${ruby(pairs)}</ruby></span>`;
	return btn;
}

const READINGS = {
	"と": [["と", "to"]],
	"みず": [["み", "mi"], ["ず", "zu"]],
	"すし": [["す", "su"], ["し", "shi"]]
};

/** Swaps a fixture token's labelled text for the unlabelled reading markup. */
function withReading(token) {
	const word = token.querySelector("[data-test='challenge-tap-token-text']").textContent;
	const live = readingToken(word, READINGS[word]);
	token.replaceChildren(...live.childNodes);
	return token;
}

describe("issue #42 — ruby readings are not part of the word", () => {
	describe("readTokenText", () => {
		test("drops the readings from an annotated word", () => {
			const node = el(`<ruby>${ruby([["す", "su"], ["し", "shi"]])}</ruby>`);
			expect(node.textContent).toBe("すsuしshi");
			expect(readTokenText(node)).toBe("すし");
		});

		test("drops fallback parentheses too", () => {
			const node = el("<ruby>水<rp>(</rp><rt>みず</rt><rp>)</rp></ruby>");
			expect(readTokenText(node)).toBe("水");
		});

		test("leaves an unannotated word alone, trimmed", () => {
			expect(readTokenText(el("  perro  "))).toBe("perro");
		});

		test("returns an empty string for a missing element", () => {
			expect(readTokenText(null)).toBe("");
		});
	});

	describe("WordBank", () => {
		test("keys an annotated token by the word, not the reading", () => {
			const bank = document.createElement("div");
			bank.dataset.test = "word-bank";
			const btn = document.createElement("button");
			btn.setAttribute("data-test", "すし-challenge-tap-token");
			const text = document.createElement("span");
			text.setAttribute("data-test", "challenge-tap-token-text");
			text.innerHTML = `<ruby>${ruby([["す", "su"], ["し", "shi"]])}</ruby>`;
			btn.appendChild(text);
			bank.appendChild(btn);

			const wordBank = new WordBank(bank);

			expect([...wordBank.wordMap.keys()]).toEqual(["すし"]);
		});
	});

	describe("ChoiceBank", () => {
		test("keys a judge-text choice by the word", () => {
			const group = document.createElement("div");
			const choice = document.createElement("button");
			choice.setAttribute("data-test", "challenge-choice");
			const judge = document.createElement("span");
			judge.setAttribute("data-test", "challenge-judge-text");
			judge.innerHTML = `<ruby>${ruby([["み", "mi"], ["ず", "zu"]])}</ruby>`;
			choice.appendChild(judge);
			group.appendChild(choice);

			expect([...new ChoiceBank(group).choiceMap.keys()]).toEqual(["みず"]);
		});

		test("keys the span[dir=ltr] fallback by the word", () => {
			// The path a live Japanese `select` challenge actually took.
			const group = document.createElement("div");
			const choice = document.createElement("button");
			choice.setAttribute("data-test", "challenge-choice");
			const ltr = document.createElement("span");
			ltr.setAttribute("dir", "ltr");
			ltr.innerHTML = `<ruby>${ruby([["お", "o"], ["ちゃ", "cha"]])}</ruby>`;
			choice.appendChild(ltr);
			group.appendChild(choice);

			expect([...new ChoiceBank(group).choiceMap.keys()]).toEqual(["おちゃ"]);
		});
	});

	describe("end to end", () => {
		test("typing the word claims its annotated bubble", () => {
			window.ignoreAccentsEnabled = false;
			window.ignoreApostrophesEnabled = false;

			const { challenge } = buildChallenge(ChallengeTranslate, "translate", ["すし", "みず"], [], "");

			// Re-render both bubbles with the readings Duolingo adds.
			const bank = challenge.elements.wordBank;
			const readings = { "すし": [["す", "su"], ["し", "shi"]], "みず": [["み", "mi"], ["ず", "zu"]] };
			for (const btn of bank.children) {
				const text = btn.querySelector("[data-test='challenge-tap-token-text']");
				text.innerHTML = `<ruby>${ruby(readings[text.textContent])}</ruby>`;
			}
			challenge.wordBank = new WordBank(bank);
			challenge.remainingChoices = new WordBank(bank);

			challenge.elements.inputField.value = "すし";
			challenge.handleInput();

			expect(challenge.remainingChoices.wordMap.get("すし")).toHaveLength(0);
		});
	});
});

describe("tokens whose reading leaves the text span unlabelled (refs #108)", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
		window.ignoreApostrophesEnabled = false;
	});

	describe("readTokenWord", () => {
		test("reads the word out of the live markup", () => {
			expect(readTokenWord(readingToken("すし", READINGS["すし"]))).toBe("すし");
		});

		test("leaves out a hotkey number beside the text", () => {
			expect(readTokenWord(readingToken("すし", READINGS["すし"], "3"))).toBe("すし");
		});

		test("reads a token none of whose characters has a reading to show", () => {
			// Duolingo's reading component renders a bare span[lang] instead of
			// ruby when no character gets a reading, e.g. with readings for new
			// words only, or kana readings over a word already in kana.
			const btn = readingToken("すし", READINGS["すし"], "2");
			btn.lastElementChild.innerHTML = '<span lang="ja">すし</span>';
			expect(readTokenWord(btn)).toBe("すし");
		});

		test("reads every ruby when each sits in its own wrapper", () => {
			const btn = document.createElement("button");
			btn.innerHTML = "<span>1</span><span>"
				+ `<span><ruby>${ruby([["お", "o"]])}</ruby></span>`
				+ `<span><ruby>${ruby([["ちゃ", "cha"]])}</ruby></span>`
				+ "</span>";
			expect(readTokenWord(btn)).toBe("おちゃ");
		});

		test("still prefers the labelled span when there is one", () => {
			expect(readTokenWord(createToken("perro", true))).toBe("perro");
		});

		test("returns an empty string for a token without text", () => {
			const audio = document.createElement("button");
			audio.innerHTML = "<span></span><span><span></span></span>";
			expect(readTokenWord(audio)).toBe("");
		});
	});

	test("WordBank keys each live token by its word", () => {
		const bank = document.createElement("div");
		bank.dataset.test = "word-bank";
		for (const word of ["と", "みず", "すし"]) {
			const slot = document.createElement("div");
			const wrapper = document.createElement("span");
			wrapper.appendChild(readingToken(word, READINGS[word]));
			slot.appendChild(wrapper);
			bank.appendChild(slot);
		}

		expect([...new WordBank(bank).wordMap.keys()]).toEqual(["と", "みず", "すし"]);
	});

	test("typing a word claims its bubble", () => {
		const { challenge, bankTokens, clicked } = buildChallenge(ChallengeTranslate, "translate", ["と", "みず", "すし"], [], "");
		bankTokens.forEach(withReading);
		challenge.wordBank = new WordBank(challenge.elements.wordBank);
		challenge.remainingChoices = new WordBank(challenge.elements.wordBank);

		challenge.elements.inputField.value = "すし";
		challenge.handleInput();

		expect(challenge.remainingChoices.wordMap.get("すし")).toHaveLength(0);
		expect(clicked).toEqual([bankTokens[2]]);
	});

	test("the placed bubble can be found again to release it", () => {
		const { challenge, bankTokens, answerTokens } = buildChallenge(ChallengeTranslate, "translate", ["と", "みず", "すし"], ["すし"], "すし ");
		[...bankTokens, ...answerTokens].forEach(withReading);

		expect(challenge.findAnswerButton("すし")).toBe(answerTokens[0]);
	});

	describe("match with a Japanese answer column", () => {
		const layout = {
			promptTexts: ["sushi", "water"],
			prompts: ["すし", "みず"],
			answers: ["みず", "すし"],
			promptLang: "en",
			answerLang: "ja"
		};

		/** Gives the answer tiles the unlabelled reading markup. */
		function liveAnswers(page) {
			for (const tile of page.answers) {
				const text = tile.querySelector("[data-test='challenge-tap-token-text']");
				text.removeAttribute("data-test");
				text.innerHTML = `<ruby>${ruby(READINGS[text.textContent])}</ruby>`;
			}
			return page;
		}

		test("is recognised as a pair layout", () => {
			const { challengeDiv } = liveAnswers(buildMatch(layout));
			expect(ChallengeMatch.isPairLayout(challengeDiv)).toBe(true);
		});

		test("typing an answer taps its tile", () => {
			const page = liveAnswers(buildMatch(layout));
			const challenge = new ChallengeMatch(page.challengeDiv, new ExtensionEventManager());
			challenge.enforceTyping();

			challenge.elements.inputField.value = "すし";
			challenge.handleInput();
			challenge.handleKeyEvent({ key: "Enter", ctrlKey: false, altKey: false });

			expect(page.clicks).toEqual(["prompt:すし", "answer:すし"]);
		});
	});
});
