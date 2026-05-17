# Folk Frequency Theme

Folk Frequency is a handcrafted folk-poster video theme for cultural, lifestyle, event, personal brand, and warm editorial article videos.

The theme uses fixed reusable assets in `assets/`. Background presets provide only paper, outer border, corner ornaments, and edge decoration. Cards, titles, image frames, steps, quote panels, and metrics are rendered as HTML/CSS inside the safe area so each article can choose its own layout. Do not generate per-article raster imagery for this theme unless the user explicitly asks for one-off custom artwork.

## Style

- Warm cream paper base with subtle grain.
- Distressed ink and block-print texture.
- Indigo, coral, sunflower, forest green, terracotta, and deep charcoal.
- Full-page folk poster backgrounds with clean central safe areas, outer borders, and edge ornaments.
- Avoid dense tiny repeated patterns behind text.

## Background Presets

- `floral_fest`: `assets/backgrounds/floral-fest-bg.png`, for hooks and warm story scenes.
- `night_folk`: `assets/backgrounds/night-folk-bg.png`, for quotes and dramatic focus.
- `sunshine_block`: `assets/backgrounds/sunshine-block-bg.png`, for positive results and metrics.
- `terracotta_print`: `assets/backgrounds/terracotta-print-bg.png`, for warnings and deltas.
- `river_waves`: `assets/backgrounds/river-waves-bg.png`, for steps and process.
- `forest_floor`: `assets/backgrounds/forest-floor-bg.png`, for key points and grounded summaries.

## Asset Rules

- Use one registered 1920x1080 background preset as the primary visual layer for each scene.
- Background images must not contain fixed card slots, empty panels, title frames, hero-art frames, step cards, arrows, metric circles, or any readable text.
- Layout templates own all cards and information regions. If a scene needs a card or illustration, add it as an HTML/CSS component inside the safe area.
- `folk-paper-grain.png` and `folk-ink-distress.png` are subtle overlays only.
- Runtime ornaments must come from `theme.json.asset_registry.ornaments`, and should be limited to 0-2 small accents per scene.
- `assets/references/folk-ornament-sheet.png` is a style and motif source only. Do not tile it or place it directly in generated HTML.
- Transparent PNG ornaments are secondary accents only. Do not use them to reconstruct the full-page border or fill the frame.
- SVG icons and borders are fallback-only; do not use them for the main visual style unless the PNG asset is unavailable.
- If a future Image 2 ornament is used at runtime, it must be a single transparent PNG element. A full sheet on an opaque background remains reference-only.
