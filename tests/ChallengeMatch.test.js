/**
 * @jest-environment jsdom
 *
 * Issue #66 — hard mode for listenMatch. The answer column is hidden and the
 * answer has to be typed; Enter taps the hidden tile so Duolingo still grades
 * the pair itself.
 */
import { ChallengeMatch } from "../src/ChallengeMatch.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";
import { buildMatch } from "./helpers/matchDom.js";

// One manager for the file: initGlobalKeyCapture is never called here, so no
// document listeners leak between tests.
const eventManager = new ExtensionEventManager();

const flush = () => new Promise(resolve => setTimeout(resolve, 0));
const key = (name, modifiers = {}) => ({ key: name, ctrlKey: false, altKey: false, ...modifiers });

const LIVE = {
	prompts: ["Kaffee", "ein", "Tochter", "ja"],
	answers: ["ja", "Tochter", "Kaffee", "ein"]
};

function start(layout = LIVE) {
	const page = buildMatch(layout);
	const challenge = new ChallengeMatch(page.challengeDiv, eventManager);
	challenge.enforceTyping();
	return { page, challenge, input: challenge.elements.inputField };
}

function typeAndEnter(challenge, text) {
	challenge.elements.inputField.value = text;
	challenge.handleInput();
	challenge.handleKeyEvent(key("Enter"));
}

