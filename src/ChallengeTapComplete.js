import{
	Challenge
} from "./Challenge.js";

import{
	ExtensionEventManager
} from "./ExtensionEventManager.js";

/**
 * Challenge type: tapComplete
 * @extends Challenge
 */
export class ChallengeTapComplete extends Challenge{
	/**
	 * Instantiates a new ChallengeTapComplete
	 * @param {HTMLElement} challengeDiv - Challenge div
	 * @param {ExtensionEventManager} eventManager - Event manager
	 * @throws {Error} If challengeDiv is not found
	 */
	constructor(challengeDiv, eventManager){
		super(challengeDiv, eventManager);
	}
}
