/**
 * @jest-environment jsdom
 *
 * "It only works after I refresh the page."
 *
 * Entering a lesson from inside the app is a client-side navigation: React
 * commits the challenge container first and fills in the word bank on a later
 * commit. Reloading renders both in one go, which is why a refresh appears to
 * fix the extension.
 *
 * enforceTyping marks the container with data-extension-processed before it
 * constructs anything, so a container seen in that intermediate state is marked
 * even though construction fails on the missing bank — and the guard at the top
 * of enforceTyping then skips it forever.
 */
import "../src/content.js";

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * A challenge container with no word bank yet, as first committed.
 * @param {string} type
 */
function createChallengeDiv(type) {
	const div = document.createElement("div");
	div.setAttribute("data-test", `challenge challenge-${type}`);

	const header = document.createElement("h1");
	header.setAttribute("data-test", "challenge-header");
	header.textContent = "Translate this sentence";
	div.appendChild(header);

	return div;
}

/** The word bank, committed a tick later. */
function createWordBank(words) {
	const bank = document.createElement("div");
	bank.dataset.test = "word-bank";

	for (const word of words) {
		const btn = document.createElement("button");
		btn.setAttribute("data-test", `${word}-challenge-tap-token`);
		btn.setAttribute("aria-disabled", "false");
		const span = document.createElement("span");
		span.setAttribute("data-test", "challenge-tap-token-text");
		span.textContent = word;
		btn.appendChild(span);
		bank.appendChild(btn);
	}

	return bank;
}

/** The choice radiogroup, which lives outside the challenge container. */
function createChoiceGroup(choices) {
	const group = document.createElement("div");
	group.setAttribute("aria-label", "choice");
	group.setAttribute("role", "radiogroup");

	for (const choice of choices) {
		const btn = document.createElement("button");
		btn.setAttribute("data-test", "challenge-choice");
		const span = document.createElement("span");
		span.setAttribute("data-test", "challenge-judge-text");
		span.textContent = choice;
		btn.appendChild(span);
		group.appendChild(btn);
	}

	return group;
}

describe("entering a lesson without a page load", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		const submit = document.createElement("button");
		submit.dataset.test = "player-next";
		document.body.appendChild(submit);
	});

	test("converts a translate challenge whose word bank arrives after the container", async () => {
		const div = createChallengeDiv("translate");
		document.body.appendChild(div);
		await tick();

		div.appendChild(createWordBank(["hola", "mundo"]));
		await tick();

		expect(document.querySelector("textarea[data-extension='true']")).not.toBeNull();
	});

	test("converts a select challenge whose radiogroup arrives after the container", async () => {
		const div = createChallengeDiv("select");
		document.body.appendChild(div);
		await tick();

		document.body.appendChild(createChoiceGroup(["gato", "perro"]));
		await tick();

		expect(document.querySelector("textarea[data-extension='true']")).not.toBeNull();
	});

	test("leaves a challenge that never gets a word bank alone, without marking it", async () => {
		const div = createChallengeDiv("translate");
		document.body.appendChild(div);
		await tick();
		await tick();

		expect(document.querySelector("textarea[data-extension='true']")).toBeNull();
		expect(div.hasAttribute("data-extension-processed")).toBe(false);
	});
});
