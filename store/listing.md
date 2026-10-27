# Chrome Web Store listing

Copy for the Developer Dashboard. Everything here describes behaviour that
exists in the current build — nothing aspirational, because the store listing is
what sets the expectation a one-star review is written against.

## Name

```
Duolingo Hard Mode — type instead of tap
```

The suffix is what people search for and it states the mechanic before the
click.

## Short description (132 character limit)

```
Hides Duolingo's word bank and answer choices so you type every answer. Real recall instead of tapping bubbles.
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

• Translations and fill-in-the-blank: the word bank is hidden. Type the
  sentence and each bubble fills in the moment you finish its word
• Multiple choice: the options stay hidden until you type one
• Chat replies: type the reply, punctuation optional
• Matching pairs: hear or read a prompt, type its partner, press Enter
• Conjugation tables and cloze exercises: type the missing words and endings
• Duolingo still grades every answer itself; the extension only does the tapping
• Ctrl+Backspace deletes a whole word, like every other text field you use
• Optional: ignore accents, so "esta" matches "está" and "soeur" matches "sœur"
• Optional: ignore apostrophes, so "dont" matches "don't"
• Toggle it off mid-lesson whenever you want the bubbles back

WORKS WITH

• Every course that uses word banks, multiple choice or matching pairs
• Japanese and Chinese, including furigana and pinyin readings and IME input
• Light and dark mode, following whatever Duolingo is using

Exercises that already make you type are left alone, and speaking exercises
can't be typed.

WHAT IT IS NOT

This is an unofficial extension. It is not made by, endorsed by, or affiliated
with Duolingo. It does not touch your account, your streak, or your progress —
it changes what is on the screen in front of you and nothing else. No analytics,
no accounts, no network requests of its own.

Source code: https://github.com/Stupidoodle/duolingo-hard-mode
```

## Category and language

Category `Education`. Primary language English.

## Privacy

Single purpose: "Replace Duolingo's word-bank and multiple-choice exercises with
a typing input."

Permission justification for `storage`: "Stores four on/off preferences —
whether hard mode is active, whether to ignore accents, whether to ignore
apostrophes, and whether to show the on-page toggles. Nothing is transmitted."

Host permission justification for `*://*.duolingo.com/*`: "The extension's only
function is to modify Duolingo lesson pages."

Data usage: tick nothing. The extension collects no data, which is worth saying
plainly because reviewers of a learning-app extension are right to wonder.

## Screenshots

`store/screenshots/` holds five captures at the required 1280×800, each a real
lesson in the 1.7.0 build with a caption above it:

| file | shows |
| --- | --- |
| `01-hero.png` | The same translation with the word bank, and with hard mode typing it |
| `02-translate.png` | A Spanish translation typed, every bubble filled in |
| `03-multiple-choice.png` | A multiple-choice exercise answered by typing |
| `04-pairs.png` | Matching pairs, two locked in and the third being typed |
| `05-dark.png` | Dark mode |

Order them as numbered. The store crops aggressively in the grid view, so the
first image carries the pitch on its own.

## Promo tiles

`store/promo/small-440x280.png` is the small tile the store needs before it will
consider an item for featuring; `store/promo/marquee-1400x560.png` is the
optional marquee. Neither uses Duolingo's logo or mascot.

## Video

The listing takes a YouTube URL. The before/after recording in
`docs/demo.gif` reads far better in motion than any still; upload it (or the
MP4 cut of it) to YouTube and paste the link.
