/**
 * @jest-environment jsdom
 */
import { ChallengeGapFill } from "../src/ChallengeGapFill.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";
import { ChoiceBank } from "../src/ChoiceBank.js";

function createGapFillElements() {
	const challengeDiv = document.createElement("div");
	challengeDiv.setAttribute("data-test", "challenge challenge-gapFill");
	const header = document.createElement("h1");
	header.setAttribute("data-test", "challenge-header");
	header.textContent = "Gap Fill Question";
	challengeDiv.appendChild(header);

	const choiceDiv = document.createElement("div");
	// Create two dummy choices.
	["option1", "option2"].forEach(choice => {
		const div = document.createElement("div");
		div.setAttribute("data-test", "challenge-choice");
		const span = document.createElement("span");
		span.setAttribute("data-test", "challenge-judge-text");
		span.textContent = choice;
		div.appendChild(span);
		choiceDiv.appendChild(div);
	});
	return { challengeDiv, choiceDiv };
}

describe("ChallengeGapFill extra branches", () => {
	let challengeDiv, choiceDiv, eventManager, gapFill;
	beforeEach(() => {
		document.body.innerHTML = "";
		({ challengeDiv, choiceDiv } = createGapFillElements());
		// Make sure choiceDiv is attached to challengeDiv.
		challengeDiv.appendChild(choiceDiv);
		// Append challengeDiv and a required submit button.
		document.body.appendChild(challengeDiv);
		const submitBtn = document.createElement("button");
		submitBtn.dataset.test = "player-next";
		document.body.appendChild(submitBtn);
		eventManager = new ExtensionEventManager();
		gapFill = new ChallengeGapFill(challengeDiv, choiceDiv, eventManager);
	});

	test("injectTypingInput calls console.warn when choiceBank is missing", () => {
		gapFill.choiceBank = null;
		const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
		gapFill.injectTypingInput();
		expect(warnSpy).toHaveBeenCalledWith("Choice bank not found");
		warnSpy.mockRestore();
	});

	test("enforceTyping does not call injectTypingInput when choices are empty", () => {
		// Simulate an empty choice bank by clearing its choiceMap.
		gapFill.choiceBank = new ChoiceBank(choiceDiv);
		gapFill.choiceBank.choiceMap.clear();
		gapFill.injectTypingInput = jest.fn();
		gapFill.enforceTyping();
		expect(gapFill.injectTypingInput).not.toHaveBeenCalled();
	});
});
