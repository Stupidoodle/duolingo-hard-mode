/**
 * @jest-environment jsdom
 */
import { ChallengeTapComplete } from "../src/ChallengeTapComplete.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";
import { WordBank } from "../src/WordBank.js";

function createChallengeDiv(challengeType = "tapComplete") {
	const div = document.createElement("div");
	div.setAttribute("data-test", `challenge challenge-${challengeType}`);

	const h1 = document.createElement("h1");
	h1.setAttribute("data-test", "challenge-header");
	h1.textContent = "Tap Complete Question";
	div.appendChild(h1);

	const wb = document.createElement("div");
	wb.dataset.test = "word-bank";

	const btn = document.createElement("button");
	// Use expected data-test attribute for extraction.
	btn.setAttribute("data-test", "challenge-tap-token");
	// Initially mark this button as active.
	btn.setAttribute("aria-disabled", "false");

	const span = document.createElement("span");
	span.setAttribute("data-test", "challenge-tap-token-text");
	span.textContent = "tap";
	btn.appendChild(span);

	wb.appendChild(btn);
	div.appendChild(wb);
	return div;
}

describe("ChallengeTapComplete", () => {
	let challengeDiv, eventManager, challenge;
	beforeEach(() => {
		document.body.innerHTML = "";
		challengeDiv = createChallengeDiv("tapComplete");
		// Append to document so that querySelectorAll works as in production.
		document.body.appendChild(challengeDiv);

		const submitBtn = document.createElement("button");
		submitBtn.dataset.test = "player-next";
		document.body.appendChild(submitBtn);

		eventManager = new ExtensionEventManager();
		challenge = new ChallengeTapComplete(challengeDiv, eventManager);

		// Initialize wordBank and remainingChoices from the appended DOM.
		challenge.wordBank = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
		challenge.remainingChoices = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));

		// Set up the input field.
		challenge.elements.inputField = document.createElement("textarea");
		challenge.elements.inputField.value = "tap";
	});

	test("handleBackspace re-enables a removed word in tapComplete", () => {
		// Simulate that the word "tap" was used by removing its button from remainingChoices.
		challenge.remainingChoices.wordMap.get("tap").pop();

		// Mark the original button as disabled so that it won’t be chosen.
		const originalButton = challenge.wordBank.wordMap.get("tap")[0];
		if (originalButton) {
			originalButton.setAttribute("aria-disabled", "true");
		}

		// Override cleanInputText to simulate deletion:
		jest.spyOn(challenge, "cleanInputText").mockImplementation(() => {
			// Simulate deletion: return an array missing the full "tap" (e.g. "ta")
			// But restore the input field's value to the full word for index calculation.
			challenge.elements.inputField.value = "tap";
			return ["ta"];
		});

		// Create a dummy DOM button element that simulates the re-enabled button.
		const dummyBtn = document.createElement("button");
		dummyBtn.setAttribute("data-test", "challenge-tap-token");
		dummyBtn.setAttribute("aria-disabled", "false");
		const dummySpan = document.createElement("span");
		dummySpan.setAttribute("data-test", "challenge-tap-token-text");
		dummySpan.textContent = "tap";
		dummyBtn.appendChild(dummySpan);
		dummyBtn.click = jest.fn(); // spy on its click method

		// Override returnLastUsed so it returns our dummy button.
		challenge.remainingChoices.returnLastUsed = jest.fn().mockReturnValue(dummyBtn);

		// Append the dummy button so document.querySelectorAll can find it.
		document.body.appendChild(dummyBtn);

		// Execute backspace handling.
		challenge.handleBackspace();

		// Verify that returnLastUsed was called with "tap"
		expect(challenge.remainingChoices.returnLastUsed).toHaveBeenCalledWith("tap");
		// Verify that the dummy button's click method was invoked.
		expect(dummyBtn.click).toHaveBeenCalled();
	});
});
