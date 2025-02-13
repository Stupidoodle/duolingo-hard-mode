import{
	ChallengeFactory,
} from "./ChallengeFactory"

import{
	ChallengeTranslate
} from "./ChallengeTranslate";

function enforceTyping(){
	const challengeDiv = document.querySelector("div[data-test^='challenge challenge-']")

	if(!challengeDiv)
		return;

	const challengeType = challengeDiv.getAttribute("data-test").replace("challenge challenge-", "")
	console.debug(challengeType)

	try{
		const challengeInstance = ChallengeFactory.create(challengeType, challengeDiv);
	}
	catch(error){
		console.error(error.message)
	}
}

const observer = new MutationObserver(enforceTyping);
observer.observe(document.body, {childList: true, subtree: true});

ChallengeFactory.register("translate", ChallengeTranslate);

enforceTyping();
