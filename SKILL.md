---
name: hyperframes-article-video
description: Convert Markdown articles, Obsidian Web Clipper notes, or readable URLs into narrated HyperFrames explainer videos. Use when Codex needs to collect a source article, preserve its authored structure, map each source section into a concise spoken scene, choose a content type and layout mode for each scene, include relevant source images as executable evidence scenes, add theme-matched logo intro and follow outro from fixed branding assets, create TTS, and render/validate a minimal-output HTML video project.
---

# HyperFrames Article Video

Turn one source article into a narrated HyperFrames video. The source can be a Markdown article, an Obsidian Web Clipper Markdown note, or a readable URL. The skill owns the workflow from source collection and article-preserved scene mapping to final render, but keeps branding and theme assets reusable across videos.

## First-Run Setup

Before using this skill on a new machine, run `npm run setup` from this repository. It checks branding and toolchain configuration, installs the local Kokoro TTS Python dependencies into `.cache/kokoro-zh-venv`, verifies lightweight imports, and validates theme contracts without pre-downloading model weights.

## Output Contract

Create only the files needed to audit, preview, and render a video project:

- `article-breakdown.md`
- `index.html`
- `hyperframes.json`
- `package.json`
- `assets/speech.wav`
- `assets/source-media/*` when source images are used in scenes
- `compositions/*.html`
- `renders/final.mp4`

`article-breakdown.md` is a required long-lived output. It is the human-readable article analysis and the executable prompt for the video. Do not treat it as a temporary intermediate file.

New breakdowns use `breakdown_schema: 2`. In schema v2, every body scene declares both `card_type` for its information shape and `layout_mode` for its visual composition.

The final rendered video format is MP4 only. Do not produce or preserve `final.mov` unless the user explicitly changes the output contract in a later request.

Do not preserve `video-blueprint.yaml`, `voice-script.txt`, `voice-timecode.json`, or `timing.json` as long-lived output. Embed the article script, scene data, card payloads, and audio-derived timing data in `index.html` as a JSON data block. Temporary transcription, per-scene audio clips, or synthesis helper files may live in `.cache/` or a system temp directory and should be deleted after successful render.

Do not create a required `source.md` intermediate. Obsidian Web Clipper Markdown files and normal Markdown files are source articles directly. URL source material should be summarized and recorded in `article-breakdown.md`, not preserved as a separate mandatory output contract.

Do not copy the fixed logo into every project unless the user explicitly requests a self-contained package. Reference the skill branding asset by path.

## Fixed Branding

Read `assets/branding/brand-profile.json` before building Logo or Follow scenes. If the file has placeholder values, read `references/branding.md` and guide the user through the first-run replacement flow.

Branding data is fixed across videos:

- logo file
- display name
- social handle
- social URL
- Logo intro text
- Follow title/subtitle/CTA text

Visual style is not fixed. Logo intro and Follow outro must use the current theme's colors, typography, background language, components, and motion. Swapping themes should change only theme components and tokens, not brand text.

## Theme Selection

Default theme: `tech-signal`.

Available built-in themes:

- `tech-signal`: clean sci-fi editorial style for technical releases, AI systems, product analysis, and dense engineering content.
- `soft-signal`: warm paper, organic shapes, botanical linework, editorial arches, soft signal lines, and gentle grids for AI, lifestyle, tutorial, personal brand, and low-pressure explainer videos.
- `folk-frequency`: handcrafted folk poster style with warm cream paper, distressed ink, bold cultural colors, ornamental borders, and festival-like cards for cultural stories, lifestyle, events, personal brand, community content, and warm editorial videos.
- `clear-code`: warm, clear, human-centered editorial style with large serif titles, terracotta accents, fine line icons, and light utility cards for AI tools, workflows, tutorials, release notes, and practical explainers.

Read `themes/<theme>/theme.json` before writing any HyperFrames HTML. Use its:

- `design_tokens`
- `background_presets`
- `card_templates`
- `layout_templates`
- `animation_map`
- `branding_components`
- `asset_policy`

