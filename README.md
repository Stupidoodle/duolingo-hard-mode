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

- Hides the word bank and the answer choices and makes you type instead, in:
  - **Translations and fill-in-the-blanks** with a word bank (`translate`, `tapComplete`, `listenTap`), including bubbles that hold several words
  - **Multiple choice** (`select`, `assist`, `gapFill`, `selectTranscription`)
  - **Chat replies** (`dialogue`): type the sentence, punctuation optional
  - **Matching pairs** (`match`, `listenMatch`): tap or hear a prompt, type its partner, press Enter
- Optional leniency for accents (including `œ`/`æ`) and apostrophes
- Japanese and Chinese: reads ruby/furigana correctly and works with IME input
- Follows Duolingo's light and dark theme
- Works straight away when you enter a lesson, no reload needed

Challenges that already ask you to type (`listenComplete`, `completeReverseTranslation`, `listen`, `name`) are left as they are. Speaking challenges and `listenIsolation` (audio-only choices) cannot be typed.

## Installation

1. **[Chrome Web Store](https://chromewebstore.google.com/detail/duolingo-hard-mode/jceggbkbebgncehlbekabbkfhdecfihh)**
2. **Manual Installation**:
   - Go to the [Releases](https://github.com/Stupidoodle/duolingo-hard-mode/releases/latest) page
   - Download `extension.zip` from the latest release
   - Extract it; it contains an `extension` folder
   - Open Chrome and go to `chrome://extensions`
   - Enable Developer Mode
   - Click "Load unpacked" and select the `extension` folder
   - Open Duolingo and start learning!

## Known Issues ⚠️

- ~~**Fill-in-the-blank challenges** with multiple choices can be buggy~~
- ~~(Some challenge types might become impossible to complete)~~
- ~~(Occasional UI glitches when switching between questions)~~
- ~~(Keyboard navigation quirks in specific scenarios)~~
- ~~Sometimes the extension is not activated on the first lesson load (refresh the page to fix), it should be indicated by the disable hard mode button in the top right corner of the page.~~

## Future Plans 🚧

- Hard mode for `tapCloze` and `tapCompleteTable`
- Add answer validation hints
- Implement smart autocomplete prevention
- Add typing statistics and error tracking

## Building from Source

This project uses [bun](https://bun.sh).

1. Install dependencies:
   ```bash
   bun install
   ```
2. Build for development:
   ```bash
   bun run build:dev
   ```
3. Build for production:
   ```bash
   bun run build
   ```
4. Watch for changes:
   ```bash
   bun run watch
   ```
5. Run the tests (use `bun run test`, not `bun test`, so jest runs):
   ```bash
   bun run test
   ```

The repository root is a loadable extension once built: "Load unpacked" on the repo root picks up `manifest.json` and `dist/`.

## Contributing

Contributions are welcome! Please open issues for:
- Bug reports (especially for impossible challenges)
- New challenge type implementations
- UI/UX improvements

## Disclaimer

This is an unofficial extension and not affiliated with Duolingo. Use at your own risk - some challenge types might currently be unplayable in hard mode.

> 🚨 Work in Progress - Expect breaking changes and occasional bugs! 🚨
