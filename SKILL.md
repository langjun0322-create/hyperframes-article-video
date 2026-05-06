---
name: hyperframes-article-video
description: HyperFrames + TTS 文章转视频工作流。从 Obsidian 文章生成带配音的 1920×1080 解说视频，适用于 OpenClaw 更新发布、产品介绍等场景。
version: 2.0.0
---

# HyperFrames Article Video Generator

从 Markdown 文章 → 视频蓝图 → 配音脚本 → 卡片内容 → TTS 语音 → HTML+GSAP 动画 → MP4 视频的完整工作流。

---

## ⚠️ 核心变革（v2.0）

| 旧 | 新 |
|---|-----|
| 硬编码 4 场景 | **分析决定分幕** — 文章分析出几幕就几幕 |
| 配音 = 简化文章 | **配音 1 句/幕** + **卡片展示关键信息** |
| `/tmp/` 临时目录 | **永久目录** — `📝 素材库/[帖子名]/` |
| 背景固定 | **主题包选择** — 6 种背景预设选 1 |
| 过渡硬编码 | **按卡片类型自动匹配** |

---

## 前置要求

- **主题包**: `templates/themes/`（当前：`tech-signal`）
- **HyperFrames**: `npm install -g hyperframes`
- **TTS**: `edge-tts`（品牌声音：zh-CN-XiaoyiNeural「小艺-活泼」）
- **Emoji 字体**: `google-noto-emoji-color-fonts`
- **Whisper**: 用于获取配音时码（划分场景切换点）

---

## 完整工作流

```
文章 (.md)
   │
   ▼
┌─ Step 1: 分析文章 ────────────────────────────────────┐
│  ① 通读文章，划分段落                                  │
│  ② 每段映射卡片类型（hook/summary/key_points/...）      │
│  ③ 选 1 个背景（默认 bg_dark_grid）                    │
│  ④ 产出：视频蓝图 video-blueprint.yaml                  │
│                                                       │
│  ⭐ 规则文件：rules/analyze-rules.md                     │
└───────────────────────────────────────────────────────┘
   │
   ▼
┌─ Step 2: 写配音脚本 ──────────────────────────────────┐
│  ① 每幕只写 1 句                                       │
│  ② 保留 What/Why/How                                   │
│  ③ 数据 → 提炼最终结论                                  │
│  ④ 口语化，不念代码                                    │
│  ⑤ 产出：voice-script.txt                               │
│                                                       │
│  ⭐ 规则文件：rules/voice-rules.md                       │
└───────────────────────────────────────────────────────┘
   │
   ▼
┌─ Step 3: 准备卡片内容 ────────────────────────────────┐
│  ① 每张卡片至少展示一条关键信息                           │
│  ② 代码/配置 → 展示关键代码行                            │
│  ③ 数据/指标 → 展示最终数字                              │
│  ④ 步骤 → 展示 CLI 命令                                 │
│  ⑤ 产出：卡片内容数据（嵌入 index.html）                  │
│                                                       │
│  ⭐ 规则文件：rules/card-content-rules.md                  │
└───────────────────────────────────────────────────────┘
   │
   ▼
┌─ Step 4: 构建项目目录 ────────────────────────────────┐
│                                                       │
│  目录：📝 素材库/[帖子名]/                               │
│                                                       │
│  ├── video-blueprint.yaml  ← 分析蓝图                   │
│  ├── voice-script.txt     ← 配音稿                     │
│  ├── speech.wav           ← TTS 配音                   │
│  ├── index.html            ← GSAP 动画主页面             │
│  ├── hyperframes.json      ← 项目配置                   │
│  ├── package.json          ← 依赖                      │
│  ├── meta.json             ← 元数据                    │
│  ├── renders/              ← 渲染输出                    │
│  │   └── [帖子名]-video.mp4                             │
│  └── [帖子名].md           ← 原文章（链接引用）           │
│                                                       │
│  ⭐ 产出目录 = 永久保留，可回溯可重渲染                    │
└───────────────────────────────────────────────────────┘
   │
   ▼
┌─ Step 5: 生成 TTS ────────────────────────────────────┐
│                                                       │
│  edge-tts --voice zh-CN-XiaoyiNeural \                │
│    --text "$(cat voice-script.txt)" \                  │
│    --write-media speech.wav                            │
│                                                       │
│  ⚡ 同时生成 speech-fast.wav（1.15x 加速备用）            │
└───────────────────────────────────────────────────────┘
   │
   ▼
┌─ Step 6: Whisper 时码 ──────────────────────────────┐
│                                                       │
│  对 speech.wav 做语音识别 → 获得每句的时间戳             │
│  → 场景切换点：第 0s / 第 8s / 第 18s / 第 28s ...        │
└───────────────────────────────────────────────────────┘
   │
   ▼
┌─ Step 7: 构建 index.html ───────────────────────────┐
│                                                       │
│  ① 选主题包 → 取对应背景 CSS + 卡片模板 + 过渡预设       │
│  ② 按视频蓝图组合场景                                    │
│  ③ 卡片内容填充（代码/数据/表格）                         │
│  ④ GSAP timeline 按 Whisper 时码切场景                   │
└───────────────────────────────────────────────────────┘
   │
   ▼
┌─ Step 8: Lint + Render ────────────────────────────┐
│  cd 📝素材库/[帖子名]/ && npm run check && npm run render  │
└───────────────────────────────────────────────────────┘
```

