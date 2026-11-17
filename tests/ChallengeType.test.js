/**
 * @jest-environment jsdom
 *
 * Issue #108 — with the "Duolingo Fast Mode" extension installed, a
 * Japanese → English translate challenge never got its textarea. Fast Mode
 * appends its own word to the container's data-test, as reported from a live
 * lesson: "challenge challenge-translate dfm-cid-d941fc2e52314e2c96d56a005a72f02b".
 * Stripping the "challenge challenge-" prefix then left
 * "translate dfm-cid-…", which no handler is registered for, so the
 * container was marked processed and skipped.
 */
import "../src/content.js";
import { challengeTypeOf } from "../src/ChallengeType.js";
import { stopContentScript } from "./helpers/contentScript.js";

const FAST_MODE_MARKER = "dfm-cid-d941fc2e52314e2c96d56a005a72f02b";

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

function container(dataTest) {
	const div = document.createElement("div");
	if (dataTest !== null) {
		div.setAttribute("data-test", dataTest);
	}
	return div;
}

describe("challengeTypeOf", () => {
	test("reads the type Duolingo writes", () => {
		expect(challengeTypeOf(container("challenge challenge-translate"))).toBe("translate");
	});

	test("ignores a word another extension appends", () => {
		expect(challengeTypeOf(container(`challenge challenge-translate ${FAST_MODE_MARKER}`))).toBe("translate");
	});

	test("ignores a word placed before Duolingo's", () => {
		expect(challengeTypeOf(container("added-by-someone challenge challenge-listenMatch"))).toBe("listenMatch");
	});

	test("returns an empty string without a type", () => {
		expect(challengeTypeOf(container("challenge"))).toBe("");
		expect(challengeTypeOf(container(null))).toBe("");
	});
});

describe("a container carrying Duolingo Fast Mode's marker", () => {
	afterAll(stopContentScript);

	beforeEach(() => {
		document.body.innerHTML = "";
		const submit = document.createElement("button");
		submit.dataset.test = "player-next";
		document.body.appendChild(submit);
	});

	test("still gets the textarea on a translate challenge", async () => {
		const div = container(`challenge challenge-translate ${FAST_MODE_MARKER}`);
		const bank = document.createElement("div");
		bank.dataset.test = "word-bank";
		for (const word of ["I", "drink", "juice"]) {
			const btn = document.createElement("button");
			btn.setAttribute("data-test", `${word}-challenge-tap-token`);
			btn.setAttribute("aria-disabled", "false");
			btn.innerHTML = `<span></span><span><span data-test="challenge-tap-token-text">${word}</span></span>`;
			bank.appendChild(btn);
		}
		div.appendChild(bank);
		document.body.appendChild(div);
		await tick();

		expect(div.querySelector("textarea[data-extension='true']")).not.toBeNull();
		expect(bank.style.display).toBe("none");
	});

	test("still gets the textarea on a select challenge", async () => {
		const div = container(`challenge challenge-select ${FAST_MODE_MARKER}`);
		document.body.appendChild(div);
		const group = document.createElement("div");
		group.setAttribute("aria-label", "choice");
		group.setAttribute("role", "radiogroup");
		group.innerHTML = '<div data-test="challenge-choice"><span data-test="challenge-judge-text">みず</span></div>'
			+ '<div data-test="challenge-choice"><span data-test="challenge-judge-text">おちゃ</span></div>';
		document.body.appendChild(group);
		await tick();

		expect(document.querySelector("textarea[data-extension='true']")).not.toBeNull();
	});
});
