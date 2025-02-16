/**
 * @jest-environment jsdom
 */
import { Challenge } from "../src/Challenge.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";
import { WordBank } from "../src/WordBank.js";

// Create a dummy subclass to allow instantiation.
class DummyChallenge extends Challenge {
	handleBackspace() {}
}

function createChallengeDivWhereWordEndsWithApostrophe(challengeType = "dummy") {
	const div = document.createElement("div");
	div.setAttribute("data-test", `challenge challenge-${challengeType}`);
	const header = document.createElement("h1");
	header.setAttribute("data-test", "challenge-header");
	header.textContent = "Dummy Question";
	div.appendChild(header);
	const wb = document.createElement("div");
	wb.dataset.test = "word-bank";
	// Create two dummy word buttons
	["you'", "re"].forEach(word => {
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

function createChallengeDivWhereWordStartsWithApostrophe(challengeType = "dummy") {
	const div = document.createElement("div");
	div.setAttribute("data-test", `challenge challenge-${challengeType}`);
	const header = document.createElement("h1");
	header.setAttribute("data-test", "challenge-header");
	header.textContent = "Dummy Question";
	div.appendChild(header);
	const wb = document.createElement("div");
	wb.dataset.test = "word-bank";
	// Create two dummy word buttons
	["you", "'re"].forEach(word => {
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

describe("Challenge Div Tests", () => {
	let challengeDiv, eventManager, challenge;

	beforeEach(() => {
		document.body.innerHTML = "";
		eventManager = new ExtensionEventManager();
	});

	describe("Word ends with apostrophe", () => {
		beforeEach(() => {
			jest.useFakeTimers();
			challengeDiv = createChallengeDivWhereWordEndsWithApostrophe();
			challenge = new DummyChallenge(challengeDiv, eventManager);
			// Override wordBank and remainingChoices for controlled testing.
			challenge.wordBank = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
			challenge.remainingChoices = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
			challenge.elements.inputField = document.createElement("textarea");
		});

		test("cleanInputText returns modified words with trailing space", () => {
			challenge.elements.inputField.value = "you're maria ";
			const words = challenge.cleanInputText();
			expect(words).toEqual(["you'", "re"]);
			expect(challenge.elements.inputField.value).toBe("you're maria");
		});

		test("cleanInputText returns modified words without trailing space", () => {
			challenge.elements.inputField.value = "you're maria";
			const words = challenge.cleanInputText();
			expect(words).toEqual(["you'", "re", "mari"]);
			expect(challenge.elements.inputField.value).toBe("you're mari");
		});

		test("cleanInputText returns modified words when the word contains a contraction with trailing space", () => {
			challenge.elements.inputField.value = "you're ";
			const words = challenge.cleanInputText();
			expect(words).toEqual(["you'"]);
			expect(challenge.elements.inputField.value).toBe("you're");
		});

		test("cleanInputText returns modified words when the word contains a contraction without trailing space", () => {
			challenge.elements.inputField.value = "you're";
			const words = challenge.cleanInputText();
			expect(words).toEqual(["you'", "r"]);
			expect(challenge.elements.inputField.value).toBe("you'r");
		});

		test("handleKeyEvent for apostrophe works correctly", () =>{
			challenge.elements.inputField.value = "you";
			const selectSpy = jest.spyOn(challenge.remainingChoices, "selectWord").mockImplementation((word) => {
				const btn = document.createElement("button");
				btn.click = jest.fn();
				return btn;
			});
			const apostropheEvent = new KeyboardEvent("keydown", { key: "'" });
			challenge.handleKeyEvent(apostropheEvent);
			expect(selectSpy).toHaveBeenCalledWith("you'");
			expect(challenge.elements.inputField.value.endsWith("'")).toBe(true);
			expect(challenge.handleSpace).toBe(challenge.handleSpaceAfterApostrophe);
			challenge.elements.inputField.value = "you're";
			const spaceEvent = new KeyboardEvent("keydown", { key: " " });
			challenge.handleKeyEvent(spaceEvent);
			expect(selectSpy).toHaveBeenCalledWith("re");
			expect(challenge.elements.inputField.value.endsWith(" ")).toBe(true);
			expect(challenge.handleSpace).toBe(challenge.handleSpace);
		});

		test("handleApostrophe sets red border when input word not found", () => {
			// Set input to a word that is not present in remainingChoices.
			challenge.elements.inputField.value = "nonexistent";
			// Make sure remainingChoices does not contain "nonexistent'"
			challenge.remainingChoices.wordMap.clear();
			// Spy on console.warn so we can check later.
			const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
			challenge.handleApostrophe();
			expect(warnSpy).toHaveBeenCalledWith(
				expect.stringContaining("Word nonexistent' not found in choices")
			);
			// Also, the input field’s style should have been modified.
			expect(challenge.elements.inputField.style.border).toBe("2px solid red");
			expect(challenge.elements.inputField.style.animation).toBe("shake 0.3s");
			jest.runAllTimers();
			expect(challenge.elements.inputField.style.animation).toBe("");
			// Clean up spy.
			warnSpy.mockRestore();
		});

		test("handleSpaceAfterApostrophe sets red border when input word not found", () => {
			// Set input to a word that is not present in remainingChoices.
			challenge.elements.inputField.value = "you're";
			// Make sure remainingChoices does not contain "you're"
			challenge.remainingChoices.wordMap.clear();
			// Spy on console.warn so we can check later.
			const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
			challenge.handleSpaceAfterApostrophe();
			expect(warnSpy).toHaveBeenCalledWith(
				expect.stringContaining("Word re not found in choices")
			);
			// Also, the input field’s style should have been modified.
			expect(challenge.elements.inputField.style.border).toBe("2px solid red");
			expect(challenge.elements.inputField.style.animation).toBe("shake 0.3s");
			jest.runAllTimers();
			expect(challenge.elements.inputField.style.animation).toBe("");
			// Clean up spy.
			warnSpy.mockRestore();
		})

		test("handleSpaceAfterApostrophe returns when userInput is empty", () => {
			challenge.elements.inputField.value = "";
			const selectSpy = jest.spyOn(challenge.remainingChoices, "selectWord").mockImplementation((word) => {
				const btn = document.createElement("button");
				btn.click = jest.fn();
				return btn;
			});
			challenge.handleSpaceAfterApostrophe();
			expect(selectSpy).not.toHaveBeenCalled();
		})
	});

	describe("Word starts with apostrophe", () => {
		beforeEach(() => {
			jest.useFakeTimers();
			challengeDiv = createChallengeDivWhereWordStartsWithApostrophe();
			challenge = new DummyChallenge(challengeDiv, eventManager);
			// Override wordBank and remainingChoices for controlled testing.
			challenge.wordBank = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
			challenge.remainingChoices = new WordBank(challengeDiv.querySelector("div[data-test='word-bank']"));
			challenge.elements.inputField = document.createElement("textarea");
		});

		test("cleanInputText returns modified words with trailing space", () => {
			challenge.elements.inputField.value = "you're maria ";
			const words = challenge.cleanInputText();
			expect(words).toEqual(["you", "'re"]);
			expect(challenge.elements.inputField.value).toBe("you're maria");
		});

		test("cleanInputText returns modified words without trailing space", () => {
			challenge.elements.inputField.value = "you're maria";
			const words = challenge.cleanInputText();
			expect(words).toEqual(["you", "'re", "mari"]);
			expect(challenge.elements.inputField.value).toBe("you're mari");
		});

		test("cleanInputText returns modified words when the word contains a contraction with trailing space", () => {
			challenge.elements.inputField.value = "you're ";
			const words = challenge.cleanInputText();
			expect(words).toEqual(["you"]);
			expect(challenge.elements.inputField.value).toBe("you're");
		});

		test("cleanInputText returns modified words when the word contains a contraction without trailing space", () => {
			challenge.elements.inputField.value = "you're";
			const words = challenge.cleanInputText();
			expect(words).toEqual(["you", "'r"]);
			expect(challenge.elements.inputField.value).toBe("you'r");
		});

		test("handleKeyEvent for apostrophe works correctly", () => {
			challenge.elements.inputField.value = "you're";
			const selectSpy = jest.spyOn(challenge.remainingChoices, "selectWord").mockImplementation((word) => {
				const btn = document.createElement("button");
				btn.click = jest.fn();
				return btn;
			});
			const spaceEvent = new KeyboardEvent("keydown", { key: " " });
			challenge.handleKeyEvent(spaceEvent);
			expect(selectSpy).toHaveBeenCalledWith("you");
			expect(selectSpy).toHaveBeenCalledWith("'re");
			expect(challenge.elements.inputField.value.endsWith(" ")).toBe(true);
		});

		test("handleKeyEvent for apostrophe works correctly", () => {
			challenge.elements.inputField.value = "you";
			const apostropheEvent = new KeyboardEvent("keydown", { key: "'" });
			challenge.handleKeyEvent(apostropheEvent);
			expect(challenge.elements.inputField.value.endsWith("'")).toBe(true);
		});

		test("handleSpace still chooses the second part of the contraction when it is divided by a space", () => {
			challenge.elements.inputField.value = "you 're";
			const selectSpy = jest.spyOn(challenge.remainingChoices, "selectWord").mockImplementation((word) => {
				const btn = document.createElement("button");
				btn.click = jest.fn();
				return btn;
			});
			challenge.handleSpace();
			expect(selectSpy).toHaveBeenCalledWith("'re");
			expect(challenge.elements.inputField.value.endsWith(" ")).toBe(true);
		});

		test("handleSpace sets red border when input word not found and the input contains an apostrophe and returns it back to normal", () => {
			// Set input to a word that is not present in remainingChoices.
			challenge.elements.inputField.value = "you 're";
			// Make sure remainingChoices does not contain "'re"
			challenge.remainingChoices.wordMap.clear();
			// Spy on console.warn so we can check later.
			const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
			challenge.handleSpace();
			expect(warnSpy).toHaveBeenCalledWith(
				expect.stringContaining("Word 're not found in choices")
			);
			// Also, the input field’s style should have been modified.
			expect(challenge.elements.inputField.style.border).toBe("2px solid red");
			expect(challenge.elements.inputField.style.animation).toBe("shake 0.3s");
			jest.runAllTimers();
			expect(challenge.elements.inputField.style.animation).toBe("");
			// Clean up spy.
			warnSpy.mockRestore();
		});
	});
});
