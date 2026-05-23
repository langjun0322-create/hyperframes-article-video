# Article Analysis Rules

Analyze the whole source article before choosing scenes, but preserve the author's order by default. The goal is not to rewrite the article into a new argument. The goal is to map the article's existing structure into video scenes, classify each source section, and compress each section into narration plus an appropriate visual composition.

## Source Inputs

The source article can arrive in three forms:

- **Obsidian Web Clipper Markdown**: use the clipped Markdown as the source article. Keep its frontmatter, source URL fields, highlights, quotes, local image links, and clipped body structure as evidence.
- **Normal Markdown**: use the Markdown as the source article. Keep headings, links, images, tables, code blocks, and quoted text.
- **Readable URL**: read the page or linked document, remove page chrome, and summarize only verifiable body content into `article-breakdown.md#Source` before choosing scenes.

Do not create a required `source.md` file. The `## Source` section in `article-breakdown.md` is the audit trail for what was read, what was summarized, and which source images were adopted.

## URL Normalization

When the user provides a URL instead of a Markdown file:

1. Capture the page title, source URL, author/date when available, and access limitations.
2. Remove navigation, ads, comments, cookie banners, related-post blocks, social widgets, footer text, and repeated page furniture.
3. Convert the remaining readable content into a structured article source with headings, paragraphs, lists, tables, code blocks, quotes, and links where they carry evidence.
4. Preserve technical strings exactly: product names, version numbers, commands, config keys, API parameters, error text, metrics, dates, and named entities.
5. Summarize prose for clarity, but keep enough source detail for every later scene to have an auditable `source_excerpt`.
6. If the URL is login-gated, mostly video/audio, empty, or too thin to support a video, record the limitation and ask for a Markdown/source export instead of inventing missing content.

The normalized URL article does not need to be a separate file. It can live directly under `article-breakdown.md#Source`.

## Source Image Selection

Images can become source evidence when they explain the article. Adopt only images that materially support a point the video will make:

- Use screenshots, charts, diagrams, product UI, workflow images, maps, before/after visuals, and other content-bearing images.
- Exclude logos, avatars, decorative art, ads, social share images, recommendation thumbnails, unrelated stock images, and generic hero images unless the article specifically discusses them.
- Prefer local image links already present in Obsidian Web Clipper Markdown or normal Markdown.
- For URL sources, use an image only when it is reliably accessible, attributable to the page, and relevant to a specific scene.
- Record adopted images in `article-breakdown.md#Source` with an image id, path or source URL, caption, and why it matters.

Source images are not theme backgrounds. They are scene evidence and should use `image_evidence` when the image is the main point of a scene.

## Article-Preserved Breakdown

Default to the article's authored structure:

- Keep source sections in their original order.
- Treat headings, paragraph groups, lists, tables, code blocks, quotes, and image groups as scene candidates.
- Create one video hook from the title, opening, strongest contrast, or clearest promise of the article.
- After the hook, do not reorder evidence across source sections unless the user explicitly asks for a rewritten video narrative.
- Merge adjacent short sections only when they are clearly part of the same idea.
- Split one long section only when it contains distinct visual units, such as a paragraph plus a table, a step list plus code, or text plus an explanatory image.
- Preserve the source's intended progression even when another order might be more dramatic.

Each body scene should answer: "What does this source section do in the article, what content type expresses it, and what layout makes that evidence readable?"

## Scene Model

Each body scene must contain:

```json
{
  "id": "scene-01",
  "card_type": "summary",
  "layout_mode": "structured_cards",
  "layout_template": "tech-signal.summary.evidence-ladder",
  "animation": "evidence_ladder_reveal",
  "title": "核心变化一句话",
  "narration": "这篇文章的重点，是把一个复杂变化压缩成观众能立刻理解的结论。画面里的卡片负责展开证据和关键细节。",
  "visual_text": {
    "headline": "核心结论",
    "supporting_copy": "用文章里的证据、数字和关键术语支撑这个结论。"
  },
  "visual_payload": {},
  "source_excerpt": "Paste the exact article evidence that supports this scene."
}
```

