#!/usr/bin/env node

import { execFile } from "node:child_process";
import { access, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const REQUIRED_BRAND_FIELDS = [
  "display_name",
  "handle",
  "url",
  "logo_intro_text",
  "follow_title",
  "follow_subtitle",
  "cta_text"
];

const PYTHON_COMMANDS = ["python3.12", "python3.11", "python3.10", "python3"];
const PYTHON_PREFERENCE = ["3.12", "3.11", "3.10"];
const PYTHON_IMPORTS = ["kokoro", "torch", "soundfile", "numpy"];
const HYPERFRAMES_VERSION = "0.6.6";

export async function checkBranding(rootDir) {
  const errors = [];
  const profilePath = path.join(rootDir, "assets", "branding", "brand-profile.json");
  let profile = null;

  try {
    profile = JSON.parse(await readFile(profilePath, "utf8"));
  } catch (error) {
    errors.push(`assets/branding/brand-profile.json is missing or invalid JSON: ${error.message}`);
  }

  if (profile) {
    for (const field of REQUIRED_BRAND_FIELDS) {
      if (typeof profile[field] !== "string" || !profile[field].trim()) {
        errors.push(`brand-profile.json missing required field: ${field}`);
      }
    }

    for (const field of ["logo_path", "follow_avatar_path"]) {
      if (typeof profile[field] !== "string" || !profile[field].trim()) {
        errors.push(`configured asset not found: ${field}`);
        continue;
      }
      if (!(await pathExists(path.join(rootDir, profile[field])))) {
        errors.push(`configured asset not found: ${field} -> ${profile[field]}`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

export function selectPythonCandidate(candidates) {
  const supported = candidates
    .map((candidate) => ({
      ...candidate,
      parsed: parsePythonVersion(candidate.version)
    }))
    .filter((candidate) => candidate.parsed && PYTHON_PREFERENCE.includes(candidate.parsed));

  supported.sort(
    (a, b) => PYTHON_PREFERENCE.indexOf(a.parsed) - PYTHON_PREFERENCE.indexOf(b.parsed)
  );

  if (!supported.length) return null;
  const { command, version } = supported[0];
  return { command, version };
}

async function main() {
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const checkOnly = process.argv.includes("--check");
  const failures = [];

  logTitle(checkOnly ? "HyperFrames config check" : "HyperFrames first-run setup");

  const nodeVersion = await runVersion("node", ["--version"]);
  const npmVersion = await runVersion("npm", ["--version"]);
  printVersion("Node", nodeVersion, failures);
  printVersion("npm", npmVersion, failures);

  const pythonCandidates = await collectPythonCandidates();
  const python = selectPythonCandidate(pythonCandidates);
  if (python) {
    console.log(`OK Python: ${python.command} (${python.version.trim()})`);
  } else {
    failures.push(
      `Python 3.12, 3.11, or 3.10 is required for the Kokoro TTS venv. Found: ${formatPythonCandidates(pythonCandidates)}`
    );
  }

  const branding = await checkBranding(rootDir);
  if (branding.ok) {
    console.log("OK Branding: required profile fields and assets are present");
  } else {
    failures.push(...branding.errors);
  }

  if (!(await pathExists(path.join(rootDir, "requirements-tts.txt")))) {
    failures.push("requirements-tts.txt is missing");
  }

  if (failures.length) {
    fail(failures);
  }

  await runChecked("Theme validation", "node", [
    "scripts/validate-generation-logic.mjs",
    "--themes-only"
  ], { cwd: rootDir });

  if (checkOnly) {
    console.log("\nConfig check passed. Run `npm run setup` to install first-run dependencies.");
    return;
  }

  await runChecked("HyperFrames CLI", "npx", [
    "--yes",
    `hyperframes@${HYPERFRAMES_VERSION}`,
    "--version"
  ], { cwd: rootDir });

  const venvDir = path.join(rootDir, ".cache", "kokoro-zh-venv");
  await mkdir(path.dirname(venvDir), { recursive: true });
  if (!(await pathExists(path.join(venvDir, "bin", "python")))) {
    await runChecked("Create Kokoro Python venv", python.command, ["-m", "venv", venvDir], {
      cwd: rootDir
    });
  } else {
    console.log("OK Kokoro Python venv: .cache/kokoro-zh-venv");
  }

  const venvPython = path.join(venvDir, "bin", "python");
  await runChecked("Bootstrap pip", venvPython, ["-m", "ensurepip", "--upgrade"], {
    cwd: rootDir
  });
  await runChecked("Upgrade pip", venvPython, ["-m", "pip", "install", "--upgrade", "pip"], {
    cwd: rootDir
  });
  await runChecked("Install TTS Python dependencies", venvPython, [
    "-m",
    "pip",
    "install",
    "-r",
    "requirements-tts.txt"
  ], { cwd: rootDir });

  await verifyPythonImports(venvPython, rootDir);

  console.log("\nSetup complete.");
  console.log("Next: use `$hyperframes-article-video` on a Markdown article, or run:");
  console.log("  npm run validate:themes");
}

async function verifyPythonImports(venvPython, cwd) {
  const code = PYTHON_IMPORTS.map((name) => `import ${name}`).join("; ");
  await runChecked("Verify TTS Python imports", venvPython, ["-c", code], { cwd });
}

async function collectPythonCandidates() {
  const candidates = [];
  for (const command of PYTHON_COMMANDS) {
    const version = await runVersion(command, ["--version"]);
    if (version) candidates.push({ command, version });
  }
  return candidates;
}

async function runVersion(command, args) {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, { timeout: 15000 });
    return `${stdout}${stderr}`.trim();
  } catch {
    return null;
  }
}

function printVersion(label, version, failures) {
  if (version) {
    console.log(`OK ${label}: ${version.trim()}`);
  } else {
    failures.push(`${label} is required but was not found on PATH`);
  }
}

async function runChecked(label, command, args, options) {
  process.stdout.write(`\n${label}...\n`);
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      ...options,
      maxBuffer: 1024 * 1024 * 20
    });
    const output = `${stdout}${stderr}`.trim();
    if (output) console.log(output);
    console.log(`OK ${label}`);
  } catch (error) {
    const output = `${error.stdout || ""}${error.stderr || ""}`.trim();
    if (output) console.error(output);
    throw new Error(`${label} failed`);
  }
}

function parsePythonVersion(version) {
  const match = /Python\s+(\d+\.\d+)/.exec(version || "");
  return match ? match[1] : null;
}

function formatPythonCandidates(candidates) {
  if (!candidates.length) return "none";
  return candidates.map((candidate) => `${candidate.command} (${candidate.version.trim()})`).join(", ");
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function logTitle(title) {
  console.log(title);
  console.log("=".repeat(title.length));
}

function fail(errors) {
  console.error("\nSetup cannot continue:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  main().catch((error) => {
    console.error(`\n${error.message}`);
    process.exit(1);
  });
}
