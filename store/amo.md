# Firefox Add-ons (AMO) listing

Copy and answers for the first submission on addons.mozilla.org. The store
listing copy in `listing.md` applies here too; this file covers what AMO asks
for on top of it.

## Package

Each GitHub release from 1.8.0 on carries two Firefox assets:

- `extension-firefox.zip`: the add-on, with `manifest.json` at the root
- `source-code.zip`: the repository at the release commit, for the reviewers

Add-on id: `duolingo-hard-mode@stupidoodle`. It is permanent once AMO has
published a version under it, so never change `GECKO_ID` in
`scripts/firefox-manifest.js`.

## Submission answers

- Distribution: on this site (listed)
- Platforms: Firefox for desktop only. The extension has not been tested on
  Firefox for Android
- Source code: yes. The bundles are produced by webpack, so upload
  `source-code.zip`
- Data collection: none. The manifest declares
  `data_collection_permissions: { required: ["none"] }`
- License: the owner's choice; AMO requires one before the listing goes live
- Categories: Language Support, Other

## Summary (250 character limit)

```
Hides Duolingo's word bank and answer choices so you type every answer. Real recall instead of tapping bubbles. Duolingo still grades every answer itself.
```

## Notes to the reviewer

```
The add-on's code is in src/ and is bundled by webpack. To reproduce the uploaded package from source-code.zip:

Requirements: bun 1.4.0 (https://bun.sh) and Node.js 24, on macOS or Linux.

  bun install --frozen-lockfile
  bun run build:firefox

The package is written to build/firefox. Its manifest is generated from manifest.json by scripts/build-firefox.js; dist/ is the webpack output. There are no remote scripts, no network requests and no data collection. The only permission is storage, for four on/off settings, and the content script runs only on duolingo.com.

Test account: none is needed. Open duolingo.com, start any lesson (the guest flow works without signing in), and the word bank or answer choices are replaced by a text box.
```

## After the first listing

Later versions can be submitted from CI with `web-ext sign --channel listed`,
using API credentials from the AMO Developer Hub (stored as repository
secrets). That is not wired up yet, because it needs the account and the
credentials first.
