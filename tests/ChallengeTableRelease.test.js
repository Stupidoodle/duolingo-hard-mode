/**
 * @jest-environment jsdom
 *
 * Issue #93 — Duolingo's table renderer (captured live) puts a copy of every
 * choice into every blank, hides all but the selected one with
 * `visibility: hidden`, and ignores taps on the hidden ones. Releasing a word by
 * clicking the last matching bubble outside the bank therefore hit a hidden
 * copy in a later row and did nothing.
 */
import { ChallengeTapComplete } from "../src/ChallengeTapComplete.js";
import { ExtensionEventManager } from "../src/ExtensionEventManager.js";

const eventManager = new ExtensionEventManager();

function bubble(text) {
	const button = document.createElement("button");
	button.setAttribute("data-test", `${text}-challenge-tap-token`);
	button.setAttribute("aria-disabled", "false");
	button.innerHTML = `<span></span><span><span data-test="challenge-tap-token-text">${text}</span></span>`;
	return button;
}

/**
 * A tapCompleteTable with the live structure: header row, one blank per row,
 * each blank holding a hidden copy of every choice, and the word bank after the
 * table. Tapping a bank bubble fills the first empty row; tapping the visible
 * copy in a row empties it; hidden copies are inert.
 */
function renderTable(rows, choices) {
	document.body.innerHTML = `
		<div data-test="challenge challenge-tapCompleteTable">
			<h1 data-test="challenge-header"><span>Complete the table</span></h1>
			<div><table><thead><tr><th>Pronoun</th><th>ser</th></tr></thead><tbody></tbody></table></div>
			<div data-test="word-bank"></div>
		</div>
		<button data-test="player-next"></button>`;
	const div = document.querySelector("[data-test^='challenge challenge-']");
	const body = div.querySelector("tbody");
	const bank = div.querySelector("[data-test='word-bank']");
	const filled = rows.map(() => null);
	const copies = rows.map((pronoun) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `<td>${pronoun}</td><td><div></div></td>`;
		const holder = tr.querySelector("td:last-child div");
		const rowCopies = new Map();
		for (const choice of choices) {
			const wrapper = document.createElement("span");
			wrapper.style.visibility = "hidden";
			const copy = bubble(choice);
			wrapper.appendChild(copy);
			holder.appendChild(wrapper);
			rowCopies.set(choice, { wrapper, copy });
		}
		body.appendChild(tr);
		return rowCopies;
	});
	const bankButtons = new Map();
	for (const choice of choices) {
		const source = bubble(choice);
		source.addEventListener("click", () => {
			if (source.getAttribute("aria-disabled") === "true") return;
			const row = filled.indexOf(null);
			if (row === -1) return;
			filled[row] = choice;
			copies[row].get(choice).wrapper.style.visibility = "visible";
			source.setAttribute("aria-disabled", "true");
		});
		bank.appendChild(source);
		bankButtons.set(choice, source);
	}
	copies.forEach((rowCopies, row) => {
		for (const [choice, { wrapper, copy }] of rowCopies) {
			copy.addEventListener("click", () => {
				if (filled[row] !== choice) return;
				filled[row] = null;
				wrapper.style.visibility = "hidden";
				bankButtons.get(choice).setAttribute("aria-disabled", "false");
			});
		}
	});
	const challenge = new ChallengeTapComplete(div, eventManager);
	challenge.enforceTyping();
	return { challenge, filled };
}

function type(challenge, text) {
	for (const char of text) {
		if (char === " ") {
			challenge.handleKeyEvent({ key: " " });
		} else {
			challenge.elements.inputField.value += char;
			challenge.handleInput();
		}
	}
}

function backspace(challenge, times) {
	for (let i = 0; i < times; i++) {
		challenge.handleKeyEvent({ key: "Backspace", ctrlKey: false, altKey: false });
	}
}

describe("issue #93 — releasing a word from a table row", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
		window.ignoreApostrophesEnabled = false;
	});

	test("typing fills the rows in order", () => {
		const { challenge, filled } = renderTable(["yo", "tú", "ella"], ["eres", "es", "somos", "soy"]);

		type(challenge, "soy eres es");

		expect(filled).toEqual(["soy", "eres", "es"]);
	});

	test("backspacing through two words empties those two rows", () => {
		const { challenge, filled } = renderTable(["yo", "tú", "ella"], ["eres", "es", "somos", "soy"]);

		type(challenge, "soy eres es");
		backspace(challenge, 7);

		expect(challenge.elements.inputField.value).toBe("soy ");
		expect(filled).toEqual(["soy", null, null]);
	});

	test("a corrected word refills the row it was removed from", () => {
		const { challenge, filled } = renderTable(["yo", "tú", "ella"], ["eres", "es", "somos", "soy"]);

		type(challenge, "soy eres es");
		backspace(challenge, 7);
		type(challenge, "eres es");

		expect(filled).toEqual(["soy", "eres", "es"]);
	});

	test("ctrl+backspace on the middle word releases it", () => {
		const { challenge, filled } = renderTable(["yo", "tú", "ella"], ["eres", "es", "somos", "soy"]);

		type(challenge, "soy eres");
		challenge.handleKeyEvent({ key: "Backspace", ctrlKey: true, altKey: false });

		expect(filled).toEqual(["soy", null, null]);
	});
});
