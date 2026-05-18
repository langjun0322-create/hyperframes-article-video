# HyperFrames Article Video

把一篇 Markdown 文章拆解成带旁白的 HyperFrames 解说视频。这个项目提供文章分析规则、固定品牌资产、中文 TTS 配置、主题模板和生成校验脚本，适合用 Codex 协作生成短视频项目。

> 当前仓库不是传统的一键命令行生成器。它更像一个可复用的视频生成技能包：Codex 读取文章和本仓库规则后，生成可审阅、可预览、可渲染的 HyperFrames 项目。

## 模板预览

| Tech Signal | Soft Signal |
| --- | --- |
| ![Tech Signal 模板预览](assets/previews/tech-signal.png) | ![Soft Signal 模板预览](assets/previews/soft-signal.png) |

| Folk Frequency | Clear Code |
| --- | --- |
| ![Folk Frequency 模板预览](assets/previews/folk-frequency.png) | ![Clear Code 模板预览](assets/previews/clear-code.png) |

## 核心能力

- 将文章拆成结构分析、分幕脚本、画面文字和可追溯证据。
- 为每一幕选择卡片类型、布局模板、背景 preset 和确定性动画。
- 使用固定品牌资料生成同主题风格的 Logo 片头和 Follow 片尾。
- 默认使用本地 Kokoro 中文 TTS 生成连续旁白音频。
- 将真实音频时长写入时间线，生成可渲染的 HyperFrames HTML 项目。
- 用项目脚本校验主题契约和生成项目的输出约定。

## 环境要求

- Node.js 和 npm
- Python 3.12
- HyperFrames CLI，可在生成项目时用于 lint、inspect、snapshot 和 render
- 首次运行会把 Kokoro 相关 Python 依赖安装到 `.cache/kokoro-zh-venv`

Python 依赖声明在 `requirements-tts.txt`：

```txt
kokoro
torch
soundfile
numpy
```

## 安装依赖

在仓库根目录运行：

```bash
npm run setup
```

这个命令会检查 Node、npm、Python、品牌配置和主题契约，并为中文 TTS 准备本地依赖环境。它不会预下载模型权重。

如果只想检查当前配置，不安装依赖：

```bash
npm run check:config
```

## 使用方法

### 1. 准备文章

准备一篇 Markdown 文章，并把文章路径交给 Codex。可以指定主题；如果不指定，默认使用 `tech-signal`。

示例需求：

```text
请使用 hyperframes-article-video，把 /path/to/article.md 生成一个中文解说视频，主题使用 soft-signal。
```

### 2. 生成文章拆解文档

生成流程的第一步是创建 `article-breakdown.md`。这个文件不是临时产物，而是整条视频生成链路的核心文档，包含：

- 文章结构分析
- 分幕方案
- 每幕旁白
- 每幕画面文字
- 卡片类型和布局选择
- 背景 preset 和动画选择
- 原文证据摘录

### 3. 生成旁白

中文视频默认使用本地 Kokoro 中文模型：

- 模型：`hexgrad/Kokoro-82M-v1.1-zh`
- 默认音色：`zf_001`
- 默认语速：`1.5`
- 脚本：`scripts/kokoro-zh-tts.py`

旁白会生成到输出项目的：

```text
assets/speech.wav
```

### 4. 构建 HyperFrames 项目

生成项目会把 Logo 片头、正文场景和 Follow 片尾写入同一个时间线。正文场景只从 `article-breakdown.md` 读取，不再依赖额外的长期中间文件。

推荐输出结构：

```text
article-breakdown.md
index.html
hyperframes.json
package.json
assets/speech.wav
compositions/*.html
renders/final.mp4
```

### 5. 校验和渲染

生成项目后，先做未渲染校验：

```bash
node scripts/validate-generation-logic.mjs --project <output-project> --allow-unrendered
```

再使用 HyperFrames 做预览和渲染：

```bash
npx hyperframes lint
npx hyperframes inspect --samples 15
npx hyperframes snapshot --at <times>
npx hyperframes render --quality draft
```

