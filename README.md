# Duolingo Hard Mode

A Chrome extension that replaces multiple-choice questions in Duolingo lessons with typing inputs, making language learning more challenging and effective.

Before:
![Before](https://i.imgur.com/bUjLt49.png)

After:
![After](https://i.imgur.com/bal7LYR.gif)
## Features

- Converts word bank challenges to text input fields
- Supports various challenge types (translation, tap-to-complete)
- Maintains Duolingo's original styling
- Automatic focus management for seamless typing

## Installation

1. **Chrome Web Store** (Coming Soon)
2. **Manual Installation**:
   - Clone this repository
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension directory

## Known Issues ⚠️

- **Fill-in-the-blank challenges** with multiple choices can be buggy
- Some challenge types might become impossible to complete
- Occasional UI glitches when switching between questions
- Keyboard navigation quirks in specific scenarios

## Future Plans 🚧

- Add hard mode support for ALL challenge types
- Improve stability for fill-in-the-blank exercises
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
