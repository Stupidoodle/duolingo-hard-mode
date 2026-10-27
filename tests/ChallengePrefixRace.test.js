/**
 * @jest-environment jsdom
 *
 * Issue #91 — typing "are" claimed the "a" bubble on its first keystroke and
 * released it on the second. Duolingo animates a released bubble back into the
 * bank and keeps it aria-disabled meanwhile, so typing "a" as its own word a
 * moment later clicked a disabled bubble: Duolingo ignored it while the
 * extension recorded the word as placed, and the answer went out without it.
 */
import { ChallengeTranslate } from "../src/ChallengeTranslate.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";

const eventManager = new ExtensionEventManager();
const RETURN_ANIMATION_MS = 200;

/**
 * A word bank that behaves like Duolingo's: a tapped bubble greys out and a copy
 * lands in the answer row; tapping the copy removes it, and the bubble only
 * re-enables once its return animation finishes. Clicks on a disabled bubble
 * are ignored, as they are on the page.
 */
function renderChallenge(words) {
	document.body.innerHTML = `
		<div data-test="challenge challenge-translate">
			<h1 data-test="challenge-header">Write this in English</h1>
			<div data-test="answer"></div>
			<div data-test="word-bank"></div>
		</div>
		<button data-test="player-next"></button>`;
	const div = document.querySelector("[data-test^='challenge challenge-']");
	const answer = div.querySelector("[data-test='answer']");
	const bank = div.querySelector("[data-test='word-bank']");
	const bubble = text => {
		const button = document.createElement("button");
		button.setAttribute("data-test", `${text}-challenge-tap-token`);
		button.setAttribute("aria-disabled", "false");
		button.innerHTML = `<span data-test="challenge-tap-token-text">${text}</span>`;
		return button;
	};
	for (const word of words) {
		const source = bubble(word);
		source.addEventListener("click", () => {
			if (source.getAttribute("aria-disabled") === "true") return;
			source.setAttribute("aria-disabled", "true");
			const placed = bubble(word);
			placed.addEventListener("click", () => {
				placed.remove();
				setTimeout(() => source.setAttribute("aria-disabled", "false"), RETURN_ANIMATION_MS);
			});
			answer.appendChild(placed);
		});
		bank.appendChild(source);
	}
	const challenge = new ChallengeTranslate(div, eventManager);
	challenge.enforceTyping();
	const placed = () => [...answer.querySelectorAll("[data-test='challenge-tap-token-text']")].map(s => s.textContent);
	return { challenge, placed, bank };
}

/** Types like a person at `msPerKey`, letting animations run in between. */
function typeOut(challenge, text, msPerKey = 40) {
	for (const char of text) {
		if (char === " ") {
			challenge.handleKeyEvent({ key: " " });
		} else {
			challenge.elements.inputField.value += char;
			challenge.handleInput();
		}
		jest.advanceTimersByTime(msPerKey);
	}
}

describe("issue #91 — short words that start a longer bubble", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		window.ignoreAccentsEnabled = false;
		window.ignoreApostrophesEnabled = false;
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	test("typing the sentence that failed live places every bubble in order", () => {
		const { challenge, placed } = renderChallenge(["What", "ruler", "lot", "there", "parks", "When", "through", "a", "neighborhood", "this", "In", "of", "are"]);

		typeOut(challenge, "In this neighborhood there are a lot of parks");
		jest.advanceTimersByTime(1000);

		expect(placed().join(" ")).toBe("In this neighborhood there are a lot of parks");
	});

	test("the first letter of 'are' does not tap the 'a' bubble", () => {
		const { challenge, placed } = renderChallenge(["a", "are", "lot"]);

		typeOut(challenge, "ar");

		expect(placed()).toEqual([]);
	});

	test("a word that starts no other bubble is still placed as soon as it is complete", () => {
		const { challenge, placed } = renderChallenge(["a", "are", "lot"]);

		typeOut(challenge, "lot");

		expect(placed()).toEqual(["lot"]);
	});

	test("space settles a word that starts a longer bubble", () => {
		const { challenge, placed } = renderChallenge(["a", "are", "lot"]);

		typeOut(challenge, "a ");

		expect(placed()).toEqual(["a"]);
	});

	test("enter places a trailing word that starts a longer bubble", () => {
		const { challenge, placed } = renderChallenge(["a", "are", "lot"]);
		const submit = jest.spyOn(challenge, "handleSubmit").mockImplementation(() => {});

		typeOut(challenge, "are a");
		challenge.handleKeyEvent({ key: "Enter" });

		expect(placed()).toEqual(["are", "a"]);
		expect(submit).toHaveBeenCalled();
	});

	test("a settled word is placed before the next one even if its space was skipped over", () => {
		const { challenge, placed } = renderChallenge(["tu", "tu as", "faim"]);

		typeOut(challenge, "tu faim");

		expect(placed()).toEqual(["tu", "faim"]);
	});

	test("a bubble still animating back is tapped once it re-enables", () => {
		const { challenge, placed } = renderChallenge(["lot", "parks"]);

		typeOut(challenge, "lot");
		challenge.handleKeyEvent({ key: "Backspace", ctrlKey: false, altKey: false });
		jest.advanceTimersByTime(20);
		challenge.elements.inputField.value += "t";
		challenge.handleInput();

		expect(placed()).toEqual([]);

		jest.advanceTimersByTime(RETURN_ANIMATION_MS + 100);

		expect(placed()).toEqual(["lot"]);
	});

	test("taps queued behind an animation keep their typed order", () => {
		const { challenge, placed } = renderChallenge(["lot", "of", "parks"]);

		typeOut(challenge, "lot");
		challenge.handleKeyEvent({ key: "Backspace", ctrlKey: false, altKey: false });
		typeOut(challenge, "t of parks", 10);
		jest.advanceTimersByTime(1000);

		expect(placed()).toEqual(["lot", "of", "parks"]);
	});
});
