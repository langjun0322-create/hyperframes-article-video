# Article Breakdown Rules

`article-breakdown.md` is the required analysis and generation prompt for every article video project. It is not a scratch file. Keep it in the output project so the article decisions, scene choices, and final video can be audited together.

Newly generated documents must declare `breakdown_schema: 2` immediately after `# Article Breakdown`. Existing documents without this field remain legacy-compatible.

## Purpose

The document must answer the full video plan in one place:

- what source was read: Web Clipper Markdown, normal Markdown, or URL
- what the article is saying
- what URL content was normalized when the source was a link
- which source images are useful evidence
- how the article's authored sections map to video scenes
- what each scene says aloud
- what each scene shows on screen
- which theme layout, background, and animation each scene uses
- which source excerpt supports each scene

Do not create a separate "full article analysis" document. The breakdown document is the analysis. Do not require a separate `source.md`; Web Clipper Markdown and normal Markdown are source articles directly, and URL summaries live in this document.

## Required Sections

Use this exact section order:

1. `# Article Breakdown` followed by `breakdown_schema: 2`
2. `## Source`
3. `## Article Profile`
4. `## Style Selection`
5. `## Scene Count Reasoning`
6. `## Fixed Scenes`
7. `## Body Scenes`
8. `## Narration Script`
9. `## Build Notes`

## Source

Record the source before analysis. Use concise fields, then add the normalized source material or source note summary needed to audit the scenes.

Include these fields when available:

- `input_type`: `obsidian_web_clipper_markdown`, `markdown`, or `url`.
- `source_path`: local Markdown path when the input is a file.
- `source_url`: original URL from the user, frontmatter, Web Clipper metadata, or page source.
- `web_clipper`: `true` when the Markdown appears to be an Obsidian Web Clipper note.
- `title`
- `author`
- `published_at`
- `captured_at`
- `extraction_notes`: missing content, login gates, paywalls, media download limits, or other reliability notes.

For Web Clipper Markdown, keep the note's existing frontmatter, source fields, clipped headings, image links, highlights, quotes, and body structure as the source article. Do not require a fixed Web Clipper template.

For URL input, include a `### Formatted Source Article` subsection that summarizes the readable page content into article form. Remove navigation, ads, comments, cookie banners, related links, and repeated page furniture. Preserve technical strings, numbers, names, dates, commands, and links that later scenes may cite.

If useful source images exist, include a `### Adopted Source Images` subsection. Each adopted image needs:

```yaml
image_id: image-01
path_or_url: "assets/source-media/image-01.png"
caption: "Short factual caption."
why_relevant: "What article point this image supports."
source_section: "Heading, paragraph, figure, or page area where it appeared."
```

Also list rejected media briefly when the distinction matters, such as logos, avatars, ads, decorative art, social share images, and recommendation thumbnails.

## Article Profile

Include these fields:

- `title`
- `article_type`
- `hook_candidate`
- `target_audience`
- `content_rhythm`
- `primary_evidence`
- `viewer_takeaway`

Use prose after the fields only when it clarifies the article's existing structure. Do not rewrite the article into a new thesis if the source is already carefully arranged.

## Style Selection

Record the chosen theme before generating the video:

- `theme`
- `style_preset`
- `visual_tone`
- `background_family`
- `logo_intro`
- `follow_outro`

Default to `tech-signal` if the user does not choose a style. Logo intro and Follow outro are fixed structural scenes in the same timeline, not later append steps. They must use the same selected theme as the body scenes.

Use `folk-frequency` when the article benefits from a handcrafted, cultural, event-like, lifestyle, personal brand, or warm editorial treatment. Its scene choices still come from `themes/folk-frequency/theme.json`; do not invent folk-specific card names outside that contract.

For every theme, `background_preset` is a deterministic preset, not a free-form image prompt. For `tech-signal`, choose from `dark_grid`, `data_stream`, `orbital_signal`, `neural_map`, `terminal_glow`, and `blueprint`. For `soft-signal`, choose from `warm_paper`, `soft_blobs`, `botanical_signal`, `editorial_arch`, `signal_blocks`, and `soft_grid`. Use the theme's registered `asset_registry.elements` only when the chosen layout calls for them.

## Scene Count Reasoning

Explain how the chosen body scenes follow the article's authored structure. Reference original headings, paragraph groups, tables, images, code blocks, and section order.

