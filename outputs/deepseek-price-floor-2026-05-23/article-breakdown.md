# Article Breakdown
breakdown_schema: 2

## Source

- input_type: markdown
- source_path: "/Users/langjun/Documents/Obsidian Vault/🚀 Projects/内容运营/✅ 已发布/2026-05-23-DeepSeek以一己之力把价格打下来/2026-05-23-DeepSeek以一己之力把价格打下来.md"
- web_clipper: false
- title: "DeepSeek 以一己之力，把全球 AI 价格打下来"
- published_at: "2026-05-23"
- extraction_notes: "按用户提供的已发布 Markdown 作为文章来源。视频保留原文陈述口径，不将其中的价格、融资、估值或技术判断改写为独立事实核验结论。"

### Adopted Source Images

```yaml
image_id: image-01
path_or_url: "assets/source-media/image-01.jpg"
caption: "DeepSeek 永久折扣公告截图。"
why_relevant: "它直接对应首节关于折扣永久化及 API 定价的叙述。"
source_section: "0.02 元/百万 tokens vs GPT-5.5 的 36 元：公告引文之后"
```

```yaml
image_id: image-02
path_or_url: "assets/source-media/image-02.jpg"
caption: "文章引用的 OpenRouter 周榜截图。"
why_relevant: "它作为首节价格对照后的榜单证据出现。"
source_section: "0.02 元/百万 tokens vs GPT-5.5 的 36 元：价格表之后"
```

Rejected media: 封面图用于文章包装而非正文论据，因此不作为 `image_evidence` 场景。

## Article Profile

- title: "DeepSeek 以一己之力，把全球 AI 价格打下来"
- article_type: "观点型行业评论"
- hook_candidate: "0.02 元/百万 tokens，把价格对比推到极端。"
- target_audience: "关注大模型成本、国产模型与 AI 商业竞争的内容读者"
- content_rhythm: "低价冲击 -> 榜单佐证 -> 融资扩张 -> 训练与开源路径 -> 长期战略判断"
- primary_evidence: "永久折扣截图、价格对照表、OpenRouter 榜单截图及文章中的融资/训练成本数字"
- viewer_takeaway: "文章认为 DeepSeek 的低价与开源不是单次促销，而是争夺长期基础设施位置的策略。"

## Style Selection

theme: tech-signal
style_preset: "dark evidence editorial"
visual_tone: "深色科技编辑风，以冷色数据界面突出价格、榜单与策略链路"
background_family: "orbital_signal, data_stream, dark_grid, neural_map, blueprint"
logo_intro: "themes/tech-signal/components/logo-intro.html"
follow_outro: "themes/tech-signal/components/follow-outro.html"

## Scene Count Reasoning

原文有四个正文标题。开场只从标题和首节最强数字提炼一个 Hook，不改变文章判断。第一节本身包含三种独立视觉证据：官方折扣公告图、价格倍数对照、榜单截图，因此依照原顺序拆成三幕。后续融资、训练与开源、战略判断各保留为一幕，末段用文章最后一句完成收束。正文共八幕，所有证据仍留在它最初出现的章节位置。

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
source_section: "文章标题与首节开头的最低价格信息"
core_message: "文章用极低的 API 缓存价格开启对 DeepSeek 竞争策略的讨论。"
narration: "DeepSeek 把 API 价格推到了一个新低。文章的起点，是缓存命中输入每百万 tokens 只要零点零二元。"
visual_text:
  headline: "0.02 元 / 百万 tokens"
  supporting_copy: "文章从一次永久折扣公告，展开对 AI 价格战的判断。"
  labels:
    - "DeepSeek"
    - "API Pricing"
visual_payload:
  headline: "0.02 元 / 百万 tokens"
  subtitle: "DeepSeek 把价格打到地板之后，会发生什么？"
  chips:
    - "永久折扣"
    - "价格对比"
    - "生态位"
card_type: hook
layout_mode: open_title
layout_template: tech-signal.hook.orbital-proof-chips
background_preset: orbital_signal
animation: orbital_thesis_reveal
duration_target: 6s
source_excerpt: "DeepSeek 以一己之力，把全球 AI 价格打下来；Flash 缓存命中输入 0.02 元/百万 tokens。"
```

### Scene 02

```yaml
scene_id: scene-02
scene_role: image_evidence
source_section: "0.02 元/百万 tokens vs GPT-5.5 的 36 元：永久折扣推文与 V4 定价"
core_message: "文章先以 DeepSeek 公告截图说明折扣由限时变为永久。"
narration: "文章先引用 DeepSeek 的公告：原本限时的折扣被永久保留。V4 Pro 输出为每百万 tokens 六元，Flash 的缓存命中输入低至零点零二元。"
visual_text:
  headline: "折扣永久化"
  supporting_copy: "原文引用的公告截图，成为价格叙事的起点。"
  labels:
    - "SOURCE IMAGE"
    - "V4 PRO / FLASH"
