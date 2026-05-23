import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = path.join(repoRoot, "themes", "tech-signal", "partials", "universal-tech.css");
const demoPath = path.join(repoRoot, "themes", "tech-signal", "demo", "hook.html");
const css = fs.readFileSync(cssPath, "utf8");

test("Tech Signal hook gives its proof rail near-equal visual weight", () => {
  assert.match(css, /\.hook-hero\s*\{[\s\S]*?grid-template-columns:\s*0\.98fr 1\.02fr;/);
  assert.match(css, /\.hook-hero\s*\{[\s\S]*?gap:\s*48px;/);
  assert.match(css, /\.release-chip-stack\s*\{[\s\S]*?width:\s*560px;/);
  assert.match(css, /\.release-chip-stack\s*\{[\s\S]*?margin-left:\s*20px;/);
  assert.match(css, /\.release-chip-stack\s*\{[\s\S]*?gap:\s*20px;/);
  assert.match(css, /\.release-chip\s*\{[\s\S]*?padding:\s*30px 32px;/);
  assert.match(css, /\.release-chip:nth-child\(2\)\s*\{\s*margin-left:\s*18px;\s*\}/);
  assert.match(css, /\.release-chip:nth-child\(3\)\s*\{\s*margin-left:\s*36px;\s*\}/);
  assert.match(css, /\.chip-title\s*\{[\s\S]*?font-size:\s*34px;/);
  assert.match(css, /\.chip-detail\s*\{[\s\S]*?font-size:\s*23px;/);
});

test("Tech Signal includes a real hook demo for visual regression checks", () => {
  assert.ok(fs.existsSync(demoPath), "themes/tech-signal/demo/hook.html should exist");
  const demo = fs.readFileSync(demoPath, "utf8");

  assert.match(demo, /data-composition-id="tech-signal-hook-demo"/);
  assert.match(demo, /class="[^"]*hook-layout[^"]*"/);
  assert.match(demo, /class="scene-content hook-hero"/);
  assert.match(demo, /class="release-chip-stack"/);
  assert.equal((demo.match(/class="release-chip glass"/g) || []).length, 3);
});
