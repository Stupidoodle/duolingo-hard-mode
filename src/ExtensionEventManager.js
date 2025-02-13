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

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			const challengeId = textarea.dataset.challengeId;
			const challenge = this.activeChallenges.get(challengeId);

			if(!challenge){
				return;
			}

			challenge.handleKeyEvent(event);
		},
			true
		);
	}

	registerChallenge(challengeId, challengeInstance){
		this.activeChallenges.set(challengeId, challengeInstance);
	}

	unregisterChallenge(challengeId){
		this.activeChallenges.delete(challengeId);
	}
}