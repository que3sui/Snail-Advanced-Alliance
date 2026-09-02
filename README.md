# 蜗壳进阶联盟官网

> 让喜欢折腾的人凑在一起折腾。

USTC 学生自组织「蜗壳进阶联盟」的官方网站。线上地址：[advancedguide.cn](https://advancedguide.cn)（GitHub Pages 备用地址：que3sui.github.io/Snail-Advanced-Alliance）。

## 仓库结构

```
├─ v3/        当前线上版本 —— Astro 6 + Tailwind 4，"活泼编辑部"风格
└─ legacy/    v2 存档 —— "Warm Light" 暖色电影感版本，仅作历史参考
```

## 本地开发

```bash
cd v3
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 v3/dist
```

## 内容维护

活动与访谈都是 Markdown，在 `v3/src/content/` 下：

- `events/` — 活动记录。frontmatter：`title` `date` `tag`（talk/workshop/hackathon/forum/camp/visit）`guest` `venue` `summary` `featured` 等
- `dialogues/` — 深度访谈。frontmatter：`interviewee` `intervieweeTitle` `summary` `tags` 等

新增一篇 md 文件并 push 到 `master` 分支即自动部署。

## 设计说明（v3）

"活泼编辑部"风：纸白底 + 墨黑描边卡片 + 硬偏移阴影 + 蜗壳橙主色；超大黑体标题、等宽字体标签、跑马灯与蜗牛吉祥物贴纸彩蛋。动画只用纯 CSS（hover 位移 / marquee），刻意不使用 view transitions 与滚动触发动画——v2 的历史教训见 `legacy/` 的 git log。
