/**
 * @jest-environment jsdom
 *
 * Issue #69 — hard mode for dialogue ("Complete the chat"). It renders the same
 * radiogroup as select and assist, but its choices are whole sentences with
 * punctuation, and French sets a narrow no-break space before ? and !.
 */
import { ChallengeGapFill } from "../src/ChallengeGapFill.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";

const eventManager = new ExtensionEventManager();
const key = name => ({ key: name, ctrlKey: false, altKey: false });

/**
 * The radiogroup as captured from a live Spanish lesson: each choice carries a
 * number hotkey and its sentence in challenge-judge-text, followed by icon spans.
 */
function buildDialogue(choices) {
	document.body.innerHTML = `
		<div data-test="challenge challenge-dialogue">
			<h1 data-test="challenge-header"><span>Complete the chat</span></h1>
			<div><div aria-label="choice" role="radiogroup">
				${choices.map((choice, index) => `
					<div aria-checked="false" aria-disabled="false" role="radio" data-test="challenge-choice">
						<span>${index + 1}</span>
						<span data-test="challenge-judge-text" dir="ltr">${choice}<span><span></span><span></span></span></span>
					</div>`).join("")}
			</div></div>
		</div>
		<button data-test="player-next"></button>`;

	const challengeDiv = document.querySelector("[data-test='challenge challenge-dialogue']");
	const choiceDiv = document.querySelector("div[aria-label='choice']");
	const choiceEls = [...choiceDiv.querySelectorAll("[data-test='challenge-choice']")];
	const clicked = [];
	choiceEls.forEach((el, index) => el.addEventListener("click", () => clicked.push(choices[index])));
	const submitted = jest.fn();
	document.querySelector("[data-test='player-next']").addEventListener("click", submitted);

	const challenge = new ChallengeGapFill(challengeDiv, choiceDiv, eventManager);
	challenge.enforceTyping();

	return { challenge, input: challenge.elements.inputField, clicked, submitted };
}

function type(challenge, text) {
	for (const char of text) {
		if (char === " ") {
			challenge.handleKeyEvent(key(" "));
		} else {
			challenge.elements.inputField.value += char;
		}
	}
}

describe("issue #69 — dialogue hard mode", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
		window.ignoreApostrophesEnabled = false;
	});

	test("reads each sentence without the hotkey number or icons", () => {
		const { challenge } = buildDialogue(["Por favor, gracias.", "Un taco, por favor."]);

		expect([...challenge.choiceBank.choiceMap.keys()]).toEqual(["por favor, gracias.", "un taco, por favor."]);
	});

	test("enter picks the sentence typed without its punctuation and submits", () => {
		const { challenge, clicked, submitted } = buildDialogue(["Por favor, gracias.", "Un taco, por favor."]);

		type(challenge, "un taco por favor");
		challenge.handleKeyEvent(key("Enter"));

		expect(clicked).toEqual(["Un taco, por favor."]);
		expect(submitted).toHaveBeenCalledTimes(1);
	});

	test("the punctuation may also be typed exactly", () => {
		const { challenge, clicked } = buildDialogue(["Por favor, gracias.", "Un taco, por favor."]);

		type(challenge, "Un taco, por favor.");
		challenge.handleKeyEvent(key("Enter"));

		expect(clicked).toEqual(["Un taco, por favor."]);
	});

	test("the narrow no-break space French puts before ! does not have to be typed", () => {
		const { challenge, clicked } = buildDialogue(["Anglais ou espagnol ?", "Non, pour mon chien !"]);

		type(challenge, "non pour mon chien");
		challenge.handleKeyEvent(key("Enter"));

		expect(clicked).toEqual(["Non, pour mon chien !"]);
	});

	test("spaces inside a sentence still being typed do not flag an error", () => {
		const { challenge, input, clicked } = buildDialogue(["Por favor, gracias.", "Un taco, por favor."]);

		type(challenge, "un taco ");

		expect(input.value).toBe("un taco ");
		expect(input.style.border).not.toContain("red");
		expect(clicked).toEqual([]);
	});

	test("a space after text no sentence starts with is still flagged", () => {
		const { challenge, input } = buildDialogue(["Por favor, gracias.", "Un taco, por favor."]);

		type(challenge, "dos ");

		expect(input.style.border).toContain("red");
	});

	test("an unfinished sentence selects no choice", () => {
		const { challenge, clicked } = buildDialogue(["Por favor, gracias.", "Un taco, por favor."]);

		type(challenge, "un taco");
		challenge.handleKeyEvent(key("Enter"));

		expect(clicked).toEqual([]);
	});

	test("accents still count unless they are ignored", () => {
		const { challenge, clicked } = buildDialogue(["Sí, un té.", "No, gracias."]);

		type(challenge, "si un te");
		challenge.handleKeyEvent(key("Enter"));
		expect(clicked).toEqual([]);

		window.ignoreAccentsEnabled = true;
		challenge.elements.inputField.value = "si un te";
		challenge.handleKeyEvent(key("Enter"));
		expect(clicked).toEqual(["Sí, un té."]);
	});
});
