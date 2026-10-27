/**
 * Derives the Firefox manifest from the Chrome one, so the version and every
 * other field keep a single source and the Chrome build stays as it is.
 */

/**
 * The add-on's permanent id on addons.mozilla.org. It can never change once
 * AMO has published a version under it.
 */
export const GECKO_ID = "duolingo-hard-mode@stupidoodle";

/**
 * @param {Object} chromeManifest - The parsed manifest.json
 * @returns {Object} The manifest for the Firefox package
 */
export function toFirefoxManifest(chromeManifest){
	const serviceWorker = chromeManifest.background?.service_worker;

	if(!serviceWorker){
		throw new Error("manifest.json has no background.service_worker to convert");
	}

	return {
		...chromeManifest,
		// Firefox runs MV3 background code as an event page, not a service worker.
		background: { scripts: [serviceWorker] },
		browser_specific_settings: {
			gecko: {
				id: GECKO_ID,
				// data_collection_permissions needs 140 on desktop and 142 on Android;
				// older versions reject the key.
				strict_min_version: "142.0",
				data_collection_permissions: { required: ["none"] }
			}
		}
	};
}