渲染后再做完整校验：

```bash
node scripts/validate-generation-logic.mjs --project <output-project>
```

最终视频只保留 MP4：

```text
renders/final.mp4
```

## 内置模板

### Tech Signal

![Tech Signal 模板预览](assets/previews/tech-signal.png)

默认模板。干净、现代、偏科幻编辑风，适合技术发布、AI 系统、产品分析、工程拆解和信息密度较高的内容。

常用背景 preset：

- `dark_grid`
- `data_stream`
- `orbital_signal`
- `neural_map`
- `terminal_glow`
- `blueprint`

### Soft Signal

![Soft Signal 模板预览](assets/previews/soft-signal.png)

柔和纸张和大色块风格，适合 AI 工具、生活方式、教程、个人品牌和低压力解释类视频。整体更温暖，适合把复杂内容讲得轻一点。

常用背景 preset：

- `warm_paper`
- `soft_blobs`
- `botanical_signal`
- `editorial_arch`
- `signal_blocks`
- `soft_grid`

### Folk Frequency

![Folk Frequency 模板预览](assets/previews/folk-frequency.png)

手工民俗海报风，使用暖纸、边框、角花、印刷纹理和高饱和色块。适合文化故事、生活方式、活动、社区内容和温暖编辑类视频。

常用背景 preset：

- `floral_fest`
- `night_folk`
- `sunshine_block`
- `terracotta_print`
- `river_waves`
- `forest_floor`

### Clear Code

![Clear Code 模板预览](assets/previews/clear-code.png)

温暖、清晰、工具感强的编辑风格。使用大号衬线标题、陶土色强调、细线图标和轻量卡片，适合 AI 工具、工作流、教程、版本更新和实用说明。

常用背景 preset：

- `warm_canvas`
- `workflow_grid`
- `actionable_cards`
- `quote_focus`
- `tool_diagram`
- `decision_board`

## 品牌配置

品牌资料放在：

```text
assets/branding/brand-profile.json
```

当前包含：

- logo 路径
- 关注头像路径
- 展示名称
- 社交账号
- 社交链接
- Logo 片头文案
- Follow 片尾文案

Logo 和 Follow 组件会读取这些固定资料，但视觉风格由当前主题决定。也就是说，切换主题会改变颜色、字体、背景和动效，不会自动改品牌文字。

首次替换品牌资料时，参考：

```text
references/branding.md
```

## 验证命令

检查配置：

```bash
npm run check:config
```

运行设置脚本测试：

```bash
npm run test:setup
```

验证所有主题契约：

```bash
npm run validate:themes
```

## 输出约定

长期保留的输出文件应该尽量少，只保留审阅、预览和渲染必需内容：

- `article-breakdown.md`
- `index.html`
- `hyperframes.json`
- `package.json`
- `assets/speech.wav`
- `compositions/*.html`
- `renders/final.mp4`

不建议长期保留：

- `video-blueprint.yaml`
- `voice-script.txt`
- `voice-timecode.json`
- `timing.json`
- `final.mov`

这些信息应该写入 `article-breakdown.md` 或嵌入 `index.html` 的结构化数据中。

## 项目结构

```text
assets/
  branding/              固定品牌资料
  previews/              README 模板预览图
references/              品牌和校验说明
rules/                   文章分析、旁白和卡片密度规则
scripts/                 TTS、首次设置和校验脚本
themes/
  tech-signal/           默认科技风模板
  soft-signal/           柔和纸张风模板
  folk-frequency/        民俗海报风模板
  clear-code/            清晰工具风模板
SKILL.md                 Codex 使用本仓库的主工作流说明
```

## 注意事项

- 不要为每篇文章重新生成主题背景，优先使用主题内登记的固定背景和组件。
- 画面文字应比旁白更完整，但不能脱离文章证据。
- Logo 片头和 Follow 片尾是同一时间线的一部分，不是后期追加片段。
- 生成中文视频时，不要把 macOS `say` 当作静默兜底；如果 Kokoro 不可用，应先修复或明确记录替代方案。
