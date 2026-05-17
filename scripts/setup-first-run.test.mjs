import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { checkBranding, selectPythonCandidate } from "./setup-first-run.mjs";

test("checkBranding accepts complete branding files", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "hyperframes-setup-"));
  await mkdir(path.join(root, "assets", "branding"), { recursive: true });
  await writeFile(path.join(root, "assets", "branding", "logo.svg"), "<svg />");
  await writeFile(path.join(root, "assets", "branding", "follow-avatar.png"), "avatar");
  await writeFile(
    path.join(root, "assets", "branding", "brand-profile.json"),
    JSON.stringify({
      logo_path: "assets/branding/logo.svg",
      follow_avatar_path: "assets/branding/follow-avatar.png",
      display_name: "JunEr Visual Lab",
      handle: "@JunEr",
      url: "https://x.com/JunEr",
      logo_intro_text: "JunEr Visual Lab",
      follow_title: "Follow JunEr",
      follow_subtitle: "More updates",
      cta_text: "Follow me"
    })
  );

  const result = await checkBranding(root);

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("checkBranding reports missing required brand fields", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "hyperframes-setup-"));
  await mkdir(path.join(root, "assets", "branding"), { recursive: true });
  await writeFile(path.join(root, "assets", "branding", "logo.svg"), "<svg />");
  await writeFile(
    path.join(root, "assets", "branding", "brand-profile.json"),
    JSON.stringify({
      logo_path: "assets/branding/logo.svg",
      display_name: "JunEr Visual Lab"
    })
  );

  const result = await checkBranding(root);

  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /brand-profile\.json missing required field: handle/);
  assert.match(result.errors.join("\n"), /configured asset not found: follow_avatar_path/);
});

test("selectPythonCandidate prefers supported Python versions only", () => {
  const selected = selectPythonCandidate([
    { command: "python3", version: "Python 3.14.5" },
    { command: "python3.11", version: "Python 3.11.9" },
    { command: "python3.12", version: "Python 3.12.4" }
  ]);

  assert.deepEqual(selected, { command: "python3.12", version: "Python 3.12.4" });
  assert.equal(
    selectPythonCandidate([{ command: "python3", version: "Python 3.14.5" }]),
    null
  );
});
