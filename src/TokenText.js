/**
 * TokenText.js
 * Reads the word out of a token element.
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
