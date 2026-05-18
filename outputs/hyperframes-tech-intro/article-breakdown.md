# Article Breakdown

## Source

- source_title: "HyperFrames Article Video"
- source_type: "local repository README and project rules"
- source_path: "../../README.md"
- repository: "langjun0322-create/hyperframes-article-video"
- generation_goal: "Create a Chinese project-introduction explainer video in a technology style."

The GitHub URL supplied by the user could not be read from the remote page during this run, so this video uses the local repository content as the source of truth.

## Article Profile

- title: "HyperFrames Article Video: Markdown to Narrated Tech Explainer"
- article_type: "project introduction"
- core_claim: "This repository is a reusable video-generation skill pack that turns Markdown articles into auditable, narrated HyperFrames projects."
- target_audience: "AI creators, technical writers, and developers who want repeatable article-to-video production."
- content_rhythm: "Start with the pain point, show the pipeline, surface the theme system, explain voice and timing, then close with the verification loop."
- primary_evidence: "README sections for core capabilities, usage, TTS, theme templates, branding, and validation commands."
- viewer_takeaway: "The repo is not just a template; it is a full production workflow with source analysis, scene planning, narration, styling, and validation."

## Style Selection

theme: tech-signal
style_preset: "project-introduction / sci-fi editorial"
visual_tone: "dark, clean, technical, signal-driven, with restrained cyan and green accents"
background_family: "orbital_signal, blueprint, data_stream, terminal_glow, dark_grid"
logo_intro: "themes/tech-signal/components/logo-intro.html"
follow_outro: "themes/tech-signal/components/follow-outro.html"

## Scene Count Reasoning

The source is a project README with a clear product shape: positioning, core workflow, visual theme system, local Chinese TTS, output contract, and verification steps. Six body scenes are enough to introduce the product without turning the video into a full tutorial. The scenes use varied card types so the video feels like a product explainer: hook, summary, architecture, key points, code log, and conclusion.

## Fixed Scenes

```yaml
logo_intro:
  source: fixed_branding_asset
  theme_component: themes/tech-signal/components/logo-intro.html
  duration_target: 3s
  narration: none
  style_note: uses selected theme, clean background, fixed logo assembly animation
follow_outro:
  source: fixed_branding_asset
  theme_component: themes/tech-signal/components/follow-outro.html
  duration_target: 4.5s
  narration: none
  style_note: uses selected theme, fixed avatar/card/button-follow animation
```

## Body Scenes

### Scene 01

```yaml
scene_id: scene-01
scene_role: hook
source_section: "README title and project summary"
core_message: "The project turns Markdown articles into narrated HyperFrames explainer videos."
narration: "这是一个把 Markdown 文章变成解说视频的项目。它不是普通模板，而是一套可复用的 HyperFrames 视频生成流程。"
visual_text:
  headline: "Markdown -> Narrated Video"
  supporting_copy: "Article analysis, scene cards, Chinese voiceover, HyperFrames render."
  labels:
    - "Project Intro"
    - "Tech Workflow"
visual_payload:
  headline: "HyperFrames Article Video"
  subtitle: "把一篇 Markdown 文章拆解成带旁白的科技风解说视频"
  chips:
    - "Markdown"
    - "TTS"
    - "HyperFrames"
card_type: hook
layout_template: tech-signal.hook.orbital-proof-chips
background_preset: orbital_signal
animation: orbital_thesis_reveal
duration_target: 5.5s
source_excerpt: "把一篇 Markdown 文章拆解成带旁白的 HyperFrames 解说视频。"
```

### Scene 02

```yaml
scene_id: scene-02
scene_role: claim
source_section: "README core capabilities"
core_message: "The repo plans the video before rendering it."
narration: "它先读文章，再生成可审阅的拆解文档。每一幕都写清楚旁白、画面文字、卡片结构和证据来源。"
visual_text:
  headline: "先拆解，再生成"
  supporting_copy: "The workflow keeps creative decisions auditable before render."
  labels:
    - "Analysis"
    - "Scene Plan"
    - "Evidence"
visual_payload:
  claim: "视频不是直接拼页面，而是先形成 article-breakdown.md。"
  evidence:
    - "文章结构分析"
    - "分幕脚本和旁白"
    - "卡片、布局、背景和动画选择"
  proof_chips:
    - "Auditable"
    - "Reusable"
card_type: summary
layout_template: tech-signal.summary.evidence-ladder
background_preset: data_stream
animation: evidence_ladder_reveal
duration_target: 6s
source_excerpt: "生成流程的第一步是创建 article-breakdown.md。这个文件不是临时产物，而是整条视频生成链路的核心文档。"
```

### Scene 03

```yaml
scene_id: scene-03
scene_role: architecture
source_section: "README usage and build workflow"
core_message: "The system has a simple production chain from source article to final MP4."
narration: "生成链路很清楚：准备文章，拆成分幕，合成旁白，再构建 HyperFrames 时间线。最后输出一个可以验证的 MP4。"
visual_text:
  headline: "Production Pipeline"
  supporting_copy: "A deterministic chain from source text to rendered video."
  labels:
    - "Source"
    - "Voice"
    - "Render"
visual_payload:
  nodes:
    - name: "Markdown"
      role: "source article"
    - name: "Breakdown"
      role: "scene decisions"
    - name: "Kokoro TTS"
      role: "continuous narration"
    - name: "HyperFrames"
      role: "HTML timeline"
    - name: "MP4"
      role: "final render"
  links:
    - "Markdown -> Breakdown"
    - "Breakdown -> Kokoro TTS"
    - "Breakdown -> HyperFrames"
    - "HyperFrames -> MP4"
card_type: architecture
layout_template: tech-signal.architecture.node-flow
background_preset: blueprint
animation: neural_node_morph
duration_target: 7s
source_excerpt: "推荐输出结构：article-breakdown.md, index.html, hyperframes.json, package.json, assets/speech.wav, compositions/*.html, renders/final.mp4"
```

