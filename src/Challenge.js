/**
 * Abstract class for all challenges
 * @abstract
 */
export class Challenge{
	/**
	 *
	 * @param {HTMLElement} challengeDiv
	 * @throws {Error} If challengeDiv is not found or if the class is instantiated directly
	 */
	constructor(challengeDiv){
		if(new.target === Challenge)
			throw new Error("Cannot instantiate abstract class");

		if(!challengeDiv)
			throw new Error("Challenge div not found");

		/** @type {HTMLElement} */
		this.challengeDiv = challengeDiv;

		/** @type {String} */
		this.challengeType = challengeDiv.getAttribute("data-test").replace("challenge challenge-", "");
	}

	/**
	 * TODO
	 * @abstract
	 */
	extractChoices(wordBankDiv){
		throw new Error("Method not implemented");
	}

	/**
	 * Extracts challenge-specific elements
	 * Subclasses MUST override this method
	 * @abstract
	 * @returns {Object} Object containing challenge-specific elements
	 * @throws {Error} If not implemented
	 */
	extractElements(){
		throw new Error("Method not implemented");
	}

	/**
	 * TODO
	 * @abstract
	 */
	enforceTyping(){
		throw new Error("Method not implemented");
	}

	/**
	 * TODO
	 * @abstract
	 */
	injectTypingInput(){
		throw new Error("Method not implemented");
	}

	/**
	 * TODO
	 * @abstract
	 */
	handleSubmit(){
		throw new Error("Method not implemented");
	}
}