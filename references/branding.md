# Branding Setup

Branding is fixed skill data. It should not be regenerated or copied into every video project by default.

## Fixed Files

- `assets/branding/logo.svg`: default logo asset.
- `assets/branding/brand-profile.json`: reusable text and social metadata.

Theme components read these values and render them in the current visual style.

For `tech-signal`, Logo and Follow components should reference the official HyperFrames catalog blocks:

- Logo intro follows the structure of `logo-outro`: 1920x1080 branding scene, logo assembly/glow, tagline, URL or handle pill.
- Follow outro follows the structure of `tiktok-follow`: profile/avatar card, display name, handle, Follow button, button press/confirmed motion.

Use the provided SVG from `assets/branding/logo.svg`; do not generate a new logo.

## First-Run Flow

When using this skill for the first time:

1. Check whether `assets/branding/logo.svg` is the user's real logo.
2. If not, ask the user to provide a logo file and replace it at `assets/branding/logo.svg` or add a raster logo such as `assets/branding/logo.png`.
3. Update `assets/branding/brand-profile.json` with:
   - `display_name`
   - `handle`
   - `url`
   - `logo_intro_text`
   - `follow_title`
   - `follow_subtitle`
   - `cta_text`
4. Keep these values stable across videos unless the user asks to change branding.

Do not create a new logo for each video. Do not rewrite Follow Me text per article unless the user asks for a campaign-specific CTA.

## Theme Relationship

Branding data supplies content. Theme components supply appearance.

Examples:

- `tech-signal` renders the logo with dark grid, cyan glow, glass panels, and precise interface motion.
- A future editorial theme may render the same logo and handle with paper texture, serif typography, and slower fades.

Only theme files should change visual style. `brand-profile.json` should remain reusable.
