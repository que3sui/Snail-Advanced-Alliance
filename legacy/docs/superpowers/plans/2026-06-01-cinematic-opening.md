# 电影感开场 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在首页叠加 4 层电影感——追光启幕 + 场景叙事 + 追光交互 + 胶片质感。

**Architecture:** CSS 为主（Tailwind v4 utilities + keyframes + view-timeline），少量 JS 用于光标追踪和卡片景深。全局氛围层在 global.css，组件改动在各自 .astro 文件中。5 个 task，顺序执行，每个 task 完成后可独立验证。

**Tech Stack:** Astro 6, Tailwind CSS v4, View Transitions API

---

### Task 1: 全局 CSS — 胶片质感氛围层 (Layer 4)

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: 替换稻纸纹理为胶片颗粒**

`body::after` 的 SVG noise 参数从粗颗粒（baseFrequency 0.85, numOctaves 4）改为细颗粒（baseFrequency 1.2, numOctaves 3），opacity 从 0.028 降为 0.025。

```css
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}
```

- [ ] **Step 2: 添加暗角晕影 + 暖调色彩偏移**

修改 `body::before`，在现有 ambient gradient 上叠加暗角层。同时在高光区引入微冷的偏移（via 略冷的顶部径向渐变）。

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    /* 暗角晕影 — 四角暗沉，中心透明 */
    radial-gradient(
      ellipse 120% 100% at 50% 50%,
      transparent 40%,
      rgba(10, 8, 5, 0.06) 65%,
      rgba(10, 8, 5, 0.12) 100%
    ),
    /* 暖金高光 + 微冷偏移 */
    radial-gradient(
      ellipse 80% 50% at 50% 5%,
      rgba(255, 245, 235, 0.15) 0%,
      transparent 55%
    ),
    radial-gradient(
      ellipse 60% 50% at 80% 20%,
      rgba(200, 136, 16, 0.04) 0%,
      transparent 50%
    ),
    radial-gradient(
      ellipse 50% 40% at 20% 80%,
      rgba(180, 100, 60, 0.03) 0%,
      transparent 50%
    );
}
```

- [ ] **Step 3: 添加暗场氛围主题**

在现有 `[data-section-theme="gold"]` 等规则之前，新增 `dark` 主题（用于 Hero 开场）。

```css
body[data-section-theme="dark"]::before {
  background:
    radial-gradient(
      ellipse 120% 100% at 50% 50%,
      transparent 30%,
      rgba(5, 5, 3, 0.7) 70%,
      rgba(5, 5, 3, 0.85) 100%
    ),
    radial-gradient(
      ellipse 50% 40% at 50% 40%,
      rgba(200, 136, 16, 0.03) 0%,
      transparent 60%
    );
  transition: background 1.5s ease;
}
```

- [ ] **Step 4: 移除钻石装饰点、细化装饰线**

删除 `.ornamental-diamond` 规则。将 `.ornamental-rule::before` 和 `::after` 的渐变透明度从 0.35 降为 0.2，线宽保持 1px。

```css
/* 删掉整个 .ornamental-diamond 块 */

/* .ornamental-rule 渐变中 rgba(200,136,16,0.35) 替换为 rgba(200,136,16,0.2) */
.ornamental-rule::before {
  background: linear-gradient(
    to left,
    rgba(200, 136, 16, 0.2),
    rgba(200, 136, 16, 0.2),
    transparent
  );
}

