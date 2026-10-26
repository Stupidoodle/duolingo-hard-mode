#!/usr/bin/env bash
# Regenerates CHROME_REFRESH_TOKEN for the Chrome Web Store publish workflow.
#
# Run this yourself, in your own terminal. The refresh token is piped straight
# into `gh secret set` and never printed.
#
#   bash scripts/chrome-store-auth.sh
#
# Needs: gh (authenticated), curl, jq, and the CHROME_CLIENT_ID /
# CHROME_CLIENT_SECRET of the Google Cloud OAuth client used for the store.

set -euo pipefail

SCOPE="https://www.googleapis.com/auth/chromewebstore"
REDIRECT="urn:ietf:wg:oauth:2.0:oob"
REPO="${REPO:-Stupidoodle/duolingo-hard-mode}"

for tool in gh curl jq; do
  command -v "$tool" >/dev/null || { echo "missing: $tool"; exit 1; }
done

read -rp "CHROME_CLIENT_ID: " CLIENT_ID
read -rsp "CHROME_CLIENT_SECRET (hidden): " CLIENT_SECRET; echo

cat <<MSG

Open this and approve with the Google account that owns the store listing:

https://accounts.google.com/o/oauth2/auth?response_type=code&scope=${SCOPE}&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT}&access_type=offline&prompt=consent

"access_type=offline" and "prompt=consent" are both required; without them
Google returns an access token but no refresh token.

MSG

read -rp "Paste the authorization code: " AUTH_CODE

RESPONSE=$(curl -s -X POST \
  -d "client_id=${CLIENT_ID}" \
  -d "client_secret=${CLIENT_SECRET}" \
  -d "code=${AUTH_CODE}" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=${REDIRECT}" \
  "https://oauth2.googleapis.com/token")

if ! printf '%s' "$RESPONSE" | jq -e '.refresh_token' >/dev/null 2>&1; then
  echo "No refresh token returned."
  printf '%s' "$RESPONSE" | jq -r '"error: \(.error // "unknown")\ndescription: \(.error_description // "none")"'
  exit 1
fi

printf '%s' "$RESPONSE" | jq -r '.refresh_token' | gh secret set CHROME_REFRESH_TOKEN --repo "$REPO"
echo "CHROME_REFRESH_TOKEN updated on $REPO."

cat <<'MSG'

Two things left:

1. Set CHROME_PUBLISHER_ID. The v2 API addresses items by publisher:
     gh secret set CHROME_PUBLISHER_ID --repo <repo>
   It is in the Chrome Web Store Developer Dashboard under account settings.

2. In Google Cloud Console, set the OAuth consent screen's publishing status to
   "In production". While it is "Testing", Google expires refresh tokens after
   seven days and this will quietly break again.

Then publish an existing tag:
     gh workflow run publish-store.yml --ref master -f tag=v1.4.1
MSG
