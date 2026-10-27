import {
	withFallbackTokens
} from "./ThemeTokens.js";

import{
	ExtensionEventManager
} from "./ExtensionEventManager.js"

import{
	getMatchingKey,
	normalizeForMatch
} from "./AccentUtils.js";

import{
	WordBank
} from "./WordBank.js";

import{
	readTokenText
} from "./TokenText.js";

import{
	CONSTANTS
} from "./constants.js";

// How long a tap waits for a bubble that is still disabled from Duolingo's
// animation before clicking anyway, so a bubble that never re-enables cannot
// stall every tap queued behind it.
const TAP_WAIT_LIMIT_MS = 1000;
const TAP_POLL_MS = 30;

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
		/** @type {HTMLElement[]} Clicks waiting for their turn, oldest first */
		this.tapQueue = [];
		this.tapTimer = null;
		this.tapWaitStarted = null;

		this.eventManager.registerChallenge(this.challengeId, this);
	}

	/**
	 * Clicks a bubble (or the submit button), in order with every earlier click.
	 *
	 * Duolingo animates a released bubble back into the bank and keeps it
	 * aria-disabled until it lands, ignoring clicks meanwhile. Clicking in that
	 * window left a word recorded as placed but missing from the answer (#91).
	 * A target that is still disabled is clicked once it re-enables, and every
	 * click queued after it waits its turn, so the answer keeps the typed order.
	 *
	 * @param {HTMLElement|null} target
	 */
	tap(target){
		if(!target){
			return;
		}

		this.tapQueue.push(target);
		this.drainTaps();
	}

	/**
	 * Clicks queued targets until one is still disabled, then polls for it.
	 */
	drainTaps(){
		while(this.tapQueue.length > 0){
			const target = this.tapQueue[0];

			if(target.getAttribute("aria-disabled") === "true"){
				this.tapWaitStarted ??= Date.now();

				if(Date.now() - this.tapWaitStarted < TAP_WAIT_LIMIT_MS){
					this.tapTimer ??= setTimeout(() => {
						this.tapTimer = null;
						this.drainTaps();
					}, TAP_POLL_MS);
					return;
				}
			}

			this.tapQueue.shift();
			this.tapWaitStarted = null;
			target.click();
		}
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

		return this.mergeMultiWordTokens(words);
	}

	/**
	 * The most words any single bubble in the bank holds.
	 * @returns {Number}
	 */
	longestTokenLength(){
		let longest = 1;

		for(const key of this.wordBank.wordMap.keys()){
			longest = Math.max(longest, key.split(/\s+/).length);
		}

		return longest;
	}

	/**
	 * Joins consecutive words that together spell one bubble.
	 *
	 * French banks hold bubbles such as "tu as" or "une sœur", so the typed words
	 * have to be regrouped before they line up with the bank's keys. The longest
	 * bubble wins, the same way a longer word takes over from a shorter one while
	 * it is being typed.
	 *
	 * @param {String[]} words
	 * @returns {String[]}
	 */
	mergeMultiWordTokens(words){
		const longest = this.longestTokenLength();

		if(longest < 2){
			return words;
		}

		const merged = [];

		for(let start = 0; start < words.length;){
			let span = 1;

			for(let length = Math.min(longest, words.length - start); length > 1; length--){
				if(this.matchKey(this.wordBank.wordMap, words.slice(start, start + length).join(" "))){
					span = length;
					break;
				}
			}

			merged.push(words.slice(start, start + span).join(" "));
			start += span;
		}

		return merged;
	}

	/**
	 * Whether the words at the end of the input are the opening words of a
	 * multi-word bubble, so a space there continues the bubble instead of being
	 * an unknown word.
	 *
	 * @returns {Boolean}
	 */
	isInsideMultiWordToken(){
		const typed = this.elements.inputField.value.trim().split(/\s+/)
			.filter(word => word.length > 0)
			.map(word => this.normalizeWord(word));

		for(const key of this.remainingChoices.wordMap.keys()){
			const keyWords = key.split(/\s+/).map(word => this.normalizeWord(word));

			for(let length = 1; length < keyWords.length && length <= typed.length; length++){
				const tail = typed.slice(typed.length - length);

				if(tail.every((word, index) => word === keyWords[index])){
					return true;
				}
			}
		}

		return false;
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
		return normalizeForMatch(word.trim(), {
			ignoreAccents: window.ignoreAccentsEnabled,
			ignoreApostrophes: window.ignoreApostrophesEnabled
		});
	}

	/**
	 * Resolves typed input to a word bank key, honouring both leniency settings.
	 * @param {Map<String, *>} map
	 * @param {String} input
	 * @returns {String|null}
	 */
	matchKey(map, input){
		return getMatchingKey(
			map,
			input,
			window.ignoreAccentsEnabled,
			window.ignoreApostrophesEnabled
		);
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

		// Disabled copies are kept: one still animating into the answer row is
		// disabled for a moment, and tap() waits for it.
		const matches = [...document.querySelectorAll("button[data-test*='challenge-tap-token']")]
			.filter(button => !wordBankDiv?.contains(button))
			.filter(button => {
				const text = readTokenText(
					button.querySelector("[data-test='challenge-tap-token-text']")
				);
				return text !== "" && this.normalizeWord(text) === target;
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
			this.tap(this.findAnswerButton(releasedWord));

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
	 * How many bubbles of a word are currently placed in the answer.
	 * @param {String} word - Word bank key
	 * @returns {Number}
	 */
	usedCount(word){
		const total = this.wordBank.wordMap.get(word)?.length ?? 0;
		const remaining = this.remainingChoices.wordMap.get(word)?.length ?? 0;

		return total - remaining;
	}

	/**
	 * Whether the word being typed has already claimed its bubble.
	 *
	 * Compares copies in use against copies the text spells out, so a repeated
	 * word can still claim a second bubble.
	 *
	 * @returns {Boolean}
	 */
	isTrailingWordClaimed(){
		const words = this.splitWords(this.elements.inputField.value);
		// Not Array.prototype.at: CI still builds on Node 14, which predates it.
		const token = words[words.length - 1];

		if(!token){
			return false;
		}

		const matchingKey = this.matchKey(this.remainingChoices.wordMap, token);

		if(!matchingKey){
			return false;
		}

		const normalizedKey = this.normalizeWord(matchingKey);
		const spelled = words.filter(word => this.normalizeWord(word) === normalizedKey).length;

		return this.usedCount(matchingKey) >= spelled;
	}

	/**
	 * Claims the bubble for the word being typed the moment it matches exactly.
	 * @returns {void}
	 */
	claimTrailingWord(){
		if(this.isTrailingWordClaimed()){
			return;
		}

		const words = this.splitWords(this.elements.inputField.value);
		// Not Array.prototype.at: CI still builds on Node 14, which predates it.
		const token = words[words.length - 1];

		if(!token){
			return;
		}

		const matchingKey = this.matchKey(this.remainingChoices.wordMap, token);

		if(!matchingKey){
			return;
		}

		// "a" while typing "are": claiming it now would only release it on the
		// next keystroke. Space, Enter or the next word settles it instead.
		if(this.startsLongerBubble(matchingKey)){
			return;
		}

		console.debug(`Claiming ${matchingKey}`);

		this.tap(this.remainingChoices.selectWord(matchingKey));
	}

	/**
	 * Whether a still-available bubble begins with this one, so the word being
	 * typed may yet turn into it ("a" → "are", "tu" → "tu as").
	 *
	 * @param {String} key - Word bank key
	 * @returns {Boolean}
	 */
	startsLongerBubble(key){
		const prefix = this.normalizeWord(key);

		for(const [other, buttons] of this.remainingChoices.wordMap){
			if(other === key || buttons.length === 0){
				continue;
			}

			const candidate = this.normalizeWord(other);

			if(candidate.length > prefix.length && candidate.startsWith(prefix)){
				return true;
			}
		}

		return false;
	}

	/**
	 * Claims every word already followed by a space that has no bubble yet.
	 *
	 * A word deferred by startsLongerBubble is settled once the next word starts;
	 * running before the trailing word is claimed keeps the typed order.
	 */
	claimSettledWords(){
		const text = this.elements.inputField.value;
		const words = this.splitWords(text);
		const settled = /\s$/.test(text) ? words : words.slice(0, -1);
		const required = new Map();

		for(const word of settled){
			const key = this.matchKey(this.wordBank.wordMap, word);

			if(key){
				required.set(key, (required.get(key) ?? 0) + 1);
			}
		}

		for(const [key, count] of required){
			for(let missing = count - this.usedCount(key); missing > 0; missing--){
				const button = this.remainingChoices.selectWord(key);

				if(!button){
					break;
				}

				console.debug(`Settling ${key}`);
				this.tap(button);
			}
		}
	}

	/**
	 * Handles every keystroke that reaches the input.
	 *
	 * Typing on past a match has to give the bubble back before the longer word
	 * can claim its own — a bank holding both "apple" and "applepie" swaps which
	 * bubble is held as the extra letters arrive.
	 */
	handleInput(){
		this.releaseWords(this.splitWords(this.elements.inputField.value));
		this.claimSettledWords();
		this.claimTrailingWord();
	}

	/**
	 * Handles space key event
	 */
	handleSpace(){
		// The word may already hold its bubble from live matching, in which case
		// space only commits it.
		if(this.isTrailingWordClaimed() || this.isInsideMultiWordToken()){
			this.elements.inputField.value += " ";
			return;
		}

		let userInput = this.elements.inputField.value.trim().split(/\s+/).pop().toLowerCase();

		if(!userInput)
			return;

		if(userInput.includes("'")){
			const apostropheIndex = userInput.indexOf("'");
			const firstPart = userInput.slice(0, apostropheIndex);
			const secondPart = userInput.slice(apostropheIndex);  // includes the apostrophe

			const firstMatchingKey = this.matchKey(this.remainingChoices.wordMap, firstPart);
			const secondMatchingKey = this.matchKey(this.remainingChoices.wordMap, secondPart);

			if(firstMatchingKey && secondMatchingKey){
				console.debug(`Selected ${firstMatchingKey} and ${secondMatchingKey}`);

				this.tap(this.remainingChoices.selectWord(firstMatchingKey));
				//FIXME
				this.tap(this.remainingChoices.selectWord(secondMatchingKey));
				this.elements.inputField.value += " ";
			}
			else if(secondMatchingKey){
				// NOTE: This could lead to unexpected behaviour
				console.debug(`Selected ${secondMatchingKey}`);

				this.tap(this.remainingChoices.selectWord(secondMatchingKey));
				this.elements.inputField.value += " ";
			}
			else if(this.matchKey(this.remainingChoices.wordMap, userInput)){
				console.debug(`Selected ${userInput}`);

				this.tap(this.remainingChoices.selectWord(userInput));
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
			const matchingKey = this.matchKey(this.remainingChoices.wordMap, userInput);

			if (matchingKey) {
				console.debug(`Selected ${matchingKey}`);

				this.tap(this.remainingChoices.selectWord(matchingKey));
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
		const words = this.splitWords(this.elements.inputField.value);
		// Not Array.prototype.at: CI still builds on Node 14, which predates it.
		const userInput = words.length > 0 ? words[words.length - 1] : "";

		const matchingKey = this.matchKey(this.remainingChoices.wordMap, userInput);

		if(matchingKey){
			// Live matching has usually claimed it already; claiming again would
			// take a second copy of a repeated word.
			if(!this.isTrailingWordClaimed()){
				console.debug(`Selected ${matchingKey}`);

				this.tap(this.remainingChoices.selectWord(matchingKey));
			}

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
		const matchingKeyAfterApostrophe = this.matchKey(this.remainingChoices.wordMap, tokenAfterApostrophe);

		if(matchingKeyAfterApostrophe){
			console.debug(`Selected ${matchingKeyAfterApostrophe}`);

			this.tap(this.remainingChoices.selectWord(matchingKeyAfterApostrophe));
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

		const matchingKey = this.matchKey(this.remainingChoices.wordMap, userInput);

		if(matchingKey){
			console.debug(`Selected ${matchingKey}`);

			this.tap(this.remainingChoices.selectWord(matchingKey));

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
		this.elements.inputField.style.cssText = withFallbackTokens(CONSTANTS.STYLE.INPUT);

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
		// Queued so it lands after any bubble still waiting on an animation.
		this.tap(this.elements.submitButton);
	}
}