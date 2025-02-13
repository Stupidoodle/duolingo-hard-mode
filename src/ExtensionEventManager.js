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

			if([' ', 'Backspace', 'Enter'].includes(event.key)) {
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
			if(e.target.closest("textarea[data-extension='true']")) {
				e.stopPropagation();
				e.stopImmediatePropagation();
			}
		}, true);
	}

	registerChallenge(challengeId, challengeInstance){
		this.activeChallenges.set(challengeId, challengeInstance);
	}

	unregisterChallenge(challengeId){
		this.activeChallenges.delete(challengeId);
	}
}