visual_payload:
  image_id: image-01
  image_path: assets/source-media/image-01.jpg
  alt: "DeepSeek 官方公告截图，展示 V4 Pro 与 Flash 的永久折扣价格。"
  caption: "DeepSeek 宣布 V4 Pro 折扣永久化"
  why_relevant: "截图直接支持该段关于永久折扣与新价格的陈述。"
  source_section: "首节公告引文之后的配图"
card_type: image_evidence
layout_mode: split_media_text
layout_template: tech-signal.image_evidence.split-media-text
background_preset: data_stream
animation: source_image_reveal
duration_target: 8s
source_excerpt: "我们的折扣永久化了！现在变成永久价格——缓存命中输入 0.1 元/百万 tokens，输出 6 元/百万 tokens。"
```

### Scene 03

```yaml
scene_id: scene-03
scene_role: comparison
source_section: "0.02 元/百万 tokens vs GPT-5.5 的 36 元：价格表与倍数结论"
core_message: "原文把三组价格差距归纳成直观倍数。"
narration: "接着，文章把价格摆到同一张表里比较。按文中数据，输入相差三十六倍，输出一百零八倍，缓存命中更达到一千八百倍。"
visual_text:
  headline: "价格差距，被放大成倍数"
  supporting_copy: "按文章中的 DeepSeek V4 Flash 与 GPT-5.5 对照数据。"
  labels:
    - "INPUT"
    - "OUTPUT"
    - "CACHE HIT"
visual_payload:
  metrics:
    - value: "36x"
      label: "输入价格差距"
    - value: "108x"
      label: "输出价格差距"
    - value: "1800x"
      label: "缓存命中差距"
card_type: metrics
layout_mode: metric_board
layout_template: tech-signal.metrics.metric-wall
background_preset: dark_grid
animation: metric_counter_pulse
duration_target: 8s
source_excerpt: "输出价格差距 108 倍。输入 36 倍。缓存命中 1800 倍。"
```

### Scene 04

```yaml
scene_id: scene-04
scene_role: image_evidence
source_section: "0.02 元/百万 tokens vs GPT-5.5 的 36 元：价格表之后的周排行榜截图"
core_message: "原文在低价对比之后接上排行榜截图，强化它对竞争力的判断。"
narration: "价格比较之后，文章给出的另一份证据，是 OpenRouter 周榜截图。文中写道，DeepSeek V4 Flash 在同一天登顶第一。"
visual_text:
  headline: "价格之后，是榜单"
  supporting_copy: "原文把排行榜截图紧接在价格对照之后。"
  labels:
    - "OPENROUTER"
    - "WEEKLY RANKING"
visual_payload:
  image_id: image-02
  image_path: assets/source-media/image-02.jpg
  alt: "OpenRouter 排行榜截图，榜首位置显示 DeepSeek V4 Flash。"
  caption: "文章引用的 OpenRouter 周排行榜"
  why_relevant: "该图是首节对低价与表现关系进行判断时采用的视觉证据。"
  source_section: "首节价格比较结论之后的配图"
card_type: image_evidence
layout_mode: media_focus
layout_template: tech-signal.image_evidence.media-focus
background_preset: data_stream
animation: source_image_reveal
duration_target: 7s
source_excerpt: "同一天，OpenRouter 发布周排行榜——DeepSeek V4 Flash 登顶第一。"
```

### Scene 05

```yaml
scene_id: scene-05
scene_role: section_summary
source_section: "成立 3 年，首次接受外部融资"
core_message: "文章将低价扩张与首次融资、估值变化联系起来。"
narration: "文章随后转向融资。它写道，DeepSeek 首次接受外部资金，整轮目标最高五百亿元，估值在二十一天内升到五百一十五亿美元。"
visual_text:
  headline: "首次外部融资"
  supporting_copy: "文章把资金规模与低价战略放在同一条发展线上。"
  labels:
    - "FINANCING"
    - "VALUATION"
visual_payload:
  metrics:
    - value: "500 亿元"
      label: "整轮目标上限"
    - value: "200 亿元"
      label: "文中创始人出资"
    - value: "515 亿美元"
      label: "文中最新估值"
card_type: metrics
layout_mode: metric_board
layout_template: tech-signal.metrics.metric-wall
background_preset: neural_map
animation: metric_counter_pulse
duration_target: 8s
source_excerpt: "整轮目标最高 500 亿元。创始人梁文锋个人出资 200 亿元，占 40%。估值在 21 天内从 70 亿美元飙到 515 亿美元。"
```

### Scene 06

```yaml
scene_id: scene-06
scene_role: key_points
source_section: "500 万美元的训练成本，打了谁的脸？"
core_message: "文章以训练成本、开源和自研架构概括其技术路线。"
narration: "第三节把成本和技术路线放在一起。文中称 R1 训练成本为五百多万美元，并强调百分之百开源，以及从底层算子开始的自研架构。"
visual_text:
  headline: "成本与技术路线"
  supporting_copy: "原文用三条信息解释低价背后的能力来源。"
  labels:
    - "TRAINING"
    - "OPEN SOURCE"
    - "ARCHITECTURE"
