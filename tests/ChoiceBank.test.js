/**
 * @jest-environment jsdom
 */
import { ChoiceBank } from "../src/ChoiceBank.js";

function createChoiceBankContainer(choices) {
	const container = document.createElement("div");
	container.dataset.test = "choice-bank";
	choices.forEach(choice => {
		const div = document.createElement("div");
		div.setAttribute("data-test", "challenge-choice");
		const span = document.createElement("span");
		span.setAttribute("data-test", "challenge-judge-text");
		span.textContent = choice;
		div.appendChild(span);
		container.appendChild(div);
	});
	return container;
}

describe("ChoiceBank", () => {
	test("extractChoices builds a proper map", () => {
		const container = createChoiceBankContainer(["A", "B", "A"]);
		const cb = new ChoiceBank(container);
		expect(cb.choiceMap.has("a")).toBe(true);
		expect(cb.choiceMap.get("a").length).toBe(2);
		expect(cb.choiceMap.has("b")).toBe(true);
		expect(cb.choiceMap.get("b").length).toBe(1);
	});

	test("constructor throws error if container is missing", () => {
		expect(() => new ChoiceBank(null)).toThrow("Choice bank div not found");
	});
});
