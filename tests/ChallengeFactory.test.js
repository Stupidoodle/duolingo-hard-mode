import { ChallengeFactory } from "../src/ChallengeFactory.js";
import { Challenge } from "../src/Challenge.js";

class DummyChallenge extends Challenge {
	handleBackspace() {}
}
class NotAChallenge {}

describe("ChallengeFactory", () => {
	beforeEach(() => {
		ChallengeFactory.registry.clear();
	});

	test("should register a valid challenge subclass", () => {
		ChallengeFactory.register("dummy", DummyChallenge);
		expect(ChallengeFactory.registry.get("dummy")).toBe(DummyChallenge);
	});

	test("should throw error when registering non-Challenge subclass", () => {
		expect(() => {
			ChallengeFactory.register("invalid", NotAChallenge);
		}).toThrow(/must extend Challenge/);
	});

	test("should create an instance for registered challenge", () => {
		const challengeDiv = document.createElement("div");
		challengeDiv.setAttribute("data-test", "challenge challenge-dummy");
		const wb = document.createElement("div");
		wb.dataset.test = "word-bank";
		challengeDiv.appendChild(wb);
		const eventManager = { registerChallenge: jest.fn() };
		ChallengeFactory.register("dummy", DummyChallenge);
		const instance = ChallengeFactory.create("dummy", challengeDiv, eventManager);
		expect(instance).toBeInstanceOf(DummyChallenge);
	});

	test("should throw error when challenge type not found", () => {
		const challengeDiv = document.createElement("div");
		challengeDiv.setAttribute("data-test", "challenge challenge-nonexistent");
		const eventManager = {};
		expect(() => {
			ChallengeFactory.create("nonexistent", challengeDiv, eventManager);
		}).toThrow(/not found/);
	});
});
