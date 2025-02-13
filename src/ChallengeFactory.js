import {
	Challenge
} from "./Challenge";

/**
 * Factory class for creating challenges
 */
export class ChallengeFactory{
	static registry = new Map();

	/**
	 * Registers a challenge class
	 * @param {String} challengeType
	 * @param {Class} challengeClass
	 * @throws {Error} If challengeType is already registered
	 * @throws {Error} If challengeClass is not a subclass of Challenge
	 */
	static register(challengeType, challengeClass){
		if(!(challengeClass.prototype instanceof Challenge)){
			throw new Error(`Class ${challengeClass.name} must extend Challenge`);
		}
		ChallengeFactory.registry.set(challengeType, challengeClass);
	}

	/**
	 * Creates an instance of a Challenge
	 * @param {String} challengeType
	 * @param {HTMLElement} challengeDiv
	 * @returns {Challenge}
	 * @throws {Error} If challengeType is not registered
	 */
	static create(challengeType, challengeDiv){
		const ChallengeClass = ChallengeFactory.registry.get(challengeType);
		if(!ChallengeClass) {
			throw new Error(`Challenge type ${challengeType} not found`);
		}
		return new ChallengeClass(challengeDiv);
	}
}