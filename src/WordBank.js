export class WordBank {
	constructor(wordBankDiv) {
		if (!wordBankDiv) {
			throw new Error("Word bank div not found");
		}

		/** @type {HTMLElement} */
		this.wordBankDiv = wordBankDiv;
		// Map of available word buttons: word → array of buttons
		this.wordMap = this.extractWords();
		// Map to track used word buttons: word → array of buttons (LIFO order)
		this.usedWordButtons = new Map();
	}

	/**
	 * Extracts word choices from the word bank container.
	 * @returns {Map<string, HTMLButtonElement[]>} A map where the key is the lowercase word,
	 * and the value is an array of matching button elements.
	 */
	extractWords() {
		const wordButtons = [
			...this.wordBankDiv.querySelectorAll(
				"button[data-test*='challenge-tap-token']"
			)
		];

		return wordButtons.reduce((map, btn) => {
			const word = btn
				.querySelector("[data-test='challenge-tap-token-text']")
				.textContent.trim()
				.toLowerCase();

			if (!map.has(word)) {
				map.set(word, []);
			}
			map.get(word).push(btn);

			return map;
		}, new Map());
	}

	/**
	 * Selects the last available occurrence of a word.
	 * This method uses a LIFO (stack) pattern to track usage so that the last-used
	 * button for that word can later be returned (e.g., when a user backspaces).
	 *
	 * @param {string} word - The word to select.
	 * @returns {HTMLButtonElement|null} The button element for the selected word, or null if unavailable.
	 */
	selectWord(word) {
		if (this.wordMap.has(word) && this.wordMap.get(word).length > 0) {
			// Remove the last available button instance.
			const btn = this.wordMap.get(word).pop();
			// Record this button as the most-recently used.
			if (!this.usedWordButtons.has(word)) {
				this.usedWordButtons.set(word, []);
			}
			this.usedWordButtons.get(word).push(btn);
			return btn;
		}
		return null;
	}

	/**
	 * Returns the last used occurrence of a word back to the available pool.
	 * This method ensures that if a word has been used multiple times,
	 * the instance returned is the one that was selected last.
	 *
	 * @param {string} word - The word to return.
	 * @returns {HTMLButtonElement|null} The returned button element, or null if none are recorded.
	 */
	returnLastUsed(word) {
		if (
			this.usedWordButtons.has(word) &&
			this.usedWordButtons.get(word).length > 0
		) {
			// Pop the most-recently used button and return it to the available pool.
			const btn = this.usedWordButtons.get(word).pop();
			this.wordMap.get(word).push(btn);
			return btn;
		}
		return null;
	}

	/**
	 * Returns a word button back to the available pool.
	 * This generic method can be used if the button to return is known.
	 *
	 * @param {string} word - The word associated with the button.
	 * @param {HTMLButtonElement} wordButton - The button element to return.
	 */
	returnWord(word, wordButton) {
		if (this.wordMap.has(word)) {
			this.wordMap.get(word).push(wordButton);
		} else {
			this.wordMap.set(word, [wordButton]);
		}
	}
}
