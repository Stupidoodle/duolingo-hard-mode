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

describe("ChallengeGapFill", () => {
	let challengeDiv, choiceDiv, eventManager, gapFill;
	beforeEach(() => {
		document.body.innerHTML = "";
		({ challengeDiv, choiceDiv } = createGapFillElements());
		// Append choiceDiv to challengeDiv so it is part of the DOM tree.
		challengeDiv.appendChild(choiceDiv);
		// Append challengeDiv and a required submit button to the document body.
		document.body.appendChild(challengeDiv);
		const submitBtn = document.createElement("button");
		submitBtn.dataset.test = "player-next";
		document.body.appendChild(submitBtn);
		eventManager = new ExtensionEventManager();
		gapFill = new ChallengeGapFill(challengeDiv, choiceDiv, eventManager);
	});

	test("extractElements returns correct question and submitButton", () => {
		const elements = gapFill.extractElements();
		expect(elements.question).toBe("Gap Fill Question");
		const submitBtn = document.querySelector('button[data-test="player-next"]');
		expect(elements.submitButton).toBe(submitBtn);
		expect(elements.inputField).toBeNull();
	});

	test("injectTypingInput hides choices and creates textarea", () => {
		gapFill.choiceBank = new ChoiceBank(choiceDiv);
		gapFill.injectTypingInput();
		gapFill.choiceBank.choiceMap.forEach(arr => {
			arr.forEach(btn => {
				expect(btn.style.display).toBe("none");
			});
		});
		expect(gapFill.elements.inputField).not.toBeNull();
		expect(gapFill.elements.inputField.tagName).toBe("TEXTAREA");
	});

	test("enforceTyping calls injectTypingInput when choices exist", () => {
		gapFill.choiceBank = new ChoiceBank(choiceDiv);
		gapFill.injectTypingInput = jest.fn();
		gapFill.enforceTyping();
		expect(gapFill.injectTypingInput).toHaveBeenCalled();
	});
});