---

## 主题包系统

### 选择方式

```
主人指定："帮我把这篇转成视频，用 tech-signal"
未指定 → 默认使用 tech-signal 主题
```

### 当前主题

| 主题 | 路径 | 状态 |
|------|------|------|
| **tech-signal** | `templates/themes/tech-signal/` | ✅ v1.0 |

### 主题包结构

```
templates/themes/tech-signal/
├── theme.json           ← 元数据 + 配色 + 背景预设 + 卡片过渡映射
├── backgrounds/         ← 6 种背景效果的 CSS/JS
├── cards/               ← 9 种卡片 HTML 模板
└── transitions/         ← GSAP 过渡预设
```

---

## 场景-卡片-过渡映射

### 9 种卡片类型

| 类型 | 用途 | 对应过渡 |
|------|------|---------|
| `hook` | 开头钩子/标题 | `hud_aperture_open` |
| `summary` | 核心摘要 | `data_sweep_reveal` |
| `key_points` | 要点列表 | `interface_stack_slide` |
| `steps` | 操作步骤 | `blueprint_draw_on` |
| `metrics` | 数据指标 | `metric_counter_pulse` |
| `code_log` | 代码展示 | `terminal_parse_in` |
| `architecture` | 系统架构 | `neural_node_morph` |
| `warning` | 问题预警 | `system_alert_shift` |
| `conclusion` | 收尾/CTA | `glass_panel_focus` |

### 卡片内容规则（关键！）

| 卡片 | 配音（说的） | 卡片展示（看的） |
|------|-----------|--------------|
| hook | 引起兴趣 | 标题 + 版本号 |
| summary | 一句结论 | 关键数字 / 对比 |
| key_points | 概览 | 3-5 个要点卡片 |
| steps | 操作指引 | **配置代码 + CLI 命令** |
| metrics | 数据结论 | **最终数字 + 对比** |
| code_log | 说明 | **代码块 + 高亮** |
| architecture | 架构概述 | 层级/箭头/角色 |
| warning | 风险提醒 | 警告样式 + 要点 |
| conclusion | 行动号召 | **CLI 命令** |

---

## 前置规则参考

| 规则 | 路径 |
|------|------|
| 文章分析规则 | `rules/analyze-rules.md` |
| 配音写作规则 | `rules/voice-rules.md` |
| 卡片内容规则 | `rules/card-content-rules.md` |
| Logo & Follow Me 规则 | `rules/logo-follow-rules.md` |

---

## 使用示例

```bash
# 完整流程示例（以 v5.3 文章为例）

# 1. 读取文章
cat "📝 素材库/OpenClaw-v2026.5.3-发布.md"

# 2. 分析 → 产出 video-blueprint.yaml + voice-script.txt
#    （按 rules/analyze-rules.md + rules/voice-rules.md）

# 3. 建项目目录（素材库内永久存储）
mkdir -p "📝 素材库/OpenClaw-v2026.5.3-发布"
cp video-blueprint.yaml "📝 素材库/OpenClaw-v2026.5.3-发布/"
cp voice-script.txt "📝 素材库/OpenClaw-v2026.5.3-发布/"

# 4. 生成 TTS
edge-tts --voice zh-CN-XiaoyiNeural \
  --text "$(cat voice-script.txt)" \
  --write-media "speech.wav"
cp speech.wav "📝 素材库/OpenClaw-v2026.5.3-发布/"

# 5. Whisper 获取时码
#    （使用本地 whisper 或 hyperframes 内置 whisper）
whisper "speech.wav" --output_format json

# 6. 构建 index.html
#    - 取主题包 backgrounds/ + cards/ + transitions/
#    - 按 video-blueprint 组合场景
#    - 填充卡片内容
#    - GSAP 按 Whisper 时码切场景

# 7. 运行校验 + 渲染
cd "📝 素材库/OpenClaw-v2026.5.3-发布"
npm run check && npm run render
```

## 重要规则

1. 每个时间元素需要 `data-start`, `data-duration`, `data-track-index`
2. 有时间的元素必须加 `class="clip"`
3. GSAP timeline 必须 `{ paused: true }` 并注册到 `window.__timelines`
4. 音频用 `<audio>` 元素，不要用 `<video muted>`
5. 只有确定性逻辑 — 不用 `Date.now()`, `Math.random()`
6. 始终在渲染前运行 lint + validate
7. ⭐ CSS font-family 必须包含 emoji 字体回退：`'Noto Color Emoji', 'Apple Color Emoji'`
8. ⭐ TTS 统一使用品牌声音：`zh-CN-XiaoyiNeural`（小艺-活泼），用 `edge-tts` 生成
9. ⭐ **配音简化 ≠ 卡片空壳** — 配音一句话，卡片展示关键信息
10. ⭐ **项目目录永久化** — 所有产出放在 `📝 素材库/[帖子名]/`，不存 `/tmp/`

## 参考

- HyperFrames Docs: https://hyperframes.heygen.com/introduction
- LLMs index: https://hyperframes.heygen.com/llms.txt
- 主题包: `templates/themes/tech-signal/theme.json`
