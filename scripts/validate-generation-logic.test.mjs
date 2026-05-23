import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const validatorPath = path.join(repoRoot, "scripts", "validate-generation-logic.mjs");

function createFixture(breakdown, indexMarkup = null) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hyperframes-validator-"));
  const project = path.join(root, "project");

  fs.cpSync(path.join(repoRoot, "themes"), path.join(root, "themes"), { recursive: true });
  fs.cpSync(path.join(repoRoot, "assets"), path.join(root, "assets"), { recursive: true });
  fs.mkdirSync(path.join(project, "assets", "source-media"), { recursive: true });
  fs.writeFileSync(path.join(project, "assets", "speech.wav"), "");
  fs.writeFileSync(path.join(project, "assets", "source-media", "image-01.png"), "image");
  fs.writeFileSync(path.join(project, "article-breakdown.md"), breakdown);
  fs.writeFileSync(path.join(project, "hyperframes.json"), "{}\n");
  fs.writeFileSync(path.join(project, "package.json"), "{}\n");
  fs.writeFileSync(
    path.join(project, "index.html"),
    indexMarkup ||
      `<script id="article-video-data" type="application/json">{"voice_source":"article-breakdown.md#Narration Script","speech_asset":"assets/speech.wav","scene_timecodes":[]}</script>\n`
  );

  return { root, project };
}

function runValidation(root, project) {
  return spawnSync(
    process.execPath,
    [validatorPath, "--project", project, "--allow-unrendered"],
    { cwd: root, encoding: "utf8" }
  );
}

function breakdown(scene, schema = "breakdown_schema: 2\n") {
  return `# Article Breakdown
${schema}
## Source
input_type: markdown

## Article Profile
hook_candidate: "A source-led story"

## Style Selection
theme: clear-code

## Scene Count Reasoning
reasoning: "One source section."

## Fixed Scenes
logo_intro: true

## Body Scenes
\`\`\`yaml
${scene}
\`\`\`

## Narration Script
- This source section becomes one visible scene.

## Build Notes
notes: "fixture"
`;
}

const hookScene = `scene_id: scene-01
scene_role: hook
source_section: "Opening"
core_message: "Source-led structure"
narration: "This source section becomes one visible scene."
visual_text: "Source-led layout"
visual_payload:
  headline: "Source-led layout"
  subtitle: "One original section"
card_type: hook
layout_template: clear-code.hook.split-hero
background_preset: warm_canvas
animation: clear_hero_reveal
duration_target: 5
source_excerpt: "A sufficiently long opening excerpt for audit."`;

function imageScene(imagePath, optionalPayload = "") {
  return `scene_id: scene-02
scene_role: image_evidence
source_section: "Product screenshot"
core_message: "The screenshot proves the resulting order."
narration: "The screenshot proves the resulting order."
visual_text: "The source image remains evidence."
visual_payload:
  image_id: image-01
  image_path: ${imagePath}
${optionalPayload}card_type: image_evidence
layout_mode: media_focus
layout_template: clear-code.image_evidence.media-focus
background_preset: warm_canvas
animation: source_image_reveal
duration_target: 5
source_excerpt: "The screenshot sits beside the text that explains the ordering."`;
}

test("schema v2 requires layout_mode on every body scene", () => {
  const { root, project } = createFixture(breakdown(hookScene));
  const result = runValidation(root, project);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /scene-01 missing layout_mode/);
});

test("schema v2 rejects a layout_mode that differs from its registered template", () => {
  const scene = hookScene.replace(
    "layout_template: clear-code.hook.split-hero",
    "layout_mode: structured_cards\nlayout_template: clear-code.hook.split-hero"
  );
  const { root, project } = createFixture(breakdown(scene));
  const result = runValidation(root, project);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /layout_mode structured_cards does not match/);
});

