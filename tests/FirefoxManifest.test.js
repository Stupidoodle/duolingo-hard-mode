/**
 * The Firefox package is generated from the Chrome manifest at build time, so
 * the version keeps a single source and the Chrome build never changes.
 */
import { toFirefoxManifest, GECKO_ID } from "../scripts/firefox-manifest.js";

const chromeManifest = () => ({
	manifest_version: 3,
	name: "Duolingo Hard Mode",
	version: "1.7.0",
	background: { service_worker: "dist/background.bundle.js" },
	content_scripts: [{ matches: ["*://*.duolingo.com/*"], js: ["dist/content.bundle.js"] }],
	permissions: ["storage"]
});

describe("toFirefoxManifest", () => {
	test("runs the background bundle as an event page, since Firefox has no extension service workers", () => {
		const manifest = toFirefoxManifest(chromeManifest());

		expect(manifest.background).toEqual({ scripts: ["dist/background.bundle.js"] });
	});

	test("declares the add-on id, the minimum version and that no data is collected", () => {
		const manifest = toFirefoxManifest(chromeManifest());

		expect(manifest.browser_specific_settings).toEqual({
			gecko: {
				id: GECKO_ID,
				strict_min_version: "142.0",
				data_collection_permissions: { required: ["none"] }
			}
		});
	});

	test("keeps everything else, the version included", () => {
		const source = chromeManifest();
		const manifest = toFirefoxManifest(source);

		expect(manifest.version).toBe("1.7.0");
		expect(manifest.content_scripts).toEqual(source.content_scripts);
		expect(manifest.permissions).toEqual(["storage"]);
	});

	test("leaves the Chrome manifest untouched", () => {
		const source = chromeManifest();
		toFirefoxManifest(source);

		expect(source).toEqual(chromeManifest());
	});

	test("refuses a manifest without a background service worker", () => {
		const source = chromeManifest();
		delete source.background;

		expect(() => toFirefoxManifest(source)).toThrow("service_worker");
	});

	test("the add-on id is email-shaped, as AMO requires", () => {
		expect(GECKO_ID).toMatch(/^[a-zA-Z0-9-._]+@[a-zA-Z0-9-._]+$/);
	});
});