For `tech-signal`, `soft-signal`, `folk-frequency`, and `clear-code`, use fixed theme-level background presets, fixed safe areas, and registered element layers by default. Article generation must choose from `themes/<theme>/theme.json.background_presets`, `layout_templates`, `animation_map`, and `asset_registry`; do not search, generate, or invent background assets per article unless the user explicitly asks.

## Source Input

Prefer source inputs in this order:

1. **Obsidian Web Clipper Markdown**. Treat the clipped Markdown file as the source article. Preserve and use its frontmatter, original source URL fields, author/date metadata, Markdown image links, block quotes, highlights, and clipped body structure. Do not require a specific Web Clipper template.
2. **Normal Markdown article**. Treat the Markdown file as the source article. Use its headings, body text, local images, links, tables, and code blocks directly.
3. **Readable URL**. Read the page or linked document, remove navigation, ads, comments, social widgets, recommendations, and unrelated chrome, then summarize the verifiable body content into a structured article source inside `article-breakdown.md#Source`. Do not invent facts when the page is thin, login-gated, mostly video, or otherwise not extractable; record the limitation and ask for a better source if needed.

Obsidian CLI can be used as an optional helper to find or read vault notes, but it is not a hard dependency for this skill. A Web Clipper note path supplied by the user is enough.

## Source Images

Images from the source may become video evidence when they explain or support the article. Good candidates include screenshots, charts, diagrams, product UI, workflow images, maps, comparison visuals, and other content-bearing images. Exclude logos, avatars, ads, decorative dividers, social share images, recommendation thumbnails, and generic hero art unless the article explicitly discusses them.

If a Web Clipper or Markdown source already contains local image links, prefer those links and copy the chosen files into the generated project's `assets/source-media/` directory when the final HTML needs a project-local path. If a URL source contains useful images, use them only when they can be reliably accessed, attributed to the source, and copied into `assets/source-media/`.

Source images are article evidence, not theme backgrounds. They must not replace `background_preset` and must not be mixed into theme-level `asset_registry` assets. Use `image_evidence` scenes when a source image is the main information in a scene.

## Scene Layout Contract

Every body scene is determined by four decisions: the original `source_section`, the analyzed `card_type`, the selected `layout_mode`, and a registered theme `layout_template`. `card_type` does not require a visible card container; an open title page or a media-led page is valid when the source section calls for it.

Use only these `layout_mode` values: `open_title`, `structured_cards`, `media_focus`, `split_media_text`, `metric_board`, `terminal_panel`, `diagram_flow`, `comparison_board`, and `quote_focus`.

## Workflow

1. **Read or collect the source article and write `article-breakdown.md`**. For Web Clipper Markdown and normal Markdown, read the file directly as the source article. For a URL, collect the readable page content and summarize it into a structured article source in `article-breakdown.md#Source`. This single document is both the source-order analysis and the scene-by-scene generation prompt.
2. **Map the article's authored structure**. Identify the title, opening, headings, paragraph groups, lists, tables, code blocks, quotes, and source images. Create one video hook from the article's title, opening, strongest contrast, or clearest promise. After that hook, preserve the source order by default.
3. **Choose or confirm the style**. Default to `tech-signal` when the user does not specify a theme. Record the selected theme and style preset in `article-breakdown.md`.
4. **Build body scenes from source sections in order**. Merge adjacent short sections only when they are clearly one idea. Split a long section only when it contains distinct visual units. Do not move evidence across sections unless the user explicitly asks for a rewritten video narrative. For each source section, first classify `card_type`, then choose `layout_mode`, and finally select a matching registered `layout_template`. Each body scene must include:
   - `narration`: 2-3 natural short spoken sentences that summarize the current source section and mention 1-2 important card points from that section.
   - `visual_text`: the visible headline, labels, chips, and card copy. This is separate from narration and should be richer than the spoken line.
   - `visual_payload`: structured card content, dense enough to fill the selected layout without clutter.
   - `card_type`: one of `hook`, `summary`, `comparison`, `key_points`, `steps`, `metrics`, `code_log`, `architecture`, `warning`, `quote`, `image_evidence`, `conclusion`.
   - `layout_mode`: selected for the material shape; use `media_focus` or `split_media_text` for an `image_evidence` scene.
   - `layout_template`: selected from `themes/<theme>/theme.json.layout_templates[card_type]` and declared with the same `layout_mode`.
   - `background_preset`: selected from `themes/<theme>/theme.json.background_presets`.
   - `animation`: selected from `themes/<theme>/theme.json.animation_map[card_type]`.
   - `duration_target`: estimated visual duration before timing with audio.
   - `source_excerpt`: the article evidence used.
   For `image_evidence`, the scene must use exactly one source image as the main evidence and explain why it matters.
