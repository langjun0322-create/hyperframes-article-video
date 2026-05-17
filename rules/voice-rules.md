# Voice Rules

Narration is the spoken spine of the video. It should be complete enough to guide the viewer through the card sequence, while cards carry the dense details.

## Defaults

- Language: Chinese unless the source article is clearly another language.
- Voice: local Kokoro Chinese model `hexgrad/Kokoro-82M-v1.1-zh`, default voice `zf_001`, unless the user specifies another Chinese voice from that model.
- TTS command: `.cache/kokoro-zh-venv/bin/python scripts/kokoro-zh-tts.py --input <scene-json-or-text> --out assets/speech.wav --voice zf_001 --speed 1.5`.
- Timing default: generate one continuous `assets/speech.wav` from the ordered scene list. Do not insert artificial scene gaps unless the user explicitly asks for pauses.
- HyperFrames CLI `tts` is only the default for non-Chinese videos or when the user explicitly asks for a HyperFrames voice.
- Pace target: roughly 3 Chinese characters per second after TTS speed is applied.
- Logo intro: no narration.
- Logo intro duration: fixed 3s.
- Follow outro: visual-only unless the user explicitly asks for an outro voice line.

## Per-Scene Rules

- Write 2-3 short spoken sentences per body scene.
- Cover the headline meaning, the subtitle or core conclusion, and 1-2 important card points.
- Keep each sentence natural when read aloud; avoid long clauses chained with commas.
- Do not read code, config, commands, or long lists. Put those in `visual_payload`.
- Keep important numbers if they are the point of the scene.
- Prefer direct product language over vague commentary.
- Avoid "第一、第二、第三" unless the article is explicitly procedural.
- Time card entrances to the narration. If a scene says several card points aloud, each corresponding card should appear near the moment it is discussed, not all at once.
- For Clear-Code style body scenes, use a stable sequence: empty background, badge/title, subtitle, footer, then cards. Card containers may appear first; card inner text should then enter with a light opacity/y stagger. Do not show all card text before the scene animation starts.

## Length Guide

| Body scenes | Spoken length | Video body duration |
| --- | --- | --- |
| 4-5 | 240-420 Chinese chars | 45-75s |
| 6-7 | 360-620 Chinese chars | 70-105s |
| 8+ | 480-820 Chinese chars | 90s+ or split into a series |

## Output Handling

The `## Narration Script` section in `article-breakdown.md` is the voice document. It is the only long-lived script source for TTS.

Do not preserve a separate `voice-script.txt` in the final project. Temporary extracted scripts, transcript JSON, and alignment files may live in `.cache/voice/` while building, then should be deleted after successful render.

## Audio Timecode Rules

Video timing must come from the real synthesized audio, not from estimated scene duration.

1. Extract body scene narration lines from `article-breakdown.md#Narration Script`.
2. Generate one continuous `assets/speech.wav`.
3. Analyze the generated audio before finalizing `index.html`:
   - Prefer the Kokoro script's cumulative per-scene timecodes from continuous single-track generation.
   - Otherwise run `npx hyperframes transcribe assets/speech.wav --language zh --json` and map sentence timestamps back to scene IDs.
   - If transcription is unavailable, measure synthesized scene segment durations directly and mark the timing method as `continuous_measured_scene_duration`.
4. Create `scene_timecodes[]` with:
   - `scene_id`
   - `narration`
   - `voice_start`
   - `voice_end`
   - `voice_duration`
   - `scene_start`
   - `scene_duration`
5. Embed `scene_timecodes[]` in the JSON data block inside `index.html`.

`duration_target` from `article-breakdown.md` is only a planning hint. Once audio exists, the final HyperFrames `data-start` and `data-duration` values must be derived from `scene_timecodes[]`.

Logo intro is silent and keeps the theme component duration. Follow outro is silent unless the user explicitly asks for an outro voice line.

Do not create fixed `0.35s` or similar scene gaps just to make the timecode easier. Body scene boundaries should be adjacent in the narration track unless the article or user asks for a deliberate pause.
