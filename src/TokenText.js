/**
 * TokenText.js
 * Reads the word out of a token element.
 *
 * Read a `challenge-tap-token` button with `readTokenWord`. `readTokenText`
 * is for an element already known to hold just the word.
 */

/**
 * Returns an element's word with any pronunciation guide removed.
 *
 * Courses that annotate their script — Japanese furigana, Chinese pinyin —
 * render each token as ruby, with the reading in `<rt>` interleaved between the
 * characters. Flattening that with `textContent` splices the reading into the
 * word, so すし reads back as "すsuしshi" and can never match what is typed.
 *
 * @param {Element|null|undefined} element - Element holding the token's text.
 * @returns {string} The trimmed word, without readings.
 */
export function readTokenText(element) {
	if (!element) {
		return "";
	}

	// Most courses have no ruby at all, so avoid cloning in the common case.
	if (!element.querySelector("rt, rp")) {
		return element.textContent.trim();
	}

	const withoutReadings = element.cloneNode(true);
	withoutReadings.querySelectorAll("rt, rp").forEach(node => node.remove());

	return withoutReadings.textContent.trim();
}

/**
 * The element holding a token's word, or null for a token without text, such
 * as an audio tile.
 *
 * Duolingo labels the text span `challenge-tap-token-text` only for a plain
 * word. A token that can carry a reading goes through its reading component
 * instead, which leaves the span unlabelled and wraps the characters in
 * `span[lang]`: inside a `<ruby>` when a reading is shown, on their own when
 * none is. The fallback is the smallest element holding all of those, so the
 * readings' `<rt lang>` stay out, and so does the hotkey number a match tile
 * keeps beside its text. The whole button would not do because of that hotkey.
 *
 * @param {Element} token - A `challenge-tap-token` button.
 * @returns {Element|null}
 */
export function tokenTextElement(token) {
	const labelled = token.querySelector("[data-test='challenge-tap-token-text']");

	if (labelled) {
		return labelled;
	}

	const characters = token.querySelectorAll("[lang]:not(rt)");

	if (characters.length === 0) {
		return null;
	}

	const last = characters[characters.length - 1];
	let container = characters[0];

	while (container !== token && !container.contains(last)) {
		container = container.parentElement;
	}

	return container;
}

/**
 * Reads a token's word, without any reading.
 *
 * @param {Element} token - A `challenge-tap-token` button.
 * @returns {string} The trimmed word, or "" for a token without text.
 */
export function readTokenWord(token) {
	return readTokenText(tokenTextElement(token));
}
