import{
	Challenge
} from "./Challenge.js";

import{
	ExtensionEventManager
} from "./ExtensionEventManager.js";

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

		let removedWordIndex = -1;
		let text = this.elements.inputField.value;

		// Find the removed word and its original position before deletion
		for (const word of this.wordBank.wordMap.keys()) {
			if (
				!words.includes(word) &&
				this.remainingChoices.wordMap.get(word).length !==
				this.wordBank.wordMap.get(word).length
			) {
				removedWord = word;
				removedWordIndex = text.trim().split(/\s+/).indexOf(word); // Get the original index before deletion
				break;
			}
		}

		if (removedWord && removedWordIndex !== -1) {
			console.debug(`Re-enabling ${removedWord} at index ${removedWordIndex}`);

			const returnedButton = this.remainingChoices.returnLastUsed(removedWord);
			const dataTestValue = returnedButton.getAttribute("data-test");

			// Get all buttons matching the word
			const buttons = [...document.querySelectorAll(`button[data-test='${dataTestValue}']`)]
				.filter(btn =>
					btn.getAttribute("aria-disabled") === "false" &&
					btn.querySelector("[data-test='challenge-tap-token-text']")?.textContent.trim() === removedWord
				);

			console.debug(buttons);

			// Select the button at the same position as the removed word
			const targetButton = buttons[removedWordIndex] || buttons.at(-1); // Fallback to last if out of range

			if (targetButton) {
				targetButton.click();
			}
		}
	}
}