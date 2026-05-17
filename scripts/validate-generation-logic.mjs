#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const REQUIRED_CARD_TYPES = [
  "hook",
  "summary",
  "key_points",
  "steps",
  "metrics",
  "code_log",
  "architecture",
  "warning",
  "quote",
  "comparison",
  "conclusion",
];

const REQUIRED_BREAKDOWN_SECTIONS = [
  "# Article Breakdown",
  "## Source",
  "## Article Profile",
  "## Style Selection",
  "## Scene Count Reasoning",
  "## Fixed Scenes",
  "## Body Scenes",
  "## Narration Script",
  "## Build Notes",
];

const REQUIRED_SCENE_FIELDS = [
  "scene_id",
  "scene_role",
  "source_section",
  "core_message",
  "narration",
  "visual_text",
  "visual_payload",
  "card_type",
  "layout_template",
  "background_preset",
  "animation",
  "duration_target",
  "source_excerpt",
];

const FORBIDDEN_LONG_LIVED_FILES = [
  "video-blueprint.yaml",
  "voice-script.txt",
  "voice-timecode.json",
  "timing.json",
  "final.mov",
];

const FORBIDDEN_OUTPUT_DIRS = new Set([
  ".cache",
  "snapshots",
  "tmp",
  "temp",
]);

const FORBIDDEN_COMPONENT_TEXT = [
  "Tech Signal",
  "Soft Signal",
  "Folk Frequency",
  "Clear Code",
  "Visual Style System",
  "Logo Frame",
  "Follow Frame",
  "FOLLOW SIGNAL",
  "SOFT SIGNAL",
  "FOLK FREQUENCY",
  "article signal system",
  "soft signal system",
  "folk frequency system",
];

const FORBIDDEN_LOGO_DECORATION = [
  "logo-combo-ring",
  "soft-logo-ring",
  "folk-logo-frame",
  "cc-logo-combo-ring",
];

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const errors = [];
const warnings = [];

const themes = loadThemes(root);
validateThemeContracts(themes, errors);

if (!args.themesOnly) {
  const projectDir = path.resolve(root, args.project || ".");
  validateProject(projectDir, themes, args, errors, warnings);
}

for (const warning of warnings) {
  console.warn(`WARN ${warning}`);
}

if (errors.length) {
  for (const error of errors) {
    console.error(`ERROR ${error}`);
  }
  process.exit(1);
}

console.log(
  args.themesOnly
    ? "Generation logic validation passed for theme contracts."
    : "Generation logic validation passed."
);

