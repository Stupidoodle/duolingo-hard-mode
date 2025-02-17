# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.10.1](https://github.com/Stupidoodle/duolingo-hard-mode/compare/v0.10.0...v0.10.1) (2025-02-17)


### Bug Fixes

* improve choice selection logic to handle missing text and add error handling ([03c8561](https://github.com/Stupidoodle/duolingo-hard-mode/commit/03c85610fcb08919241c254b7ce5f9598fd58a6d))

## [0.10.0](https://github.com/Stupidoodle/duolingo-hard-mode/compare/v0.9.1...v0.10.0) (2025-02-17)


### Features

* extend challenge type handling to include 'select' closes [#12](https://github.com/Stupidoodle/duolingo-hard-mode/issues/12) ([68f3199](https://github.com/Stupidoodle/duolingo-hard-mode/commit/68f3199a37cc4399fc75ca39b4fdf99a3d2845e2))


### Bug Fixes

* append space to user input in handleSpace method fixes [#18](https://github.com/Stupidoodle/duolingo-hard-mode/issues/18) ([404d771](https://github.com/Stupidoodle/duolingo-hard-mode/commit/404d771ce891bf4cc48ba3207fe6ff5059c4493a))
* update choice selection logic to handle different data-test attributes ([947f93f](https://github.com/Stupidoodle/duolingo-hard-mode/commit/947f93fe679bae23ec0d5c935cb7b33ee1e861bd))

### [0.9.1](https://github.com/Stupidoodle/duolingo-hard-mode/compare/v0.9.0...v0.9.1) (2025-02-17)


### Bug Fixes

* add user input handling for matching words in remaining choices in apostrophe case ([428643a](https://github.com/Stupidoodle/duolingo-hard-mode/commit/428643a5420dea28b9967ebf6914e249bd5f3c3b))
* standardize quotes in data-test attribute selectors ([fe8546a](https://github.com/Stupidoodle/duolingo-hard-mode/commit/fe8546a2b1c42a2150fa1a0f7fc135bf2f52b2c7))

## [0.9.0](https://github.com/Stupidoodle/duolingo-hard-mode/compare/v0.8.0...v0.9.0) (2025-02-17)


### Features

* register listenTap challenge and update challenge type check ([10e71d0](https://github.com/Stupidoodle/duolingo-hard-mode/commit/10e71d0b10829749e2e0c550ad03d697f1b55153))


### Bug Fixes

* streamline input handling by removing unnecessary checks and improving apostrophe event processing ([dd1ca03](https://github.com/Stupidoodle/duolingo-hard-mode/commit/dd1ca03496ddd02235f7fb9469bfd78b6d9beb7d))
* update key event handling to use handleEnter instead of handleSubmit ([49db452](https://github.com/Stupidoodle/duolingo-hard-mode/commit/49db4529509cbd5e5bbe4ef1c019945bb4b92290))

## [0.8.0](https://github.com/Stupidoodle/duolingo-hard-mode/compare/v0.7.0...v0.8.0) (2025-02-16)


### Features

* enhance input handling for apostrophes and spaces in Challenge.js closes [#2](https://github.com/Stupidoodle/duolingo-hard-mode/issues/2) ([be60a80](https://github.com/Stupidoodle/duolingo-hard-mode/commit/be60a8024adf6b8e657390e9eca1a36d3ef2be37))


### Bug Fixes

* ensure early return for empty input in handleBackspace method ([990ff4b](https://github.com/Stupidoodle/duolingo-hard-mode/commit/990ff4beb153a47ecbf2a695a9c1bfcb6275769a))
* update release asset naming to remove version from zip file ([dd9ac05](https://github.com/Stupidoodle/duolingo-hard-mode/commit/dd9ac05c9d0378ed76e4f40566e12d62d4a5ddef))
* update release workflow to use GITHUB_ENV for changelog and adjust asset naming ([278947c](https://github.com/Stupidoodle/duolingo-hard-mode/commit/278947c9c270c757995e77b6504979dbe6f2a652))

## [0.7.0](https://github.com/Stupidoodle/duolingo-hard-mode/compare/v0.6.0...v0.7.0) (2025-02-15)


### Features

* add ignore accents toggle button and enhance challenge typing enforcement ([defe728](https://github.com/Stupidoodle/duolingo-hard-mode/commit/defe7281de6d0f90a2312fc25611ca4da6aac722))
* add utility functions for accent normalization ([9fdd5cc](https://github.com/Stupidoodle/duolingo-hard-mode/commit/9fdd5cc30fab5e2d22865f5cd1539c4492e2ff30))
* enhance ChallengeTapComplete by normalizing text for accent handling ([0e34ccd](https://github.com/Stupidoodle/duolingo-hard-mode/commit/0e34ccde18a2bb57ba1d83f73ec10eb95ef692ca))
* enhance ChallengeTranslate by normalizing text for accent handling ([b8c9e12](https://github.com/Stupidoodle/duolingo-hard-mode/commit/b8c9e127305868e05cd556b52a138380ea660882))
* enhance word selection by normalizing accents ([75bd652](https://github.com/Stupidoodle/duolingo-hard-mode/commit/75bd65238bd39af4b41fbbea632fe37674134f18))
* improve gap fill choice selection by utilizing accent normalization ([deb7c2b](https://github.com/Stupidoodle/duolingo-hard-mode/commit/deb7c2ba5be38cebe2b029cdea26a217fcda40fc))

## [0.6.0](https://github.com/Stupidoodle/duolingo-hard-mode/compare/v0.5.0...v0.6.0) (2025-02-15)


### Features

* add ChallengeGapFill class to handle gap fill challenges and user input ([dd9f9dc](https://github.com/Stupidoodle/duolingo-hard-mode/commit/dd9f9dc26e9c68686c17376ea8d8044f1e3257aa))
* extend ChallengeGapFill to support 'assist' challenge type alongside 'gapFill' ([f7b002e](https://github.com/Stupidoodle/duolingo-hard-mode/commit/f7b002e066ed2787381ecd43e293d659dcdbd3e8))
* implement ChoiceBank class to manage challenge choices and extract radio buttons ([46c4a34](https://github.com/Stupidoodle/duolingo-hard-mode/commit/46c4a34f2fa0337c1cf19e8cc05162c250835e9b))
* integrate ChallengeGapFill for gap fill challenges in content.js ([28fda07](https://github.com/Stupidoodle/duolingo-hard-mode/commit/28fda07b02a26a6437d2d099428a6de4ef12cf4e))
* update ChallengeGapFill to manage challenge and choice divs, enhance choice display logic ([7e368c0](https://github.com/Stupidoodle/duolingo-hard-mode/commit/7e368c0a8f38fe216f5b75502544a4e90df86a24))


### Bug Fixes

* change error logging to warning for missing word bank in injectTypingInput ([dddd63a](https://github.com/Stupidoodle/duolingo-hard-mode/commit/dddd63a377bdd0d5addc20dd91c86ecbd08c3ebf))

## [0.5.0](https://github.com/Stupidoodle/duolingo-hard-mode/compare/v0.4.3...v0.5.0) (2025-02-15)


### Features

* add toggle button for Hard Mode and implement MutationObserver for challenge enforcement closes [#4](https://github.com/Stupidoodle/duolingo-hard-mode/issues/4) ([b15fd2b](https://github.com/Stupidoodle/duolingo-hard-mode/commit/b15fd2bee1c99da6ba35d922f601245b513509f0))

### [0.4.3](https://github.com/Stupidoodle/duolingo-hard-mode/compare/v0.4.2...v0.4.3) (2025-02-15)


### Bug Fixes

* remove early return for empty input in ChallengeTapComplete.js ([5c216fa](https://github.com/Stupidoodle/duolingo-hard-mode/commit/5c216fa5a651861713a110c693aefd38f210eae2))

### 0.4.2 (2025-02-15)

### [0.4.1](https://github.com/Stupidoodle/duolingo-hard-mode/compare/v0.4.0...v0.4.1) (2025-02-14)

## 0.4.0 (2025-02-14)


### Features

* add WordBank class for managing word selection and usage ([6e08075](https://github.com/Stupidoodle/duolingo-hard-mode/commit/6e08075d5770afd90aa9ec19c24302710c72af59))
* enhance ChallengeTapComplete class by improving input handling and simplifying backspace logic fixes [#5](https://github.com/Stupidoodle/duolingo-hard-mode/issues/5) ([14cccaa](https://github.com/Stupidoodle/duolingo-hard-mode/commit/14cccaa73f7644729dea4bbca94868c76e9173cd))
* refactor ChallengeTranslate to utilize WordBank for choice management to resolve the duplicated words in bank issue Fixes [#6](https://github.com/Stupidoodle/duolingo-hard-mode/issues/6) ([d10ee3a](https://github.com/Stupidoodle/duolingo-hard-mode/commit/d10ee3a41fc4ca9b0ae2ca55592e24dd739507fe))
* refactored Challenge.js class to minimise duplicated code ([2c19da4](https://github.com/Stupidoodle/duolingo-hard-mode/commit/2c19da4e4786e0e314c677d9f3151e92650821b7))
