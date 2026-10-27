/**
 * Builds a pairs challenge the way Duolingo renders it. Every tile is a
 * `button[data-test*="challenge-tap-token"]` wrapped in a span, with the prompt
 * column first in DOM order and the answer column after it.
 *
 * - listenMatch (captured from a live French-from-German practice): the audio
 *   prompts carry no token text, and partners share the same data-test.
 * - match (captured from a live Spanish-from-English lesson): both columns carry
 *   text and a number hotkey, each column has its own `lang`, and every tile's
 *   data-test is its own text, so partners do not share it.
 *
 * Duolingo shows which tile is selected only through Web Animations, so the
 * fake below keeps that state in a closure the extension cannot see — the same
 * blind spot the real page gives it.
 *
 * Not a test file — jest's default testMatch only picks up `*.test.js`.
 */

/**
 * @param {string} key - data-test prefix
 * @param {string|null} text - visible token text, or null for an audio tile
 * @param {string|null} lang - the tile's `lang`, if any
 * @param {string|null} hotkey - the number hotkey a match tile shows
 * @returns {HTMLSpanElement}
 */
function createTile(key, text, lang, hotkey) {
	const wrapper = document.createElement("span");
	const button = document.createElement("button");
	button.setAttribute("dir", "ltr");
	if (lang) {
		button.setAttribute("lang", lang);
	}
	button.setAttribute("data-test", `${key}-challenge-tap-token`);
	button.setAttribute("aria-disabled", "false");
	button.appendChild(document.createElement("span"));
	if (hotkey !== null) {
		const number = document.createElement("span");
		number.textContent = hotkey;
		button.appendChild(number);
	}

	const label = document.createElement("span");
	const inner = document.createElement("span");
	if (text !== null) {
		inner.setAttribute("data-test", "challenge-tap-token-text");
		inner.textContent = text;
	}
	label.appendChild(inner);
	button.appendChild(label);

	wrapper.appendChild(button);
	return wrapper;
}

/**
 * Renders the challenge and wires the tiles to behave like Duolingo's.
 *
 * @param {object} options
 * @param {string[]} options.prompts - for each prompt, the answer text it pairs with
 * @param {string[]} options.answers - answer texts in answer column order
 * @param {string[]} [options.promptTexts] - visible prompt texts; renders a match
 *   challenge instead of listenMatch's audio prompts
 * @param {string|null} [options.promptLang] - `lang` of the prompt column
 * @param {string|null} [options.answerLang] - `lang` of the answer column
 * @param {string} [options.type] - challenge type in the container's data-test
 * @returns {{ challengeDiv: HTMLElement, grid: HTMLElement, prompts: HTMLButtonElement[],
 *   answers: HTMLButtonElement[], clicks: string[], selected: () => HTMLButtonElement|null,
 *   submit: HTMLButtonElement, hearts: () => number }}
 */
export function buildMatch({
	prompts,
	answers,
	promptTexts = null,
	promptLang = "de",
	answerLang = "fr",
	type = promptTexts ? "match" : "listenMatch"
}) {
	document.body.innerHTML = "";

	const challengeDiv = document.createElement("div");
	challengeDiv.setAttribute("data-test", `challenge challenge-${type}`);

	const headerWrap = document.createElement("div");
	const header = document.createElement("h1");
	header.setAttribute("data-test", "challenge-header");
	header.textContent = "Tippe die Paare an";
	headerWrap.appendChild(header);
	challengeDiv.appendChild(headerWrap);

	const outer = document.createElement("div");
	const grid = document.createElement("div");
	// Match tiles number themselves 1–9 then 0 down the prompt column first.
	const hotkey = index => (promptTexts ? String((index + 1) % 10) : null);
	prompts.forEach((key, index) => {
		const text = promptTexts ? promptTexts[index] : null;
		grid.appendChild(createTile(text ?? key, text, promptLang, hotkey(index)));
	});
	answers.forEach((text, index) => {
		grid.appendChild(createTile(text, text, answerLang, hotkey(prompts.length + index)));
	});
	outer.appendChild(grid);
	challengeDiv.appendChild(outer);
	document.body.appendChild(challengeDiv);

	const submit = document.createElement("button");
	submit.dataset.test = "player-next";
	document.body.appendChild(submit);

	const tiles = [...grid.querySelectorAll("button")];
	const promptTiles = tiles.slice(0, prompts.length);
	const answerTiles = tiles.slice(prompts.length);

	// What each tile pairs on: the prompt's partner text, or the answer's own.
	const pairKey = new Map([
		...promptTiles.map((tile, index) => [tile, prompts[index]]),
		...answerTiles.map((tile, index) => [tile, answers[index]])
	]);

	const clicks = [];
	let selected = null;
	let hearts = 5;
	const name = tile => `${promptTiles.includes(tile) ? "prompt" : "answer"}:${pairKey.get(tile)}`;

	for (const tile of tiles) {
		tile.addEventListener("click", () => {
			clicks.push(name(tile));

			if (tile.getAttribute("aria-disabled") === "true") {
				return;
			}
			if (selected === tile) {
				selected = null;
				return;
			}
			const sameColumn = selected && promptTiles.includes(selected) === promptTiles.includes(tile);
			if (!selected || sameColumn) {
				selected = tile;
				return;
			}
			if (pairKey.get(selected) === pairKey.get(tile)) {
				selected.setAttribute("aria-disabled", "true");
				tile.setAttribute("aria-disabled", "true");
			} else {
				hearts -= 1;
			}
			selected = null;
		});
	}

	return {
		challengeDiv,
		grid,
		prompts: promptTiles,
		answers: answerTiles,
		clicks,
		selected: () => selected,
		submit,
		hearts: () => hearts
	};
}
