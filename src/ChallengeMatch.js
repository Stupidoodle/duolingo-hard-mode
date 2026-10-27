import {
	withFallbackTokens
} from "./ThemeTokens.js";

import{
	ExtensionEventManager
} from "./ExtensionEventManager.js";

import{
	getMatchingKey
} from "./AccentUtils.js";

import{
	readTokenText
} from "./TokenText.js";

import{
	CONSTANTS
} from "./constants.js";

// `*=` rather than `$=`: a tile holding several words puts the first word
// behind the marker, e.g. "sœur-challenge-tap-token une".
const TILE_SELECTOR = "button[data-test*='challenge-tap-token']";
const TEXT_SELECTOR = "[data-test='challenge-tap-token-text']";

/**
 * Every pair tile in DOM order: the prompt column first, then the answers.
 * @param {HTMLElement} challengeDiv
 * @returns {HTMLButtonElement[]}
 */
function tilesOf(challengeDiv){
	return [...challengeDiv.querySelectorAll(TILE_SELECTOR)];
}

/**
 * @param {HTMLButtonElement} tile
 * @returns {Boolean}
 */
function isOpen(tile){
	return tile.getAttribute("aria-disabled") !== "true";
}

/**
 * The visible text of a tile, or "" for an audio tile.
 * @param {HTMLButtonElement} tile
 * @returns {String}
 */
function tileText(tile){
	const text = tile.querySelector(TEXT_SELECTOR);

	return text ? readTokenText(text) : "";
}

/**
 * The `lang` every tile of a column agrees on, or null if they do not.
 * @param {HTMLButtonElement[]} tiles
 * @returns {String|null}
 */
function columnLanguage(tiles){
	const lang = tiles[0].getAttribute("lang");

	return lang && tiles.every(tile => tile.getAttribute("lang") === lang) ? lang : null;
}

/**
 * The innermost element holding both nodes.
 * @param {HTMLElement} first
 * @param {HTMLElement} last
 * @returns {HTMLElement|null}
 */
function commonAncestor(first, last){
	let node = first.parentElement;

	while(node && !node.contains(last)){
		node = node.parentElement;
	}

	return node;
}

/**
 * Challenge types: listenMatch and match
 *
 * The answer column is hidden and has to be typed instead. Enter taps the
 * hidden tile carrying the typed text, so Duolingo pairs it with whichever
 * prompt is selected and grades it exactly as it would a tap.
 *
 * Duolingo shows which tile is selected only through Web Animations, never in
 * the DOM, so this class does not try to track it. It taps a prompt itself only
 * when nothing can be selected yet: on a fresh challenge, and straight after a
 * pair locks in.
 */
export class ChallengeMatch{
	/**
	 * Whether the container holds a pair layout this class was verified against:
	 * an even number of tiles with a text answer in every tile of the second
	 * half, and a first half of either
	 *
	 * - audio-only prompts (listenMatch), or
	 * - text prompts (match). Both columns hold text there, so each has to agree
	 *   on one `lang` that differs from the other's — that is what shows the DOM
	 *   splits between the columns rather than somewhere else.
	 *
	 * Also false while the tiles have not rendered yet, so the caller retries on
	 * a later mutation instead of marking the container.
	 *
	 * @param {HTMLElement} challengeDiv
	 * @returns {Boolean}
	 */
	static isPairLayout(challengeDiv){
		const tiles = tilesOf(challengeDiv);

		if(tiles.length === 0 || tiles.length % 2 !== 0){
			return false;
		}

		const prompts = tiles.slice(0, tiles.length / 2);
		const answers = tiles.slice(tiles.length / 2);

		if(!answers.every(tile => tileText(tile).length > 0)){
			return false;
		}

		if(prompts.every(tile => !tile.querySelector(TEXT_SELECTOR))){
			return true;
		}

		if(!prompts.every(tile => tileText(tile).length > 0)){
			return false;
		}

		const promptLanguage = columnLanguage(prompts);
		const answerLanguage = columnLanguage(answers);

		return promptLanguage !== null && answerLanguage !== null && promptLanguage !== answerLanguage;
	}

	/**
	 * @param {HTMLElement} challengeDiv - Challenge div
	 * @param {ExtensionEventManager} eventManager - Event manager
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

		const tiles = tilesOf(challengeDiv);

		/** @type {HTMLButtonElement[]} */
		this.prompts = tiles.slice(0, tiles.length / 2);

		/** @type {HTMLButtonElement[]} */
		this.answers = tiles.slice(tiles.length / 2);

		/** @type {Object} */
		this.elements = {
			question: challengeDiv.querySelector("h1[data-test='challenge-header']")?.textContent.trim() || "",
			inputField: null,
			tiles: tiles.length > 0 ? commonAncestor(tiles[0], tiles[tiles.length - 1]) : null
		};

		/**
		 * The answer tile tapped last, until it either locks in or is left behind
		 * by a wrong pair.
		 * @type {HTMLButtonElement|null}
		 */
		this.pendingAnswer = null;

		/** @type {MutationObserver|null} */
		this.observer = null;

