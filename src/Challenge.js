import{
	ExtensionEventManager
} from "./ExtensionEventManager.js"

import{
	getMatchingKey,
	normalizeText
} from "./AccentUtils.js";

import{
	WordBank
} from "./WordBank.js";

import{
	CONSTANTS
} from "./constants.js";

/**
 * Abstract class for all challenges
 * @abstract
 */
export class Challenge{
	/** @type {WordBank | null} */
	remainingChoices = null;
	/**
	 * Instantiates a new Challenge
	 * @param {HTMLElement} challengeDiv - Challenge div
	 * @param {ExtensionEventManager} eventManager - Event manager
	 * @throws {Error} If challengeDiv is not found
	 */
	constructor(challengeDiv, eventManager){
		/** @type {HTMLElement} */
		this.challengeDiv = challengeDiv;

		/** @type {String} */
		this.challengeType = challengeDiv.getAttribute("data-test").replace("challenge challenge-", "");

		/** @type {String} */
		this.challengeId = this.challengeType + "-" + Date.now();

		/** @type {ExtensionEventManager} */
		this.eventManager = eventManager;

		/** @type {Object} */
		this.elements = this.extractElements();

		/** @type {WordBank} */
		this.wordBank = new WordBank(this.challengeDiv.querySelector("div[data-test='word-bank']"));

		/** @type {WordBank} */
		this.remainingChoices = new WordBank(this.challengeDiv.querySelector("div[data-test='word-bank']"));

		console.debug(this.elements);
		console.debug(this.wordBank);
		this.eventManager.registerChallenge(this.challengeId, this);
	}

	/**
	 * Cleans up input text
	 * @returns {Array} Array of words
	 */
	cleanInputText(){
		const inputField = this.elements.inputField;
		let text = inputField.value;

		if(text.length === 0){
			return [];
		}

		inputField.value = text.substring(0, text.length - 1);

		let words = this.splitWords(inputField.value);

		if(text.endsWith(" ") && words.length > 0) {
			words.pop();
		}

		return words;
	}

	/**
	 * Splits typed text into the words the word bank is keyed by.
	 *
	 * A bank that holds a contraction as two bubbles ("l'" + "eau") needs the
	 * typed word split at the apostrophe to line up with them.
	 *
	 * @param {String} text
	 * @returns {String[]} Array of words
	 */
	splitWords(text){
		const trimmed = text.trim();

		if(trimmed.length === 0){
			return [];
		}

		let words = trimmed.split(/\s+/);

		for(const word of [...words]){
			if(word.includes("'")){
				if(Array.from(this.wordBank.wordMap.keys()).some(word =>
					typeof word === "string" && word.endsWith("'"))){
					const apostropheIndex = word.indexOf("'");
					const firstPart = word.slice(0, apostropheIndex + 1);  // includes the apostrophe
					const secondPart = word.slice(apostropheIndex + 1);

					words[words.indexOf(word)] = firstPart;
					words.splice(words.indexOf(firstPart) + 1, 0, secondPart);
				}
				else if(Array.from(this.wordBank.wordMap.keys()).some(word =>
					typeof word === "string" && word.startsWith("'"))) {
					const apostropheIndex = word.indexOf("'");
					const firstPart = word.slice(0, apostropheIndex);
					const secondPart = word.slice(apostropheIndex);  // includes the apostrophe

					words[words.indexOf(word)] = firstPart;
					words.splice(words.indexOf(firstPart) + 1, 0, secondPart);
				}
			}
		}

		return words;
	}

	/**
	 * Cleans up the challenge
	 */
	cleanup(){
		this.eventManager.unregisterChallenge(this.challengeId);
		if(this.elements?.inputField){
			this.elements.inputField.remove();
			this.elements.inputField = null;
			this.elements.wordBank.style.display = "flex";
		}
	}

	/**
	 * Extracts challenge-specific elements
	 * @returns {{question: (string), submitButton: HTMLButtonElement, inputField: HTMLTextAreaElement, wordBank: HTMLElement}} Object containing challenge-specific elements
	 */
	extractElements(){
		// noinspection JSValidateTypes
		return {
			question: this.challengeDiv.querySelector("h1[data-test='challenge-header']")?.textContent.trim() || "",
			submitButton: document.querySelector('button[data-test="player-next"]'),
			inputField: null,
			wordBank: this.challengeDiv.querySelector("div[data-test='word-bank']")
		};
	}

