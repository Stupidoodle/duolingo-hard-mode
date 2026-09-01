/**
 * Service worker. Its only job is keeping the toolbar icon in step with whether
 * hard mode is on.
 *
 * chrome.action.setIcon is unavailable to content scripts, so the state has to
 * be observed from here. It keys off chrome.storage rather than runtime
 * messages, which means the popup toggle and the on-page toggle both drive the
 * icon simply by writing the setting — no extra plumbing on either side.
 */

const SIZES = [16, 32, 48, 128];

/**
 * Icon paths per state, keyed the way chrome.action.setIcon expects.
 * @type {{active: Object<string, string>, inactive: Object<string, string>}}
 */
export const ICON_PATHS = {
	active: Object.fromEntries(SIZES.map(size => [String(size), `icons/icon-active-${size}.png`])),
	inactive: Object.fromEntries(SIZES.map(size => [String(size), `icons/icon-inactive-${size}.png`]))
};

/**
 * Points the toolbar icon at the set for the given state.
 * @param {Boolean} enabled - Whether hard mode is on
 */
export function applyIcon(enabled){
	chrome.action.setIcon({ path: enabled ? ICON_PATHS.active : ICON_PATHS.inactive });
}

/**
 * Reads the stored setting and applies the matching icon.
 *
 * An unset value counts as enabled, which is how the content script treats it
 * on a fresh install.
 */
export function syncIcon(){
	chrome.storage.sync.get(["extensionEnabled"], (data) => {
		applyIcon(data.extensionEnabled !== false);
	});
}

/**
 * Subscribes to the events that can change the icon.
 */
export function registerIconListeners(){
	chrome.storage.onChanged.addListener((changes, areaName) => {
		if(areaName !== "sync" || !changes.extensionEnabled){
			return;
		}
		applyIcon(changes.extensionEnabled.newValue !== false);
	});

	chrome.runtime.onInstalled.addListener(syncIcon);
	chrome.runtime.onStartup.addListener(syncIcon);
}

registerIconListeners();
syncIcon();
