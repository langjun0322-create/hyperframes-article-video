# Logo & Follow Me 规则 — 品牌标识 + 关注引导

> 独立于卡片体系，每个视频固定包含。

---

## 核心原则

1. **Logo 片头** — 每个视频开头展示品牌 Logo
2. **Follow Me 片尾** — 每个视频结尾展示关注引导
3. **独立场景** — 不归属于 hook 或 conclusion 卡片，是单独的过场

---

## 素材位置

| 素材 | 路径 | 用途 |
|------|------|------|
| 品牌 Logo | `📝 素材库/品牌素材/朱迪-Logo.png` | 片头展示 |
| Logo 精调版 | `agents/mr-big/logo-juner-v3-balanced-2048.png` | 备选/高清 |
| Avatar 头像 | `agents/mr-big/logo-juner-avatar-2048.png` | 备选 |

> ⭐ 视频项目中引用 Logo 时，从 `📝 素材库/品牌素材/` 复制到项目 `assets/` 目录。

---

## 配置项

所有 Logo & Follow 的配置信息存放在**主题包的 `theme.json`** 的 `branding` 字段：

```json
{
  "branding": {
    "logo": {
      "path": "assets/logo.png",
      "display_duration": 3,
      "animation": "fade_in_scale"
    },
    "follow": {
      "handle": "@你的X账号",
      "url": "https://x.com/你的账号",
      "display_duration": 6,
      "animation": "slide_up"
    }
  }
}
```

> ⚠️ `handle` 和 `url` 需要主人提供后填充。

---

## 视频结构中的位置

```
┌─ Logo 片头（0-3s）──────────────┐
│                                  │
│      [ 品牌 Logo 居中 ]          │
│      fade_in_scale 动画           │
│                                  │
└──────────────────────────────────┘
          ↓ 过渡
┌─ 第 1 幕 hook ───────────────────┐
│  ...                              │
└──────────────────────────────────┘
          ↓ ...
┌─ 最后一幕 conclusion ────────────┐
│  ...                              │
└──────────────────────────────────┘
          ↓ 过渡
┌─ Follow Me 片尾（最后 6s）─────────┐
│                                    │
│    🔔 关注 @你的X账号               │
│     获取更多 OpenClaw 更新           │
│                                    │
│      [ 品牌 Logo（小）]             │
│      slide_up 动画                  │
│                                    │
└────────────────────────────────────┘
```

---

## 在 index.html 中的实现

### Logo 片头（GASAP）

```javascript
// Scene: Logo Intro (0-3s)
tl.from("#logo-intro img", {
  opacity: 0,
  scale: 0.8,
  duration: 1,
  ease: "power2.out"
}, 0.5);
tl.to("#logo-intro", {
  opacity: 0,
  duration: 0.5,
  ease: "power2.in"
}, 2.5);
```

### HTML 结构

```html
<!-- Logo Intro Scene -->
<div id="logo-intro" class="clip" data-start="0" data-duration="3" data-track-index="1">
  <img src="assets/logo.png" alt="Logo" style="width: 200px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" />
</div>

<!-- Follow Me Outro Scene -->
<div id="follow-outro" class="clip" data-start="..." data-duration="6" data-track-index="1">
  <div style="text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
    <p style="font-size: 36px; color: #EAF2FF; margin-bottom: 10px;">🔔 关注 @你的X账号</p>
    <p style="font-size: 24px; color: #8FA3B8;">获取更多 OpenClaw 更新</p>
    <img src="assets/logo.png" alt="Logo" style="width: 80px; margin-top: 30px; opacity: 0.6;" />
  </div>
</div>
```

---

## 测试验证

Logo 片头和 Follow Me 片尾已在以下测试视频中跑通：

| 测试 | 文件 | 时长 |
|------|------|------|
| Logo 片头 | `2026-05-06-Intro-Logo-v4-SVG修复.mp4` | 3s |
| Follow Me 片尾 | `2026-05-06-Outro-FollowMe-v2.mp4` | 6s |
| 全流程验证 | `2026-05-06-v5.3-全流程测试.mp4` | ✅ |

---

## 质量检查

生成视频前确认：

- [ ] Logo 素材已复制到项目 `assets/` 目录
- [ ] Logo 片头动画正常（fade_in_scale）
- [ ] Follow Me 显示正确的社交媒体账号
- [ ] Follow Me 包含品牌 Logo（小尺寸）
- [ ] 总时长已计入 Logo 3s + Follow 6s
- [ ] TTS 配音从 Logo 片头之后开始（Skip 0-3s）
