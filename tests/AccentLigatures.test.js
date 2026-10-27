/**
 * @jest-environment jsdom
 *
 * Issue #71 — "ignore accents" has to fold the œ and æ ligatures too. NFD leaves
 * them intact because they are letters of their own rather than a base letter
 * plus a combining mark, and most keyboards have no key for them.
 */
import { normalizeText, getMatchingKey } from "../src/AccentUtils.js";
import { ChallengeTapComplete } from "../src/ChallengeTapComplete.js";
import { buildChallenge, textOf } from "./helpers/challengeDom.js";

describe("issue #71 — ligatures fold when accents are ignored", () => {
	beforeEach(() => {
		window.ignoreAccentsEnabled = false;
		window.ignoreApostrophesEnabled = false;
	});

	test("normalizeText spells œ and æ out", () => {
		expect(normalizeText("sœur")).toBe("soeur");
		expect(normalizeText("Œuf")).toBe("OEuf");
		expect(normalizeText("ex æquo")).toBe("ex aequo");
		expect(normalizeText("Æsop")).toBe("AEsop");
	});

	test("normalizeText still strips ordinary accents alongside", () => {
		expect(normalizeText("cœur brûlé")).toBe("coeur brule");
	});

	test("getMatchingKey matches the spelled-out form when accents are ignored", () => {
		const bank = new Map([["sœur", 1], ["cœur", 1]]);
		expect(getMatchingKey(bank, "soeur", true)).toBe("sœur");
		expect(getMatchingKey(bank, "COEUR", true)).toBe("cœur");
	});

	test("getMatchingKey still requires the ligature when accents count", () => {
		const bank = new Map([["sœur", 1]]);
		expect(getMatchingKey(bank, "soeur", false)).toBeNull();
		expect(getMatchingKey(bank, "sœur", false)).toBe("sœur");
	});

	test("typing soeur claims a multi-word sœur bubble in a challenge", () => {
		window.ignoreAccentsEnabled = true;
		const { challenge, clicked } = buildChallenge(
			ChallengeTapComplete, "tapComplete", ["une sœur", "tu as"], [], ""
		);

		challenge.elements.inputField.value = "une soeur";
		challenge.handleInput();

		expect(clicked.map(textOf)).toEqual(["une sœur"]);
	});
});
