# Card Content Rules

Short narration does not mean sparse visuals. Every article body scene needs a complete source-grounded visual composition, but it does not need a visible card container.

Scenes should not all share one layout. Match the information shape:

- Use a hero + tilted proof chips for a release hook.
- Use a two-column proof board for summary scenes.
- Use radar, constellation, or stacked interface layouts for key-point scenes.
- Use metric walls for numbers.
- Use terminal shells for code and errors.
- Use node flows for architecture.
- Use one source image plus caption and evidence notes in `media_focus` or `split_media_text` for image evidence.
- Use confirmation rings or CTA panels for conclusions.

Themes decide how much content is open layout versus wrapped in cards. `folk-frequency` and `soft-signal` may place titles and short labels directly on the background safe area; use cards only for grouped information. `tech-signal` and `clear-code` can use stronger panels, but the visible text and payload must still come from the article breakdown, not from theme demo copy.

Use a few relevant emoji markers when they improve scanning, especially in labels and small chips. Do not turn the whole card into emoji decoration.

## Required Fields

Each `visual_payload` must include the fields required by its card template in `theme.json.card_templates`.

Use `visual_text` for the screen's human-readable copy: scene headline, short subtitle, labels, chip text, and card section names. Use `visual_payload` for structured content that templates render: item arrays, metrics, commands, before/after rows, nodes, and links. Do not make `visual_text` a duplicate of `narration`; the spoken line can be compact while the screen carries richer evidence.

Keep text from the article when it is a technical string, number, command, error, provider, channel, or product name. Summarize prose only when needed for fit.

Source images can be visible card content when they are evidence. Use only images that explain the article: screenshots, charts, diagrams, product UI, workflow images, maps, and before/after visuals. Do not use logos, avatars, ads, decorative dividers, social share images, recommendation thumbnails, or generic hero art unless the article specifically discusses them.

## Type Rules

### `hook`

- Show the article title or strongest framing.
- Add a subtitle that explains why the viewer should care.
- Include version/date if available.
- Do not show code or long lists.

### `summary`

- Show the core conclusion.
- Include 1-2 proof chips, numbers, or short evidence lines.
- Good for "30+ 修复项覆盖全链路".

### `key_points`

- Show 3-5 items.
- Each item needs a title plus one concrete detail.
- Avoid one-word bullets.

### `steps`

- Show ordered steps.
- Each step needs an action and a concrete config, command, setup code, or route when available.

### `metrics`

- Show final numbers prominently.
- Include labels and units.
- Use before/after or count cards when the article gives comparisons.

### `code_log`

- Show commands, errors, config keys, API params, or quoted strings exactly.
- Add a short label explaining why each string matters.
- Do not invent code.

### `architecture`

- Show named nodes and arrows.
- Each node needs a one-line role.
- Use this for product chains and multi-system relationships.

### `warning`

- Show the failure mode and the fix.
- Use warning styling, but keep the tone precise.

### `image_evidence`

- Show exactly one source image as the main evidence.
- Include a concise headline that says what the viewer should notice.
- Include a factual caption; do not use the image as decoration.
- Include `why_relevant` in `visual_payload` so the generator knows why this image deserves a scene.
- Include `source_section` or equivalent source location.
- Use local project paths in final HTML. If the source was a Web Clipper Markdown note with local images, copy the chosen image into `assets/source-media/` when needed.
- Keep the image inside the registered media layout. Do not turn it into a theme background or full-scene wallpaper.

### `conclusion`

- Show the action the viewer should take.
- Include compatibility or risk information when the article provides it.
- Keep Follow Me content out of this card; Follow Me is a separate theme component.

## Density Checklist

Before writing HTML, confirm:

- No body scene is visually empty or title-only unless it intentionally uses `open_title` for a short thesis or ending.
- Any scene with a number displays the number.
- Any scene about code/config displays the exact technical string.
- Any `key_points` scene has at least 3 real items.
- Any `image_evidence` scene has one main image, an alt description, a caption, and a relevance note.
- Source images are local and resolvable before they are used in HTML.
- Text volume fits the selected card template.
- Long headlines use the theme's compact title or lower-body layout rule so cards never overlap the title or subtitle.
