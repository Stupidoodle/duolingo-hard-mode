/**
 * ThemeTokens.js
 * Supplies Duolingo's design tokens only where Duolingo does not.
 */

/**
 * Values read off Duolingo's own `:root`, once per colour scheme.
 *
 * These exist purely as a safety net. When the page provides a token the live
 * value is used, which is what lets the injected UI follow the theme and track
 * any palette change Duolingo makes. A snapshot is only consulted when the
 * token is missing — a Duolingo rename, or a page where their stylesheet has
 * not loaded — so the input stays legible instead of rendering unstyled.
 *
 * @type {{light: Object<string, string>, dark: Object<string, string>}}
 */
export const FALLBACK_TOKENS = {
	light: {
		"--color-black-text": "60, 60, 60",
		"--color-cardinal": "255, 75, 75",
		"--color-fire-ant": "234, 43, 43",
		"--color-hare": "175, 175, 175",
		"--color-macaw": "28, 176, 246",
		"--color-owl": "88, 204, 2",
		"--color-polar": "247, 247, 247",
		"--color-snow": "255, 255, 255",
		"--color-swan": "229, 229, 229",
		"--color-tree-frog": "88, 167, 0",
		"--color-whale": "24, 153, 214"
	},
	dark: {
		"--color-black-text": "241, 247, 251",
		"--color-cardinal": "238, 85, 85",
		"--color-fire-ant": "216, 72, 72",
		"--color-hare": "82, 101, 109",
		"--color-macaw": "73, 192, 248",
		"--color-owl": "147, 211, 51",
		"--color-polar": "32, 47, 54",
		"--color-snow": "19, 31, 36",
		"--color-swan": "55, 70, 79",
		"--color-tree-frog": "121, 185, 51",
		"--color-whale": "24, 153, 214"
	}
};

/**
 * Tokens that do not change with the colour scheme.
 *
 * `--web-ui_button-transition-lip` is referenced by the button styles but is
 * not defined on Duolingo's root either, which leaves the `transition`
 * shorthand invalid; supplying it here makes the declaration parse.
 *
 * @type {Object<string, string>}
 */
export const STATIC_FALLBACK_TOKENS = {
	"--web-ui_button-border-radius": "16px",
	"--web-ui_button-transition-lip": "0.1s"
};

/**
 * Whether the page is being shown in dark mode.
 * @returns {Boolean}
 */
function prefersDark(){
	return typeof window.matchMedia === "function"
		&& window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Reads a custom property as the page currently resolves it.
 * @param {HTMLElement} root
 * @param {String} name
 * @returns {String}
 */
function readToken(root, name){
	const inline = root.style?.getPropertyValue(name) || "";
	if(inline.trim()){
		return inline.trim();
	}
	return (getComputedStyle(root).getPropertyValue(name) || "").trim();
}

/**
 * Declarations for every token the page does not define.
 *
 * Returning nothing is the expected result on Duolingo, and is what keeps the
 * live palette in charge.
 *
 * @param {HTMLElement} [root] - Element whose tokens are inspected
 * @returns {String} CSS declarations, or an empty string
 */
export function missingTokenDeclarations(root = document.documentElement){
	const wanted = {
		...(prefersDark() ? FALLBACK_TOKENS.dark : FALLBACK_TOKENS.light),
		...STATIC_FALLBACK_TOKENS
	};

	return Object.entries(wanted)
		.filter(([name]) => !readToken(root, name))
		.map(([name, value]) => `${name}: ${value};`)
		.join("\n");
}

/**
 * Prefixes a style block with fallbacks for whatever the page is missing.
 *
 * Declaration order does not matter for custom properties, but putting them
 * first keeps the generated text readable.
 *
 * @param {String} style - One of the CONSTANTS.STYLE blocks
 * @param {HTMLElement} [root]
 * @returns {String}
 */
export function withFallbackTokens(style, root = document.documentElement){
	const fallbacks = missingTokenDeclarations(root);
	return fallbacks ? `${fallbacks}\n${style}` : style;
}