		this.eventManager.registerChallenge(this.challengeId, this);
	}

	/**
	 * Enforces typing by hiding the answers and injecting a textarea
	 */
	enforceTyping(){
		if(this.answers.length === 0 || !this.elements.tiles){
			return;
		}

		const fresh = [...this.prompts, ...this.answers].every(isOpen);

		this.answers.forEach(tile => {
			tile.style.display = "none";
		});

		this.injectTypingInput();

		// A pair locking in disables both tiles; nothing else on the page tells
		// the extension that the selection was used up.
		this.observer = new MutationObserver(() => this.handleTilesChanged());
		this.observer.observe(this.challengeDiv, {
			attributes: true,
			attributeFilter: ["aria-disabled"],
			subtree: true
		});

		if(fresh){
			this.selectNextPrompt();
		}
	}

	/**
	 * Injects a textarea element for typing input
	 */
	injectTypingInput(){
		const inputField = document.createElement("textarea");
		inputField.dataset.extension = "true";
		inputField.dataset.challengeId = this.challengeId;
		inputField.setAttribute("autocapitalize", "off");
		inputField.setAttribute("autocomplete", "off");
		inputField.setAttribute("spellcheck", "false");
		inputField.setAttribute("placeholder", "Type here...");
		inputField.style.cssText = withFallbackTokens(CONSTANTS.STYLE.INPUT);

		this.elements.tiles.parentNode.insertBefore(inputField, this.elements.tiles.nextSibling);

		// Tapping a prompt to hear it moves focus onto the tile.
		inputField.addEventListener("blur", () => setTimeout(() => this.elements.inputField?.focus(), 50));

		this.elements.inputField = inputField;
		inputField.focus();
	}

	/**
	 * Answer tiles that have not been paired off yet.
	 * @returns {HTMLButtonElement[]}
	 */
	openAnswers(){
		return this.answers.filter(isOpen);
	}

	/**
	 * Taps the first prompt that is still open, which also plays its audio.
	 */
	selectNextPrompt(){
		this.prompts.find(isOpen)?.click();
	}

	/**
	 * Moves on to the next prompt once the answer just tapped has locked in. A
	 * wrong pair leaves both tiles open and selects nothing, so the user picks
	 * which prompt to retry.
	 */
	handleTilesChanged(){
		if(this.pendingAnswer && !isOpen(this.pendingAnswer)){
			this.pendingAnswer = null;
			this.selectNextPrompt();
		}
	}

	/**
	 * Called on every input event. Typing alone never taps a tile: a wrong pair
	 * costs a heart, so only Enter commits.
	 */
	handleInput(){
	}

	/**
	 * Handles the keys the event manager swallows before they reach the textarea.
	 * @param {KeyboardEvent} event - Keyboard event
	 */
	handleKeyEvent(event){
		const inputField = this.elements.inputField;

		if(!inputField){
			return;
		}

		if(event.key === "Enter"){
			this.handleEnter();
		}
		else if(event.key === " "){
			inputField.value += " ";
		}
		else if(event.key === "'"){
			inputField.value += "'";
		}
		else if(event.key === "Backspace"){
			// Alt is the macOS equivalent of the ctrl+backspace word delete.
			if(event.ctrlKey || event.altKey){
				const withoutTrailingSpace = inputField.value.replace(/\s+$/, "");
				inputField.value = withoutTrailingSpace.slice(0, withoutTrailingSpace.lastIndexOf(" ") + 1);
			}
			else{
				inputField.value = inputField.value.slice(0, -1);
			}
		}
	}

	/**
	 * Taps the hidden answer whose text was typed, or continues once every pair
	 * is done.
	 */
	handleEnter(){
		const inputField = this.elements.inputField;
		const openAnswers = this.openAnswers();

		if(openAnswers.length === 0){
			this.handleSubmit();
			return;
		}

		const typed = inputField.value.trim();

		if(typed.length === 0){
			return;
		}

		const answersByText = new Map();

		for(const tile of openAnswers){
			const text = tileText(tile).toLowerCase();

			if(!answersByText.has(text)){
				answersByText.set(text, []);
			}
			answersByText.get(text).push(tile);
		}

		const matchingKey = getMatchingKey(answersByText, typed,
			window.ignoreAccentsEnabled, window.ignoreApostrophesEnabled);

		if(!matchingKey){
			console.debug(`No open answer reads ${typed}`);
			this.flashError();
			return;
		}

		console.debug(`Tapping answer ${matchingKey}`);

		this.pendingAnswer = answersByText.get(matchingKey)[0];
		inputField.value = "";
		this.pendingAnswer.click();
	}

	/**
	 * Marks the input red for a moment.
	 */
	flashError(){
		const inputField = this.elements.inputField;

		inputField.style.border = "2px solid red";
		inputField.style.animation = "shake 0.3s";

		setTimeout(() => {
			inputField.style.border = "2px solid rgb(var(--color-swan))";
			inputField.style.animation = "";
		}, 300);
	}

	/**
	 * Continues to the next challenge. Looked up on demand because the button is
	 * re-rendered once the challenge is graded.
	 */
	handleSubmit(){
		document.querySelector('button[data-test="player-next"]')?.click();
	}

	/**
	 * Cleans up the challenge
	 */
	cleanup(){
		this.eventManager.unregisterChallenge(this.challengeId);
		this.observer?.disconnect();
		this.observer = null;
		this.pendingAnswer = null;

		this.answers.forEach(tile => {
			tile.style.display = "";
		});

		if(this.elements?.inputField){
			const inputField = this.elements.inputField;
			this.elements.inputField = null;
			inputField.remove();
		}
	}
}