	/**
	 * Enforces typing by injecting a textarea element
	 */
	enforceTyping(){
		if(this.wordBank.wordMap.size > 0){
			console.debug(`Enforcing typing for ${this.challengeType}`);
			this.injectTypingInput();
		}
	}

	/**
	 * Normalizes a word for comparison, honouring the accent setting.
	 * @param {String} word
	 * @returns {String}
	 */
	normalizeWord(word){
		const lowered = word.trim().toLowerCase();
		return window.ignoreAccentsEnabled ? normalizeText(lowered) : lowered;
	}

	/**
	 * Finds the word whose bubble should be returned to the word bank.
	 *
	 * A word is released once the answer holds more copies of it than the input
	 * still spells out. Comparing counts rather than mere presence is what makes
	 * repeated words work: typing "el perro el" and deleting the trailing "el"
	 * has to release a bubble even though "el" still appears earlier in the text.
	 *
	 * @param {String[]} words - words currently spelled out in the input
	 * @returns {String|null} The word bank key to release, or null if none
	 */
	findReleasedWord(words){
		const typed = words.map(word => this.normalizeWord(word));

		for(const [word, buttons] of this.wordBank.wordMap){
			const remaining = this.remainingChoices.wordMap.get(word)?.length ?? 0;
			const used = buttons.length - remaining;

			if(used <= 0){
				continue;
			}

			const normalizedWord = this.normalizeWord(word);
			const stillTyped = typed.filter(candidate => candidate === normalizedWord).length;

			if(used > stillTyped){
				return word;
			}
		}

		return null;
	}

	/**
	 * Finds the bubble to click in order to send `word` back to the word bank.
	 *
	 * Every bubble carries the same `data-test="challenge-tap-token"`, so that
	 * attribute cannot identify one — only the token's own text can. Bubbles
	 * inside the word bank are excluded because clicking those *adds* a word.
	 * The last remaining match is the most recently placed one, which mirrors
	 * the LIFO order `WordBank.returnLastUsed` pops.
	 *
	 * @param {String} word - Word bank key to return
	 * @returns {HTMLButtonElement|null}
	 */
	findAnswerButton(word){
		const target = this.normalizeWord(word);
		const wordBankDiv = this.elements.wordBank;

		const matches = [...document.querySelectorAll("button[data-test*='challenge-tap-token']")]
			.filter(button => button.getAttribute("aria-disabled") === "false")
			.filter(button => !wordBankDiv?.contains(button))
			.filter(button => {
				const text = button
					.querySelector("[data-test='challenge-tap-token-text']")
					?.textContent;
				return text != null && this.normalizeWord(text) === target;
			});

		// Index arithmetic rather than Array.prototype.at: CI still builds on
		// Node 14, which predates it.
		return matches.length > 0 ? matches[matches.length - 1] : null;
	}

	/**
	 * Returns every bubble the input no longer accounts for.
	 *
	 * Each pass hands one button back to the pool, so the used count falls and
	 * the loop terminates.
	 *
	 * @param {String[]} words - words currently spelled out in the input
	 */
	releaseWords(words){
		let releasedWord;

		while((releasedWord = this.findReleasedWord(words)) !== null){
			console.debug(`Re-enabling ${releasedWord}`);

			const availableBefore = this.remainingChoices.wordMap.get(releasedWord)?.length ?? 0;

			this.remainingChoices.returnLastUsed(releasedWord);
			this.findAnswerButton(releasedWord)?.click();

			// Handing the button back is what shrinks the used count. If the pool
			// did not actually grow — it has no record of this word — the next
			// pass would pick the same word again and spin forever.
			if((this.remainingChoices.wordMap.get(releasedWord)?.length ?? 0) === availableBefore){
				break;
			}
		}
	}

	/**
	 * Handles backspace key event by returning the bubble of the word that the
	 * deletion just broke up.
	 */
	handleBackspace(){
		this.releaseWords(this.cleanInputText());
	}

