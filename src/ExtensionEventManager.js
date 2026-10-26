/**
 * Whether a key or input event is part of an in-progress IME composition.
 *
 * Browsers that predate `isComposing` report the composing keydown only as
 * keyCode 229, so both are checked.
 *
 * @param {KeyboardEvent|InputEvent} event
 * @returns {Boolean}
 */
function isComposing(event){
	return event.isComposing === true || event.keyCode === 229;
}

export class ExtensionEventManager{
	constructor() {
		this.activeChallenges = new Map();
	}

	initGlobalKeyCapture(){
		document.addEventListener("keydown", (event) => {
			const textarea = event.target.closest("textarea[data-extension='true']");
			if(!textarea){
				return;
			}

			event.stopPropagation();
			event.stopImmediatePropagation();

			if(isComposing(event)){
				// Mid-composition these keys belong to the input method: Space
				// picks a kanji candidate and Enter commits it.
				return;
			}

			if([' ', 'Backspace', 'Enter', "'"].includes(event.key)) {
				event.preventDefault();
				const challengeId = textarea.dataset.challengeId;
				const challenge = this.activeChallenges.get(challengeId);
				challenge?.handleKeyEvent(event);
			}
		}, true);

		document.addEventListener('keypress', (e) => {
			if(e.target.closest("textarea[data-extension='true']")) {
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
		}, true);

		document.addEventListener('input', (e) => {
			const textarea = e.target.closest("textarea[data-extension='true']");
			if(!textarea){
				return;
			}

			e.stopPropagation();
			e.stopImmediatePropagation();

			if(isComposing(e)){
				// Intermediate composition updates would match the word bank
				// against half-typed romaji; compositionend handles it instead.
				return;
			}

			// Stopping the event here also keeps it from reaching listeners on the
			// textarea itself, so the challenge has to be called from this handler.
			const challenge = this.activeChallenges.get(textarea.dataset.challengeId);
			challenge?.handleInput?.();
		}, true);

		document.addEventListener('compositionend', (e) => {
			const textarea = e.target.closest("textarea[data-extension='true']");
			if(!textarea){
				return;
			}

			const challenge = this.activeChallenges.get(textarea.dataset.challengeId);
			challenge?.handleInput?.();
		}, true);
	}

	registerChallenge(challengeId, challengeInstance){
		this.activeChallenges.set(challengeId, challengeInstance);
	}

	unregisterChallenge(challengeId){
		this.activeChallenges.delete(challengeId);
	}
}