/**
 * AccentUtils.js
 * Utility functions to handle accent normalization.
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
 * Given a map of words (keys are the original words), returns the key that matches the input.
 * If ignoreAccents is true, the comparison is done on the normalized (accent-free) versions.
 *
 * @param {Map<string, any>} map - The map of words.
 * @param {string} input - The user’s input.
 * @param {boolean} ignoreAccents - Whether to ignore accents.
 * @returns {string|null} - The matching key from the map or null if no match.
 */
export function getMatchingKey(map, input, ignoreAccents) {
	input = input.toLowerCase();
	if (!ignoreAccents) {
		return map.has(input) ? input : null;
	}
	const normalizedInput = normalizeText(input);
	for (let key of map.keys()) {
		if (normalizeText(key) === normalizedInput) {
			return key;
		}
	}
	return null;
}
