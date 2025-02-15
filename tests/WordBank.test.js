/**
 * @jest-environment jsdom
 */
import { WordBank } from "../src/WordBank.js";

function createWordBankContainer(words) {
	const container = document.createElement("div");
	container.dataset.test = "word-bank";
	words.forEach(word => {
		const button = document.createElement("button");
		button.setAttribute("data-test", "challenge-tap-token");
		const span = document.createElement("span");
		span.setAttribute("data-test", "challenge-tap-token-text");
		span.textContent = word;
		button.appendChild(span);
		container.appendChild(button);
	});
	return container;
}

describe("WordBank", () => {
	let container;
	beforeEach(() => {
		document.body.innerHTML = "";
		container = createWordBankContainer(["hello", "world", "hello"]);
		document.body.appendChild(container);
	});

	test("should extract words into a map", () => {
		const wb = new WordBank(container);
		const map = wb.wordMap;
		expect(map.has("hello")).toBe(true);
		expect(map.get("hello").length).toBe(2);
		expect(map.has("world")).toBe(true);
		expect(map.get("world").length).toBe(1);
	});

	test("selectWord returns a button and removes it from available", () => {
		const wb = new WordBank(container);
		const btn1 = wb.selectWord("hello");
		expect(btn1).not.toBeNull();
		expect(wb.wordMap.get("hello").length).toBe(1);
		expect(wb.usedWordButtons.get("hello").length).toBe(1);
	});

	test("returnLastUsed restores a selected word", () => {
		const wb = new WordBank(container);
		const btn1 = wb.selectWord("hello");
		expect(wb.wordMap.get("hello").length).toBe(1);
		const returned = wb.returnLastUsed("hello");
		expect(returned).toBe(btn1);
		expect(wb.wordMap.get("hello").length).toBe(2);
	});

	test("returnWord adds a new button if not present", () => {
		const wb = new WordBank(container);
		const newButton = document.createElement("button");
		wb.returnWord("new", newButton);
		expect(wb.wordMap.has("new")).toBe(true);
		expect(wb.wordMap.get("new")).toEqual([newButton]);
	});

	test("selectWord returns null if word unavailable", () => {
		const wb = new WordBank(container);
		wb.selectWord("world");
		expect(wb.selectWord("world")).toBeNull();
	});
});
