# Article Breakdown Rules

`article-breakdown.md` is the required analysis and generation prompt for every article video project. It is not a scratch file. Keep it in the output project so the article decisions, scene choices, and final video can be audited together.

## Purpose

The document must answer the full video plan in one place:

- what the article is saying
- why it becomes this many scenes
- what each scene says aloud
- what each scene shows on screen
- which theme layout, background, and animation each scene uses
- which source excerpt supports each scene

Do not create a separate "full article analysis" document. The breakdown document is the analysis.

## Required Sections

Use this exact section order:

1. `# Article Breakdown`
2. `## Source`
3. `## Article Profile`
4. `## Style Selection`
5. `## Scene Count Reasoning`
6. `## Fixed Scenes`
7. `## Body Scenes`
8. `## Narration Script`
9. `## Build Notes`

## Article Profile

Include these fields:

- `title`
- `article_type`
- `core_claim`
- `target_audience`
- `content_rhythm`
- `primary_evidence`
- `viewer_takeaway`

Use prose after the fields only when it clarifies why the video should be cut a certain way.

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

Explain why the article needs the chosen number of body scenes. The reason should reference the article's shape, such as release hook, comparison table, feature groups, metrics, command snippets, architecture relationships, risks, or upgrade steps.

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
source_section: "article title and opening"
core_message: "The key idea this scene communicates."
narration: "2-3 natural short spoken sentences that introduce the headline, explain the core conclusion, and mention 1-2 key card points."
visual_text:
  headline: "Text shown prominently on screen."
  supporting_copy: "Short on-screen explanation."
  labels:
    - "chip or section label"
visual_payload:
  items: []
card_type: hook
layout_template: tech-signal.hook.orbital-proof-chips
background_preset: orbital_signal
animation: orbital_thesis_reveal
duration_target: 5.5s
source_excerpt: "Exact or lightly trimmed article evidence."
```

`narration` and `visual_text` must not be duplicates. Narration is what the voice says. `visual_text` and `visual_payload` are what the viewer reads.

## Field Rules

- `scene_id`: Use stable sequential IDs, such as `scene-01`.
- `scene_role`: Use a semantic role such as hook, claim, proof, comparison, evidence, command, architecture, steps, or conclusion.
- `source_section`: Name the article section or table that supports the scene.
- `core_message`: One sentence explaining why this scene exists.
- `narration`: 2-3 short spoken sentences. Cover the scene's headline meaning, core conclusion, and 1-2 key visual points. Keep code, config, and long lists out of narration.
- `visual_text`: Human-readable on-screen copy. It may include labels, chips, panel titles, and section names.
- `visual_payload`: Structured data used by the selected card. It must satisfy `theme.json.card_templates[card_type]`.
- `card_type`: Must exist in `theme.json.card_templates`.
- `layout_template`: Must exist in `theme.json.layout_templates[card_type]`.
- `background_preset`: Must exist in `theme.json.background_presets`.
- `animation`: Must match `theme.json.animation_map[card_type]`.
- `duration_target`: Estimate from scene complexity and narration length.
- `source_excerpt`: Keep technical strings, commands, numbers, and product names exact.

## Card Type Mapping

Choose card types from the article evidence:

- `hook`: article title, thesis, release framing, strong opening.
- `summary`: central claim or high-level conclusion.
- `comparison`: before/after table, old behavior vs new behavior.
- `key_points`: 3-5 peer highlights or fix groups.
- `metrics`: numbers, counts, timings, retries, ratios, measurable proof.
- `code_log`: commands, config keys, errors, status enums, API params.
- `architecture`: system flow, product chain, provider/channel relationships.
- `steps`: setup, upgrade, checklist, operational order.
- `warning`: failure mode, risk, constraint, false alarm, validation issue.
- `quote`: short source quote that carries narrative weight.
- `conclusion`: final recommendation and viewer action.

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
- Any deliberate omission from the article and why.

## Validation Checklist

Before generating HTML, confirm:

- The document includes article analysis and scene breakdown together.
- Every scene has the required fields.
- Every body scene is supported by `source_excerpt`.
- Every scene chooses `card_type`, `layout_template`, `background_preset`, and `animation`.
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