`narration` is the spoken script and should usually be 2-3 natural short sentences. It should summarize the current source section without pulling in later evidence. `visual_text` and `visual_payload` are the screen script: they can carry the fuller headline, labels, chips, metrics, code strings, and evidence lines from the same source section that would be too dense to read aloud.

`animation` is not invented during analysis. Select it from `themes/<theme>/theme.json.animation_map[card_type]`.

## Card Type Selection

| Source section signal | Card type | Use when |
| --- | --- | --- |
| Main title, surprising opening, release framing | `hook` | The video needs a first-view reason to watch. |
| A section's central point or short explanatory passage | `summary` | The source section mainly states or explains one idea. |
| A section with feature/fix groups, highlights, or noteworthy points | `key_points` | The source section has 3-5 parallel items. |
| A section with setup, pairing, commands, or operational process | `steps` | The source section is ordered and procedural. |
| A section with counts, timing, retries, before/after, or performance | `metrics` | Numbers or measurable evidence matter in that section. |
| A section with commands, errors, config keys, or API params | `code_log` | Technical strings from that section should be visible, not narrated. |
| A section explaining product chain, provider flow, or module relationships | `architecture` | Named components form a system or pipeline. |
| A section contrasting before/after or old/new behavior | `comparison` | The source section itself makes a contrast. |
| A section about bugs, false alarms, validation failures, risks, or limits | `warning` | The source section warns about a failure mode or constraint. |
| Screenshot, diagram, chart, product UI, or other source image | `image_evidence` | One source image is the clearest evidence for that source section. |
| The article's final recommendation, takeaway, or closing action | `conclusion` | The source's ending closes the article body. |

## Layout Mode Selection

Choose `card_type` first, then choose the layout that fits that section's material. Never rearrange the article merely to obtain a preferred layout.

| Source material shape | `layout_mode` |
| --- | --- |
| Short thesis, strong ending, or clear title moment | `open_title` |
| Multiple points, steps, explanations, or notes | `structured_cards` |
| One source image is itself the evidence | `media_focus` |
| One source image needs nearby interpretation | `split_media_text` |
| Numbers or measurable results | `metric_board` |
| Commands, errors, logs, or configuration | `terminal_panel` |
| System relationships or flow | `diagram_flow` |
| Explicit before/after or two-sided contrast | `comparison_board` |
| A source quotation is the focal evidence | `quote_focus` |

## Analysis Procedure

1. Read or collect the full source article once and identify its authored structure: title, opening, headings, paragraph groups, lists, tables, code blocks, quotes, and images. For URLs, first normalize the readable page content into `article-breakdown.md#Source`.
2. Extract one video hook from the title, opening, strongest contrast, or clearest promise. This hook may compress the article's premise, but it must not change the order of the remaining body scenes.
3. Walk the article in order and mark scene candidates. Use the author's sections as the default boundaries.
4. Merge adjacent short candidates when they express one idea. Split a long candidate when it contains separate visual units. Do not move later evidence earlier just to make a stronger argument.
5. Classify each candidate by information shape: summary, key points, steps, metrics, code log, architecture, comparison, warning, quote, image evidence, or conclusion.
6. Choose `layout_mode` from the current section's density and material shape, then select a theme layout registered with that same mode.
7. Keep only one main idea per scene, and make that idea match the source section's role in the article.
8. Preserve technical strings exactly in `visual_payload`: commands, error messages, config keys, provider names, channel names, counts, and timings.
9. Consider source images at the point where they appear in the article. Add an `image_evidence` scene only when one image carries information that would be weaker as text alone.
10. Use `source_excerpt` to make every scene traceable to the source section, URL-normalized content, or the adopted source image record.
11. Treat `tech-signal`, `soft-signal`, `folk-frequency`, and `clear-code` as deterministic themes: choose only registered backgrounds, layouts, card types, and animations from `theme.json`; never invent per-article theme assets or fixed body copy.
