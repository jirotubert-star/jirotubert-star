import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const distDir = resolve(root, "dist");

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

const itemsToCopy = ["index.html", "site.webmanifest", "css", "js", "assets"];

for (const item of itemsToCopy) {
  const source = resolve(root, item);
  if (!existsSync(source)) {
    throw new Error(`Missing build source: ${item}`);
  }
  const target = resolve(distDir, item);
  cpSync(source, target, { recursive: true });
}

console.log("Build complete: dist/");
