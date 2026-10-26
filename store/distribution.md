# Distribution plan

## Start here: there is nothing to distribute yet

The store has been serving a build from around March 2025 for over a year,
because the publish workflow reported success while uploading nothing. That
build contains the bug that produced the "doesn't work" review: entering a
lesson from inside the app left the extension inert until you reloaded the page.

So every channel below is on hold until `CHROME_REFRESH_TOKEN` and
`CHROME_PUBLISHER_ID` are set and a release actually lands. Driving traffic now
would send people to a broken build and convert a 3.8 into something worse —
and first reviews are extremely sticky on a listing with five of them.

Order of operations:

1. Publish a working build.
2. Reply to the three existing reviews. The "doesn't work" one is now factually
   fixed; saying so publicly is the single highest-leverage thing available,
   because it is the first thing a prospective user reads.
3. Then open the taps.

## What actually makes this spread

The product has one genuinely shareable idea, and it is not a feature list:
**Duolingo lets you pass lessons you could not actually speak.** That is a
claim people argue about, which is what travels. The extension is the punchline,
not the pitch.

Everything below is a variation on getting someone to feel that gap.

## Channels, in order of fit

**r/duolingo and r/languagelearning.** The audience is exactly the complaint
this solves — "I'm on a 900-day streak and can't order coffee" is a recurring
thread. Do not post a launch announcement; post the observation, with the
before/after screenshots, and let the extension be the answer in the comments.
Self-promotion rules are enforced, so an account with history matters.

**Short video.** The before/after toggle is a two-second visual. Tap-tap-tap
versus a blank box is legible without audio, in any language, which is why this
is the highest-ceiling channel and worth the one-off effort of a decent
screencast. The same clip feeds the store listing, the README and the Reddit
posts.

**Hacker News.** Fits as a Show HN, but only with the engineering story
attached: the word bank is reverse-engineered from `data-test` attributes, the
Japanese furigana bug was readings interleaved into `textContent`, the whole
thing is 33 KiB with no network calls. That audience rewards the writeup more
than the product.

**Duolingo-adjacent Discords and language-learning YouTubers.** Slower, but a
single mention from someone with an audience of serious learners outperforms a
Reddit spike, because the viewers are selected for wanting it harder.

**Product Hunt.** Lowest fit. The audience is builders, not language learners,
and the traffic does not retain. Worth doing once for the backlink, not worth
building a campaign around.

## The loop, honestly assessed

A browser extension has no native sharing surface, so the flywheel has to be
manufactured. Ranked by effort against plausible return:

**Worth building: an end-of-lesson stat.** "You typed 47 words instead of
tapping them." It is cheap — the extension already knows every word it matched —
it reinforces the habit, and it is the natural thing to screenshot. This is the
only in-product mechanic here with a real shot at a loop.

**Worth building: a share card.** One button on that stat that copies a
pre-written line plus the store link. Removes the friction between "nice" and
"posted".

**Probably not worth it: leaderboards or accounts.** They require a backend,
which means privacy policy, data handling, and ongoing cost. The current pitch
includes "no accounts, no network requests" — that is a real differentiator for
an extension that sits on top of someone's learning account, and trading it for
a social feature is a bad swap.

**Not worth it: gamification on top of gamification.** Duolingo already owns
streaks and XP. Competing there loses.

## What to measure

Weekly users from the store dashboard is the only number that matters, and the
one to watch is the retention curve rather than the spike — a hard mode is a
thing people install enthusiastically and uninstall quietly. Alongside it:
rating count and average, which is the conversion gate on the listing, and
uninstall rate within seven days, which is the honest signal about whether the
extension is actually pleasant to use or just a good idea.

Tie each push to a date and read the curve a week later. With five ratings
today, the first twenty are worth more than any amount of traffic.
