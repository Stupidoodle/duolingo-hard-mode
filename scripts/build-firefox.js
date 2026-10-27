/**
 * Assembles the Firefox package in build/firefox from the current build:
 * the converted manifest plus dist/ and icons/, the same layout as the Chrome
 * zip. Run `bun run build` first; `bun run build:firefox` does both.
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { toFirefoxManifest } from "./firefox-manifest.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "build", "firefox");

const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

writeFileSync(join(out, "manifest.json"), JSON.stringify(toFirefoxManifest(manifest), null, "\t") + "\n");
cpSync(join(root, "dist"), join(out, "dist"), { recursive: true });
cpSync(join(root, "icons"), join(out, "icons"), { recursive: true });

console.log(`Firefox package for ${manifest.version} written to build/firefox`);
