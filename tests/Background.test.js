/**
 * @jest-environment jsdom
 *
 * Issue #24 — the toolbar icon reflects whether hard mode is on.
 *
 * The service worker is the only place that can call chrome.action.setIcon, and
 * it keys off chrome.storage rather than messaging, so the popup toggle and the
 * on-page toggle both drive it by writing the same key.
 */
import { ICON_PATHS, applyIcon, syncIcon, registerIconListeners } from "../src/background.js";

describe("issue #24 — the toolbar icon follows hard mode", () => {
	beforeEach(() => {
		chrome.action.setIcon.mockClear?.();
	});

	test("exposes a full icon set for both states", () => {
		for (const state of ["active", "inactive"]) {
			expect(Object.keys(ICON_PATHS[state])).toEqual(["16", "32", "48", "128"]);
			for (const path of Object.values(ICON_PATHS[state])) {
				expect(path).toMatch(new RegExp(`^icons/icon-${state}-\\d+\\.png$`));
			}
		}
	});

	test("applies the active icon when hard mode is on", () => {
		applyIcon(true);
		expect(chrome.action.setIcon).toHaveBeenCalledWith({ path: ICON_PATHS.active });
	});

	test("applies the inactive icon when hard mode is off", () => {
		applyIcon(false);
		expect(chrome.action.setIcon).toHaveBeenCalledWith({ path: ICON_PATHS.inactive });
	});

	test("syncIcon reads the stored setting", () => {
		chrome.storage.sync.get.mockImplementation((keys, cb) => cb({ extensionEnabled: false }));
		syncIcon();
		expect(chrome.action.setIcon).toHaveBeenCalledWith({ path: ICON_PATHS.inactive });
	});

	test("treats an unset setting as enabled, matching the content script default", () => {
		chrome.storage.sync.get.mockImplementation((keys, cb) => cb({}));
		syncIcon();
		expect(chrome.action.setIcon).toHaveBeenCalledWith({ path: ICON_PATHS.active });
	});

	describe("storage listener", () => {
		test("updates the icon when extensionEnabled changes in sync storage", () => {
			registerIconListeners();
			chrome.storage.onChanged.callListeners(
				{ extensionEnabled: { oldValue: true, newValue: false } },
				"sync"
			);
			expect(chrome.action.setIcon).toHaveBeenCalledWith({ path: ICON_PATHS.inactive });
		});

		test("ignores changes to other keys", () => {
			registerIconListeners();
			chrome.storage.onChanged.callListeners(
				{ ignoreAccentsEnabled: { oldValue: false, newValue: true } },
				"sync"
			);
			expect(chrome.action.setIcon).not.toHaveBeenCalled();
		});

		test("ignores other storage areas", () => {
			registerIconListeners();
			chrome.storage.onChanged.callListeners(
				{ extensionEnabled: { oldValue: true, newValue: false } },
				"local"
			);
			expect(chrome.action.setIcon).not.toHaveBeenCalled();
		});
	});
});
