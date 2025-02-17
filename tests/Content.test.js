/**
 * @jest-environment jsdom
 */
import { ChallengeFactory } from "../src/ChallengeFactory.js";
import "../src/content.js";

describe("Content bootstrap", () => {
	test("registers 'translate' and 'tapComplete' challenge types", () => {
		expect(ChallengeFactory.registry.has("translate")).toBe(true);
		expect(ChallengeFactory.registry.has("tapComplete")).toBe(true);
		expect(ChallengeFactory.registry.has("listenTap")).toBe(true);
	});
});
