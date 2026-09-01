Object.assign(global, require('jest-chrome'))

// jest-chrome predates Manifest V3 and stubs no chrome.action, which the
// service worker needs in order to swap the toolbar icon.
if (!global.chrome.action) {
	global.chrome.action = {
		setIcon: jest.fn(),
		setTitle: jest.fn(),
		setBadgeText: jest.fn()
	}
}
