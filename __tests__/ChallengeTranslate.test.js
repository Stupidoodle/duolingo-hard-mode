/**
 * @jest-environment jsdom
 */
import { ChallengeTranslate } from "../src/ChallengeTranslate.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";
import { WordBank } from "../src/WordBank.js";

// Helper to create a basic challenge div.
function createChallengeDiv(challengeType = "translate") {
	const div = document.createElement("div");
	div.setAttribute("data-test", `challenge challenge-${challengeType}`);
	// Create a dummy header
	const h1 = document.createElement("h1");
	h1.setAttribute("data-test", "challenge-header");
	h1.textContent = "Test Question";
	div.appendChild(h1);
	// Create a dummy word bank container with one word button.
	const wb = document.createElement("div");
	wb.dataset.test = "word-bank";
	const btn = document.createElement("button");
	btn.setAttribute("data-test", "challenge-tap-token");
	const span = document.createElement("span");
	span.setAttribute("data-test", "challenge-tap-token-text");
	span.textContent = "test";
	btn.appendChild(span);
	wb.appendChild(btn);
	div.appendChild(wb);
	return div;
}

describe("ChallengeTranslate", () => {
	let challengeDiv, eventManager, challenge;
	beforeEach(() => {
		document.body.innerHTML = "";
		challengeDiv = createChallengeDiv("translate");
		// Create a dummy submit button required by Challenge.
		const submitBtn = document.createElement("button");
		submitBtn.dataset.test = "player-next";
		document.body.appendChild(submitBtn);
		eventManager = new ExtensionEventManager();
		challenge = new ChallengeTranslate(challengeDiv, eventManager);
		// Override the wordBank and remainingChoices for control.
		challenge.wordBank = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
		challenge.remainingChoices = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
		// Inject a dummy input field for testing.
		challenge.elements.inputField = document.createElement("textarea");
	});

	test("cleanInputText returns [] when input ends with space", () => {
		challenge.elements.inputField.value = "test ";
		const words = challenge.cleanInputText();
		expect(words).toEqual([]); // Because trailing space triggers removal.
		expect(challenge.elements.inputField.value).toBe("test");
	});

	test("cleanInputText returns modified words when no trailing space", () => {
		challenge.elements.inputField.value = "test";
		const words = challenge.cleanInputText();
		// "test" becomes "tes" after slicing, so the result is ["tes"].
		expect(words).toEqual(["tes"]);
		expect(challenge.elements.inputField.value).toBe("tes");
	});

	test("handleBackspace re-enables a removed word", () => {
		// Set up input without trailing space so that cleanInputText returns ["tes"]
		challenge.elements.inputField.value = "test";
		// Remove one instance from remainingChoices for the word "test"
		challenge.remainingChoices.wordMap.get("test").pop();

		// Create a dummy DOM button element
		const dummyBtn = document.createElement("button");
		dummyBtn.setAttribute("data-test", "dummy");
		dummyBtn.setAttribute("aria-disabled", "false");
		// Spy on the button's click method
		dummyBtn.click = jest.fn();

		// Have returnLastUsed return the actual DOM element
		challenge.remainingChoices.returnLastUsed = jest.fn().mockReturnValue(dummyBtn);

		// Append the dummy button to the document so that querySelectorAll can find it
		document.body.appendChild(dummyBtn);

		challenge.handleBackspace();

		// Expect that returnLastUsed was called with "test" (the full word)
		expect(challenge.remainingChoices.returnLastUsed).toHaveBeenCalledWith("test");
		// And that the dummy button's click method was called.
		expect(dummyBtn.click).toHaveBeenCalled();
	});
});
