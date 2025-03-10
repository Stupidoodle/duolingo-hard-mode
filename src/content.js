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

import{
	ChallengeGapFill
} from "./ChallengeGapFill.js";

import{
	CONSTANTS
} from "./constants.js";

const eventManager = new ExtensionEventManager();
eventManager.initGlobalKeyCapture();

ChallengeFactory.register("translate", ChallengeTranslate);
ChallengeFactory.register("tapComplete", ChallengeTapComplete);
ChallengeFactory.register("listenTap", ChallengeTapComplete);

let extensionEnabled = true;
let activeChallenge = null;
let observer = null;

window.ignoreAccentsEnabled = false;

/**
 * Enforces typing on the current challenge
 */
function enforceTyping(){
	if(!extensionEnabled){
		return;
	}

	const challengeDiv = document.querySelector("div[data-test^='challenge challenge-']")

	if(activeChallenge && (!challengeDiv || challengeDiv !== activeChallenge.challengeDiv)){
		console.debug("Cleaning up active challenge");
		activeChallenge.cleanup?.();
		activeChallenge = null;
	}

	if(!challengeDiv || challengeDiv.hasAttribute("data-extension-processed")) {
		console.debug("No challenge div found or already processed");
		return;
	}

	const challengeType = challengeDiv.getAttribute("data-test").replace("challenge challenge-", "")

	if(["completeReverseTranslation"].includes(challengeType)){
		return;
	}

	console.debug(challengeType)
	if(challengeType !== "gapFill" && challengeType !== "assist" && challengeType !== "select" && challengeType !== "selectTranscription"){
		try {
			challengeDiv.setAttribute("data-extension-processed", "true");
			activeChallenge = ChallengeFactory.create(challengeType, challengeDiv, eventManager);
			console.debug(`Creating challenge ${challengeType}`);
			activeChallenge.enforceTyping();
		} catch (error) {
			console.error(error.message)
		}
	}
	else if(challengeType === "gapFill" || challengeType === "assist" || challengeType === "select" || challengeType === "selectTranscription"){
		challengeDiv.setAttribute("data-extension-processed", "true");
		const choiceDiv = document.querySelector('div[aria-label="choice"][role="radiogroup"]');
		activeChallenge = new ChallengeGapFill(challengeDiv, choiceDiv, eventManager);
		console.debug(`Creating challenge ${challengeType}`);
		activeChallenge.enforceTyping();
	}
}

/**
 * Sets up a MutationObserver that calls `enforceTyping` on relevant DOM changes.
 */
function initObserver() {
	if(observer) {
		observer.disconnect();
	}

	observer = new MutationObserver(enforceTyping);
	observer.observe(document.body, { childList: true, subtree: true });

	// Run initially to catch any already rendered challenges:
	enforceTyping();
}

/**
 * Toggle extension on/off, updating global state, button label,
 * cleaning up or re-initializing as necessary.
 */
function toggleExtension() {
	extensionEnabled = !extensionEnabled;

	const toggleButton = document.getElementById("duo-hard-mode-toggle");
	const toggleSpan = document.getElementById("duo-hard-mode-span");

	if(extensionEnabled){
        if (toggleSpan) toggleSpan.textContent = "Disable Hard";
        if (toggleButton) toggleButton.style.cssText = CONSTANTS.STYLE.ACTIVE;

		const processedDivs = document.querySelectorAll("[data-extension-processed='true']");
		processedDivs.forEach(div => div.removeAttribute("data-extension-processed"));
		// Reconnect observer and re-run enforceTyping:
		initObserver();
	}
	else{
        if (toggleButton) toggleButton.style.cssText = CONSTANTS.STYLE.INACTIVE;
        if (toggleSpan) toggleSpan.textContent = "Enable Hard";
		// Disconnect observer, cleanup any active challenge:
		observer.disconnect();
		activeChallenge?.cleanup();
		activeChallenge = null;
	}
}

/**
 * Creates and injects the toggle button into the DOM.
 */
function createToggleButton() {
    chrome.storage.sync.get(['showOnPageControls'], function(data) {
        if (!data.showOnPageControls) return;

        if (document.getElementById('duo-hard-mode-toggle')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'duo-hard-mode-toggle';
        button.style.cssText = CONSTANTS.STYLE.ACTIVE;

        const span = document.createElement('span');
        span.id = 'duo-hard-mode-span';
        span.textContent = 'Disable Hard';
        span.style.cssText = CONSTANTS.STYLE.SPAN;

        button.appendChild(span);
        button.addEventListener('click', toggleExtension);
        document.body.appendChild(button);
    });
}

/**
 * Creates and injects ignore accents button into the DOM.
 */
function createIgnoreAccentsToggleButton() {
    chrome.storage.sync.get(['showOnPageControls'], function(data) {
        if (!data.showOnPageControls) return;

        if (document.getElementById('duo-ignore-accents-toggle')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'duo-ignore-accents-toggle';
        button.style.cssText = CONSTANTS.STYLE.ACTIVE;
        button.style.top = '70px';

        const span = document.createElement('span');
        span.id = 'duo-ignore-accents-span';
        span.textContent = 'Disable Accents';
        span.style.cssText = CONSTANTS.STYLE.SPAN;

        button.appendChild(span);

        button.addEventListener('click', () => {
            window.ignoreAccentsEnabled = !window.ignoreAccentsEnabled;
            span.textContent = window.ignoreAccentsEnabled ? 'Enable Accents' : 'Disable Accents';
            button.style.cssText = window.ignoreAccentsEnabled ? CONSTANTS.STYLE.INACTIVE : CONSTANTS.STYLE.ACTIVE;
            button.style.top = '70px';
        });

        document.body.appendChild(button);
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggleExtension') {
        toggleExtension();
    } else if (request.action === 'toggleIgnoreAccents') {
        window.ignoreAccentsEnabled = request.enabled;
		const ignoreAccentsButton = document.getElementById('duo-ignore-accents-toggle');
		const ignoreAccentsSpan = document.getElementById('duo-ignore-accents-span');
		if (ignoreAccentsButton) {
			ignoreAccentsButton.style.cssText = request.enabled ? CONSTANTS.STYLE.INACTIVE : CONSTANTS.STYLE.ACTIVE;
			ignoreAccentsSpan.textContent = request.enabled ? 'Enable Accents' : 'Disable Accents';
			ignoreAccentsButton.style.top = '70px';
		}
    } else if (request.action === 'toggleOnPageControls') {
        const toggleButton = document.getElementById('duo-hard-mode-toggle');
        const ignoreAccentsButton = document.getElementById('duo-ignore-accents-toggle');
        if (request.enabled) {
            if (!toggleButton) createToggleButton();
            if (!ignoreAccentsButton) createIgnoreAccentsToggleButton();
        } else {
            if (toggleButton) toggleButton.remove();
            if (ignoreAccentsButton) ignoreAccentsButton.remove();
        }
    }
});

chrome.storage.sync.get(['showOnPageControls'], function(result) {
    const showControls = result.showOnPageControls;
	if(showControls){
		createToggleButton();
		createIgnoreAccentsToggleButton();
	}
});
initObserver();