/**
 * Logs the MCP browser profiles into Duolingo using credentials from .env.
 *
 * Run it yourself: `bun run login` (Claude does not run this — it enters a password).
 *
 * `.mcp.json` pins both MCP servers to repo-local, gitignored profile directories
 * under .chrome-profiles/, so a successful login sticks across sessions. This
 * script is the re-auth fallback for when a session expires. Profiles that are
 * still logged in are skipped.
 *
 * Chrome holds an exclusive lock on a profile directory, so both MCP browsers
 * must be fully quit before this runs — see the message it prints if they aren't.
 *
 * The browser opens headed on purpose: if Duolingo shows a captcha or a
 * device-verification step, solve it in the visible window.
 */

import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PROFILE_ROOT = join(REPO_ROOT, ".chrome-profiles");

const PROFILES = [
	{ name: "playwright-mcp", dir: join(PROFILE_ROOT, "playwright") },
	{ name: "chrome-devtools-mcp", dir: join(PROFILE_ROOT, "devtools") },
];

const LEARN_URL = "https://www.duolingo.com/learn";
const NAV_TIMEOUT = 60_000;

const email = process.env.DUOLINGO_EMAIL;
const password = process.env.DUOLINGO_PASSWORD;

if (!email || !password) {
	console.error(
		"Missing DUOLINGO_EMAIL or DUOLINGO_PASSWORD.\n" +
			"Copy .env.example to .env and fill both values, then re-run `bun run login`."
	);
	process.exit(1);
}

/**
 * Which of our profiles are currently open in a Chrome process.
 * @returns {{name: string, dir: string}[]}
 */
function lockedProfiles() {
	let ps = "";
	try {
		ps = execFileSync("ps", ["-axww", "-o", "command"], { encoding: "utf8" });
	} catch {
		return [];
	}

	const inUse = new Set([...ps.matchAll(/--user-data-dir=(\S+)/g)].map((match) => match[1]));
	return PROFILES.filter((profile) => inUse.has(profile.dir));
}

/**
 * Fills and submits the Duolingo login form.
 * Selectors are ordered most-specific first; Duolingo changes its DOM often, so
 * each one falls back to a generic attribute match.
 * @param {import("playwright-core").Page} page
 */
async function submitLoginForm(page) {
	const alreadyHaveAccount = page
		.getByRole("button", { name: /already have an account/i })
		.or(page.getByRole("link", { name: /already have an account/i }));

	if (await alreadyHaveAccount.first().isVisible().catch(() => false)) {
		await alreadyHaveAccount.first().click();
	}

	const emailField = page
		.locator("[data-test='email-input']")
		.or(page.locator("input[name='identifier'], input[type='email']"))
		.first();

	const passwordField = page
		.locator("[data-test='password-input']")
		.or(page.locator("input[type='password']"))
		.first();

	await emailField.waitFor({ state: "visible", timeout: 30_000 });

	await emailField.fill(email);
	await passwordField.fill(password);
	await passwordField.press("Enter");

	await page.waitForURL(/\/learn/, { timeout: NAV_TIMEOUT });
}

/**
 * Logs one profile in, skipping it when the session is still valid.
 * @param {{name: string, dir: string}} profile
 * @returns {Promise<"skipped"|"logged-in">}
 */
async function loginProfile({ name, dir }) {
	console.log(`\n[${name}] ${dir}`);

	const context = await chromium.launchPersistentContext(dir, {
		channel: "chrome",
		headless: false,
		viewport: null,
	});

	try {
		const page = context.pages()[0] ?? (await context.newPage());
		await page.goto(LEARN_URL, { timeout: NAV_TIMEOUT, waitUntil: "domcontentloaded" });

		// Duolingo bounces logged-out visitors off /learn onto the landing page.
		if (new URL(page.url()).pathname.startsWith("/learn")) {
			console.log(`[${name}] already logged in — skipped`);
			return "skipped";
		}

		try {
			await submitLoginForm(page);
		} catch (error) {
			const shot = join(REPO_ROOT, `login-debug-${name}.png`);
			await page.screenshot({ path: shot }).catch(() => {});
			throw new Error(
				`login form failed at ${page.url()}\n  screenshot: ${shot}\n  cause: ${error.message}`
			);
		}

		console.log(`[${name}] logged in`);
		return "logged-in";
	} finally {
		await context.close();
	}
}

const missing = PROFILES.filter((profile) => !existsSync(profile.dir));
if (missing.length === PROFILES.length) {
	console.log(
		"No profile directories yet — they are created on first login.\n" +
			"Chrome will start each one from scratch."
	);
}

const locked = lockedProfiles();
if (locked.length > 0) {
	console.error("These MCP browsers are open and hold their profile locks:\n");
	for (const { name, dir } of locked) {
		console.error(`  ${name}  ${dir}`);
	}
	console.error(
		"\nQuit those Chrome windows (Cmd+Q in the window itself), then re-run `bun run login`.\n" +
			"Note: playwright's browser_close only closes the tab — the browser process\n" +
			"stays alive and keeps the lock."
	);
	process.exit(1);
}

let failed = false;

for (const profile of PROFILES) {
	try {
		await loginProfile(profile);
	} catch (error) {
		failed = true;
		// Playwright appends the full Chrome command line to launch errors; the
		// text before the call log carries the actual cause.
		console.error(`[${profile.name}] FAILED: ${error.message.split("\nCall log:")[0]}`);
	}
}

if (failed) {
	console.error(
		"\nOne or more profiles failed. SSO (Google/Apple) sign-in is not supported —\n" +
			"log in by hand in that browser for those."
	);
	process.exit(1);
}

console.log("\nAll profiles authenticated.");
