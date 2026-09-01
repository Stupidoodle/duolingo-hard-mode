/**
 * AccentUtils.js
 * Utility functions to normalize text before matching it against the word bank.
 */

/**
 * Removes accents from a string using Unicode normalization.
 * @param {string} str - The input string.
 * @returns {string} - The normalized string without diacritics.
 */
export function normalizeText(str) {
	return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Removes apostrophes from a string.
 *
 * Duolingo renders the typographic apostrophe (U+2019) while keyboards produce
 * the straight one, so both have to go — along with the modifier letter and
 * prime characters that occasionally stand in for them.
 *
 * @param {string} str - The input string.
 * @returns {string} - The string without apostrophes.
 */
export function normalizeApostrophes(str) {
	return str.replace(/['\u2018\u2019\u02BC\u2032]/g, "");
}

/**
 * Lowercases a string and applies whichever normalizations are switched on.
 *
 * @param {string} str - The input string.
 * @param {{ignoreAccents?: boolean, ignoreApostrophes?: boolean}} [options]
 * @returns {string} - The comparable form of the string.
 */
export function normalizeForMatch(str, options = {}) {
	const { ignoreAccents = false, ignoreApostrophes = false } = options;

	let normalized = str.toLowerCase();

	if (ignoreAccents) {
		normalized = normalizeText(normalized);
	}
	if (ignoreApostrophes) {
		normalized = normalizeApostrophes(normalized);
	}

	return normalized;
}

/**
 * Given a map of words (keys are the original words), returns the key that matches the input.
 * With both options off the lookup is exact; otherwise every key is compared in
 * its normalized form.
 *
 * @param {Map<string, any>} map - The map of words.
 * @param {string} input - The user’s input.
 * @param {boolean} ignoreAccents - Whether to ignore accents.
 * @param {boolean} [ignoreApostrophes] - Whether to ignore apostrophes.
 * @returns {string|null} - The matching key from the map or null if no match.
 */
export function getMatchingKey(map, input, ignoreAccents, ignoreApostrophes = false) {
	input = input.toLowerCase();

	if (!ignoreAccents && !ignoreApostrophes) {
		return map.has(input) ? input : null;
	}

	const options = { ignoreAccents, ignoreApostrophes };
	const normalizedInput = normalizeForMatch(input, options);

	for (let key of map.keys()) {
		if (normalizeForMatch(key, options) === normalizedInput) {
			return key;
		}
	}

	return null;
}
