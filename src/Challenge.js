import{
	ExtensionEventManager
} from "./ExtensionEventManager.js"

import{
	getMatchingKey
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

		let words = inputField.value.trim().split(/\s+/);

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

		if(text.endsWith(" ") && words.length > 0) {
			words.pop();
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
	 * Handles backspace key event
	 * @abstract
	 */
	handleBackspace(){
		throw new Error("Method not implemented");
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
			this.handleBackspace();
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