import{
	Challenge
} from "./Challenge.js";

import{
	ExtensionEventManager
} from "./ExtensionEventManager.js";

import {
	normalizeText
} from "./AccentUtils.js";

/**
 * Challenge type: tapComplete
 * @extends Challenge
 */
export class ChallengeTapComplete extends Challenge{
	/**
	 * Instantiates a new ChallengeTranslate
	 * @param {HTMLElement} challengeDiv - Challenge div
	 * @param {ExtensionEventManager} eventManager - Event manager
	 * @throws {Error} If challengeDiv is not found
	 */
	constructor(challengeDiv, eventManager){
		super(challengeDiv, eventManager);
	}

	/**
	 * Handles backspace key event
	 */
	handleBackspace() {
		let removedWord = null;

		let words = this.cleanInputText()
		let normalizedWords = window.ignoreAccentsEnabled ?
			words.map(word => normalizeText(word)) :
			words;

		let removedWordIndex = -1;
		let text = this.elements.inputField.value;

		// Find the removed word and its original position before deletion
		for (const word of this.wordBank.wordMap.keys()) {
			const normalizedWord = window.ignoreAccentsEnabled ? normalizeText(word) : word;
			if (
				!normalizedWords.includes(normalizedWord) &&
				this.remainingChoices.wordMap.get(word).length !==
				this.wordBank.wordMap.get(word).length
			) {
				removedWord = word;
				let typedWords = text.trim().split(/\s+/);
				removedWordIndex = typedWords.findIndex(word => {
					let normalizedTypedWord = window.ignoreAccentsEnabled ? normalizeText(word) : word;
					return normalizedTypedWord === normalizedWord;
				});
				break;
			}
		}

		if (removedWord && removedWordIndex !== -1) {
			console.debug(`Re-enabling ${removedWord} at index ${removedWordIndex}`);

			const returnedButton = this.remainingChoices.returnLastUsed(removedWord);
			const dataTestValue = returnedButton.getAttribute("data-test");

			// Get all buttons matching the word
			console.debug(`Looking for buttons with data-test='${dataTestValue}'`);
			console.debug(document.querySelectorAll(`button[data-test='${dataTestValue}']`))

			const buttons = [...document.querySelectorAll(`button[data-test='${dataTestValue}']`)]
				.filter(btn => {
					if (btn.getAttribute("aria-disabled") !== "false") return false;
					const btnWord = btn.querySelector("[data-test='challenge-tap-token-text']")?.textContent.trim();
					const normalizedBtnWord = window.ignoreAccentsEnabled ? normalizeText(btnWord) : btnWord;
					const normalizedRemovedWord = window.ignoreAccentsEnabled ? normalizeText(removedWord) : removedWord;
					return normalizedBtnWord.toLowerCase() === normalizedRemovedWord.toLowerCase();
				});

			console.debug(buttons);

			// Select the button at the same position as the removed word
			const targetButton = buttons[removedWordIndex] || buttons.at(-1); // Fallback to last if out of range

			if (targetButton) {
				targetButton.click();
			}
		}
	}
}