function parseArgs(argv) {
  const parsed = {
    project: null,
    themesOnly: false,
    allowUnrendered: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--project") {
      parsed.project = argv[++i];
    } else if (arg === "--themes-only") {
      parsed.themesOnly = true;
    } else if (arg === "--allow-unrendered") {
      parsed.allowUnrendered = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return parsed;
}

function printHelp() {
  console.log(`Usage:
  node scripts/validate-generation-logic.mjs --themes-only
  node scripts/validate-generation-logic.mjs --project <video-project-dir>
  node scripts/validate-generation-logic.mjs --project <video-project-dir> --allow-unrendered

Validates that article video outputs are content-driven:
- article-breakdown.md contains scene analysis and narration.
- scene card/layout/background/animation choices exist in the selected theme.
- index.html embeds scene data and audio-derived scene_timecodes.
- final output is MP4 only; MOV and long-lived process files are forbidden.
`);
}

function loadThemes(baseDir) {
  const themesDir = path.join(baseDir, "themes");
  const loaded = new Map();
  if (!fs.existsSync(themesDir)) {
    return loaded;
  }

  for (const entry of fs.readdirSync(themesDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const themePath = path.join(themesDir, entry.name, "theme.json");
    if (!fs.existsSync(themePath)) continue;
    const theme = JSON.parse(fs.readFileSync(themePath, "utf8"));
    const id = typeof theme.theme === "string" ? theme.theme : theme.theme?.id;
    if (!id) {
      throw new Error(`${themePath} does not declare theme id`);
    }
    loaded.set(id, { id, theme, path: themePath });
  }

  return loaded;
}

function validateThemeContracts(themes, collectedErrors) {
  if (!themes.size) {
    collectedErrors.push("No theme contracts found under themes/*/theme.json.");
    return;
  }

  for (const { id, theme, path: themePath } of themes.values()) {
    if (!Array.isArray(theme.background_presets) || !theme.background_presets.length) {
      collectedErrors.push(`${themePath}: background_presets must be a non-empty array.`);
    }

    const backgrounds = new Set((theme.background_presets || []).map((item) => item.id));
    if (backgrounds.has(undefined)) {
      collectedErrors.push(`${themePath}: every background preset needs an id.`);
    }

    for (const preset of theme.background_presets || []) {
      if (preset.asset_path && !fs.existsSync(path.resolve(root, preset.asset_path))) {
        collectedErrors.push(`${themePath}: background asset not found: ${preset.asset_path}`);
      }
    }

    validateAssetRegistry(themePath, theme.asset_registry, collectedErrors);
    validateThemeLocalResources(path.dirname(themePath), collectedErrors);
    validateThemeComponents(id, path.dirname(themePath), collectedErrors);
    validateDeterministicThemeScripts(path.dirname(themePath), collectedErrors);

    for (const cardType of REQUIRED_CARD_TYPES) {
      if (!theme.card_templates?.[cardType]) {
        collectedErrors.push(`${id}: missing card_templates.${cardType}.`);
      }
      if (!Array.isArray(theme.layout_templates?.[cardType]) || !theme.layout_templates[cardType].length) {
        collectedErrors.push(`${id}: missing layout_templates.${cardType}.`);
      }
      if (!theme.animation_map?.[cardType]) {
        collectedErrors.push(`${id}: missing animation_map.${cardType}.`);
      }
    }
  }
}

function validateProject(projectDir, themes, parsedArgs, collectedErrors, collectedWarnings) {
  const requiredFiles = [
    "article-breakdown.md",
    "index.html",
    "hyperframes.json",
    "package.json",
    "assets/speech.wav",
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(projectDir, file))) {
      collectedErrors.push(`${projectDir}: missing required output file ${file}.`);
    }
  }

  if (!parsedArgs.allowUnrendered && !fs.existsSync(path.join(projectDir, "renders/final.mp4"))) {
    collectedErrors.push(`${projectDir}: missing rendered MP4 output renders/final.mp4.`);
  }

  validateForbiddenFiles(projectDir, collectedErrors);
  validateLocalResources(projectDir, collectedErrors);
  validateLayoutIgnoreUsage(projectDir, collectedErrors);

  const breakdownPath = path.join(projectDir, "article-breakdown.md");
  if (fs.existsSync(breakdownPath)) {
    validateBreakdown(breakdownPath, themes, collectedErrors, collectedWarnings);
  }

  const indexPath = path.join(projectDir, "index.html");
  if (fs.existsSync(indexPath)) {
    validateIndexHtml(indexPath, collectedErrors);
  }
}

function validateForbiddenFiles(projectDir, collectedErrors) {
  for (const dir of walkDirs(projectDir)) {
    const rel = path.relative(projectDir, dir);
    if (FORBIDDEN_OUTPUT_DIRS.has(path.basename(dir))) {
      collectedErrors.push(`${projectDir}: forbidden temporary output directory ${rel}.`);
    }
  }

  for (const file of walkFiles(projectDir, { includeForbiddenDirs: true })) {
    const rel = path.relative(projectDir, file);
    const base = path.basename(file);
    if (FORBIDDEN_LONG_LIVED_FILES.includes(base) || rel.endsWith("renders/final.mov")) {
      collectedErrors.push(`${projectDir}: forbidden long-lived output file ${rel}.`);
    }
  }
}

function validateLocalResources(projectDir, collectedErrors) {
  const readableFiles = walkFiles(projectDir).filter((file) => /\.(html|css|js|json|md)$/i.test(file));
  for (const file of readableFiles) {
    const text = fs.readFileSync(file, "utf8");
    for (const resource of extractLocalResources(text)) {
      const target = resolveProjectResource(projectDir, file, resource);
      if (!target) {
        collectedErrors.push(`${file}: missing local resource ${resource}.`);
      }
    }
  }
}

function resolveProjectResource(projectDir, sourceFile, resource) {
  const localTarget = path.resolve(path.dirname(sourceFile), resource);
  if (fs.existsSync(localTarget)) return localTarget;

  if (!resource.startsWith(".") && !path.isAbsolute(resource)) {
    const projectTarget = path.resolve(projectDir, resource);
    if (fs.existsSync(projectTarget)) return projectTarget;
  }

  return null;
}

function validateLayoutIgnoreUsage(projectDir, collectedErrors) {
  const htmlFiles = walkFiles(projectDir).filter((file) => file.endsWith(".html"));
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    validateLayoutIgnoreTags(html, file, collectedErrors);
  }
}

