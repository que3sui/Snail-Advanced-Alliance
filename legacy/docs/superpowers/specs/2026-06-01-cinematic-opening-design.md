# 电影感开场设计 — 网页即放映

> 2026-06-01 · 蜗壳进阶联盟官网  
> 方向：B（电影氛围为主体，古典元素作点缀）  
> 在现有古典暖调基础上叠加 4 层电影感，创造沉浸式观影体验。

## 一、设计目标

将首页从一个"向下滚动阅览"的网页变成一个"放映"——每一屏是一个场景，每次交互有追光回应，全局弥漫胶片质感。用户不是在"浏览"，而是在"观看"。

## 二、当前状态

- 框架：Astro 6 + Tailwind CSS v4 + View Transitions
- 色调：暖金系（gemini-bg #fffbf5, gold #c88810, orange #e05535, rose #d43d52, plum #9b3a6e）
- 已有：稻纸纹理、墨晕光标、古典边角、玻璃态卡片、装饰金线、按钮流光、卷轴浮现过渡
- 首页结构：Hero → MetricsCounter → ActivityCards → NewsSection → PartnerLogos

## 三、4 层设计方案

### 第 1 层：追光启幕（Dark → Light Reveal）

**不是机械黑边，而是光影叙事。**

页面初始为深暗底色 + 中心微光呼吸。一束暖光从中心扩散，标题字符从光中浮现（逐字 stagger），装饰金线跟随出场。整个过程是一次"亮场仪式"。

技术方案：

- Hero section 包装一个全屏深色容器，初始状态覆盖视口
- 多层 CSS radial-gradient 模拟聚光灯效果
- 用 `data-section-theme` 机制切换：开场 `dark` → 内容区 `gold`
- 标题逐字浮现用 CSS animation-delay stagger
- Animation-timeline: view() 驱动亮场进度（CSS-only，零 JS）

### 第 2 层：场景式叙事（Scene Sequencer）

**5 个 section = 5 场戏，各有自己的"镜头运动"。**

| 场景 | 组件           | 运镜                         | 节奏     |
| ---- | -------------- | ---------------------------- | -------- |
| 场 1 | HeroSection    | 追光渐亮                     | 慢→中    |
| 场 2 | MetricsCounter | 数字滚入（蒙太奇）           | 快、有力 |
| 场 3 | ActivityCards  | 横摇 Pan（角色登场）         | 中       |
| 场 4 | NewsSection    | 慢推 Slow Push-in（记叙）    | 最慢     |
| 场 5 | PartnerLogos   | 渐显 Fade-in Tableau（群像） | 沉稳退场 |

场景间转场用全宽暖光带（light ribbon）作为叠化（dissolve），用 view-timeline 驱透明度。

情绪曲线：开场震撼 → 数据提气 → 角色亲近 → 深度沉浸 → 从容退场。

### 第 3 层：追光交互（Spotlight Interaction）

**4 个微交互：**

1. **卡片景深跟随** — hover 时根据鼠标位置产生微小 3D 倾斜（±4px），模拟摄影机微调
2. **按钮追光反馈** — hover 时按钮后方出现柔光 halo，周围元素微暗
3. **墨晕光标增强** — 光标在可交互元素上时光晕变暖变大（`:has()` / dataset 感知）
4. **滚动对焦** — 停止滚动时内容极微弱 sharpen（scroll-end 事件驱动）

约束：所有动效在 `prefers-reduced-motion` 时禁用。

### 第 4 层：胶片质感（Film Stock）

**3 个全局氛围层 + 古典元素去留：**

- **胶片颗粒**：替换稻纸纹理，密度暗区 > 亮区，opacity 0.02–0.04
- **暗角晕影**：radial-gradient 叠加，max opacity 0.15，仅四角
- **暖调色彩偏移**：调整现有 ambient gradient 的色温分布（高光微冷、暗部微暖）

古典元素处理：

- 保留：金色装饰线（更细）、古典边角（仅 hover）、墨晕光标
- 替换：稻纸纹理 → 胶片颗粒
- 移除：钻石装饰点、金色粒子（仅 Hero 追光中少量保留）

## 四、涉及文件

| 文件                                       | 改动类型                                             |
| ------------------------------------------ | ---------------------------------------------------- |
| `src/pages/index.astro`                    | 可能需包裹场景容器                                   |
| `src/components/home/HeroSection.astro`    | 重构：暗场 → 亮场 + 标题 stagger                     |
| `src/components/home/MetricsCounter.astro` | 数字滚入动画                                         |
| `src/components/home/ActivityCards.astro`  | 横摇入场 + 景深跟随                                  |
| `src/components/home/NewsSection.astro`    | 慢推入场                                             |
| `src/components/home/PartnerLogos.astro`   | 渐显群像                                             |
| `src/styles/global.css`                    | 胶片颗粒 + 暗角 + 色彩偏移 + 转场光带 + 新 keyframes |

## 五、非目标

- 不添加音频
- 不修改非首页页面
- 不影响无障碍（prefers-reduced-motion）
- 不改变现有内容结构
- 不引入新 JS 依赖

## 六、实现顺序

1. 全局 CSS 氛围层（胶片颗粒 + 暗角 + 色彩偏移）
2. Hero 追光启幕
3. 场景转场系统
4. Sections 逐个编排镜头
5. 微交互细节