.ornamental-rule::after {
  background: linear-gradient(
    to right,
    rgba(200, 136, 16, 0.2),
    rgba(200, 136, 16, 0.2),
    transparent
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: 胶片质感氛围层 — 颗粒、暗角、色彩偏移、暗场主题"
```

---

### Task 2: 全局 CSS — 场景转场系统 + 电影级 keyframes (Layer 2 基础 + Layer 3 工具)

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: 添加场景入场 keyframes**

在现有 keyframes 区域后添加 5 个新的 `@keyframes`：

```css
/* 横摇入场（卡片从左右滑入） */
@keyframes pan-in {
  from {
    opacity: 0;
    transform: translateX(60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 反向横摇（从右滑入） */
@keyframes pan-in-reverse {
  from {
    opacity: 0;
    transform: translateX(-60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 慢推入场（虚焦到实焦 + 轻微放大） */
@keyframes push-in {
  from {
    opacity: 0;
    filter: blur(4px);
    transform: scale(0.97);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }
}

/* 蒙太奇数字（虚焦从下方滚入） */
@keyframes montage-in {
  from {
    opacity: 0;
    filter: blur(6px);
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}

/* 群像渐显 */
@keyframes tableau-in {
  from {
    opacity: 0;
    filter: brightness(1.3);
  }
  60% {
    opacity: 0.6;
    filter: brightness(1.05);
  }
  to {
    opacity: 1;
    filter: brightness(1);
  }
}
```

- [ ] **Step 2: 添加场景转场光带 utility**

```css
/* 场景间叠化光带 */
@utility scene-ribbon {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    z-index: 5;
    pointer-events: none;
    background: linear-gradient(
      to right,
      transparent,
      rgba(200, 136, 16, 0.25) 20%,
      rgba(224, 85, 53, 0.15) 50%,
      rgba(200, 136, 16, 0.25) 80%,
      transparent
    );
    opacity: 0;
    transition: opacity 1s ease;
  }
}

@supports (animation-timeline: view()) {
  .scene-ribbon::before {
    animation: ribbon-fade linear both;
    animation-timeline: view();
    animation-range: entry -10% entry 30%;
  }
}

@keyframes ribbon-fade {
  from {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

- [ ] **Step 3: 添加场景入场 utilities（CSS-only view-timeline 驱动）**

```css
@utility scene-pan-in {
  opacity: 0;
  transform: translateX(60px);
}

@utility scene-pan-in-reverse {
  opacity: 0;
  transform: translateX(-60px);
}

@utility scene-push-in {
  opacity: 0;
  filter: blur(4px);
  transform: scale(0.97);
}

@utility scene-montage-in {
  opacity: 0;
  filter: blur(6px);
  transform: translateY(18px);
}

@utility scene-tableau-in {
  opacity: 0;
  filter: brightness(1.3);
}

@supports (animation-timeline: view()) {
  .scene-pan-in {
    animation: pan-in 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) both;
    animation-timeline: view();
    animation-range: entry 0% entry 40%;
  }
  .scene-pan-in-reverse {
    animation: pan-in-reverse 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) both;
    animation-timeline: view();
    animation-range: entry 0% entry 40%;
  }
  .scene-push-in {
    animation: push-in 1s cubic-bezier(0.22, 0.61, 0.36, 1) both;
    animation-timeline: view();
    animation-range: entry 0% entry 35%;
  }
  .scene-montage-in {
    animation: montage-in 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) both;
    animation-timeline: view();
    animation-range: entry 0% entry 45%;
  }
  .scene-tableau-in {
    animation: tableau-in 1.2s ease both;
    animation-timeline: view();
    animation-range: entry 0% entry 30%;
  }
}
```

- [ ] **Step 4: 添加卡片景深跟随和按钮追光 utility**

```css
/* 卡片 3D 景深跟随 — JS 通过 CSS 变量驱动 */
@utility card-tilt {
  transform: perspective(800px) rotateX(var(--tilt-y, 0deg)) rotateY(var(--tilt-x, 0deg));
  transition: transform 0.1s ease-out;
}

/* 按钮追光 halo */
@utility btn-halo {
  position: relative;
  transition: box-shadow 0.6s ease;

  &:hover {
    box-shadow:
      0 0 28px rgba(200, 136, 16, 0.12),
      0 0 60px rgba(200, 136, 16, 0.06),
      0 0 0 1px rgba(200, 136, 16, 0.08);
  }
}
```

- [ ] **Step 5: 添加字符浮现动画**

```css
/* 标题字符浮现 */
@utility title-char {
  display: inline-block;
  opacity: 0;
  animation: char-reveal 1s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  animation-play-state: paused;
}

.reveal-started .title-char {
  animation-play-state: running;
}

@keyframes char-reveal {
  from {
    opacity: 0;
    filter: blur(8px);
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
}
```

- [ ] **Step 6: 确保 prefers-reduced-motion 覆盖新增动效**

修改现有 `@media (prefers-reduced-motion: reduce)` 块，追加对新增 utility 的覆盖：

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }

  /* 覆盖 view-timeline 驱动的动画 */
  .scene-pan-in,
  .scene-pan-in-reverse,
  .scene-push-in,
  .scene-montage-in,
  .scene-tableau-in,
  .title-char,
  .scroll-reveal,
  .scroll-reveal-css,
  .stagger-reveal,
  .stagger-reveal-css,
  .text-gradient-scroll {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: 场景转场系统 + 电影级 keyframes + 卡片景深工具类"
```

---

### Task 3: HeroSection — 追光启幕 (Layer 1)

**Files:**
- Modify: `src/components/home/HeroSection.astro`

- [ ] **Step 1: 将 `<section>` 的 `data-section-theme` 从 `gold` 改为 `dark`**

```diff
- data-section-theme="gold"
+ data-section-theme="dark"
```

这会立即让 Hero 使用暗场氛围渐变（已在 Task 1 Step 3 定义）。

- [ ] **Step 2: 添加追光聚光灯 overlay**

在 `<section>` 内部、ambient orbs 之后，添加一个追光 overlay div：

```html
<!-- Spotlight — the projector beam from darkness -->
<div class="spotlight pointer-events-none absolute inset-0 z-[2]" aria-hidden="true"></div>
```

替换现有的 `.cursor-glow` div（追光取代墨晕的位置）。

- [ ] **Step 3: 添加追光 CSS**

在 `<style>` 块中替换 `.cursor-glow` 样式为 `.spotlight`：

```css
/* 追光聚光灯 — 从中心扩散的暖光 */
.spotlight {
  background: radial-gradient(
    ellipse 60% 50% at 50% 40%,
    rgba(200, 136, 16, 0.15) 0%,
    rgba(200, 136, 16, 0.05) 30%,
    rgba(224, 85, 53, 0.03) 50%,
    transparent 70%
  );
}

@supports (animation-timeline: view()) {
  .spotlight {
    animation: spotlight-bloom 2s cubic-bezier(0.22, 0.61, 0.36, 1) both;
    animation-timeline: view();
    animation-range: cover 0% cover 50%;
  }
}

@keyframes spotlight-bloom {
  from {
    opacity: 0.3;
    filter: brightness(0.4);
  }
  to {
    opacity: 1;
    filter: brightness(1);
  }
}
```

- [ ] **Step 4: 标题改为逐字浮现**

将 `<h1>` 内容改为逐字符 `<span>`，每个带递增 `animation-delay`：

`HeroSection.astro` frontmatter 部分添加：

```astro
---
import { SITE } from "@/lib/constants";

const lang = Astro.url.pathname.startsWith("/en") ? "en" : "zh";
const title = lang === "en" ? SITE.nameEn : SITE.name;
const titleChars = [...title];
---
```

将 h1 内容从：
```astro
<h1 class="scroll-reveal luxury-title mb-6">
  {lang === "en" ? SITE.nameEn : SITE.name}
</h1>
```

改为：
```astro
<h1 class="scroll-reveal luxury-title mb-6">
  {titleChars.map((char, i) => (
    <span
      class="title-char"
      style={`animation-delay: ${i * 0.12}s`}
    >
      {char === " " ? " " : char}
    </span>
  ))}
</h1>
```

- [ ] **Step 5: Scroll 触发 reveal-started class**

修改现有 `<script>` 块中的 `setupHero` 函数，在第一次进入 Hero 时添加 `reveal-started` class 到 hero 元素：

在 `setupHero()` 函数开头加入：

```js
// 微延迟后开始字符浮现（等待暗场稳定）
requestAnimationFrame(() => {
  hero.classList.add("reveal-started");
});
```

- [ ] **Step 6: 移除 sparkle 粒子、钻石装饰点、cursor-glow**

```diff
- <!-- Cursor glow -->
- <div class="cursor-glow pointer-events-none absolute inset-0 z-5" aria-hidden="true"></div>

- <!-- Sparkle particles -->
- <div class="sparkles pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
-   <span class="sparkle" style="top:18%;left:18%;animation-delay:0s"></span>
-   ... (all sparkle spans)
- </div>

- <!-- Decorative top/bottom rules 中的 diamond -->
- <div class="ornamental-diamond"></div>
```

移除 `.sparkle`、`@keyframes sparkle-pop`、`.cursor-glow`、`.spark-frame::before/::after` 的 CSS 规则。

- [ ] **Step 7: 调整 ornamental-rule 移除 diamond 引用**

将：
```html
<div class="scroll-reveal ornamental-rule mb-8">
  <div class="ornamental-diamond"></div>
</div>
```

简化为：
```html
<div class="scroll-reveal ornamental-rule mb-8"></div>
```

顶部和底部各一处。

- [ ] **Step 8: Commit**

```bash
git add src/components/home/HeroSection.astro
git commit -m "feat: Hero 追光启幕 — 暗场 + 聚光灯 + 标题逐字浮现"
```

---

### Task 4: Section 镜头运动编排 (Layer 2)

**Files:**
- Modify: `src/components/home/MetricsCounter.astro`
- Modify: `src/components/home/ActivityCards.astro`
- Modify: `src/components/home/NewsSection.astro`
- Modify: `src/components/home/PartnerLogos.astro`

- [ ] **Step 1: MetricsCounter — 蒙太奇数字滚入**

在 `<section>` 上添加 `scene-ribbon` 类（生成顶部转场光带）。  
在 `ScrollReveal` 上添加 `scene-montage-in` 替换默认 reveal 行为。  
每个 metric 卡片加 `--stagger` 自定义属性。

```astro
<section class="bg-gemini-surface scene-ribbon py-20">
  <div class="mx-auto max-w-[var(--content-max)] px-6">
    <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
      {METRICS.map((metric, i) => (
        <ScrollReveal class="text-center">
          <div
            class="scene-montage-in text-gradient text-4xl font-extrabold tracking-tight md:text-5xl"
            style={`animation-delay: ${i * 100}ms`}
          >
            <span class="counter" data-target={metric.value} data-suffix={metric.suffix}>
              0
            </span>
            {metric.suffix}
          </div>
          <p
            class="scene-montage-in text-text-secondary mt-2 text-sm"
            style={`animation-delay: ${i * 100 + 150}ms`}
          >
            {lang === "en" ? metric.labelEn : metric.label}
          </p>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: ActivityCards — 横摇登场 + 卡片景深**

在 `<section>` 上添加 `scene-ribbon`。每张卡片交替使用 `scene-pan-in` 和 `scene-pan-in-reverse`。  
卡片外层添加 `card-tilt` 类，由 JS 驱动 CSS 变量。

```astro
<section class="scene-ribbon py-[var(--section-gap)]">
  <div class="mx-auto max-w-[var(--content-max)] px-6">
    <SectionHeading ... />
    <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {activities.map((item, i) => (
        <ScrollReveal class="group">
          <a
            href={item.href}
            class={`glass glass-hover classical-corners card-tilt block h-full rounded-2xl p-6 ${
              i % 2 === 0 ? "scene-pan-in" : "scene-pan-in-reverse"
            }`}
            style={`animation-delay: ${i * 120}ms`}
            data-tilt
          >
            <!-- 内容保持不变 -->
          </a>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 3: NewsSection — 慢推记叙**

在 `<section>` 上添加 `scene-ribbon`。每条新闻卡片使用 `scene-push-in` + 递增 delay。

```astro
<section class="bg-gemini-surface scene-ribbon py-[var(--section-gap)]" id="content-start">
  <div class="mx-auto max-w-5xl px-6">
    <SectionHeading ... />
    <div class="grid gap-5 md:grid-cols-2">
      {allFeatured.slice(0, 4).map((item, i) => (
        <ScrollReveal>
          <a
            href={href}
            class={`glass glass-hover classical-corners scene-push-in group block rounded-2xl border-l-4 ${border} p-6`}
            style={`animation-delay: ${i * 150}ms`}
          >
            <!-- 内容保持不变 -->
          </a>
        </ScrollReveal>
      ))}
    </div>
    <!-- ... -->
  </div>
</section>
```

- [ ] **Step 4: PartnerLogos — 群像渐显**

在 `<section>` 上添加 `scene-ribbon`。整个 logo 网格用 `scene-tableau-in` 一次性渐显。

```astro
<section class="border-border-subtle scene-ribbon border-t py-20">
  <div class="mx-auto max-w-5xl px-6">
    <ScrollReveal>
      <p class="text-text-muted mb-2 text-center text-xs font-semibold tracking-[0.2em] uppercase">
        {lang === "en" ? "Trusted by Industry Leaders" : "合作企业 & 社区"}
      </p>
    </ScrollReveal>
    <div class="scene-tableau-in mt-10 flex flex-wrap items-center justify-center gap-3">
      {partnerDetails.map((p, i) => (
        <ScrollReveal class={`delay-${i * 100}`}>
          <div class="glass glass-hover flex cursor-default items-center gap-3 rounded-xl px-5 py-3">
            <!-- 内容保持不变 -->
          </div>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 5: Commit**

```bash
git add src/components/home/MetricsCounter.astro src/components/home/ActivityCards.astro src/components/home/NewsSection.astro src/components/home/PartnerLogos.astro
git commit -m "feat: 场景镜头编排 — 蒙太奇/横摇/慢推/群像渐显"
```

---

### Task 5: 微交互 — 卡片景深 + 光标增强 (Layer 3)

**Files:**
- Modify: `src/components/home/HeroSection.astro` (cursor glow + spotlight interaction)
- Modify: `src/components/home/ActivityCards.astro` (3D tilt JS)
- Modify: `src/styles/global.css` (scroll-focus, cursor enhancement)

- [ ] **Step 1: 卡片 3D 景深跟随 JS**

在 `ActivityCards.astro` 的 `<script>` 块中添加：

```js
<script>
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${x * 8}deg`);
      card.style.setProperty("--tilt-y", `${-y * 8}deg`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
</script>
```

- [ ] **Step 2: 按钮追光 halo**

在 `HeroSection.astro` 的 CTA 按钮上添加 `btn-halo` 类：

```diff
- class="btn-primary btn-shimmer group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
+ class="btn-primary btn-shimmer btn-halo group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"

- class="btn-secondary btn-shimmer inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
+ class="btn-secondary btn-shimmer btn-halo inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
```

- [ ] **Step 3: 滚动停止时"对焦"效果**

在 `global.css` 的 `@layer base` 末尾添加：

```css
/* 滚动停止后微弱 sharpen */
body {
  transition: filter 0.8s ease;
}

body.scrolling {
  filter: brightness(0.97);
}
```

在 `HeroSection.astro` 的 `<script>` 块中添加滚动对焦逻辑（追加到现有 script 末尾）：

```js
// Scroll-focus: 滚动时微暗，停止后恢复
let scrollTimer: ReturnType<typeof setTimeout>;
window.addEventListener("scroll", () => {
  document.body.classList.add("scrolling");
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    document.body.classList.remove("scrolling");
  }, 150);
}, { passive: true });
```

- [ ] **Step 4: 更新 HeroSection cursor glow 为交互感知**

在 `HeroSection.astro` 的现有 `<script>` 中，将原来的 cursor glow 代码替换为增强版——光标在可交互元素上方时光晕变暖变大。

在 `setupHero()` 函数的 cursor glow 部分：

```js
// Cursor glow — 交互感知增强
const glow = hero.querySelector<HTMLElement>(".spotlight");
if (glow) {
  let ticking = false;
  let latest: MouseEvent | null = null;

  const onMouseMove = (e: MouseEvent) => {
    latest = e;
    if (!ticking) {
      requestAnimationFrame(() => {
        if (!latest) return;
        const rect = hero.getBoundingClientRect();
        const x = ((latest.clientX - rect.left) / rect.width) * 100;
        const y = ((latest.clientY - rect.top) / rect.height) * 100;
        glow.style.setProperty("--cursor-x", `${x}%`);
        glow.style.setProperty("--cursor-y", `${y}%`);

        // 检测光标是否在可交互元素上
        const target = latest.target as HTMLElement;
        const isInteractive = target?.closest("a, button, [data-tilt]");
        glow.style.opacity = isInteractive ? "1" : "0.6";

        ticking = false;
        latest = null;
      });
      ticking = true;
    }
  };

  hero.addEventListener("mousemove", onMouseMove, { passive: true });
  cleanups.push(() => hero.removeEventListener("mousemove", onMouseMove));
}
```

- [ ] **Step 5: 验证 & Commit**

```bash
git add src/components/home/HeroSection.astro src/components/home/ActivityCards.astro src/styles/global.css
git commit -m "feat: 微交互 — 卡片景深/按钮追光/滚动对焦/光标增强"
```

---

### 验证 Checklist

全部 Task 完成后，运行：

```bash
npm run dev
```

检查以下行为：
1. 首页 Hero 初始为暗场，中心有微弱暖光 → ✓
2. 标题字符逐个浮现（有 blur→sharp 过渡）→ ✓
3. 滚动时 Hero 聚光灯亮度变化 → ✓
4. 每个 section 之间有暖光带叠化 → ✓
5. MetricsCounter 数字从虚到实滚入 → ✓
6. ActivityCards 从左右交替滑入 → ✓
7. NewsSection 卡片慢推浮现 → ✓
8. PartnerLogos 整组渐显 → ✓
9. ActivityCards hover 时卡片 3D 倾斜 → ✓
10. 按钮 hover 时有暖光 halo → ✓
11. 光标在可交互元素上时 spotlight 变亮 → ✓
12. 所有效果在 `prefers-reduced-motion: reduce` 时静默 → ✓
