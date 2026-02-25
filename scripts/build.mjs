import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const distDir = resolve(root, "dist");

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

const requiredItems = [
  "index.html",
  "privacy.html",
  "impressum.html",
  "site.webmanifest",
  "service-worker.js",
  "css",
  "js",
  "data",
  "assets",
];
const optionalItems = ["icons"];

for (const item of requiredItems) {
  const source = resolve(root, item);
  if (!existsSync(source)) {
    throw new Error(`Missing build source: ${item}`);
  }
  const target = resolve(distDir, item);
  cpSync(source, target, { recursive: true });
}

for (const item of optionalItems) {
  const source = resolve(root, item);
  if (!existsSync(source)) continue;
  const target = resolve(distDir, item);
  cpSync(source, target, { recursive: true });
}

console.log("Build complete: dist/");