	/**
	 * Handles ctrl/alt + backspace by deleting the whole trailing word, the way
	 * every other text input on the platform does.
	 *
	 * The space that separated the deleted word from the previous one stays, so
	 * the next word can be typed straight away.
	 */
	handleCtrlBackspace(){
		const inputField = this.elements.inputField;
		const withoutTrailingSpace = inputField.value.replace(/\s+$/, "");
		const lastBoundary = withoutTrailingSpace.lastIndexOf(" ");

		inputField.value = lastBoundary === -1
			? ""
			: withoutTrailingSpace.slice(0, lastBoundary + 1);

		this.releaseWords(this.splitWords(inputField.value));
	}

	/**
	 * Handles space key event
	 */
	handleSpace(){
		let userInput = this.elements.inputField.value.trim().split(/\s+/).pop().toLowerCase();

		if(!userInput)
			return;

		if(userInput.includes("'")){
			const apostropheIndex = userInput.indexOf("'");
			const firstPart = userInput.slice(0, apostropheIndex);
			const secondPart = userInput.slice(apostropheIndex);  // includes the apostrophe

			const firstMatchingKey = getMatchingKey(this.remainingChoices.wordMap, firstPart, window.ignoreAccentsEnabled);
			const secondMatchingKey = getMatchingKey(this.remainingChoices.wordMap, secondPart, window.ignoreAccentsEnabled);

			if(firstMatchingKey && secondMatchingKey){
				console.debug(`Selected ${firstMatchingKey} and ${secondMatchingKey}`);

				this.remainingChoices.selectWord(firstMatchingKey).click();
				//FIXME
				this.remainingChoices.selectWord(secondMatchingKey)?.click();
				this.elements.inputField.value += " ";
			}
			else if(secondMatchingKey){
				// NOTE: This could lead to unexpected behaviour
				console.debug(`Selected ${secondMatchingKey}`);

				this.remainingChoices.selectWord(secondMatchingKey).click();
				this.elements.inputField.value += " ";
			}
			else if(getMatchingKey(this.remainingChoices.wordMap, userInput, window.ignoreAccentsEnabled)){
				console.debug(`Selected ${userInput}`);

				this.remainingChoices.selectWord(userInput).click();
				this.elements.inputField.value += " ";
			}
			else{
				console.warn(`Word ${userInput} not found in choices ${Array.from(this.remainingChoices.wordMap.keys())}`);

				this.elements.inputField.style.border = "2px solid red";
				this.elements.inputField.style.animation = "shake 0.3s";

				setTimeout(() => {
					this.elements.inputField.style.border = "2px solid rgb(var(--color-swan))";
					this.elements.inputField.style.animation = "";
				}, 300);
			}
		}
		else{
			const matchingKey = getMatchingKey(this.remainingChoices.wordMap, userInput, window.ignoreAccentsEnabled);

			if (matchingKey) {
				console.debug(`Selected ${matchingKey}`);

				this.remainingChoices.selectWord(matchingKey).click();
				this.elements.inputField.value += " ";
			} else {
				console.warn(`Word ${userInput} not found in choices ${Array.from(this.remainingChoices.wordMap.keys())}`);

				this.elements.inputField.style.border = "2px solid red";
				this.elements.inputField.style.animation = "shake 0.3s";

				setTimeout(() => {
					this.elements.inputField.style.border = "2px solid rgb(var(--color-swan))";
					this.elements.inputField.style.animation = "";
				}, 300);
			}
		}
	}

	/**
	 * Handles enter key event
	 */
	handleEnter(){
		let userInput = this.elements.inputField.value.trim().split(" ").pop().toLowerCase()

		const matchingKey = getMatchingKey(this.remainingChoices.wordMap, userInput, window.ignoreAccentsEnabled);

		if(matchingKey){
			console.debug(`Selected ${matchingKey}`);

			this.remainingChoices.selectWord(matchingKey)?.click();
			this.handleSubmit();
			this.cleanup();
		}
	}

	/**
	 * Handles space after apostrophe key event
	 */
	handleSpaceAfterApostrophe(){
		let userInput = this.elements.inputField.value.trim().split(/\s+/).pop().toLowerCase();

		if(!userInput){
			return;
		}

		let tokenAfterApostrophe = userInput.split("'").pop();
		const matchingKeyAfterApostrophe = getMatchingKey(this.remainingChoices.wordMap, tokenAfterApostrophe, window.ignoreAccentsEnabled);

		if(matchingKeyAfterApostrophe){
			console.debug(`Selected ${matchingKeyAfterApostrophe}`);

			this.remainingChoices.selectWord(matchingKeyAfterApostrophe)?.click();
			this.elements.inputField.value += " ";

			// This is not silly wtf
			// noinspection SillyAssignmentJS
			this.handleSpace = this.handleSpace;
		}
		else{
			console.warn(`Word ${tokenAfterApostrophe} not found in choices ${Array.from(this.remainingChoices.wordMap.keys())}`);

			this.elements.inputField.style.border = "2px solid red";
			this.elements.inputField.style.animation = "shake 0.3s";

			setTimeout(() => {
				this.elements.inputField.style.border = "2px solid rgb(var(--color-swan))";
				this.elements.inputField.style.animation = "";
			}, 300);
		}
	}

