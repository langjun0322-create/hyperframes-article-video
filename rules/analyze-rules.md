# Article Analysis Rules

Analyze the whole article before choosing scenes. Do not mechanically turn every heading into one scene. The goal is to extract a watchable argument: hook, claim, proof, concrete details, and CTA.

## Scene Model

Each body scene must contain:

```json
{
  "id": "scene-01",
  "card_type": "summary",
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

`narration` is the spoken script and should usually be 2-3 natural short sentences. It should introduce the headline meaning, the core conclusion, and 1-2 card points. `visual_text` and `visual_payload` are the screen script: they can carry the fuller headline, labels, chips, metrics, code strings, and evidence lines that would be too dense to read aloud.

`animation` is not invented during analysis. Select it from `themes/<theme>/theme.json.animation_map[card_type]`.

## Card Type Selection

| Article signal | Card type | Use when |
| --- | --- | --- |
| Main title, surprising opening, release framing | `hook` | The video needs a first-view reason to watch. |
| Core claim, one-sentence conclusion | `summary` | The article gives a clear thesis or release headline. |
| Feature/fix groups, highlights, noteworthy points | `key_points` | There are 3-5 parallel items. |
| Setup, pairing, commands, operational process | `steps` | The viewer should understand an order of actions. |
| Counts, timing, retries, before/after, performance | `metrics` | Numbers or measurable evidence matter. |
| Commands, errors, config keys, API params | `code_log` | Technical strings should be visible, not narrated. |
| Product chain, provider flow, module relationships | `architecture` | Named components form a system or pipeline. |
| Before/after tables, old vs new behavior | `comparison` | The article contrasts prior pain with the new behavior. |
| Bugs, false alarms, validation failures, risks | `warning` | The article warns about a failure mode or constraint. |
| Upgrade recommendation, final action, no-breaking note | `conclusion` | The video closes the article body. |

## Analysis Procedure

1. Read the full article once and identify the thesis in one sentence.
2. Group evidence by viewer value: what changed, why it matters, what proof exists, what action follows.
3. Choose 5-8 body scenes for a normal article. Use 9 only when the article has enough distinct evidence groups, such as a release table plus commands and an upgrade guide. Add Logo intro and Follow outro separately.
4. Keep only one main idea per scene, but keep enough visible information to fill the card.
5. Preserve technical strings exactly in `visual_payload`: commands, error messages, config keys, provider names, channel names, counts, and timings.
6. Use `source_excerpt` to make every scene traceable to article text.
7. Treat `tech-signal`, `soft-signal`, `folk-frequency`, and `clear-code` as deterministic themes: choose only registered backgrounds, layouts, card types, and animations from `theme.json`; never invent per-article theme assets or fixed body copy.
