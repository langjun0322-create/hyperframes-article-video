# Generation Logic Validation

Use `scripts/validate-generation-logic.mjs` to verify that a generated video project follows the article-driven workflow.

## First-Run Setup

Run this once from the skill repository before generating a video:

```bash
npm run setup
```

To check branding and toolchain configuration without installing dependencies:

```bash
npm run check:config
```

## Theme Contract Check

Run from the skill repository:

```bash
node scripts/validate-generation-logic.mjs --themes-only
```

This confirms every theme declares the required card types, layout templates, background presets, registered assets, Logo/Follow components, deterministic scripts, and clean fixed-scene behavior.

## Project Check Before Render

Run after generating `article-breakdown.md`, `index.html`, HyperFrames project files, and `assets/speech.wav`, but before rendering:

```bash
node scripts/validate-generation-logic.mjs --project <output-project> --allow-unrendered
```

This catches missing scene fields, invalid theme preset choices, missing `scene_timecodes[]`, non-continuous voice gaps, forbidden process files, MOV output leaks, invalid `data-layout-ignore`, and Chinese Kokoro TTS metadata that does not match the default `zf_001` / speed `1.5` contract.

## Project Check After Render

Run after `npx hyperframes render --quality draft`:

```bash
node scripts/validate-generation-logic.mjs --project <output-project>
```

The post-render check requires `renders/final.mp4`. MOV is not part of the output contract.

## Visual Regression Checklist

Use snapshots or the HyperFrames preview before accepting a template update:

- Logo intro is 3s, uses the fixed segmented J/E plus triangle animation, and does not add an outer ring.
- Follow outro uses the theme component structure, starts hidden, and changes `Follow me` to `Following` once without flicker.
- Body scenes start empty, then reveal title/footer, subtitle, cards, and card text in sequence.
- Theme names such as `Clear Code`, `Tech Signal`, `Soft Signal`, or `Folk Frequency` do not appear in final video content.
- `tech-signal`, `soft-signal`, `folk-frequency`, and `clear-code` only use registered theme assets and deterministic transitions.
