import {ExtensionEventManager} from "./ExtensionEventManager.js"

import {getMatchingKey} from "./AccentUtils.js";

import {WordBank} from "./WordBank.js";

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
		this.elements.inputField.style.cssText = `
		-webkit-text-size-adjust: 100%;
		--viewport-height: 100dvh;
		--web-ui_button-border-radius: 16px;
		--rtl-sign: 1;
		--text-pageTitle-casing-large: none;
		--text-pageTitle-letter-spacing-large: 0;
		--text-pageTitle-line-height-large: 2.75rem;
		--text-pageTitle-size-large: 2.5rem;
		--text-pageTitle-weight-large: 700;
		--text-pageTitle-casing-small: none;
		--text-pageTitle-letter-spacing-small: 0;
		--text-pageTitle-line-height-small: 2.25rem;
		--text-pageTitle-size-small: 2rem;
		--text-pageTitle-weight-small: 700;
		--text-heading-casing-large: none;
		--text-heading-letter-spacing-large: 0;
		--text-heading-line-height-large: 2rem;
		--text-heading-size-large: 1.75rem;
		--text-heading-weight-large: 700;
		--text-heading-casing-medium: none;
		--text-heading-letter-spacing-medium: 0;
		--text-heading-line-height-medium: 2rem;
		--text-heading-size-medium: 1.5rem;
		--text-heading-weight-medium: 700;
		--text-heading-casing-small: none;
		--text-heading-letter-spacing-small: 0;
		--text-heading-line-height-small: 1.5rem;
		--text-heading-size-small: 1.25rem;
		--text-heading-weight-small: 700;
		--text-heading-casing-xsmall: none;
		--text-heading-letter-spacing-xsmall: 0;
		--text-heading-line-height-xsmall: 1.25rem;
		--text-heading-size-xsmall: 1rem;
		--text-heading-weight-xsmall: 700;
		--text-body-casing: none;
		--text-body-letter-spacing: 0;
		--text-body-line-height: 1.75rem;
		--text-body-size: 1.25rem;
		--text-body-weight: 500;
		--text-body-weight-bold: 700;
		--text-body-casing-spacious: none;
		--text-body-letter-spacing-spacious: 0;
		--text-body-line-height-spacious: 2rem;
		--text-body-size-spacious: 1.25rem;
		--text-body-weight-spacious: 500;
		--text-body-weight-spacious-bold: 700;
		--text-caption-casing: none;
		--text-caption-letter-spacing: 0;
		--text-caption-line-height: 1.5rem;
		--text-caption-size: 1rem;
		--text-caption-weight: 500;
		--text-caption-weight-bold: 700;
		--text-label-casing-large: uppercase;
		--text-label-letter-spacing-large: 0.04em;
		--text-label-line-height-large: 1.5rem;
		--text-label-size-large: 1.5rem;
		--text-label-weight-large: 700;
		--text-label-casing-medium: uppercase;
		--text-label-letter-spacing-medium: 0.04em;
		--text-label-line-height-medium: 1rem;
		--text-label-size-medium: 1rem;
		--text-label-weight-medium: 700;
		--color-snow: 19, 31, 36;
		--color-snow-always-light: 255, 255, 255;
		--color-snow-always-dark: 19, 31, 36;
		--color-polar: 32, 47, 54;
		--color-swan: 55, 70, 79;
		--color-swan-always-light: 229, 229, 229;
		--color-swan-always-dark: 55, 70, 79;
		--color-hare: 82, 101, 109;
		--color-hare-always-light: 175, 175, 175;
		--color-wolf: 220, 230, 236;
		--color-eel: 241, 247, 251;
		--color-squid: 235, 227, 227;
		--color-walking-fish: 32, 47, 54;
		--color-flamingo: 148, 81, 81;
		--color-pig: 245, 164, 164;
		--color-crab: 255, 120, 120;
		--color-cardinal: 238, 85, 85;
		--color-fire-ant: 216, 72, 72;
		--color-canary: 32, 47, 54;
		--color-duck: 251, 229, 109;
		--color-bee: 255, 199, 0;
		--color-bee-always-dark: 255, 199, 0;
		--color-lion: 255, 177, 0;
		--color-fox: 255, 171, 51;
		--color-cheetah: 32, 47, 54;
		--color-monkey: 229, 162, 89;
		--color-camel: 231, 166, 1;
		--color-guinea-pig: 215, 148, 51;
		--color-grizzly: 187, 113, 73;
		--color-sea-sponge: 32, 47, 54;
		--color-turtle: 95, 132, 40;
		--color-owl: 147, 211, 51;
		--color-tree-frog: 121, 185, 51;
		--color-peacock: 0, 205, 156;
		--color-iguana: 32, 47, 54;
		--color-anchovy: 210, 228, 232;
		--color-beluga: 187, 242, 255;
		--color-moon-jelly: 122, 240, 242;
		--color-blue-jay: 63, 133, 167;
		--color-macaw: 73, 192, 248;
		--color-whale: 24, 153, 214;
		--color-humpback: 43, 112, 201;
		--color-narwhal: 20, 83, 163;
		--color-manta-ray: 4, 44, 96;
		--color-starfish: 255, 134, 208;
		--color-beetle: 206, 130, 255;
		--color-betta: 144, 105, 205;
		--color-butterfly: 111, 78, 161;
		--color-dragon: 204, 52, 141;
		--color-starling: 92, 108, 252;
		--color-martin: 71, 85, 223;
		--color-grackle: 167, 160, 255;
		--color-honeycreeper: 193, 187, 255;
		--color-deep-starling: 34, 33, 81;
		--color-deep-martin: 16, 15, 62;
		--color-legendary-foreground: 140, 65, 3;
		--color-stardust: 199, 255, 254;
		--color-cosmos: 60, 77, 255;
		--color-nebula: 63, 34, 236;
		--color-nova: 207, 23, 200;
		--color-gamma: 38, 246, 99;
		--color-starlight: 38, 138, 255;
		--color-quasar: 252, 85, 255;
		--color-celestia: 255, 255, 255;
		--color-eclipse: 0, 4, 55;
		--color-black: 0, 0, 0;
		--color-aqua: 43, 164, 176;
		--color-aqua-always-light: 56, 238, 255;
		--color-ocean: 56, 238, 255;
		--color-seafoam: 30, 89, 97;
		--color-ice: 23, 52, 58;
		--color-max-shadow: 20, 208, 225;
		--color-black-white: 255, 255, 255;
		--color-diamond-stat: 86, 219, 226;
		--color-mask-green: 144, 220, 72;
		--color-pearl-stat: 255, 170, 222;
		--color-snow-dark-swan: 55, 70, 79;
		--color-black-text: 241, 247, 251;
		--color-blue-space: 11, 62, 113;
		--color-juicy-blue-space: 10, 74, 130;
		--color-juicy-blue-space-light: 35, 83, 144;
		--color-gold: 250, 169, 25;
		--color-gray-text: 220, 230, 236;
		--color-orange: 255, 157, 0;
		--color-diamond-highlight: 231, 251, 251;
		--color-diamond: 56, 208, 208;
		--color-banana: 255, 176, 32;
		--color-cloud: 207, 207, 207;
		--color-cloud-light: 221, 221, 221;
		--color-cloud-lightest: 240, 240, 240;
		--color-kiwi: 122, 199, 12;
		--color-kiwi-dark: 93, 151, 9;
		--color-kiwi-light: 142, 224, 0;
		--color-facebook: 59, 89, 152;
		--color-facebook-dark: 45, 67, 115;
		--color-google: 66, 133, 244;
		--color-twitter: 29, 161, 242;
		--color-hv-light-peach: 241, 218, 179;
		--color-hv-peach: 219, 186, 131;
		--color-hv-light-orange: 255, 177, 64;
		--color-hv-orange: 204, 121, 0;
		--color-hv-brown: 140, 90, 17;
		--color-streak-panel-extended-background: 205, 121, 0;
		--color-streak-panel-friend-background: 255, 95, 0;
		--color-streak-panel-frozen-background: 43, 112, 201;
		--color-streak-panel-frozen-flair-background: 73, 192, 248;
		--color-streak-panel-frozen-subtitle: 255, 255, 255;
		--color-streak-panel-frozen-text: 255, 255, 255;
		--color-streak-panel-frozen-topbar-text: 255, 255, 255;
		--color-streak-panel-streak-society-background: 215, 148, 51;
		--color-streak-panel-streak-society-background-always-dark: 215, 148, 51;
		--color-streak-panel-streak-society-text: 255, 255, 255;
		--color-streak-panel-unextended-heading-text: 82, 101, 109;
		--color-streak-panel-unextended-heading-background: 32, 47, 54;
		--color-streak-panel-unextended-topbar-text: 255, 255, 255;
		--color-streak-panel-milestone-gradient-start: 255, 147, 58;
		--color-streak-panel-milestone-gradient-end: 255, 200, 0;
		--color-streak-society-dark-orange: 255, 151, 1;
		--color-streak-society-light-orange: 255, 179, 1;
		--color-friends-quest-own-incomplete: 111, 139, 157;
		--color-friends-quest-friend-incomplete: 79, 100, 113;
		--color-black-text-always-light: 60, 60, 60;
		--color-cardinal-always-light: 255, 75, 75;
		--color-cowbird: 174, 104, 2;
		--color-eel-always-light: 75, 75, 75;
		--color-fox-always-light: 255, 150, 0;
		--color-fire-ant-always-light: 234, 43, 43;
		--color-grizzly-lite: 220, 143, 71;
		--color-guinea-pig-always-light: 205, 121, 0;
		--color-iguana-always-light: 221, 244, 255;
		--color-macaw-always-light: 28, 176, 246;
		--color-owl-always-light: 88, 204, 2;
		--color-polar-always-light: 247, 247, 247;
		--color-sea-sponge-always-light: 215, 255, 184;
		--color-tree-frog-always-light: 88, 167, 0;
		--color-turtle-always-light: 165, 237, 110;
		--color-walking-fish-always-light: 255, 223, 224;
		--color-wolf-always-light: 119, 119, 119;
		--color-cardinal-always-dark: 238, 85, 85;
		--color-eel-always-dark: 241, 247, 251;
		--color-hare-always-dark: 82, 101, 109;
		--color-macaw-always-dark: 73, 192, 248;
		--color-owl-always-dark: 147, 211, 51;
		--color-polar-always-dark: 32, 47, 54;
		--color-wolf-always-dark: 220, 230, 236;
		--color-rookie: 0, 175, 133;
		--color-explorer: 255, 100, 191;
		--color-traveler: 255, 145, 83;
		--color-trailblazer: 154, 143, 232;
		--color-adventurer: 96, 12, 199;
		--color-discoverer: 111, 44, 57;
		--color-daredevil: 46, 83, 138;
		--color-navigator: 9, 47, 119;
		--color-champion: 255, 110, 53;
		--color-daily_refresh: 0, 148, 255;
		--color-dark-mode-locked-path-section-text-color: 82, 101, 109;
		--color-rookie-progress-bar: 0, 198, 150;
		--color-explorer-progress-bar: 255, 138, 207;
		--color-traveler-progress-bar: 255, 167, 106;
		--color-trailblazer-progress-bar: 169, 157, 254;
		--color-adventurer-progress-bar: 122, 13, 199;
		--color-discoverer-progress-bar: 131, 50, 65;
		--color-daredevil-progress-bar: 54, 98, 165;
		--color-navigator-progress-bar: 12, 57, 141;
		--color-champion-progress-bar: 255, 129, 80;
		--color-daily_refresh-progress-bar: 28, 160, 255;
		--color-course-complete-cta: 120, 219, 224;
		--color-course-complete-cta-border: 94, 201, 204;
		--color-bea-secondary: 24, 153, 214;
		--color-eddy-secondary: 234, 43, 43;
		--color-gilded-secondary: 231, 166, 1;
		--color-lily-secondary: 165, 104, 204;
		--color-vikram-secondary: 163, 42, 113;
		--color-zari-secondary: 204, 107, 166;
		--color-oscar-secondary: 0, 164, 125;
		--color-falstaff-secondary: 150, 90, 58;
		--color-bea-radio: 20, 123, 172;
		--color-duo-radio: 62, 143, 1;
		--color-eddy-radio: 179, 53, 53;
		--color-falstaff-radio: 131, 79, 51;
		--color-lin-lucy-radio: 179, 105, 0;
		--color-lily-radio: 144, 91, 179;
		--color-vikram-radio: 143, 36, 99;
		--color-zari-radio: 179, 94, 146;
		--color-oscar-radio: 0, 144, 109;
		--color-bea-junior-shine: 67, 190, 248;
		--color-duo-shine: 114, 214, 39;
		--color-eddy-shine: 255, 105, 105;
		--color-falstaff-shine: 227, 165, 108;
		--color-lily-shine: 214, 150, 255;
		--color-lin-lucy-shine: 255, 168, 44;
		--color-oscar-shine: 63, 217, 181;
		--color-vikram-shine: 214, 90, 162;
		--color-zari-shine: 255, 158, 217;
		--color-super-background-secondary: 26, 30, 76;
		--color-super-gradient-background: 12, 47, 113;
		--color-super-gradient-top-halo: 12, 76, 70;
		--color-super-gradient-bottom-halo: 76, 29, 115;
		--color-gold-shine: 255, 231, 0;
		--color-legendary-dark-background: 24, 24, 24;
		--color-roseate: 223, 75, 162;
		--color-rosefinch: 180, 28, 117;
		--color-bluebird: 3, 144, 211;
		--color-cotinga: 121, 58, 227;
		--color-sabrewing: 165, 112, 255;
		--color-blueberry: 17, 82, 167;
		--color-ether: 60, 89, 141;
		--color-diamond-tournament-purple: 161, 161, 238;
		--color-diamond-tournament-reaction: 118, 163, 231;
		--color-yir-page0: 221, 244, 255;
		--color-yir-page1: 227, 255, 235;
		--color-yir-page1-shadow: 19, 31, 36;
		--color-yir-page3-shadow: 187, 172, 252;
		--color-yir-page4-shadow: 143, 219, 255;
		--color-yir-page5-shadow: 255, 183, 80;
		--color-super-gradient-green-variant1: 38, 255, 85;
		--color-super-gradient-blue-variant1: 38, 139, 255;
		--color-super-gradient-pink-variant1: 252, 85, 255;
		--color-super-gradient-purple-variant1: 17, 34, 181;
		--color-unknown-001e2d: 0, 30, 45;
		--color-unknown-0047a4: 0, 71, 164;
		--color-unknown-0087d0: 0, 135, 208;
		--color-unknown-00aff9: 0, 175, 249;
		--color-unknown-013047: 1, 48, 71;
		--color-unknown-048fd1: 4, 143, 209;
		--color-unknown-0e0f10: 14, 15, 16;
		--color-unknown-0e3d79: 14, 61, 121;
		--color-unknown-172071: 23, 32, 113;
		--color-unknown-280378: 40, 3, 120;
		--color-unknown-3ebbf6: 62, 187, 246;
		--color-unknown-655ebb: 101, 94, 187;
		--color-unknown-696cee: 105, 108, 238;
		--color-unknown-7c0000: 124, 0, 0;
		--color-unknown-89e219: 137, 226, 25;
		--color-unknown-935051: 147, 80, 81;
		--color-unknown-959595: 149, 149, 149;
		--color-unknown-a2a2a2: 162, 162, 162;
		--color-unknown-a3dbeb: 163, 219, 235;
		--color-unknown-a4dffb: 164, 223, 251;
		--color-unknown-aaa: 170, 170, 170;
		--color-unknown-d087ff: 208, 135, 255;
		--color-unknown-d9d9d9: 217, 217, 217;
		--color-unknown-ddd: 221, 221, 221;
		--color-unknown-de8029: 222, 128, 41;
		--color-unknown-e3e3e3: 227, 227, 227;
		--color-unknown-e4ffff: 228, 255, 255;
		--color-unknown-ed8c01: 237, 140, 1;
		--color-unknown-f3484e: 243, 72, 78;
		--color-unknown-f4fafe: 244, 250, 254;
		--color-unknown-fbdec5: 251, 222, 197;
		--color-unknown-ffc700: 255, 199, 0;
		--color-unknown-fff2aa: 255, 242, 170;
		--color-unknown-fffbef: 255, 251, 239;
		--app-offset: 0px;
		-webkit-font-smoothing: antialiased;
		direction: ltr;
		-webkit-locale: "es";
		font-size: 100%;
		margin: 0;
		overflow: auto;
		-webkit-tap-highlight-color: transparent;
		box-sizing: inherit;
		font-family: din-round,sans-serif;
		outline: none;
		user-select: auto;
		background: rgb(var(--color-snow));
		border: 2px solid rgb(var(--color-swan));
		color: rgb(var(--color-black-text));
		text-align: initial;
		line-height: 24px;
		background-color: rgb(var(--color-polar));
		border-color: rgb(var(--color-swan));
		border-radius: 10px;
		padding: 10px 12px;
		appearance: none;
		width: 100%;
		flex-grow: 1;
		resize: none;
		`

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