Scene count follows the source structure, not a fixed target. Use as many body scenes as the article naturally needs. Merge adjacent short sections when they express the same idea. Split a long section when it contains separate visual units, such as text plus a table, a step list plus code, or a paragraph plus an explanatory image.

Only the opening video hook may compress the article's overall promise. After the hook, preserve the source order. Do not move evidence across sections unless the user explicitly asks for a rewritten video narrative.

Logo intro and Follow outro do not count as body scenes.

## Fixed Scenes

Use this format:

```yaml
logo_intro:
  source: fixed_branding_asset
  theme_component: themes/<theme>/components/logo-intro.html
  duration_target: 3s
  narration: none
  style_note: uses selected theme, clean background, fixed logo assembly animation
follow_outro:
  source: fixed_branding_asset
  theme_component: themes/<theme>/components/follow-outro.html
  duration_target: 4.5s
  narration: none
  style_note: uses selected theme, fixed avatar/card/button-follow animation
```

Do not put article-specific body content into fixed scenes.

## Body Scene Schema

Each body scene must be written as a Markdown subsection with a YAML block. Use this exact field set:

```yaml
scene_id: scene-01
scene_role: hook
source_section: "article title and opening, in original order"
core_message: "The key idea this source section communicates."
narration: "2-3 natural short spoken sentences that summarize this source section without pulling in later evidence."
visual_text:
  headline: "Text shown prominently on screen."
  supporting_copy: "Short on-screen explanation."
  labels:
    - "chip or section label"
visual_payload:
  items: []
card_type: hook
layout_mode: open_title
layout_template: tech-signal.hook.orbital-proof-chips
background_preset: orbital_signal
animation: orbital_thesis_reveal
duration_target: 5.5s
source_excerpt: "Exact or lightly trimmed article evidence."
```

`narration` and `visual_text` must not be duplicates. Narration is what the voice says. `visual_text` and `visual_payload` are what the viewer reads.

For an image evidence scene, use this `visual_payload` shape:

```yaml
visual_payload:
  image_id: image-01
  image_path: assets/source-media/image-01.png
  alt: "Accessible description of the source image."
  caption: "Short factual caption shown near the image."
  why_relevant: "Why this image supports the scene's core message."
  source_section: "Where the image appeared in the source article."
card_type: image_evidence
layout_mode: media_focus
layout_template: tech-signal.image_evidence.media-focus
background_preset: dark_grid
animation: source_image_reveal
```

Use exactly one main image per `image_evidence` scene. If multiple source images matter, create separate scenes or choose the one that carries the clearest evidence.

## Field Rules

- `scene_id`: Use stable sequential IDs, such as `scene-01`, in the same order as the source article after the opening hook.
- `scene_role`: Use a semantic role such as hook, section_summary, list, comparison, evidence, command, architecture, steps, image_evidence, warning, or conclusion.
- `source_section`: Name the original article heading, paragraph group, table, code block, quote, or image position that supports the scene. Include enough wording to show its original place in the article.
- `core_message`: One sentence explaining what this source section contributes to the article.
- `narration`: 2-3 short spoken sentences. Summarize the current source section and mention 1-2 key visual points from that section. Keep code, config, and long lists out of narration. Do not pull in later sections.
- `visual_text`: Human-readable on-screen copy. It may include labels, chips, panel titles, and section names.
- `visual_payload`: Structured data used by the selected card. It must satisfy `theme.json.card_templates[card_type]`.
- `card_type`: Must exist in `theme.json.card_templates`. It identifies the information type, not whether the scene must show a card-shaped container.
- `layout_mode`: Required in schema v2. It identifies the composition type and must match the selected theme layout.
- `layout_template`: Must exist in `theme.json.layout_templates[card_type]` and declare the selected `layout_mode`.
- `background_preset`: Must exist in `theme.json.background_presets`.
- `animation`: Must match `theme.json.animation_map[card_type]`.
- `duration_target`: Estimate from scene complexity and narration length.
- `source_excerpt`: Keep technical strings, commands, numbers, and product names exact.
  For `image_evidence`, `source_excerpt` should cite the adopted image record plus the nearby article text that explains it.

## Card Type Mapping

Choose card types from the article evidence:

