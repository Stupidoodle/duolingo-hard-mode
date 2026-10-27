/**
 * @jest-environment jsdom
 *
 * Issues #15 and #16 — tapCloze, tapClozeTable and tapCompleteTable. They
 * render their blanks in a sentence or a conjugation table, but fill them from
 * the same `word-bank` of `challenge-tap-token` buttons tapComplete uses, one
 * tap per blank in order (markup as relied on by DuoHacker's solver). Typing the
 * tokens in order is therefore the whole hard mode.
 */
import "../src/content.js";

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

function token(text) {
	const button = document.createElement("button");
	button.setAttribute("data-test", `${text}-challenge-tap-token`);
	button.setAttribute("aria-disabled", "false");
	const span = document.createElement("span");
	span.setAttribute("data-test", "challenge-tap-token-text");
	span.textContent = text;
	button.appendChild(span);
	return button;
}

function wordBank(texts) {
	const bank = document.createElement("div");
	bank.setAttribute("data-test", "word-bank");
	texts.forEach(text => bank.appendChild(token(text)));
	return bank;
}

/** A conjugation table whose second column holds the blanks. */
function table(rows) {
	const element = document.createElement("table");
	const body = document.createElement("tbody");
	for (const [pronoun, cell] of rows) {
		const row = document.createElement("tr");
		const left = document.createElement("td");
		left.textContent = pronoun;
		const right = document.createElement("td");
		right.textContent = cell;
		row.append(left, right);
		body.appendChild(row);
	}
	element.appendChild(body);
	return element;
}

function challenge(type, ...children) {
	const div = document.createElement("div");
	div.setAttribute("data-test", `challenge challenge-${type}`);
	const header = document.createElement("h1");
	header.setAttribute("data-test", "challenge-header");
	header.textContent = "Complete the table";
	div.append(header, ...children);
	return div;
}

describe("issues #15/#16 — table and cloze challenges type into the word bank", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
		const submit = document.createElement("button");
		submit.dataset.test = "player-next";
		document.body.appendChild(submit);
		window.ignoreAccentsEnabled = false;
		window.ignoreApostrophesEnabled = false;
	});

	for (const type of ["tapCompleteTable", "tapClozeTable", "tapCloze"]) {
		test(`${type} hides its word bank and injects the input once the bank renders`, async () => {
			const div = challenge(type, table([["yo", ""], ["tú", ""]]));
			document.body.appendChild(div);
			await tick();

			expect(div.hasAttribute("data-extension-processed")).toBe(false);

			const bank = wordBank(["soy", "eres", "es"]);
			div.appendChild(bank);
			await tick();

			expect(div.querySelector("textarea[data-extension='true']")).not.toBeNull();
			expect(bank.style.display).toBe("none");
			expect(div.getAttribute("data-extension-processed")).toBe("true");
		});
	}

	test("typing the conjugations taps their tokens in order", async () => {
		const bank = wordBank(["es", "soy", "eres"]);
		const div = challenge("tapCompleteTable", table([["yo", ""], ["tú", ""]]), bank);
		document.body.appendChild(div);
		await tick();

		const tapped = [];
		bank.querySelectorAll("button").forEach(button => {
			button.addEventListener("click", () => tapped.push(button.textContent));
		});

		const input = div.querySelector("textarea[data-extension='true']");
		for (const text of ["s", "so", "soy", "soy ", "soy e", "soy er", "soy ere", "soy eres"]) {
			input.value = text;
			input.dispatchEvent(new Event("input", { bubbles: true }));
		}

		expect(tapped).toEqual(["soy", "eres"]);
	});

	test("word-ending fragments of a cloze table are typed like words", async () => {
		const bank = wordBank(["as", "o", "amos"]);
		const div = challenge("tapClozeTable", table([["yo", "habl"], ["tú", "habl"]]), bank);
		document.body.appendChild(div);
		await tick();

		const tapped = [];
		bank.querySelectorAll("button").forEach(button => {
			button.addEventListener("click", () => tapped.push(button.textContent));
		});

		const input = div.querySelector("textarea[data-extension='true']");
		for (const text of ["o", "o ", "o a", "o as"]) {
			input.value = text;
			input.dispatchEvent(new Event("input", { bubbles: true }));
		}

		expect(tapped).toEqual(["o", "as"]);
	});
});