test("theme validation requires image_evidence contracts", () => {
  const { root } = createFixture(breakdown(hookScene));
  const themePath = path.join(root, "themes", "clear-code", "theme.json");
  const theme = JSON.parse(fs.readFileSync(themePath, "utf8"));
  delete theme.card_templates.image_evidence;
  delete theme.layout_templates.image_evidence;
  delete theme.animation_map.image_evidence;
  fs.writeFileSync(themePath, JSON.stringify(theme, null, 2));

  const result = spawnSync(process.execPath, [validatorPath, "--themes-only"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing card_templates\.image_evidence/);
});

test("image_evidence scenes require descriptive image payload fields", () => {
  const { root, project } = createFixture(
    breakdown(imageScene("assets/source-media/image-01.png"))
  );
  const result = runValidation(root, project);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing visual_payload\.alt/);
  assert.match(result.stderr, /missing visual_payload\.caption/);
  assert.match(result.stderr, /missing visual_payload\.why_relevant/);
});

test("image_evidence scenes reject runtime remote image paths", () => {
  const payload = `  alt: "Timeline interface"
  caption: "Source proof"
  why_relevant: "It directly supports the section."
  source_section: "Product screenshot"
`;
  const { root, project } = createFixture(
    breakdown(imageScene("https://example.com/timeline.png", payload))
  );
  const result = runValidation(root, project);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /image_path must reference a local assets\/source-media\/ resource/);
});

test("legacy breakdowns remain valid and emit a compatibility warning", () => {
  const { root, project } = createFixture(breakdown(hookScene, ""));
  const result = runValidation(root, project);

  assert.equal(result.status, 0);
  assert.match(result.stderr, /WARN .*legacy/);
});

test("a Web Clipper style v2 project preserves ordered source scenes and embeds a local source image", () => {
  const firstSection = `scene_id: scene-02
scene_role: section_summary
source_section: "原文第一节：流程说明"
core_message: "The article first describes its workflow."
narration: "The first section explains the workflow."
visual_text: "流程首先被保留"
visual_payload:
  claim: "原文章节顺序"
  evidence: "第一节先说明流程"
card_type: summary
layout_mode: structured_cards
layout_template: clear-code.summary.card-stack
background_preset: warm_canvas
animation: cards_rise_in
duration_target: 5
source_excerpt: "第一节首先说明流程如何逐步运行，并保持顺序。"`;
  const payload = `  alt: "产品界面里的时间线截图"
  caption: "结果按原文章节排列"
  why_relevant: "截图直接支撑第二节描述的结果"
  source_section: "原文第二节配图"
`;
  const secondSection = imageScene("assets/source-media/image-01.png", payload).replace("scene-02", "scene-03");
  const markdown = `# Article Breakdown
breakdown_schema: 2
## Source
input_type: obsidian_web_clipper_markdown
web_clipper: true
source_url: "https://example.com/article"

## Article Profile
hook_candidate: "A source-led story"

## Style Selection
theme: clear-code

## Scene Count Reasoning
reasoning: "The two authored body sections remain in order after the hook."

## Fixed Scenes
logo_intro: true

## Body Scenes
\`\`\`yaml
${hookScene.replace("card_type: hook", "card_type: hook\nlayout_mode: open_title")}
\`\`\`

\`\`\`yaml
${firstSection}
\`\`\`

\`\`\`yaml
${secondSection}
\`\`\`

## Narration Script
- This source section becomes one visible scene.
- The first section explains the workflow.
- The screenshot proves the resulting order.

## Build Notes
notes: "Copied from the clipped Markdown image link into assets/source-media."
`;
  const indexMarkup = `<img src="assets/source-media/image-01.png" alt="产品界面里的时间线截图" />
<script id="article-video-data" type="application/json">{"voice_source":"article-breakdown.md#Narration Script","speech_asset":"assets/speech.wav","scene_timecodes":[]}</script>
`;
  const { root, project } = createFixture(markdown, indexMarkup);
  const result = runValidation(root, project);

  assert.equal(result.status, 0, result.stderr);
  assert.ok(markdown.indexOf("原文第一节：流程说明") < markdown.indexOf("原文第二节配图"));
  assert.match(indexMarkup, /src="assets\/source-media\/image-01\.png"/);
});
