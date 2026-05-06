# 文章分析规则 — 文章 → 视频蓝图

> 所有主题通用。不依赖具体视觉风格。

---

## 核心原则

1. **文章分析决定一切** — 分幕、卡片类型、背景都在这一步定
2. **每段只映射一种卡片类型** — 一段内容只属于一个场景
3. **一篇文章一个背景** — 背景选择后全文不变
4. **过渡按卡片类型自动匹配** — 不需要手动指定

---

## 分析步骤

### 第 1 步：通读全文，划分段落

读文章，按自然段落分组。每个段落应该表达一个完整的意思。

### 第 2 步：判断每段的内容类型

| 段落意图 | 映射卡片类型 | 说明 |
|---------|------------|------|
| 介绍背景/引出问题 | `hook` | 文章开头，吸引注意力 |
| 核心观点/一句话总结 | `summary` | 这篇文章的核心结论 |
| 功能/亮点/要点列表 | `key_points` | 3-5 个要点，每个一句 |
| 操作指引/配置步骤 | `steps` | 有先后顺序的步骤 |
| 数据对比/指标展示 | `metrics` | 有数字、对比、前后对照的数据 |
| 代码/配置/JOSN 展示 | `code_log` | 技术细节展示 |
| 系统架构/流程结构 | `architecture` | 模块关系、层级、流程 |
| 预警/注意事项 | `warning` | 踩坑提醒、限制条件 |
| 收尾/引导行动 | `conclusion` | 升级命令、CTA、资源链接 |

### 第 3 步：选择背景

从当前主题包的 `background_presets` 中选择最匹配的 1 个背景：

| 文章内容方向 | 推荐背景 |
|-------------|---------|
| 通用科技 / 工具介绍 / 信息密集 | `bg_dark_grid` |
| AI Agent / Memory / 自动化 / 模型 | `bg_data_stream` |
| 版本更新 / 技术拆解 / Dashboard | `bg_hud_panels` |
| 向量 / 记忆 / Embedding / Agent 关系 | `bg_neural_map` |
| Debug / Issue Fix / 日志分析 | `bg_terminal_glow` |
| 系统架构 / 工作流 / 产品结构 | `bg_blueprint` |

> 如果匹配度不高或不清楚，默认使用 `bg_dark_grid`。

### 第 4 步：产出视频蓝图

```yaml
# video-blueprint.yaml
theme: "tech-signal"
background: "bg_neural_map"   # 6 种选 1
total_duration_estimate: 45   # 秒，预估
scenes:
  - scene: 1
    card_type: hook
    content_title: "为什么你的 OpenClaw 总是健忘？"
    key_data: null
  - scene: 2
    card_type: architecture
    content_title: "记忆系统三层架构"
    key_data: "memory-core → Active Memory → Memory Wiki"
  - scene: 3
    card_type: steps
    content_title: "三步配置法"
    key_data: "3 步：存·检·编"
  - scene: 4
    card_type: summary
    content_title: "Dreaming 自动整理"
    key_data: null
  - scene: 5
    card_type: conclusion
    content_title: "升级建议"
    key_data: "openclaw gateway restart"
```

---

## 卡片类型与配音/内容的职责分离

| 场景 | 配音（说的） | 卡片内容（展示的） |
|------|-----------|----------------|
| hook | 1 句话引起兴趣 | 视觉钩子，无代码/数据 |
| summary | 1 句核心结论 | 关键数字或结论展示 |
| key_points | 1 句概览 | 3-5 个要点卡片 |
| steps | 1 句操作指引 | 代码/配置模块展示 |
| metrics | 1 句数据结论 | 表格/指标/对比图 |
| code_log | 1 句说明 | 代码块+高亮 |
| architecture | 1 句架构概述 | 结构图/层级/流程 |
| warning | 1 句风险提醒 | 警示样式+要点 |
| conclusion | 1 句行动号召 | CTA 命令/链接 |

---

## 输出格式

分析结果必须输出为两件产物：

1. `video-blueprint.yaml` — 视频蓝图（给构建器用）
2. `voice-script.txt` — 配音脚本（每幕一句话，给 TTS 用）
