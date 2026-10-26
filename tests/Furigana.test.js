/**
 * @jest-environment jsdom
 *
 * Issue #42 — Japanese tokens carry their reading in <rt>, interleaved between
 * the characters, so flattening with textContent splices the reading into the
 * word. Markup below is copied from a live Japanese lesson.
 */
import { readTokenText } from "../src/TokenText.js";
import { WordBank } from "../src/WordBank.js";
import { ChoiceBank } from "../src/ChoiceBank.js";
import { ChallengeTranslate } from "../src/ChallengeTranslate.js";
import { buildChallenge } from "./helpers/challengeDom.js";

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
