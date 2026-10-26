# Chrome Web Store listing

Copy for the Developer Dashboard. Everything here describes behaviour that
exists in the current build — nothing aspirational, because the store listing is
what sets the expectation a one-star review is written against.

## Name

```
Duolingo Hard Mode — type instead of tap
```

The old name was just "Duolingo Hard Mode". The suffix is what people search
for and it states the mechanic before the click.

## Short description (132 character limit)

```
Hides Duolingo's word bank and makes you type the answer. Real recall instead of picking from four options.
```

## Detailed description

```
Duolingo gives you the words and asks you to arrange them. That is recognition,
not recall — and recognition is the easy half of knowing a language. You can tap
your way through a lesson you could not actually speak.

Duolingo Hard Mode hides the word bank and gives you a text box. Same lesson,
same streak, same everything else — you just have to produce the answer instead
of recognising it.

WHAT IT DOES

• Replaces the word-bank tiles with a typing field
• Matches what you type against the hidden words as you go, so a word is locked
  in the moment you spell it — no trailing space needed
• Ctrl+Backspace deletes a whole word, like every other text field you use
• Optional: ignore accents, so "esta" matches "está"
• Optional: ignore apostrophes, so "dont" matches "don't"
• Toggle it off mid-lesson whenever you want the tiles back

WORKS WITH

• Translate and tap-complete exercises
• Multiple-choice and listening exercises
• Japanese and Chinese, including furigana and pinyin readings
• Light and dark mode, following whatever Duolingo is using

WHAT IT IS NOT

This is an unofficial extension. It is not made by, endorsed by, or affiliated
with Duolingo. It does not touch your account, your streak, or your progress —
it changes what is on the screen in front of you and nothing else. No analytics,
no accounts, no network requests of its own.

Open source: https://github.com/Stupidoodle/duolingo-hard-mode
```

## Category and language

Category `Education`. Primary language English.

## Privacy

Single purpose: "Replace Duolingo's word-bank exercises with a typing input."

Permission justification for `storage`: "Stores four on/off preferences —
whether hard mode is active, whether to ignore accents, whether to ignore
apostrophes, and whether to show the on-page toggles. Nothing is transmitted."

Host permission justification for `*://*.duolingo.com/*`: "The extension's only
function is to modify Duolingo lesson pages."

Data usage: tick nothing. The extension collects no data, which is worth saying
plainly because reviewers of a learning-app extension are right to wonder.

## Screenshots

`store/screenshots/` holds three captures at the required 1280×800, taken from
a real lesson rather than mocked up:

| file | shows |
| --- | --- |
| `01-hero-typing.png` | Japanese translate exercise with a word typed into the input |
| `02-typing-active.png` | Multiple-choice exercise converted to typing |
| `03-before-wordbank.png` | The same exercise with hard mode off, word bank restored |

Order them hero first. The store crops aggressively in the grid view, so the
first image carries the pitch on its own.

Still worth adding, and not yet made:

- A short screencast. The before/after toggle is the whole product and it reads
  far better in motion than as two stills.
- A 440×280 small promo tile, which the store needs for any chance of
  featuring.
