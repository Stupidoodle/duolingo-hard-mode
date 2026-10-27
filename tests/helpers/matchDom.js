/**
 * Builds a listenMatch challenge the way Duolingo renders it (captured from a
 * live French-from-German practice): every tile is a
 * `button[data-test="<translation>-challenge-tap-token"]` wrapped in a span,
 * the audio prompts come first and carry no token text, and the text answers
 * follow. Partners share the same data-test.
 *
 * Duolingo shows which tile is selected only through Web Animations, so the
 * fake below keeps that state in a closure the extension cannot see — the same
 * blind spot the real page gives it.
 *
 * Not a test file — jest's default testMatch only picks up `*.test.js`.
 */

/**
 * @param {string} key - shared data-test prefix, i.e. the answer's text
 * @param {string|null} text - visible token text, or null for an audio tile
 * @returns {HTMLSpanElement}
 */
function createTile(key, text) {
	const wrapper = document.createElement("span");
	const button = document.createElement("button");
	button.setAttribute("dir", "ltr");
	button.setAttribute("data-test", `${key}-challenge-tap-token`);
	button.setAttribute("aria-disabled", "false");
	button.appendChild(document.createElement("span"));

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
 * @param {string[]} options.prompts - pair keys in prompt (audio) order
 * @param {string[]} options.answers - answer texts in answer column order
 * @param {string} [options.type] - challenge type in the container's data-test
 * @returns {{ challengeDiv: HTMLElement, grid: HTMLElement, prompts: HTMLButtonElement[],
 *   answers: HTMLButtonElement[], clicks: string[], selected: () => HTMLButtonElement|null,
 *   submit: HTMLButtonElement, hearts: () => number }}
 */
export function buildMatch({ prompts, answers, type = "listenMatch" }) {
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
	for (const key of prompts) {
		grid.appendChild(createTile(key, null));
	}
	for (const text of answers) {
		grid.appendChild(createTile(text, text));
	}
	outer.appendChild(grid);
	challengeDiv.appendChild(outer);
	document.body.appendChild(challengeDiv);

	const submit = document.createElement("button");
	submit.dataset.test = "player-next";
	document.body.appendChild(submit);

	const tiles = [...grid.querySelectorAll("button")];
	const promptTiles = tiles.slice(0, prompts.length);
	const answerTiles = tiles.slice(prompts.length);

	const clicks = [];
	let selected = null;
	let hearts = 5;
	const name = tile => `${promptTiles.includes(tile) ? "prompt" : "answer"}:${tile.dataset.test.replace("-challenge-tap-token", "")}`;

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
			if (selected.dataset.test === tile.dataset.test) {
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