5. **Extract the voice document** from `article-breakdown.md`:
   - The `## Narration Script` section is the canonical voice document.
   - It must include body scene narrations in scene order.
   - Do not create a permanent `voice-script.txt`; temporary extraction may happen in `.cache/voice/`.
6. **Generate TTS from the voice document** with the local Kokoro Chinese model by default for Chinese videos: `hexgrad/Kokoro-82M-v1.1-zh`, voice `zf_001`, speed `1.5`, via `scripts/kokoro-zh-tts.py`. Generate one continuous `assets/speech.wav` from the ordered scene list; do not add fixed scene gaps unless the user asks for pauses. Use HyperFrames CLI TTS only for non-Chinese videos or when the user explicitly asks for a specific HyperFrames voice. Do not use macOS `say` as a silent fallback; if Kokoro is unavailable, fix or report the TTS environment and record any explicit fallback in `article-breakdown.md`.
7. **Analyze the real audio timecode before writing the final video timeline**:
   - Prefer the Kokoro script's cumulative per-scene timecodes from continuous single-track generation.
   - If another engine only returns one WAV without scene timecodes, run `npx hyperframes transcribe assets/speech.wav --language zh --json` when available, then map transcript sentence timestamps back to scene IDs.
   - If transcription is unavailable, measure synthesized scene segment durations directly and record that fallback in the embedded timing metadata.
   - `duration_target` is only a planning estimate. It must not be the final `data-duration` once audio exists.
8. **Derive scene timing from audio timecode**:
   - Logo intro keeps its fixed silent 3s duration.
   - Each body scene starts from the aligned narration start plus any deliberate visual lead-in.
   - Each body scene duration must cover its narration plus a small reading/hold buffer for the visual card.
   - Follow outro starts after the final body scene and remains visual-only unless the user requested outro narration.
9. **Generate one complete timeline from the aligned timing**:
   - Logo intro from the theme component.
   - Body scenes from `article-breakdown.md`.
   - Follow outro from the theme component structure.
   Logo and Follow are not post-production append steps. They are fixed structural scenes in the same `index.html` timeline and must use the same confirmed theme.
   Clear-Code and compatible themes should reuse the fixed segmented logo assembly animation: J/E outline-fill reveal plus the triangle play button scaling in place. Do not add a decorative outer ring around the logo unless the user explicitly requests it.
   Follow outro must reuse the theme component markup and animation contract. If a late-start child composition cannot receive local time from HyperFrames, embed a fixed component instance in the parent timeline and drive that instance from the parent; do not freehand a new Follow layout.
10. **Embed timing metadata into `index.html`**:
   - `voice_source`: `article-breakdown.md#Narration Script`
   - `speech_asset`: `assets/speech.wav`
   - `audio_duration`
   - `scene_timecodes[]` with `scene_id`, `narration`, `voice_start`, `voice_end`, `scene_start`, and `scene_duration`
