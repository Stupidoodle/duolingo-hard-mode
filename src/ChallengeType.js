/**
 * ChallengeType.js
 * Reads the challenge type off Duolingo's challenge container.
 */

const TYPE_PREFIX = "challenge-";

/**
 * The type in a challenge container's `data-test`, such as "translate".
 *
 * Duolingo writes `challenge challenge-<type>`, but other extensions add their
 * own words to the same attribute: Duolingo Fast Mode appends `dfm-cid-<id>`
 * (#108). Stripping the prefix left that word glued to the type, which nothing
 * is registered for, so the challenge was skipped. The type is read from the
 * one word that starts with `challenge-` instead.
 *
 * @param {Element} challengeDiv - The `div[data-test^='challenge challenge-']` container.
 * @returns {string} The type, or "" when the attribute names none.
 */
export function challengeTypeOf(challengeDiv) {
	const words = (challengeDiv.getAttribute("data-test") ?? "").split(/\s+/);
	const marker = words.find(word => word.startsWith(TYPE_PREFIX));

	return marker ? marker.slice(TYPE_PREFIX.length) : "";
}
