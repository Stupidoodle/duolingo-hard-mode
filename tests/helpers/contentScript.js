/**
 * Switches the content script off once a test file is done with it.
 *
 * Importing src/content.js starts a MutationObserver on document.body. jsdom
 * tears the document down after the last test, which fires that observer with
 * the globals already gone, so every such file logged "Cannot log after tests
 * are done" with a TypeError from document.querySelector. Toggling through the
 * real message handler disconnects the observer the same way the popup does.
 *
 * Not a test file — jest's default testMatch only picks up `*.test.js`.
 */
export function stopContentScript() {
	chrome.runtime.onMessage.callListeners({ action: "toggleExtension" }, {}, () => {});
}
