/**
 * @jest-environment jsdom
 */
import { Challenge } from "../src/Challenge.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";
import { WordBank } from "../src/WordBank.js";

// Create a dummy subclass to allow instantiation.
class DummyChallenge extends Challenge {
	handleBackspace() {}
	handleSubmit() {} // Needed because handleKeyEvent calls it on Enter.
}

function createChallengeDiv(challengeType = "dummy") {
	const div = document.createElement("div");
	div.setAttribute("data-test", `challenge challenge-${challengeType}`);
	const header = document.createElement("h1");
	header.setAttribute("data-test", "challenge-header");
	header.textContent = "Dummy Question";
	div.appendChild(header);
	const wb = document.createElement("div");
	wb.dataset.test = "word-bank";
	// Create two dummy word buttons
	["word1", "word2"].forEach(word => {
		const btn = document.createElement("button");
		btn.setAttribute("data-test", "challenge-tap-token");
		const span = document.createElement("span");
		span.setAttribute("data-test", "challenge-tap-token-text");
		span.textContent = word;
		btn.appendChild(span);
		wb.appendChild(btn);
	});
	div.appendChild(wb);
	return div;
}

describe("DummyChallenge (base methods in Challenge)", () => {
	let challengeDiv, eventManager, challenge;
	beforeEach(() => {
		document.body.innerHTML = "";
		challengeDiv = createChallengeDiv();
		const submitBtn = document.createElement("button");
		submitBtn.dataset.test = "player-next";
		document.body.appendChild(submitBtn);
		eventManager = new ExtensionEventManager();
		challenge = new DummyChallenge(challengeDiv, eventManager);
		// Override wordBank and remainingChoices for controlled testing.
		challenge.wordBank = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
		challenge.remainingChoices = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
		challenge.elements.inputField = document.createElement("textarea");
	});

	test("cleanInputText returns [] when input ends with space", () => {
		challenge.elements.inputField.value = "hello ";
		const words = challenge.cleanInputText();
		expect(words).toEqual([]);
		expect(challenge.elements.inputField.value).toBe("hello");
	});

	test("cleanInputText returns modified words when no trailing space", () => {
		challenge.elements.inputField.value = "hello";
		const words = challenge.cleanInputText();
		// The method slices off one character.
		expect(words).toEqual(["hell"]);
		expect(challenge.elements.inputField.value).toBe("hell");
	});

	test("cleanup unregisters challenge and cleans up DOM elements", () => {
		challenge.elements.inputField = document.createElement("textarea");
		challenge.elements.wordBank.style.display = "none";
		eventManager.registerChallenge(challenge.challengeId, challenge);
		challenge.cleanup();
		expect(eventManager.activeChallenges.has(challenge.challengeId)).toBe(false);
		expect(challenge.elements.inputField).toBeNull();
		expect(challenge.elements.wordBank.style.display).toBe("flex");
	});

	test("injectTypingInput hides word bank and creates textarea", () => {
		challenge.elements.wordBank.style.display = "flex";
		challenge.elements.inputField = null;
		challenge.injectTypingInput();
		expect(challenge.elements.wordBank.style.display).toBe("none");
		expect(challenge.elements.inputField).not.toBeNull();
		expect(challenge.elements.inputField.tagName).toBe("TEXTAREA");
	});

	test("handleSpace selects available word and appends a space", () => {
		challenge.elements.inputField.value = "word1";
		const selectSpy = jest.spyOn(challenge.remainingChoices, "selectWord").mockImplementation((word) => {
			const btn = document.createElement("button");
			btn.click = jest.fn();
			return btn;
		});
		challenge.handleSpace();
		expect(selectSpy).toHaveBeenCalledWith("word1");
		expect(challenge.elements.inputField.value.endsWith(" ")).toBe(true);
	});

	test("handleKeyEvent dispatches based on key", () => {
		challenge.handleSpace = jest.fn();
		challenge.handleBackspace = jest.fn();
		challenge.handleEnter = jest.fn();
		const spaceEvent = new KeyboardEvent("keydown", { key: " " });
		challenge.handleKeyEvent(spaceEvent);
		expect(challenge.handleSpace).toHaveBeenCalled();

		const backspaceEvent = new KeyboardEvent("keydown", { key: "Backspace" });
		challenge.handleKeyEvent(backspaceEvent);
		expect(challenge.handleBackspace).toHaveBeenCalled();

		const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
		challenge.handleKeyEvent(enterEvent);
		expect(challenge.handleEnter).toHaveBeenCalled();
	});
});
