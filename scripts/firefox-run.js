/**
 * Opens Firefox with the add-on from build/firefox installed, for trying it by
 * hand: the Firefox counterpart of "Load unpacked". Release Firefox only loads
 * an unsigned add-on temporarily, so it is gone once the window closes.
 *
 * Firefox stable is downloaded into .browsers/ on the first run.
 */
import { Browser, computeExecutablePath, detectBrowserPlatform, install, resolveBuildId } from "@puppeteer/browsers";
import puppeteer from "puppeteer-core";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = join(root, ".browsers");
const platform = detectBrowserPlatform();
const buildId = await resolveBuildId(Browser.FIREFOX, platform, "stable");

await install({ browser: Browser.FIREFOX, buildId, cacheDir });

const browser = await puppeteer.launch({
	browser: "firefox",
	executablePath: computeExecutablePath({ browser: Browser.FIREFOX, buildId, cacheDir }),
	headless: false,
	defaultViewport: null
});

await browser.installExtension(join(root, "build", "firefox"));
const [page] = await browser.pages();
await page.goto("https://www.duolingo.com/");

console.log(`Firefox ${buildId} is running with the add-on installed. Close the window to quit.`);
browser.on("disconnected", () => process.exit(0));
