#!/usr/bin/env python3
"""Generate Mandarin narration with Kokoro Chinese model.

This script keeps article-video TTS independent from HyperFrames CLI voices.
It supports a single text input or a JSON list/object of scene narrations and
prints measured timecodes as JSON so callers can embed them into index.html.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import numpy as np
import soundfile as sf
import torch
from kokoro import KModel, KPipeline


REPO_ID = "hexgrad/Kokoro-82M-v1.1-zh"
SAMPLE_RATE = 24000


def read_input(value: str) -> tuple[list[dict[str, str]], bool]:
    path = Path(value)
    raw = path.read_text(encoding="utf-8") if path.exists() else value
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return [{"scene_id": "speech", "narration": raw.strip()}], False

    if isinstance(data, list):
        scenes = data
    elif isinstance(data, dict):
        scenes = data.get("scenes") or data.get("scene_timecodes") or [data]
    else:
        raise SystemExit("JSON input must be an object or list")

    normalized: list[dict[str, str]] = []
    for index, scene in enumerate(scenes, 1):
        if not isinstance(scene, dict):
            raise SystemExit("Each scene item must be an object")
        scene_id = str(scene.get("scene_id") or scene.get("id") or f"scene-{index:02d}")
        text = str(scene.get("narration") or scene.get("text") or "").strip()
        if not text:
            raise SystemExit(f"Scene {scene_id} has no narration/text")
        normalized.append({"scene_id": scene_id, "narration": text})
    return normalized, True


def speed_for_phonemes(base_speed: float):
    def speed_callable(len_ps: int) -> float:
        # Kokoro zh can rush long Chinese passages; keep the official sample's
        # length-aware slowdown, then apply the user-facing base speed.
        speed = 1.0
        if len_ps > 183:
            speed = 0.80
        elif len_ps > 83:
            speed = 1 - (len_ps - 83) / 500
        return speed * base_speed

    return speed_callable


def build_pipelines() -> tuple[KPipeline, KPipeline]:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = KModel(repo_id=REPO_ID).to(device).eval()
    en_pipeline = KPipeline(lang_code="a", repo_id=REPO_ID, model=False)

    def en_callable(text: str) -> str:
        overrides = {
            "Kokoro": "kˈOkəɹO",
            "Obsidian": "əbˈsɪdiən",
            "GitHub": "ɡˈɪthʌb",
            "Community": "kəmjˈunᵻti",
        }
        if text in overrides:
            return overrides[text]
        return next(en_pipeline(text)).phonemes

    zh_pipeline = KPipeline(lang_code="z", repo_id=REPO_ID, model=model, en_callable=en_callable)
    return zh_pipeline, en_pipeline


def synthesize_scene(pipeline: KPipeline, text: str, voice: str, speed: float) -> np.ndarray:
    chunks: list[np.ndarray] = []
    for result in pipeline(text.strip(), voice=voice, speed=speed_for_phonemes(speed)):
        audio = np.asarray(result.audio, dtype=np.float32)
        chunks.append(audio)
    if not chunks:
        return np.zeros(1, dtype=np.float32)
    return np.concatenate(chunks)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Chinese narration with Kokoro v1.1 zh")
    parser.add_argument("--input", required=True, help="Text, text file, or JSON scenes file")
    parser.add_argument("--out", required=True, help="Output WAV path")
    parser.add_argument("--voice", default="zf_001", help="Kokoro zh voice id")
    parser.add_argument("--speed", type=float, default=1.5, help="Base speed multiplier")
    parser.add_argument("--gap", type=float, default=0.0, help="Optional silence between scene clips")
    parser.add_argument("--json-out", help="Optional path to write timing JSON")
    args = parser.parse_args()

    scenes, multi_scene = read_input(args.input)
    pipeline, _ = build_pipelines()
    gap = np.zeros(int(SAMPLE_RATE * args.gap), dtype=np.float32)
    wavs: list[np.ndarray] = []
    timecodes: list[dict[str, Any]] = []
    cursor = 0.0

    for index, scene in enumerate(scenes):
        if index:
            wavs.append(gap)
            cursor += args.gap
        audio = synthesize_scene(pipeline, scene["narration"], args.voice, args.speed)
        duration = len(audio) / SAMPLE_RATE
        start = cursor
        end = cursor + duration
        timecodes.append(
            {
                "scene_id": scene["scene_id"],
                "narration": scene["narration"],
                "voice_start": round(start, 3),
                "voice_end": round(end, 3),
                "voice_duration": round(duration, 3),
            }
        )
        wavs.append(audio)
        cursor = end

    combined = np.concatenate(wavs) if wavs else np.zeros(1, dtype=np.float32)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    sf.write(out, combined, SAMPLE_RATE)

    payload: dict[str, Any] = {
        "ok": True,
        "engine": "kokoro_zh_v1.1",
        "repo_id": REPO_ID,
        "voice": args.voice,
        "speed": args.speed,
        "gap": args.gap,
        "sample_rate": SAMPLE_RATE,
        "duration": round(len(combined) / SAMPLE_RATE, 3),
        "multi_scene": multi_scene,
        "timecodes": timecodes,
        "output": str(out),
    }
    if args.json_out:
        Path(args.json_out).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(payload, ensure_ascii=False))


if __name__ == "__main__":
    main()