### Scene 04

```yaml
scene_id: scene-04
scene_role: proof
source_section: "README built-in templates"
core_message: "The selected Tech Signal style is built for dense technical explainers."
narration: "这次使用科技信号视觉风格。它适合 AI 系统、产品分析和工程拆解，画面会偏干净、暗色、信息密度高。"
visual_text:
  headline: "科技信号视觉风格"
  supporting_copy: "Modern minimal tech editorial visuals for AI and engineering topics."
  labels:
    - "Dark Grid"
    - "Data Stream"
    - "Blueprint"
visual_payload:
  items:
    - title: "Dark Grid"
      detail: "clean technical release and dense information"
    - title: "Data Stream"
      detail: "AI agent and automation scenes"
    - title: "Blueprint"
      detail: "system architecture and process diagrams"
    - title: "Terminal Glow"
      detail: "commands, logs, configuration strings"
card_type: key_points
layout_template: tech-signal.key_points.layered-stack
background_preset: dark_grid
animation: layered_points_stack
duration_target: 6s
source_excerpt: "Tech Signal: 干净、现代、偏科幻编辑风，适合技术发布、AI 系统、产品分析、工程拆解和信息密度较高的内容。"
```

### Scene 05

```yaml
scene_id: scene-05
scene_role: command
source_section: "README TTS and validation commands"
core_message: "The repo includes local Chinese TTS and concrete validation commands."
narration: "旁白默认走本地 Kokoro 中文模型，并把真实音频时长写回时间线。渲染前后还会跑校验，确保输出结构没有偏离约定。"
visual_text:
  headline: "Voice + Validation"
  supporting_copy: "Local Mandarin narration and repeatable render checks."
  labels:
    - "Kokoro"
    - "Timecode"
    - "Validation"
visual_payload:
  entries:
    - code: "scripts/kokoro-zh-tts.py"
      label: "continuous Chinese narration"
    - code: "assets/speech.wav"
      label: "single voice track"
    - code: "validate-generation-logic.mjs --allow-unrendered"
      label: "pre-render check"
    - code: "npx hyperframes render --quality draft"
      label: "draft MP4 render"
card_type: code_log
layout_template: tech-signal.code_log.terminal-shell
background_preset: terminal_glow
animation: terminal_parse_in
duration_target: 7s
source_excerpt: "中文视频默认使用本地 Kokoro 中文模型；渲染后再做完整校验：node scripts/validate-generation-logic.mjs --project <output-project>"
```

### Scene 06

```yaml
scene_id: scene-06
scene_role: conclusion
source_section: "README usage and output contract"
core_message: "The project is best understood as a production skill pack, not a one-off template."
narration: "所以这个仓库最适合做成一个视频生产工作台。给它一篇文章，它会帮你留下可追溯的创作过程，并产出最终解说视频。"
visual_text:
  headline: "A Video Production Skill Pack"
  supporting_copy: "Use it when an article needs structured narration, themed visuals, and a verified MP4."
  labels:
    - "Article In"
    - "Explainer Out"
visual_payload:
  action: "Feed in a Markdown article"
  reason: "Get an auditable, narrated HyperFrames explainer video"
  compatibility: "Chinese TTS, theme assets, logo intro, follow outro, MP4 render"
  command: "npm run setup"
card_type: conclusion
layout_template: tech-signal.conclusion.signal-cta
background_preset: orbital_signal
animation: glass_panel_focus
duration_target: 6s
source_excerpt: "当前仓库不是传统的一键命令行生成器。它更像一个可复用的视频生成技能包。"
```

## Narration Script

1. 这是一个把 Markdown 文章变成解说视频的项目。它不是普通模板，而是一套可复用的 HyperFrames 视频生成流程。
2. 它先读文章，再生成可审阅的拆解文档。每一幕都写清楚旁白、画面文字、卡片结构和证据来源。
3. 生成链路很清楚：准备文章，拆成分幕，合成旁白，再构建 HyperFrames 时间线。最后输出一个可以验证的 MP4。
4. 这次使用科技信号视觉风格。它适合 AI 系统、产品分析和工程拆解，画面会偏干净、暗色、信息密度高。
5. 旁白默认走本地 Kokoro 中文模型，并把真实音频时长写回时间线。渲染前后还会跑校验，确保输出结构没有偏离约定。
6. 所以这个仓库最适合做成一个视频生产工作台。给它一篇文章，它会帮你留下可追溯的创作过程，并产出最终解说视频。

## Build Notes

- TTS engine: Kokoro Chinese, model `hexgrad/Kokoro-82M-v1.1-zh`, voice `zf_001`, speed `1.5`.
- Audio timing method: `continuous_kokoro_timecode`.
- Logo intro and follow outro stay silent.
- Body scene timing should use real `assets/speech.wav` timecodes plus a small visual hold buffer.
- Output is not self-contained; it references the repository theme and branding assets by relative path.
- Final render target: `renders/final.mp4`.
