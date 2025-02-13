import{
	ChallengeFactory,
} from "./ChallengeFactory"

import{
	ChallengeTranslate
} from "./ChallengeTranslate";

ChallengeFactory.register("translate", ChallengeTranslate);

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
	console.debug(challengeType)

	try{
		challengeDiv.setAttribute("data-extension-processed", "true");
		activeChallenge = ChallengeFactory.create(challengeType, challengeDiv);
		activeChallenge.enforceTyping();
	}
	catch(error){
		console.error(error.message)
	}
}

const observer = new MutationObserver(enforceTyping);
observer.observe(document.body, {childList: true, subtree: true});

enforceTyping();
