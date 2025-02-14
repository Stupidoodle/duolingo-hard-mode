/**
 * @jest-environment jsdom
 */
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";

describe("ExtensionEventManager", () => {
	let eventManager;
	beforeEach(() => {
		document.body.innerHTML = "";
		eventManager = new ExtensionEventManager();
	});

	test("registers and unregisters challenges", () => {
		const dummyChallenge = { handleKeyEvent: jest.fn() };
		eventManager.registerChallenge("dummy", dummyChallenge);
		expect(eventManager.activeChallenges.get("dummy")).toBe(dummyChallenge);
		eventManager.unregisterChallenge("dummy");
		expect(eventManager.activeChallenges.has("dummy")).toBe(false);
	});

	test("global key capture dispatches to challenge", () => {
		// Create a dummy textarea simulating an extension text area.
		const textarea = document.createElement("textarea");
		textarea.dataset.extension = "true";
		textarea.dataset.challengeId = "dummy";
		document.body.appendChild(textarea);

		// Activate the global key listener.
		eventManager.initGlobalKeyCapture();

		const dummyChallenge = { handleKeyEvent: jest.fn() };
		eventManager.registerChallenge("dummy", dummyChallenge);

		// Dispatch a keydown event (Enter) that should trigger the listener.
		const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
		textarea.dispatchEvent(event);

		// Now the challenge's handleKeyEvent should have been called.
		expect(dummyChallenge.handleKeyEvent).toHaveBeenCalled();
	});
});
