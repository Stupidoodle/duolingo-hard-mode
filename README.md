# Duolingo Hard Mode
[![CI](https://github.com/Stupidoodle/duolingo-hard-mode/actions/workflows/ci.yml/badge.svg)](https://github.com/Stupidoodle/duolingo-hard-mode/actions/workflows/ci.yml)
[![CodeQL Analysis](https://github.com/Stupidoodle/duolingo-hard-mode/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/Stupidoodle/duolingo-hard-mode/actions/workflows/codeql-analysis.yml)
[![Dependency Audit](https://github.com/Stupidoodle/duolingo-hard-mode/actions/workflows/dependency-audit.yml/badge.svg)](https://github.com/Stupidoodle/duolingo-hard-mode/actions/workflows/dependency-audit.yml)
[![Lint](https://github.com/Stupidoodle/duolingo-hard-mode/actions/workflows/lint.yml/badge.svg)](https://github.com/Stupidoodle/duolingo-hard-mode/actions/workflows/lint.yml)
[![Auto Release](https://github.com/Stupidoodle/duolingo-hard-mode/actions/workflows/release.yml/badge.svg?event=pull_request)](https://github.com/Stupidoodle/duolingo-hard-mode/actions/workflows/release.yml)
[![codecov](https://codecov.io/github/Stupidoodle/duolingo-hard-mode/graph/badge.svg?token=J2UJ0CR82A)](https://codecov.io/github/Stupidoodle/duolingo-hard-mode)

A Chrome extension that replaces multiple-choice questions in Duolingo lessons with typing inputs, making language learning more challenging and effective.

Before:
![Before](https://i.imgur.com/bUjLt49.png)

After:
![After](https://github.com/user-attachments/assets/a9bd57fa-5285-46d3-95e7-60df3ead4457)
## Features

- Converts word bank challenges to text input fields
- Supports various challenge types (translation, tap-to-complete)
- Maintains Duolingo's original styling
- Automatic focus management for seamless typing

## Installation

1. **Chrome Web Store** (Coming Soon)
2. **Manual Installation**:
   - Go to the [Releases](https://github.com/Stupidoodle/duolingo-hard-mode/releases/latest) page
   - Download the latest .zip file
   - Extract the contents to a folder
   - Open Chrome and go to `chrome://extensions`
   - Enable Developer Mode
   - Click "Load unpacked" and select the extracted folder
   - Open Duolingo and start learning!

## Known Issues ⚠️

- ~~**Fill-in-the-blank challenges** with multiple choices can be buggy~~
- ~~(Some challenge types might become impossible to complete)~~
- ~~(Occasional UI glitches when switching between questions)~~
- ~~(Keyboard navigation quirks in specific scenarios)~~
- Sometimes the extension is not activated on the first lesson load (refresh the page to fix), it should be indicated by the disable hard mode button in the top right corner of the page.

## Future Plans 🚧

- Add hard mode support for ALL challenge types
- (Improve stability for fill-in-the-blank exercises)
- Add answer validation hints
- Implement smart autocomplete prevention
- Add typing statistics and error tracking

## Building from Source

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build for development:
   ```bash
   npm run build:dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Watch for changes:
   ```bash
   npm run watch
   ```

## Contributing

Contributions are welcome! Please open issues for:
- Bug reports (especially for impossible challenges)
- New challenge type implementations
- UI/UX improvements

## Disclaimer

This is an unofficial extension and not affiliated with Duolingo. Use at your own risk - some challenge types might currently be unplayable in hard mode.

> 🚨 Work in Progress - Expect breaking changes and occasional bugs! 🚨
