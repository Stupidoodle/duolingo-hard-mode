/**
 * @jest-environment jsdom
 *
 * Routing of `input` events, which issue #29 needs so the word bank can be
 * matched on every keystroke.
 *
 * These live in their own file on purpose. initGlobalKeyCapture attaches a
 * capture-phase listener to `document` that calls stopImmediatePropagation, and
 * document listeners survive between tests in a file — so a second listener
 * registered by a later test never runs. Jest gives each file its own jsdom, so
 * a separate file is what guarantees the listener under test is the only one.
 */
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";

describe("ExtensionEventManager input routing", () => {
	test("input on the extension textarea reaches the challenge", () => {
		const eventManager = new ExtensionEventManager();

		const textarea = document.createElement("textarea");
		textarea.dataset.extension = "true";
		textarea.dataset.challengeId = "dummy";
		document.body.appendChild(textarea);

		eventManager.initGlobalKeyCapture();

		const dummyChallenge = { handleKeyEvent: jest.fn(), handleInput: jest.fn() };
		eventManager.registerChallenge("dummy", dummyChallenge);

		textarea.dispatchEvent(new Event("input", { bubbles: true }));

		expect(dummyChallenge.handleInput).toHaveBeenCalled();
	});

	test("input on any other field is left alone", () => {
		const eventManager = new ExtensionEventManager();

		const other = document.createElement("textarea");
		document.body.appendChild(other);

		const dummyChallenge = { handleKeyEvent: jest.fn(), handleInput: jest.fn() };
		eventManager.registerChallenge("dummy", dummyChallenge);

		other.dispatchEvent(new Event("input", { bubbles: true }));

		expect(dummyChallenge.handleInput).not.toHaveBeenCalled();
	});
});