function validateBreakdown(breakdownPath, themes, collectedErrors, collectedWarnings) {
  const text = fs.readFileSync(breakdownPath, "utf8");
  for (const section of REQUIRED_BREAKDOWN_SECTIONS) {
    if (!text.includes(section)) {
      collectedErrors.push(`${breakdownPath}: missing section ${section}.`);
    }
  }

  const themeId = readScalar(text, "theme");
  if (!themeId) {
    collectedErrors.push(`${breakdownPath}: Style Selection must include theme.`);
    return;
  }

  const themeRecord = themes.get(themeId);
  if (!themeRecord) {
    collectedErrors.push(`${breakdownPath}: unknown theme ${themeId}.`);
    return;
  }

  const bodyBlocks = extractBodySceneBlocks(text);
  if (!bodyBlocks.length) {
    collectedErrors.push(`${breakdownPath}: Body Scenes must contain fenced YAML scene blocks.`);
    return;
  }

  const theme = themeRecord.theme;
  const backgroundIds = new Set((theme.background_presets || []).map((item) => item.id));
  const layoutIdsByType = new Map(
    Object.entries(theme.layout_templates || {}).map(([cardType, layouts]) => [
      cardType,
      new Set((layouts || []).map((layout) => layout.id)),
    ])
  );

  const narrations = new Set();
  const cardTypes = new Set();

  bodyBlocks.forEach((block, index) => {
    const scene = parseSceneBlock(block);
    const sceneLabel = scene.scene_id || `scene block ${index + 1}`;

    for (const field of REQUIRED_SCENE_FIELDS) {
      if (!scene[field]) {
        collectedErrors.push(`${breakdownPath}: ${sceneLabel} missing ${field}.`);
      }
    }

    if (scene.narration && scene.visual_text && normalize(scene.narration) === normalize(scene.visual_text)) {
      collectedErrors.push(`${breakdownPath}: ${sceneLabel} visual_text duplicates narration.`);
    }

    if (scene.narration) narrations.add(normalize(scene.narration));
    if (scene.card_type) cardTypes.add(scene.card_type);

    if (scene.card_type && !theme.card_templates?.[scene.card_type]) {
      collectedErrors.push(`${breakdownPath}: ${sceneLabel} unknown card_type ${scene.card_type} for ${themeRecord.id}.`);
    }

    const layoutIds = layoutIdsByType.get(scene.card_type);
    if (scene.layout_template && (!layoutIds || !layoutIds.has(scene.layout_template))) {
      collectedErrors.push(`${breakdownPath}: ${sceneLabel} layout_template ${scene.layout_template} is not registered for ${themeRecord.id}.${scene.card_type}.`);
    }

    if (scene.background_preset && !backgroundIds.has(scene.background_preset)) {
      collectedErrors.push(`${breakdownPath}: ${sceneLabel} background_preset ${scene.background_preset} is not registered for ${themeRecord.id}.`);
    }

    const expectedAnimation = theme.animation_map?.[scene.card_type];
    if (scene.animation && expectedAnimation && scene.animation !== expectedAnimation) {
      collectedErrors.push(`${breakdownPath}: ${sceneLabel} animation ${scene.animation} does not match ${themeRecord.id}.animation_map.${scene.card_type} (${expectedAnimation}).`);
    }

    if (scene.source_excerpt && scene.source_excerpt.length < 12) {
      collectedErrors.push(`${breakdownPath}: ${sceneLabel} source_excerpt is too short to audit.`);
    }
  });

  if (bodyBlocks.length > 1 && narrations.size === 1) {
    collectedErrors.push(`${breakdownPath}: all body scene narrations are identical; scenes must be article-driven.`);
  }

  if (bodyBlocks.length >= 4 && cardTypes.size < 2) {
    collectedWarnings.push(`${breakdownPath}: all or most scenes use one card type; verify this is justified by the article.`);
  }

  validateNarrationScript(text, bodyBlocks.length, breakdownPath, collectedErrors);
}

