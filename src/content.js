import{
	ChallengeFactory,
} from "./ChallengeFactory.js"

import{
	ChallengeTranslate
} from "./ChallengeTranslate.js";

import{
	ChallengeTapComplete
} from "./ChallengeTapComplete.js";

import{
	ExtensionEventManager
} from "./ExtensionEventManager.js";

const eventManager = new ExtensionEventManager();
eventManager.initGlobalKeyCapture();

ChallengeFactory.register("translate", ChallengeTranslate);
ChallengeFactory.register("tapComplete", ChallengeTapComplete);

let activeChallenge = null;

function enforceTyping(){
	const challengeDiv = document.querySelector("div[data-test^='challenge challenge-']")

	if(activeChallenge && (!challengeDiv || challengeDiv !== activeChallenge.challengeDiv)){
		activeChallenge.cleanup?.();
		activeChallenge = null;
	}

	if(!challengeDiv || challengeDiv.hasAttribute("data-extension-processed")) {
		return;
	}

	const challengeType = challengeDiv.getAttribute("data-test").replace("challenge challenge-", "")

	if(["listenTap", "completeReverseTranslation"].includes(challengeType)){
		return;
	}

	console.debug(challengeType)

	try{
		challengeDiv.setAttribute("data-extension-processed", "true");
		activeChallenge = ChallengeFactory.create(challengeType, challengeDiv, eventManager);
		console.debug(`Creating challenge ${challengeType}`);
		activeChallenge.enforceTyping();
	}
	catch(error){
		console.error(error.message)
	}
}

const observer = new MutationObserver(enforceTyping);
observer.observe(document.body, {childList: true, subtree: true});

enforceTyping();