11. **Build HyperFrames HTML** using the theme partials:
   - `themes/<theme>/partials/backgrounds.css`
   - `themes/<theme>/partials/cards.css`
   - `themes/<theme>/partials/transitions.js`
   - Start from the selected theme's component/demo structure for the matching `layout_template`; do not freehand a temporary page that only borrows CSS class names.
   - Do not use `data-layout-ignore` on readable text, cards, scene wrappers, Logo, or Follow content. It is only acceptable on decorative `aria-hidden="true"` nodes.
   - Keep all `src`, `href`, `url()`, and `data-composition-src` paths local and resolvable inside the output project.
   - Animate body scenes across the real narration duration. The default order is title and footer first, then subtitle/supporting copy, then cards or list items in sequence, then key numbers/tags. Do not front-load all card animation into the first second unless the scene narration is actually that short.
12. **Validate and render**:
   - `node scripts/validate-generation-logic.mjs --project <output-project> --allow-unrendered`
   - `npx hyperframes lint`
   - `npx hyperframes inspect --samples 15`
   - `npx hyperframes snapshot --at <times>` for several key frames before claiming the visual style is correct
   - `npx hyperframes render --quality draft`
   - `node scripts/validate-generation-logic.mjs --project <output-project>`

## Card Density Rules

The narration may be short; the card may not be empty.

- `key_points`: 3-5 items, each with a title and one detail.
- `metrics`: show at least one number, count, timing, ratio, or before/after comparison.
- `code_log`: show commands, config keys, errors, or quoted technical strings from the article.
- `steps`: show step labels plus concrete action/config/command text.
- `summary`: show the core conclusion plus 1-2 evidence points.
- `comparison`: show before/after or left/right evidence with named criteria.
- `architecture`: show named layers, arrows, and one role per layer.
- `image_evidence`: show one relevant source image, a concise caption, why it matters, and the source section it supports.

See `rules/card-content-rules.md` for full rules.

## HyperFrames Rules

- Every timed element needs `id`, `data-start`, `data-duration`, and `data-track-index`.
- Use `<audio>` for narration; never use video as audio.
- Timelines must be synchronous, paused, and registered in `window.__timelines`.
- Do not use runtime random APIs, clock-dependent values, or endless GSAP repeats.
- Build the final layout first, then animate from/to that layout.
- Keep Logo and Follow components theme-matched, not fixed-style overlays.

## Resource Map

- `references/branding.md`: first-run branding setup and fixed copy rules.
- `references/generation-validation.md`: validation commands for theme contracts and generated video projects.
- `rules/analyze-rules.md`: article-to-scene analysis.
- `rules/voice-rules.md`: narration length, Kokoro TTS, and audio timecode rules.
- `rules/card-content-rules.md`: visual payload density rules.
- `themes/tech-signal/theme.json`: default theme contract.
- `themes/tech-signal/components/logo-intro.html`: theme-matched logo intro.
- `themes/tech-signal/components/follow-outro.html`: theme-matched follow outro.
- `themes/tech-signal/partials/`: reusable CSS/JS for generated article scenes.
- `themes/soft-signal/theme.json`: warm soft theme contract.
- `themes/soft-signal/components/logo-intro.html`: soft theme logo intro.
- `themes/soft-signal/components/follow-outro.html`: soft theme follow outro.
- `themes/soft-signal/partials/`: warm paper, soft blob, botanical, arch, signal-block, and soft-grid CSS/JS.
- `themes/folk-frequency/theme.json`: handcrafted folk-poster theme contract.
- `themes/folk-frequency/components/logo-intro.html`: folk theme logo intro.
- `themes/folk-frequency/components/follow-outro.html`: folk theme follow outro.
- `themes/folk-frequency/partials/`: folk paper backgrounds, poster cards, and stamp-like transitions.
- `themes/folk-frequency/assets/asset-manifest.json`: fixed Image 2 theme assets and usage rules.
- `themes/clear-code/theme.json`: warm clear editorial theme contract.
- `themes/clear-code/components/logo-intro.html`: clear-code theme logo intro.
- `themes/clear-code/components/follow-outro.html`: clear-code theme follow outro.
- `themes/clear-code/partials/`: warm canvas backgrounds, clear utility cards, and calm deterministic transitions.
- `rules/article-breakdown-rules.md`: required `article-breakdown.md` structure and scene prompt fields.
