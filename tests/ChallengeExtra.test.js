/**
 * @jest-environment jsdom
 */
import { Challenge } from "../src/Challenge.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";
import { WordBank } from "../src/WordBank.js";

// Create a dummy subclass to be able to instantiate Challenge.
class DummyChallenge extends Challenge {
	// Override abstract methods:
	handleBackspace() { /* empty implementation for testing */ }
	handleSubmit() { return "submitted"; }
}

function createDummyChallengeDiv() {
	const div = document.createElement("div");
	div.setAttribute("data-test", "challenge challenge-dummy");
	const header = document.createElement("h1");
	header.setAttribute("data-test", "challenge-header");
	header.textContent = "Dummy Question";
	div.appendChild(header);
	const wb = document.createElement("div");
	wb.dataset.test = "word-bank";
	// Create a dummy word button with text "dummy"
	const btn = document.createElement("button");
	btn.setAttribute("data-test", "challenge-tap-token");
	// Mark button as enabled by default.
	btn.setAttribute("aria-disabled", "false");
	const span = document.createElement("span");
	span.setAttribute("data-test", "challenge-tap-token-text");
	span.textContent = "dummy";
	btn.appendChild(span);
	wb.appendChild(btn);
	div.appendChild(wb);
	// Append a submit button (used by extractElements)
	const submitBtn = document.createElement("button");
	submitBtn.dataset.test = "player-next";
	document.body.appendChild(submitBtn);
	return div;
}

describe("DummyChallenge extra branches (Challenge.js)", () => {
	let challengeDiv, eventManager, challenge;
	beforeEach(() => {
		document.body.innerHTML = "";
		challengeDiv = createDummyChallengeDiv();
		eventManager = new ExtensionEventManager();
		challenge = new DummyChallenge(challengeDiv, eventManager);
		// Override wordBank and remainingChoices for controlled testing.
		challenge.wordBank = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
		challenge.remainingChoices = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
		// Create an input field.
		challenge.elements.inputField = document.createElement("textarea");
	});

	test("handleSpace sets red border when input word not found", () => {
		// Set input to a word that is not present in remainingChoices.
		challenge.elements.inputField.value = "nonexistent";
		// Make sure remainingChoices does not contain "nonexistent"
		challenge.remainingChoices.wordMap.clear();
		// Spy on console.warn so we can check later.
		const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
		challenge.handleSpace();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining("Word nonexistent not found in choices")
		);
		// Also, the input field’s style should have been modified.
		expect(challenge.elements.inputField.style.border).toBe("2px solid red");
		// Clean up spy.
		warnSpy.mockRestore();
	});

	test("injectTypingInput calls console.warn when word bank is missing", () => {
		// Simulate missing word bank by setting both elements.wordBank and wordBank to null.
		challenge.elements.wordBank = null;
		challenge.wordBank = null;
		const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
		challenge.injectTypingInput();
		expect(warnSpy).toHaveBeenCalledWith("Word bank not found");
		warnSpy.mockRestore();
	});

	test("handleKeyEvent for Enter calls handleSubmit", () => {
		// Prepare input with a word that is available.
		challenge.elements.inputField.value = "dummy";
		// Override remainingChoices.selectWord to return a button with a click spy.
		const dummyBtn = document.createElement("button");
		dummyBtn.click = jest.fn();
		challenge.remainingChoices.selectWord = jest.fn().mockReturnValue(dummyBtn);
		// Override handleSubmit.
		challenge.handleSubmit = jest.fn();
		// Create an Enter key event.
		const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
		challenge.handleKeyEvent(enterEvent);
		expect(challenge.handleSubmit).toHaveBeenCalled();
	});
});
