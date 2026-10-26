/**
 * @jest-environment jsdom
 *
 * Issue #54 — the styles should use Duolingo's live design tokens, and fall
 * back to a snapshot only for tokens the page does not define.
 */
import {
	FALLBACK_TOKENS,
	STATIC_FALLBACK_TOKENS,
	missingTokenDeclarations,
	withFallbackTokens
} from "../src/ThemeTokens.js";

/** @param {boolean} dark */
function setScheme(dark) {
	window.matchMedia = jest.fn().mockImplementation(query => ({
		matches: dark && query.includes("dark"),
		media: query
	}));
}

const root = () => document.documentElement;

function clearTokens() {
	for (const name of Object.keys({ ...FALLBACK_TOKENS.light, ...STATIC_FALLBACK_TOKENS })) {
		root().style.removeProperty(name);
	}
}

describe("issue #54 — live tokens win, snapshot is only a fallback", () => {
	beforeEach(() => {
		clearTokens();
		setScheme(false);
	});

	test("the two palettes cover the same tokens", () => {
		expect(Object.keys(FALLBACK_TOKENS.dark).sort())
			.toEqual(Object.keys(FALLBACK_TOKENS.light).sort());
	});

	test("light and dark actually differ, so the fallback is theme-aware", () => {
		expect(FALLBACK_TOKENS.light["--color-snow"]).toBe("255, 255, 255");
		expect(FALLBACK_TOKENS.dark["--color-snow"]).toBe("19, 31, 36");
	});

	test("a token the page defines is not redeclared", () => {
		root().style.setProperty("--color-snow", "1, 2, 3");

		expect(missingTokenDeclarations()).not.toContain("--color-snow");
	});

	test("a token the page omits falls back", () => {
		expect(missingTokenDeclarations()).toContain("--color-snow: 255, 255, 255;");
	});

	test("the fallback follows the colour scheme", () => {
		setScheme(true);

		expect(missingTokenDeclarations()).toContain("--color-snow: 19, 31, 36;");
	});

	test("nothing is emitted when the page defines everything", () => {
		for (const [name, value] of Object.entries({ ...FALLBACK_TOKENS.light, ...STATIC_FALLBACK_TOKENS })) {
			root().style.setProperty(name, value);
		}

		expect(missingTokenDeclarations()).toBe("");
	});

	test("backstops the transition token Duolingo never defines", () => {
		// Referenced by the button styles but absent from Duolingo's own root,
		// which left the transition shorthand invalid.
		expect(missingTokenDeclarations()).toContain("--web-ui_button-transition-lip");
	});

	describe("withFallbackTokens", () => {
		test("returns the style untouched when nothing is missing", () => {
			for (const [name, value] of Object.entries({ ...FALLBACK_TOKENS.light, ...STATIC_FALLBACK_TOKENS })) {
				root().style.setProperty(name, value);
			}

			expect(withFallbackTokens("color: red;")).toBe("color: red;");
		});

		test("prefixes the declarations it had to supply", () => {
			const result = withFallbackTokens("color: red;");

			expect(result).toContain("--color-snow: 255, 255, 255;");
			expect(result.endsWith("color: red;")).toBe(true);
		});
	});
});
