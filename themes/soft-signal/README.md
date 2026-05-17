# Soft Signal Theme

Warm editorial theme for article-to-video projects that should feel softer than the default technical style. It is based on soft color blocks, warm paper texture, and subtle grain. Avoid decorative line systems by default.

| Preset | Use For | Components |
| --- | --- | --- |
| `warm_paper` | General explainers, tutorials, dense but calm information | warm gradient, subtle grain, paper texture |
| `soft_blobs` | Product intro, AI tools, workflow overview | organic blobs, soft gradients, subtle grain |
| `botanical_signal` | Human-centered stories, personal brand, intimate commentary | botanical color mood, organic shapes, soft grain |
| `editorial_arch` | Case studies, viewpoints, quote/cover scenes | arch composition, warm blob, editorial gradient |
| `signal_blocks` | AI agent, memory, automation, relationship mapping | layered soft blocks, no visible line clutter |
| `soft_grid` | Version update, technical breakdown, comparison, checklist | very subtle structure, color fields, paper texture |

## Palette

- `#FFF8EC` paper
- `#F4EBD8` warm paper
- `#252325` ink
- `#6F665B` secondary text
- `#A79C8D` muted line
- `#F5A623` gold
- `#8FAF8C` sage
- `#C4A3A3` rose
- `#D98C63` clay
- `#FF6A00` orange
- `#0A0A0A` black

## Usage

In `article-breakdown.md`, set:

```yaml
theme: soft-signal
style_preset: warm soft editorial
```

Then choose scene-level values from `theme.json`, for example:

```yaml
card_type: summary
layout_template: soft-signal.summary.paper-evidence-stack
background_preset: warm_paper
animation: soft_evidence_rise
```

Logo intro and Follow outro use fixed branding data, but their colors, typography, background, and motion come from this theme.

## Grain Overlay

Soft Signal includes a theme-level `ss-grain-overlay` inspired by HyperFrames' `grain-overlay` component. It is now a fixed static grain layer so repeated renders stay visually deterministic. Add it as the first child inside a scene background:

```html
<section class="ss-article-scene ss-bg-warm-paper">
  <div class="ss-grain-overlay" data-layout-ignore aria-hidden="true"></div>
  ...
</section>
```

Use `is-subtle` for Logo/Follow or dense technical scenes, and `is-strong` when a page needs more paper texture. Keep it behind content and avoid stacking multiple grain layers in the same scene. Do not add looping grain motion or random movement.