	/**
	 * Handles apostrophe key event
	 */
	handleApostrophe(){
		this.elements.inputField.value += "'";
		let userInput = this.elements.inputField.value.trim().split(/\s+/).pop().toLowerCase();

		if(!userInput)
			return;

		const matchingKey = getMatchingKey(this.remainingChoices.wordMap, userInput, window.ignoreAccentsEnabled);

		if(matchingKey){
			console.debug(`Selected ${matchingKey}`);

			this.remainingChoices.selectWord(matchingKey).click();

			this.handleSpace = this.handleSpaceAfterApostrophe;
		}
		else{
			console.warn(`Word ${userInput} not found in choices ${Array.from(this.remainingChoices.wordMap.keys())}`);

			this.elements.inputField.style.border = "2px solid red";
			this.elements.inputField.style.animation = "shake 0.3s";

			setTimeout(() => {
				this.elements.inputField.style.border = "2px solid rgb(var(--color-swan))";
				this.elements.inputField.style.animation = "";
			}, 300);
		}
	}

	/**
	 * Handles key events
	 * @param {KeyboardEvent} event - Keyboard event
	 */
	handleKeyEvent(event){
		const key = event.key;

		if(key === " "){
			this.handleSpace();
		}
		else if(key === "Backspace"){
			// Alt is the macOS equivalent of the ctrl+backspace word delete.
			if(event.ctrlKey || event.altKey){
				this.handleCtrlBackspace();
			}
			else{
				this.handleBackspace();
			}
		}
		else if(key === "Enter"){
			if(Array.from(this.remainingChoices.wordMap.keys()).some(word =>
				typeof word === "string" && word.includes("'"))){
				this.handleSpace();
				this.handleSubmit();
				this.cleanup();
			}
			this.handleEnter();
		}
		else if(key === "'"){
			if(Array.from(this.remainingChoices.wordMap.keys()).some(word =>
				typeof word === "string" && word.endsWith("'")
			)){
				this.handleApostrophe();
			}
			else{
				this.elements.inputField.value += "'";
			}
		}
	}

	/**
	 * Injects a textarea element for typing input
	 */
	injectTypingInput(){
		if(!this.elements.wordBank || !this.wordBank)
			return console.warn("Word bank not found");

		this.elements.wordBank.style.display = "none";

		this.elements.inputField = document.createElement("textarea");
		this.elements.inputField.dataset.extension = "true";
		this.elements.inputField.dataset.challengeId = this.challengeId;
		this.elements.inputField.setAttribute("autocapitalize", "off");
		this.elements.inputField.setAttribute("autocomplete", "off");
		this.elements.inputField.setAttribute("spellcheck", "false");
		this.elements.inputField.setAttribute("placeholder", "Type here...");
		this.elements.inputField.setAttribute("data-extension", "true");
		this.elements.inputField.style.cssText = CONSTANTS.STYLE.INPUT;

		this.elements.wordBank.parentNode.insertBefore(this.elements.inputField, this.elements.wordBank);

		this.elements.inputField.addEventListener('input', (e) => {
			e.stopPropagation();
			e.stopImmediatePropagation();
		});

		this.elements.inputField.addEventListener('keydown', (e) => {
			e.stopPropagation();
			e.stopImmediatePropagation();

			// Handle special keys through our system
			if([' ', 'Backspace', 'Enter', "'"].includes(e.key)) {
				e.preventDefault();
				this.handleKeyEvent(e);
			}
		});

		this.elements.inputField.addEventListener("blur", () => setTimeout(() => this.elements.inputField.focus(), 50));

		this.elements.inputField.focus();
	}

	/**
	 * Submits the challenge
	 */
	handleSubmit() {
		this.elements.submitButton.click();
	}
}