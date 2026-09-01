import{
	Challenge
} from "./Challenge.js";

import{
	ExtensionEventManager
} from "./ExtensionEventManager.js"

/**
 * Challenge type: translate
 * @extends Challenge
 */
export class ChallengeTranslate extends Challenge{
	/**
	 * Instantiates a new ChallengeTranslate
	 * @param {HTMLElement} challengeDiv - Challenge div
	 * @param {ExtensionEventManager} eventManager - Event manager
	 * @throws {Error} If challengeDiv is not found
	 */
	constructor(challengeDiv, eventManager){
		super(challengeDiv, eventManager);
	}
}