function validateIndexHtml(indexPath, collectedErrors) {
  const html = fs.readFileSync(indexPath, "utf8");
  const requiredSignals = [
    "scene_timecodes",
    "voice_source",
    "speech.wav",
    "article-breakdown.md#Narration Script",
  ];

  for (const signal of requiredSignals) {
    if (!html.includes(signal)) {
      collectedErrors.push(`${indexPath}: missing embedded timing/content signal ${signal}.`);
    }
  }

  if (html.includes("final.mov") || html.includes(".mov")) {
    collectedErrors.push(`${indexPath}: MOV output is not allowed; use MP4 only.`);
  }

  const articleData = readEmbeddedArticleData(html);
  if (articleData?.scene_timecodes?.length) {
    validateTtsMetadata(indexPath, articleData, collectedErrors);
    validateContinuousSceneTimecodes(indexPath, articleData.scene_timecodes, collectedErrors);
  }
}

function validateAssetRegistry(themePath, registry, collectedErrors) {
  if (!registry) {
    collectedErrors.push(`${themePath}: missing asset_registry.`);
    return;
  }

  for (const asset of flattenRegistryAssets(registry)) {
    if (!asset.path) continue;
    const target = path.resolve(root, asset.path);
    if (!fs.existsSync(target)) {
      collectedErrors.push(`${themePath}: registered asset not found: ${asset.path}`);
    }
  }
}

function flattenRegistryAssets(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenRegistryAssets(item));
  }
  if (typeof value === "object") {
    const own = value.path ? [value] : [];
    return own.concat(Object.values(value).flatMap((item) => flattenRegistryAssets(item)));
  }
  return [];
}

function validateThemeLocalResources(themeDir, collectedErrors) {
  const readableFiles = walkFiles(themeDir).filter((file) => /\.(html|css|js|json|md)$/i.test(file));
  for (const file of readableFiles) {
    const text = fs.readFileSync(file, "utf8");
    for (const resource of extractLocalResources(text)) {
      const target = path.resolve(path.dirname(file), resource);
      if (!fs.existsSync(target)) {
        collectedErrors.push(`${file}: missing local theme resource ${resource}.`);
      }
    }
  }
}

