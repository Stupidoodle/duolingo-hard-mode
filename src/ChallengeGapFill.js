import{
	ChoiceBank
} from "./ChoiceBank.js";

import{
	ExtensionEventManager
} from "./ExtensionEventManager.js";

import{
	getMatchingKey
} from "./AccentUtils.js";

import{
	CONSTANTS
} from "./constants.js";

/**
 * Challenge type: gapFill
 */
export class ChallengeGapFill{
	/**
	 * Instantiates a new ChallengeTranslate
	 * @param {HTMLElement} challengeDiv - Challenge div
	 * @param {HTMLElement} choiceDiv - Choice div
	 * @param {ExtensionEventManager} eventManager - Event manager
	 * @throws {Error} If choiceDiv is not found
	 */
	constructor(challengeDiv, choiceDiv, eventManager){
		/** @type {HTMLElement} */
		this.challengeDiv = challengeDiv;

		/** @type {HTMLElement} */
		this.choiceDiv = choiceDiv;

		/** @type {String} */
		this.challengeId = "gapFill" + "-" + Date.now();

		/** @type {ExtensionEventManager} */
		this.eventManager = eventManager;

		/** @type {Object} */
		this.elements = this.extractElements();

		/** @type {ChoiceBank} */
		this.choiceBank = new ChoiceBank(this.choiceDiv);

		console.debug(this.elements)
		console.debug(this.choiceBank)
		this.eventManager.registerChallenge(this.challengeId, this);
	}

	/**
	 * Extracts elements from the choice div
	 * @returns {Object} Object containing elements
	 */
	extractElements(){
		return{
			question: document.querySelector(
				"div[data-test^='challenge challenge-']"
			).querySelector(
				"h1[data-test='challenge-header']"
			)?.textContent.trim() || "",
			submitButton: document.querySelector('button[data-test="player-next"]'),
			inputField: null,
		}
	}

	/**
	 * Enforces typing by injecting a textarea element
	 */
	enforceTyping(){
		if(this.choiceBank.choiceMap.size > 0){
			console.debug("Enforcing typing for gapFill challenge");
			this.injectTypingInput();
		}
	}

	/**
	 * Injects a textarea element for typing input
	 */
	injectTypingInput(){
		if(!this.choiceBank){
			return console.warn("Choice bank not found");
		}

		this.choiceBank.choiceMap.forEach((value) => {
			value[0].style.display = "none";
		});

		this.elements.inputField = document.createElement("textarea");
		this.elements.inputField.dataset.extension = "true";
		this.elements.inputField.dataset.challengeId = this.challengeId;
		this.elements.inputField.setAttribute("autocapitalize", "off");
		this.elements.inputField.setAttribute("autocomplete", "off");
		this.elements.inputField.setAttribute("spellcheck", "false");
		this.elements.inputField.setAttribute("placeholder", "Type here...");
		this.elements.inputField.setAttribute("data-extension", "true");
		this.elements.inputField.style.cssText = CONSTANTS.STYLE.INPUT;

		this.choiceDiv.parentNode.insertBefore(this.elements.inputField, this.choiceDiv.nextSibling);  // Needs to be tested

		this.elements.inputField.addEventListener('input', (e) => {
			e.stopPropagation();
			e.stopImmediatePropagation();
		});

		this.elements.inputField.addEventListener('keydown', (e) => {
			e.stopPropagation();
			e.stopImmediatePropagation();

			// Handle special keys through our system
			if ([' ', 'Backspace', 'Enter', "'"].includes(e.key)) {
				e.preventDefault();
				this.handleKeyEvent(e);
			}
		});

		this.elements.inputField.addEventListener("blur", () => setTimeout(() => this.elements.inputField.focus(), 50));

		this.elements.inputField.focus();
	}

	/**
	 * Handles key event
	 * @param {KeyboardEvent} event - Keyboard event
	 */
	handleKeyEvent(event){
		const key = event.key;

		if(key === " "){
			this.handleSpace();
		}
		else if(key === "Enter"){
			let userInput = this.elements.inputField.value.trim().toLowerCase();

			const matchingKey = getMatchingKey(this.choiceBank.choiceMap, userInput, window.ignoreAccentsEnabled);

			if(matchingKey){
				console.debug(`Selecting choice: ${matchingKey}`);

				this.choiceBank.choiceMap.get(matchingKey)[0]?.click();
			}
			this.handleSubmit();
		}
		else if(key === "Backspace"){
			if(this.elements.inputField.value.length === 0){
				return;
			}

			this.elements.inputField.value = this.elements.inputField.value.slice(0, -1);
		}
		else if(key === "'"){
			this.elements.inputField.value += "'";
		}
	}

	/**
	 * Handles space key event
	 */
	handleSpace(){
		let userInput = this.elements.inputField.value.trim().toLowerCase();

		this.elements.inputField.value += " ";

		if(!userInput){
			return;
		}

		const matchingKey = getMatchingKey(this.choiceBank.choiceMap, userInput, window.ignoreAccentsEnabled);

		if(matchingKey){
			console.debug(`Selecting choice: ${matchingKey}`);

			this.choiceBank.choiceMap.get(matchingKey)[0].click();
			// Set the style.display for all other choices to none
			this.choiceBank.choiceMap.forEach((value, key) => {
				if(key !== userInput){
					value[0].style.display = "none";
				}
			});
			this.choiceBank.choiceMap.get(matchingKey)[0].style.display = "flex";

			this.elements.inputField.style.border = "2px solid green";
			this.elements.inputField.style.animation = "shake 0.3s";

			setTimeout(() => {
				this.elements.inputField.style.border = "2px solid rgb(var(--color-swan))";
				this.elements.inputField.style.animation = "";
			}, 300);
		}
		else{
			console.debug(`Choice not found: ${matchingKey}`);

			this.elements.inputField.style.border = "2px solid red";
			this.elements.inputField.style.animation = "shake 0.3s";

			setTimeout(() => {
				this.elements.inputField.style.border = "2px solid rgb(var(--color-swan))";
				this.elements.inputField.style.animation = "";
			}, 300);
		}
	}

	/**
	 * Handles submit event
	 */
	handleSubmit(){
		if(this.elements.submitButton){
			this.elements.submitButton.click();
		}
	}

	/**
	 * Cleans up the challenge
	 */
	cleanup(){
		this.eventManager.unregisterChallenge(this.challengeId);
		if(this.elements?.inputField){
			this.elements.inputField.remove();
			this.elements.inputField = null;
			this.choiceBank.choiceMap.forEach((value) => {
				value[0].style.display = "flex";
			});
		}
	}
}