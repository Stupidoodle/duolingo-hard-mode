/**
 * @jest-environment jsdom
 *
 * Issue #48 — while an input method is composing, Space picks a candidate and
 * Enter commits it. Those keys belong to the IME, not to the extension.
 *
 * Own file on purpose: initGlobalKeyCapture attaches a capture-phase document
 * listener that calls stopImmediatePropagation, and document listeners outlive
 * individual tests, so a listener registered by a later test never runs. Jest
 * gives each file its own jsdom.
 */
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";

// One manager for the whole file. Calling initGlobalKeyCapture per test would
// stack document listeners, and the first one's stopImmediatePropagation would
// stop every later one from ever running.
const eventManager = new ExtensionEventManager();
let textarea;

beforeAll(() => {
	textarea = document.createElement("textarea");
	textarea.dataset.extension = "true";
	textarea.dataset.challengeId = "dummy";
	document.body.appendChild(textarea);
	eventManager.initGlobalKeyCapture();
});

function setup() {
	const challenge = { handleKeyEvent: jest.fn(), handleInput: jest.fn() };
	eventManager.registerChallenge("dummy", challenge);
	return { textarea, challenge };
}

/** @param {Partial<KeyboardEventInit>} init */
function keydown(textarea, init) {
	const event = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
	textarea.dispatchEvent(event);
	return event;
}

describe("issue #48 — IME composition keys reach the input method", () => {
	test("space during composition is left to the IME", () => {
		const { textarea, challenge } = setup();

		const event = keydown(textarea, { key: " ", isComposing: true });

		expect(challenge.handleKeyEvent).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(false);
	});

	test("enter during composition is left to the IME", () => {
		const { textarea, challenge } = setup();

		const event = keydown(textarea, { key: "Enter", isComposing: true });

		expect(challenge.handleKeyEvent).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(false);
	});

	test("keyCode 229 is treated as composition even without the flag", () => {
		// Some browsers report the composing keydown only through this code.
		const { textarea, challenge } = setup();

		const event = keydown(textarea, { key: " ", keyCode: 229 });

		expect(challenge.handleKeyEvent).not.toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(false);
	});

	test("space outside composition still drives the extension", () => {
		const { textarea, challenge } = setup();

		const event = keydown(textarea, { key: " " });

		expect(challenge.handleKeyEvent).toHaveBeenCalled();
		expect(event.defaultPrevented).toBe(true);
	});

	test("live matching is skipped while composing", () => {
		const { textarea, challenge } = setup();

		const event = new Event("input", { bubbles: true });
		event.isComposing = true;
		textarea.dispatchEvent(event);

		expect(challenge.handleInput).not.toHaveBeenCalled();
	});

	test("live matching runs once the composition ends", () => {
		const { textarea, challenge } = setup();

		textarea.dispatchEvent(new Event("compositionend", { bubbles: true }));

		expect(challenge.handleInput).toHaveBeenCalled();
	});
});