- `hook`: article title, opening, release framing, strongest contrast, or clearest promise.
- `summary`: the current source section mainly states or explains one idea.
- `comparison`: the current source section contrasts before/after or old/new behavior.
- `key_points`: the current source section has 3-5 peer highlights or fix groups.
- `metrics`: the current source section contains numbers, counts, timings, retries, ratios, or measurable proof.
- `code_log`: the current source section contains commands, config keys, errors, status enums, or API params.
- `architecture`: the current source section explains system flow, product chain, provider/channel relationships, or module relationships.
- `steps`: the current source section is setup, upgrade, checklist, or operational order.
- `warning`: the current source section explains a failure mode, risk, constraint, false alarm, or validation issue.
- `quote`: the current source section contains a short quote that carries narrative weight.
- `image_evidence`: one source screenshot, chart, diagram, product image, or other information-bearing image is the clearest evidence for the current source section.
- `conclusion`: the article's final recommendation, takeaway, or viewer action.

## Layout Mode Mapping

- `open_title`: a short headline, thesis, or ending displayed without a prominent card wrapper.
- `structured_cards`: several points, steps, or explanatory modules.
- `media_focus`: one source image is the central evidence with compact captioning.
- `split_media_text`: one source image shares the scene with interpretation text.
- `metric_board`: measurements, results, or numeric evidence.
- `terminal_panel`: commands, logs, configurations, or technical strings.
- `diagram_flow`: systems, architecture, dependencies, or ordered relationships.
- `comparison_board`: explicit before/after or left/right evidence.
- `quote_focus`: a quotation or statement is the primary evidence.

## Narration Script

After body scenes, include a single `## Narration Script` section that lists only the body scene narrations in order. Each item may contain 2-3 short spoken sentences for that scene. This is the source for TTS. Logo intro and Follow outro remain silent unless the user explicitly asks otherwise.

This section is the voice document. Do not create a second permanent voice script file. The build may temporarily extract it, synthesize audio, and produce alignment data, but the final project should keep the voice source here and embed the generated timecodes in `index.html`.

## Build Notes

Include any implementation notes needed to generate the video from the breakdown:

- TTS voice choice or fallback.
- Audio timing method: `continuous_kokoro_timecode`, `hyperframes_transcribe`, or `continuous_measured_scene_duration`.
- Any intentional lead-in, hold buffer, or silence around scenes.
  Do not add artificial scene gaps for timing convenience; call out any deliberate pause explicitly.
- Any self-contained packaging request.
- Any article media that should or should not be used.
- Any source image copied into `assets/source-media/`, including the original Markdown path or URL.
- Any deliberate omission from the article and why.

## Validation Checklist

Before generating HTML, confirm:

- The document includes article analysis and scene breakdown together.
- `## Source` records the input type, source path or URL, and Web Clipper status when relevant.
- New breakdowns declare `breakdown_schema: 2`.
- URL inputs include enough formatted source material to audit the scene plan.
- Adopted source images have captions, relevance notes, and source sections.
- Body scenes preserve the source order after the opening hook.
- Scene count follows source structure; any merge or split is explained in Scene Count Reasoning.
- Every scene has the required fields.
- Every body scene is supported by `source_excerpt` from its own source section, not from a later unrelated section.
- Every schema v2 scene chooses `card_type`, `layout_mode`, `layout_template`, `background_preset`, and `animation`, and its template mode matches its scene mode.
- `image_evidence` scenes use one main source image, not a collage, and the image is treated as evidence rather than a background.
- `visual_text` and `visual_payload` are richer than narration.
- The final video timeline uses audio-derived `scene_timecodes`, not only `duration_target`.
- Chinese narration is generated as one continuous speech track by default; `scene_timecodes[].voice_start` should be adjacent to the previous `voice_end` unless a pause was intentionally requested.
- Fixed Logo and Follow scenes are in the complete timeline but do not contain article body content.
- HTML generation uses the chosen theme's registered layout structure and demo/component patterns, not one-off inline layouts that merely pass lint.
- Follow outro uses the theme component structure and fixed button state animation. If a late-start sub-composition cannot receive local time, embed a fixed component instance in the parent timeline and let the parent drive only that fixed component instance.
- For Clear-Code style generation, remove theme-name marks from video content, reuse the fixed J/E plus triangle logo animation without an outer ring, reveal body content in sequence, and use compact title treatment plus a lower body region when a Chinese headline is long enough to wrap into the card area.
- `data-layout-ignore` is not used on text, cards, scene wrappers, Logo content, Follow content, or any other readable layout. Only decorative `aria-hidden="true"` nodes may use it.
- All local `src`, `href`, `url()`, and `data-composition-src` paths resolve inside the output project.
- The output project passes `node scripts/validate-generation-logic.mjs --project <output-project>`.
- The final render is `renders/final.mp4`; do not produce `final.mov`.