describe("issue #66 — listenMatch hard mode", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
		window.ignoreApostrophesEnabled = false;
	});

	describe("recognising the layout", () => {
		test("accepts the live markup", () => {
			const { challengeDiv } = buildMatch(LIVE);
			expect(ChallengeMatch.isPairLayout(challengeDiv)).toBe(true);
		});

		test("rejects a container whose tiles have not rendered yet", () => {
			const { challengeDiv, grid } = buildMatch(LIVE);
			grid.innerHTML = "";
			expect(ChallengeMatch.isPairLayout(challengeDiv)).toBe(false);
		});

		test("rejects an odd number of tiles", () => {
			const { challengeDiv, grid } = buildMatch(LIVE);
			grid.lastElementChild.remove();
			expect(ChallengeMatch.isPairLayout(challengeDiv)).toBe(false);
		});

		test("rejects a mix of audio and text prompts, a layout it was never checked against", () => {
			const { challengeDiv } = buildMatch({ prompts: ["ja", "ein"], answers: ["ja", "ein"] });
			const firstPrompt = challengeDiv.querySelector("button");
			const text = document.createElement("span");
			text.setAttribute("data-test", "challenge-tap-token-text");
			text.textContent = "oui";
			firstPrompt.appendChild(text);
			expect(ChallengeMatch.isPairLayout(challengeDiv)).toBe(false);
		});

		test("rejects answers without text", () => {
			const { challengeDiv, answers } = buildMatch(LIVE);
			answers[0].querySelector("[data-test='challenge-tap-token-text']").remove();
			expect(ChallengeMatch.isPairLayout(challengeDiv)).toBe(false);
		});
	});

	describe("enforcing typing", () => {
		test("hides the answer tiles and keeps the prompts", () => {
			const { page } = start();

			for (const answer of page.answers) {
				expect(answer.style.display).toBe("none");
			}
			for (const prompt of page.prompts) {
				expect(prompt.style.display).not.toBe("none");
			}
		});

		test("injects a registered textarea right after the tiles", () => {
			const { page, challenge, input } = start();

			expect(input.tagName).toBe("TEXTAREA");
			expect(input.dataset.extension).toBe("true");
			expect(input.dataset.challengeId).toBe(challenge.challengeId);
			expect(page.grid.nextElementSibling).toBe(input);
			expect(eventManager.activeChallenges.get(challenge.challengeId)).toBe(challenge);
		});

		test("leaves a gap between the tiles and the textarea", () => {
			const { input } = start();

			// The tile column has no bottom margin of its own, so without one the
			// textarea sits flush against the last prompt.
			expect(input.style.marginTop).toBe("16px");
		});

		test("selects the first prompt of a fresh challenge", () => {
			const { page } = start();

			expect(page.clicks).toEqual(["prompt:Kaffee"]);
			expect(page.selected()).toBe(page.prompts[0]);
		});
	});

	describe("answering", () => {
		test("enter taps the hidden tile carrying the typed text", async () => {
			const { page, challenge, input } = start();

			typeAndEnter(challenge, "Kaffee");
			await flush();

			expect(page.prompts[0].getAttribute("aria-disabled")).toBe("true");
			expect(page.answers[2].getAttribute("aria-disabled")).toBe("true");
			expect(input.value).toBe("");
			expect(page.hearts()).toBe(5);
		});

		test("typing alone never taps a tile, since a wrong tap costs a heart", () => {
			const { page, challenge, input } = start();

			for (const text of ["e", "ei", "ein"]) {
				input.value = text;
				challenge.handleInput();
			}

			expect(page.clicks).toEqual(["prompt:Kaffee"]);
		});

		test("matching is case-insensitive", () => {
			const { page, challenge } = start();

			typeAndEnter(challenge, "kaffee");

			expect(page.answers[2].getAttribute("aria-disabled")).toBe("true");
		});

		test("text that is no remaining answer taps nothing and stays in the input", () => {
			const { page, challenge, input } = start();

			typeAndEnter(challenge, "Milch");

			expect(page.clicks).toEqual(["prompt:Kaffee"]);
			expect(input.value).toBe("Milch");
			expect(input.style.border).toContain("red");
		});

		test("an answer already paired off is no longer offered", async () => {
			const { page, challenge, input } = start();

			typeAndEnter(challenge, "Kaffee");
			await flush();
			typeAndEnter(challenge, "Kaffee");

			expect(page.clicks.filter(click => click === "answer:Kaffee")).toHaveLength(1);
			expect(input.value).toBe("Kaffee");
		});

		test("a wrong answer is still tapped, so Duolingo grades it like a wrong tap", () => {
			const { page, challenge } = start();

			typeAndEnter(challenge, "Tochter");

			expect(page.clicks).toEqual(["prompt:Kaffee", "answer:Tochter"]);
			expect(page.hearts()).toBe(4);
		});

		test("ignores accents when that setting is on", () => {
			window.ignoreAccentsEnabled = true;
			const { page, challenge } = start({ prompts: ["Töchter", "ja"], answers: ["ja", "Töchter"] });

			typeAndEnter(challenge, "tochter");

			expect(page.answers[1].getAttribute("aria-disabled")).toBe("true");
		});

		test("still requires accents when that setting is off", () => {
			const { page, challenge } = start({ prompts: ["Töchter", "ja"], answers: ["ja", "Töchter"] });

			typeAndEnter(challenge, "tochter");

			expect(page.clicks).toEqual(["prompt:Töchter"]);
		});

		test("matches answer tiles that hold several words", () => {
			const { page, challenge } = start({ prompts: ["une sœur", "tu as"], answers: ["tu as", "une sœur"] });
			// Live multi-word tiles move the first word behind the marker.
			page.prompts[0].setAttribute("data-test", "sœur-challenge-tap-token une");
			page.answers[1].setAttribute("data-test", "sœur-challenge-tap-token une");

			typeAndEnter(challenge, "une sœur");

			expect(page.answers[1].getAttribute("aria-disabled")).toBe("true");
		});
	});

	describe("moving on", () => {
		test("selects the next open prompt once a pair locks in", async () => {
			const { page, challenge } = start();

			typeAndEnter(challenge, "Kaffee");
			await flush();

			expect(page.selected()).toBe(page.prompts[1]);
			expect(page.clicks).toEqual(["prompt:Kaffee", "answer:Kaffee", "prompt:ein"]);
		});

		test("selects nothing after a wrong pair, because the user picks what to retry", async () => {
			const { page, challenge } = start();

			typeAndEnter(challenge, "Tochter");
			await flush();

			expect(page.selected()).toBeNull();
			expect(page.clicks).toEqual(["prompt:Kaffee", "answer:Tochter"]);
		});

		test("pairs with whatever prompt the user tapped instead", async () => {
			const { page, challenge } = start();

			page.prompts[2].click();
			typeAndEnter(challenge, "Tochter");
			await flush();

			expect(page.prompts[2].getAttribute("aria-disabled")).toBe("true");
			expect(page.answers[1].getAttribute("aria-disabled")).toBe("true");
			expect(page.hearts()).toBe(5);
		});

		test("a whole challenge can be answered from the keyboard", async () => {
			const { page, challenge } = start();

			for (const answer of ["Kaffee", "ein", "Tochter", "ja"]) {
				typeAndEnter(challenge, answer);
				await flush();
			}

			expect([...page.prompts, ...page.answers].every(tile => tile.getAttribute("aria-disabled") === "true")).toBe(true);
			expect(page.hearts()).toBe(5);
		});

		test("enter on an empty input continues once every pair is matched", async () => {
			const { page, challenge } = start();
			const submitted = jest.fn();
			page.submit.addEventListener("click", submitted);

			for (const answer of ["Kaffee", "ein", "Tochter", "ja"]) {
				typeAndEnter(challenge, answer);
				await flush();
			}
			challenge.handleKeyEvent(key("Enter"));

			expect(submitted).toHaveBeenCalledTimes(1);
		});

		test("enter on an empty input does nothing while pairs remain", () => {
			const { page, challenge } = start();
			const submitted = jest.fn();
			page.submit.addEventListener("click", submitted);

			challenge.handleKeyEvent(key("Enter"));

			expect(submitted).not.toHaveBeenCalled();
		});
	});

	describe("editing keys the event manager swallows", () => {
		test("space and apostrophe are inserted", () => {
			const { challenge, input } = start();

			input.value = "tu";
			challenge.handleKeyEvent(key(" "));
			challenge.handleKeyEvent(key("'"));

			expect(input.value).toBe("tu '");
		});

		test("backspace deletes one character", () => {
			const { challenge, input } = start();

			input.value = "Kaffee";
			challenge.handleKeyEvent(key("Backspace"));

			expect(input.value).toBe("Kaffe");
		});

		test("ctrl or alt + backspace deletes the trailing word", () => {
			const { challenge, input } = start();

			input.value = "une sœur";
			challenge.handleKeyEvent(key("Backspace", { ctrlKey: true }));
			expect(input.value).toBe("une ");

			input.value = "tu as";
			challenge.handleKeyEvent(key("Backspace", { altKey: true }));
			expect(input.value).toBe("tu ");
		});
	});

	describe("issue #67 — match, with text in both columns", () => {
		const MATCH = {
			promptTexts: ["water", "cat", "milk", "dog", "mom"],
			prompts: ["agua", "gato", "leche", "perro", "mamá"],
			answers: ["agua", "perro", "leche", "gato", "mamá"],
			promptLang: "en",
			answerLang: "es"
		};

		test("accepts the live markup", () => {
			const { challengeDiv } = buildMatch(MATCH);
			expect(ChallengeMatch.isPairLayout(challengeDiv)).toBe(true);
		});

		test("rejects text columns that share a language, since the split could be wrong", () => {
			const { challengeDiv } = buildMatch({ ...MATCH, answerLang: "en" });
			expect(ChallengeMatch.isPairLayout(challengeDiv)).toBe(false);
		});

		test("rejects text columns without a language", () => {
			const { challengeDiv } = buildMatch({ ...MATCH, promptLang: null, answerLang: null });
			expect(ChallengeMatch.isPairLayout(challengeDiv)).toBe(false);
		});

		test("rejects a column whose tiles disagree on the language", () => {
			const { challengeDiv, answers } = buildMatch(MATCH);
			answers[0].setAttribute("lang", "en");
			expect(ChallengeMatch.isPairLayout(challengeDiv)).toBe(false);
		});

		test("hides the learning-language column and keeps the prompts", () => {
			const { page } = start(MATCH);

			expect(page.answers.every(tile => tile.style.display === "none")).toBe(true);
			expect(page.prompts.every(tile => tile.style.display !== "none")).toBe(true);
			expect(page.selected()).toBe(page.prompts[0]);
		});

		test("reads the answer text without the hotkey number", () => {
			const { page, challenge } = start(MATCH);

			typeAndEnter(challenge, "agua");

			expect(page.answers[0].getAttribute("aria-disabled")).toBe("true");
		});

		test("a whole challenge can be answered from the keyboard", async () => {
			const { page, challenge } = start(MATCH);

			for (const answer of ["agua", "gato", "leche", "perro", "mamá"]) {
				typeAndEnter(challenge, answer);
				await flush();
			}

			expect([...page.prompts, ...page.answers].every(tile => tile.getAttribute("aria-disabled") === "true")).toBe(true);
			expect(page.hearts()).toBe(5);
		});

		test("folds the accent on mamá when accents are ignored", () => {
			window.ignoreAccentsEnabled = true;
			const { page, challenge } = start({ ...MATCH, promptTexts: ["mom", "cat"], prompts: ["mamá", "gato"], answers: ["gato", "mamá"] });

			typeAndEnter(challenge, "mama");

			expect(page.answers[1].getAttribute("aria-disabled")).toBe("true");
		});
	});

	describe("cleanup", () => {
		test("restores the tiles, removes the input and unregisters", () => {
			const { page, challenge, input } = start();

			challenge.cleanup();

			for (const answer of page.answers) {
				expect(answer.style.display).toBe("");
			}
			expect(input.isConnected).toBe(false);
			expect(challenge.elements.inputField).toBeNull();
			expect(eventManager.activeChallenges.has(challenge.challengeId)).toBe(false);
		});

		test("stops selecting prompts after cleanup", async () => {
			const { page, challenge } = start();

			challenge.cleanup();
			page.prompts[0].setAttribute("aria-disabled", "true");
			page.answers[2].setAttribute("aria-disabled", "true");
			await flush();

			expect(page.clicks).toEqual(["prompt:Kaffee"]);
		});
	});
});