function validateThemeComponents(themeId, themeDir, collectedErrors) {
  const logoPath = path.join(themeDir, "components", "logo-intro.html");
  const followPath = path.join(themeDir, "components", "follow-outro.html");

  if (!fs.existsSync(logoPath)) {
    collectedErrors.push(`${themeId}: missing components/logo-intro.html.`);
  } else {
    const html = fs.readFileSync(logoPath, "utf8");
    if (!/\bdata-duration=(["'])3\1/.test(html)) {
      collectedErrors.push(`${logoPath}: logo intro duration must be fixed at 3s.`);
    }
    for (const marker of FORBIDDEN_LOGO_DECORATION) {
      if (html.includes(marker)) {
        collectedErrors.push(`${logoPath}: logo intro must not use decorative logo wrapper ${marker}.`);
      }
    }
    validateComponentText(html, logoPath, collectedErrors);
    validateLayoutIgnoreTags(html, logoPath, collectedErrors);
  }

  if (!fs.existsSync(followPath)) {
    collectedErrors.push(`${themeId}: missing components/follow-outro.html.`);
  } else {
    const html = fs.readFileSync(followPath, "utf8");
    validateComponentText(html, followPath, collectedErrors);
    validateLayoutIgnoreTags(html, followPath, collectedErrors);
  }
}

function validateComponentText(html, source, collectedErrors) {
  const visibleText = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const forbidden of FORBIDDEN_COMPONENT_TEXT) {
    if (visibleText.includes(forbidden)) {
      collectedErrors.push(`${source}: theme component exposes template label "${forbidden}" in visible fallback text.`);
    }
  }
}

function validateLayoutIgnoreTags(html, source, collectedErrors) {
  const ignoredTags = html.match(/<[^>]*\bdata-layout-ignore\b[^>]*>/g) || [];
  for (const tag of ignoredTags) {
    if (!/\baria-hidden=(["'])true\1/.test(tag)) {
      collectedErrors.push(`${source}: data-layout-ignore is only allowed on aria-hidden decorative nodes.`);
    }
  }
}

function validateDeterministicThemeScripts(themeDir, collectedErrors) {
  const scriptFiles = walkFiles(themeDir).filter((file) => /\.(js|html)$/i.test(file));
  for (const file of scriptFiles) {
    const text = fs.readFileSync(file, "utf8");
    if (/Math\.random|Date\.now|repeat\s*:\s*(?:-1|Infinity)/.test(text)) {
      collectedErrors.push(`${file}: theme scripts must be deterministic and must not use random/clock/infinite animation.`);
    }
  }
}

function readEmbeddedArticleData(html) {
  const match = html.match(/<script[^>]*id=(["'])article-video-data\1[^>]*>([\s\S]*?)<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[2]);
  } catch {
    return null;
  }
}

function validateContinuousSceneTimecodes(source, timecodes, collectedErrors) {
  for (let i = 1; i < timecodes.length; i += 1) {
    const previous = Number(timecodes[i - 1].voice_end);
    const current = Number(timecodes[i].voice_start);
    if (!Number.isFinite(previous) || !Number.isFinite(current)) continue;
    const gap = Math.abs(current - previous);
    if (gap > 0.05) {
      collectedErrors.push(`${source}: scene_timecodes have a non-continuous voice gap of ${gap.toFixed(3)}s before ${timecodes[i].scene_id}.`);
    }
  }
}

function validateTtsMetadata(source, articleData, collectedErrors) {
  const usesKokoroZh =
    articleData.tts_model === "kokoro_zh_v1.1" ||
    String(articleData.tts_engine || "").includes("kokoro_zh_v1.1") ||
    String(articleData.tts_engine || "").includes("hexgrad/Kokoro-82M-v1.1-zh");

  if (!usesKokoroZh) return;

  if (articleData.tts_voice && articleData.tts_voice !== "zf_001") {
    collectedErrors.push(`${source}: Chinese Kokoro default voice must be zf_001 unless the user explicitly chose another voice.`);
  }

  const speed = Number(articleData.tts_speed ?? String(articleData.tts_engine || "").match(/speed\s+([0-9.]+)/)?.[1]);
  if (Number.isFinite(speed) && Math.abs(speed - 1.5) > 0.001) {
    collectedErrors.push(`${source}: Chinese Kokoro default speed must be 1.5; found ${speed}.`);
  }
}

function extractBodySceneBlocks(markdown) {
  const bodyMatch = markdown.match(/## Body Scenes([\s\S]*?)## Narration Script/);
  if (!bodyMatch) return [];
  const body = bodyMatch[1];
  return [...body.matchAll(/```ya?ml\s*\n([\s\S]*?)```/g)].map((match) => match[1]);
}

function parseSceneBlock(block) {
  const scene = {};
  const lines = block.split(/\r?\n/);
  let currentTopLevel = null;

  for (const line of lines) {
    const topLevel = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (topLevel) {
      currentTopLevel = topLevel[1];
      scene[currentTopLevel] = cleanYamlScalar(topLevel[2]);
      continue;
    }

    if (currentTopLevel && line.trim()) {
      scene[currentTopLevel] = `${scene[currentTopLevel] || ""}\n${line}`.trim();
    }
  }

  return scene;
}

function validateNarrationScript(markdown, bodySceneCount, source, collectedErrors) {
  const match = markdown.match(/## Narration Script([\s\S]*?)(?:\n## |\n# |$)/);
  if (!match) return;
  const lines = match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("```"));

  const narrationLines = lines.filter((line) => /^[-*]|\d+[.)]/.test(line));
  if (narrationLines.length && narrationLines.length !== bodySceneCount) {
    collectedErrors.push(`${source}: Narration Script has ${narrationLines.length} lines but Body Scenes has ${bodySceneCount} scenes.`);
  }
}

function readScalar(text, key) {
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(new RegExp(`^\\s*${escapeRegExp(key)}:\\s*(.+?)\\s*$`));
    if (match) return cleanYamlScalar(match[1]);
  }
  return null;
}

function cleanYamlScalar(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.replace(/^["']|["']$/g, "");
}

function normalize(value) {
  return String(value).replace(/\s+/g, "").trim();
}

function extractLocalResources(text) {
  const resources = [];
  const patterns = [
    /\b(?:src|href|data-composition-src)=["']([^"']+)["']/g,
    /url\(([^)]+)\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const raw = match[1].trim().replace(/^["']|["']$/g, "");
      if (!raw || shouldIgnoreResource(raw)) continue;
      resources.push(raw.split("#")[0].split("?")[0]);
    }
  }

  return resources;
}

function shouldIgnoreResource(value) {
  return (
    value.startsWith("#") ||
    value.startsWith("data:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("javascript:")
  );
}

function walkDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  const dirs = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const item = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    dirs.push(item, ...walkDirs(item));
  }
  return dirs;
}

function walkFiles(dir, options = {}) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const item = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      if (!options.includeForbiddenDirs && FORBIDDEN_OUTPUT_DIRS.has(entry.name)) continue;
      files.push(...walkFiles(item, options));
    } else {
      files.push(item);
    }
  }
  return files;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