visual_payload:
  items:
    - title: "500+ 万美元"
      detail: "文中给出的 R1 训练成本"
    - title: "100% 开源"
      detail: "技术报告与模型权重公开"
    - title: "自研架构"
      detail: "文中描述为从底层算子脱离 CUDA 依赖"
card_type: key_points
layout_mode: structured_cards
layout_template: tech-signal.key_points.layered-stack
background_preset: dark_grid
animation: layered_points_stack
duration_target: 8s
source_excerpt: "R1 训练成本只有 500 多万美元。而且 100% 开源——技术报告、模型权重、全部在 GitHub 上公开。更关键的是完全自研架构。"
```

### Scene 07

```yaml
scene_id: scene-07
scene_role: architecture
source_section: "这不是慈善，是阳谋：战略链路判断"
core_message: "文章把低价和开源整理为争夺基础设施位置的长期链路。"
narration: "最后一节提出它的判断：这不是慈善，而是一条长期路线。开源加极致低价，先占领生态位，再走向基础设施化。"
visual_text:
  headline: "文章给出的战略链路"
  supporting_copy: "开源与定价，被描述为长期竞争的起点。"
  labels:
    - "STRATEGY"
    - "LONG GAME"
visual_payload:
  nodes:
    - name: "开源"
      role: "降低采用门槛"
    - name: "极致低价"
      role: "扩大使用规模"
    - name: "生态位"
      role: "形成开发者依赖"
    - name: "基础设施化"
      role: "长期位置"
  links:
    - "开源 -> 极致低价"
    - "极致低价 -> 生态位"
    - "生态位 -> 基础设施化"
card_type: architecture
layout_mode: diagram_flow
layout_template: tech-signal.architecture.node-flow
background_preset: blueprint
animation: neural_node_morph
duration_target: 8s
source_excerpt: "开源 + 极致低价 → 占领生态位 → 基础设施化 → 长线收割。"
```

### Scene 08

```yaml
scene_id: scene-08
scene_role: conclusion
source_section: "这不是慈善，是阳谋：结尾判断"
core_message: "文章以重新定义 AI 成本单位的判断结束。"
narration: "文章的落点是，当五百一十五亿美元估值遇上零点零二元 API 定价，DeepSeek 想重新定义的，不只是价格，而是 AI 的电费。"
visual_text:
  headline: "重新定义 AI 的“电费”"
  supporting_copy: "这是原文最后给出的竞争判断。"
  labels:
    - "DEEPSEEK"
    - "PRICE FLOOR"
visual_payload:
  action: "0.02 元 API 定价"
  reason: "文章判断它正在改变 AI 基础成本的想象空间"
  compatibility: "515 亿美元估值 x 极致低价"
card_type: conclusion
layout_mode: open_title
layout_template: tech-signal.conclusion.open-title
background_preset: orbital_signal
animation: glass_panel_focus
duration_target: 7s
source_excerpt: "这不是价格战，这是一家中国公司在重新定义 AI 的“电费”。"
```

## Narration Script

1. DeepSeek 把 API 价格推到了一个新低。文章的起点，是缓存命中输入每百万 tokens 只要零点零二元。
2. 文章先引用 DeepSeek 的公告：原本限时的折扣被永久保留。V4 Pro 输出为每百万 tokens 六元，Flash 的缓存命中输入低至零点零二元。
3. 接着，文章把价格摆到同一张表里比较。按文中数据，输入相差三十六倍，输出一百零八倍，缓存命中更达到一千八百倍。
4. 价格比较之后，文章给出的另一份证据，是 OpenRouter 周榜截图。文中写道，DeepSeek V4 Flash 在同一天登顶第一。
5. 文章随后转向融资。它写道，DeepSeek 首次接受外部资金，整轮目标最高五百亿元，估值在二十一天内升到五百一十五亿美元。
6. 第三节把成本和技术路线放在一起。文中称 R1 训练成本为五百多万美元，并强调百分之百开源，以及从底层算子开始的自研架构。
7. 最后一节提出它的判断：这不是慈善，而是一条长期路线。开源加极致低价，先占领生态位，再走向基础设施化。
8. 文章的落点是，当五百一十五亿美元估值遇上零点零二元 API 定价，DeepSeek 想重新定义的，不只是价格，而是 AI 的电费。

## Build Notes

- 正文顺序完全依原文：首节三项视觉单元后，依次进入融资、训练/开源和战略判断。
- 图片仅作为 `image_evidence` 正文证据，使用项目本地路径；不将原图用作背景。
- 数字与结论均以“文中表述”呈现，视频不新增独立真实性背书。
- Logo intro 固定 3 秒且无旁白；Follow outro 固定为末尾静默提示场景。
