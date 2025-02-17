export class ChoiceBank{
	constructor(choiceDiv) {
		if(!choiceDiv){
			throw new Error("Choice bank div not found");
		}

		/** @type {HTMLElement} */
		this.choiceDiv = choiceDiv;
		// Map of available choice radio buttons: choice → array of radio buttons
		this.choiceMap = this.extractChoices();
		// NOTE: gapFill only has one choice, so we can just use the first one
	}

	/**
	 * Extracts choice radio buttons from the choice bank container.
	 * @returns {Map<string, HTMLDivElement[]>} A map where the key is the lowercase choice,
	 * and the value is an array of matching radio button elements.
	 */
	extractChoices() {
		const choiceButtons = [
			...this.choiceDiv.querySelectorAll(
				'[data-test="challenge-choice"]'
			)
		];

		return choiceButtons.reduce((map, btn) => {
			const choice = btn.getAttribute("data-test") !== "challenge-choice" ? btn.querySelector(
				'[data-test="challenge-judge-text"]'
			).textContent.trim().toLowerCase() :
				btn.querySelector('span[dir="ltr"]').textContent.trim().toLowerCase();

			if (!map.has(choice)) {
				map.set(choice, []);
			}
			map.get(choice).push(btn);

			return map;
		}, new Map());
	}
}