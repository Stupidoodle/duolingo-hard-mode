/**
 * @jest-environment jsdom
 *
 * Issue #64 — a word bank bubble can hold more than one word. French banks
 * render "une sœur" and "tu as" as single bubbles, so matching the typed text
 * one word at a time can never claim them.
 */
import { ChallengeTapComplete } from "../src/ChallengeTapComplete.js";
import { buildChallenge, textOf } from "./helpers/challengeDom.js";

describe("issue #64 — bubbles that span several words", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
		window.ignoreApostrophesEnabled = false;
	});

	const setup = (bankWords = ["une sœur", "tu as"], typed = "") => buildChallenge(
		ChallengeTapComplete, "tapComplete", bankWords, [], typed
	);

	const type = (challenge, text) => {
		challenge.elements.inputField.value = text;
		challenge.handleInput();
	};

	// Feeds the text one keystroke at a time, the way the input event sees it.
	const typeOut = (challenge, text) => {
		for (let end = 1; end <= text.length; end++) {
			type(challenge, text.slice(0, end));
		}
	};

	test("typing both words claims the bubble", () => {
		const { challenge, clicked } = setup();

		type(challenge, "tu as");

		expect(clicked.map(textOf)).toEqual(["tu as"]);
		expect(challenge.remainingChoices.wordMap.get("tu as")).toHaveLength(0);
	});

	test("the first word alone claims nothing", () => {
		const { challenge, clicked } = setup();

		type(challenge, "tu");

		expect(clicked).toHaveLength(0);
	});

	test("space after the first word is kept instead of being rejected", () => {
		const { challenge } = setup();

		type(challenge, "tu");
		challenge.handleSpace();

		expect(challenge.elements.inputField.value).toBe("tu ");
		expect(challenge.elements.inputField.style.border).not.toContain("red");
	});

	test("space after a word that starts no bubble is still rejected", () => {
		const { challenge } = setup();

		type(challenge, "nous");
		challenge.handleSpace();

		expect(challenge.elements.inputField.value).toBe("nous");
	});

	test("a whole answer claims every bubble in order", () => {
		const { challenge, clicked } = setup();

		typeOut(challenge, "tu as une sœur");

		expect(clicked.map(textOf)).toEqual(["tu as", "une sœur"]);
	});

	test("space after a claimed bubble commits it", () => {
		const { challenge } = setup();

		type(challenge, "tu as");
		challenge.handleSpace();

		expect(challenge.elements.inputField.value).toBe("tu as ");
		expect(challenge.remainingChoices.wordMap.get("tu as")).toHaveLength(0);
	});

	test("backspacing into the bubble releases it", () => {
		const { challenge } = setup();

		type(challenge, "tu as");
		challenge.handleBackspace();

		expect(challenge.elements.inputField.value).toBe("tu a");
		expect(challenge.remainingChoices.wordMap.get("tu as")).toHaveLength(1);
	});

	test("enter submits once the last bubble is claimed", () => {
		const { challenge } = setup();
		const submit = jest.spyOn(challenge, "handleSubmit").mockImplementation(() => {});

		typeOut(challenge, "tu as une sœur");
		challenge.handleEnter();

		expect(submit).toHaveBeenCalled();
		expect(challenge.remainingChoices.wordMap.get("une sœur")).toHaveLength(0);
	});

	test("enter does not claim the trailing bubble a second time", () => {
		const { challenge } = setup(["une sœur", "une sœur"]);
		jest.spyOn(challenge, "handleSubmit").mockImplementation(() => {});

		type(challenge, "une sœur");
		challenge.handleEnter();

		expect(challenge.remainingChoices.wordMap.get("une sœur")).toHaveLength(1);
	});

	test("folds accents across the whole bubble when accents are ignored", () => {
		window.ignoreAccentsEnabled = true;
		const { challenge, clicked } = setup(["un frère", "tu as"]);

		type(challenge, "un frere");

		expect(clicked.map(textOf)).toEqual(["un frère"]);
	});

	test("prefers the longer bubble once its second word arrives", () => {
		const { challenge } = setup(["tu", "tu as", "une"]);

		// "tu" may still become "tu as", so it is not claimed on its own yet (#91).
		type(challenge, "tu");
		expect(challenge.remainingChoices.wordMap.get("tu")).toHaveLength(1);

		typeOut(challenge, "tu as");

		expect(challenge.remainingChoices.wordMap.get("tu")).toHaveLength(1);
		expect(challenge.remainingChoices.wordMap.get("tu as")).toHaveLength(0);
	});

	test("single-word bubbles keep working beside multi-word ones", () => {
		const { challenge, clicked } = setup(["tu as", "frère", "un"]);

		typeOut(challenge, "tu as un frère");

		expect(clicked.map(textOf)).toEqual(["tu as", "un", "frère"]);
	});
});
