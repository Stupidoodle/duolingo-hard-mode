import{
	Challenge
} from "./Challenge.js";

import{
	ExtensionEventManager
} from "./ExtensionEventManager.js"
import{
	normalizeText
} from "./AccentUtils.js";

/**
 * Challenge type: translate
 * @extends Challenge
 */
export class ChallengeTranslate extends Challenge{
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
	handleBackspace(){
		let removedWord = null;

		let words = this.cleanInputText();

		if(words.length === 0){
			return;
		}

		let normalizedWords = window.ignoreAccentsEnabled ?
			words.map(word => normalizeText(word)) :
			words;

		for(const word of this.wordBank.wordMap.keys()){
			const normalizedWord = window.ignoreAccentsEnabled ? normalizeText(word) : word;
			if (
				!(normalizedWords.includes(normalizedWord)) &&
				this.remainingChoices.wordMap.get(word).length !==
				this.wordBank.wordMap.get(word).length
			){
				removedWord = word;
				break;
			}
		}

		if(removedWord){
			console.debug(`Re-enabling ${removedWord}`);

			const returnedButton = this.remainingChoices.returnLastUsed(removedWord);
			// Click the only enabled button to make the word available again
			const dataTestValue = returnedButton.getAttribute("data-test");
			const activeButton = [...document.querySelectorAll(`button[data-test="${dataTestValue}"]`)]
				.find(btn => btn.getAttribute("aria-disabled") === "false");

			if(activeButton){
				activeButton.click();
			}
		}
	}
}