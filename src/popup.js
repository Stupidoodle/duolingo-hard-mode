document.addEventListener('DOMContentLoaded', function() {
    const hardModeToggle = document.getElementById('popup-hard-mode-toggle');
    const hardModeSpan = document.getElementById('popup-hard-mode-span');
    const ignoreAccentsToggle = document.getElementById('popup-ignore-accents-toggle');
    const ignoreAccentsSpan = document.getElementById('popup-ignore-accents-span');
    const ignoreApostrophesToggle = document.getElementById('popup-ignore-apostrophes-toggle');
    const ignoreApostrophesSpan = document.getElementById('popup-ignore-apostrophes-span');
    const showOnPageControls = document.getElementById('show-on-page-controls');

    // Load saved settings
    chrome.storage.sync.get(['extensionEnabled', 'ignoreAccentsEnabled', 'ignoreApostrophesEnabled', 'showOnPageControls'], function(data) {
        hardModeSpan.textContent = data.extensionEnabled ? 'Disable Hard' : 'Enable Hard';
        ignoreAccentsSpan.textContent = data.ignoreAccentsEnabled ? 'Enable Accents' : 'Disable Accents';
        ignoreApostrophesSpan.textContent = data.ignoreApostrophesEnabled ? 'Enable Apostrophes' : 'Disable Apostrophes';
        showOnPageControls.checked = data.showOnPageControls || false;
    });

    // Toggle Hard Mode
    hardModeToggle.addEventListener('click', function() {
        chrome.storage.sync.get(['extensionEnabled'], function(data) {
            const newState = !data.extensionEnabled;
            chrome.storage.sync.set({ extensionEnabled: newState }, function() {
                hardModeSpan.textContent = newState ? 'Disable Hard' : 'Enable Hard';
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleExtension', enabled: newState });
                });
            });
        });
    });

    // Toggle Ignore Accents
    ignoreAccentsToggle.addEventListener('click', function() {
        chrome.storage.sync.get(['ignoreAccentsEnabled'], function(data) {
            const newState = !data.ignoreAccentsEnabled;
            chrome.storage.sync.set({ ignoreAccentsEnabled: newState }, function() {
                ignoreAccentsSpan.textContent = newState ? 'Enable Accents' : 'Disable Accents';
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleIgnoreAccents', enabled: newState });
                });
            });
        });
    });

    // Toggle Ignore Apostrophes
    ignoreApostrophesToggle.addEventListener('click', function() {
        chrome.storage.sync.get(['ignoreApostrophesEnabled'], function(data) {
            const newState = !data.ignoreApostrophesEnabled;
            chrome.storage.sync.set({ ignoreApostrophesEnabled: newState }, function() {
                ignoreApostrophesSpan.textContent = newState ? 'Enable Apostrophes' : 'Disable Apostrophes';
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleIgnoreApostrophes', enabled: newState });
                });
            });
        });
    });

    // Toggle On-Page Controls
    showOnPageControls.addEventListener('change', function() {
        const showControls = showOnPageControls.checked;
        chrome.storage.sync.set({ showOnPageControls: showControls }, function() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleOnPageControls', enabled: showControls });
            });
        });
    });
});