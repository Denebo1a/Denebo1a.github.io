---
layout: article
title: vitepress vp-doc markdown样式渲染测试
date: 2026-04-30
category: 测试
tags: [markdown, vitepress]
summary: 本文档旨在全面测试 `vp-doc` 样式环境下的元素渲染效果，涵盖了标准 Markdown 语法、排版元素以及 VitePress 提供的高级扩展功能。
cover: /blog/covers/default-empty-cover.png
---

以下为测试示例内容。

## 1. 文本格式化 (Text Formatting)

正常文本段落。测试一段**粗体文本 (Bold)**，一段*斜体文本 (Italic)*，以及一段~~删除线文本 (Strikethrough)~~。我们也可以将它们组合起来，比如 ***加粗斜体***。

为了展示行内元素，这里有一段内联代码：你可以使用 `document.querySelectorAll('.vp-doc')` 来检查 DOM 结构。还可以使用键盘标签：请按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制代码。

## 2. 标题层级 (Headings)

下面是各级标题的字体大小、字重和锚点 (Anchor) 渲染测试：

### H3 标题示例
#### H4 标题示例
##### H5 标题示例
###### H6 标题示例

## 3. 列表 (Lists)

**无序列表 (Unordered List) - 以音乐流派为例：**
* 独立摇滚 (Indie Rock)
* 盯鞋 (Shoegaze)
  * 嵌套层级 1：效果器链配置
  * 嵌套层级 2：空间感混响
* 另类摇滚 (Alt Rock)

**有序列表 (Ordered List) - 以生物信息学分析为例：**
1. 获取并清洗 RNA-seq 原始读取数据。
2. 使用 DESeq2 进行差异表达分析。
3. 提取显著性差异基因并进行 GO/KEGG 富集分析可视化。

## 4. 任务列表 (Task Lists)

- [x] 使用 Vue 3 + TypeScript 搭建基础架构
- [x] 将 ReprogHub 平台部署至阿里云 ECS 服务器
- [ ] 开发 Slay the Spire 2 的 Godot 视觉模组
- [ ] 完善 K-Means 和 PCA 的网络流量聚类脚本

## 5. 引用块 (Blockquotes)

> 这是一个标准的引用块。它通常用于高亮一段引言或者外部资料。
> 
> > 这是一个嵌套的引用块 (Nested Blockquote)。
> > 在 VitePress 的默认主题中，它的左侧边框颜色和背景色可能会有所不同。

## 6. 表格 (Tables)

测试表头、对齐方式以及斑马纹（如果主题有配置）：

| 技术栈选型 | 核心作用 | 熟练度评估 |
| :--- | :---: | ---: |
| **Vue 3** | 构建前端交互界面的核心框架 | 熟练 |
| **Element Plus** | 提供标准化 UI 组件库 | 熟练 |
| **Tailwind CSS** | 响应式布局与实用类优先样式 | 熟悉 |
| **Pinia** | 跨组件状态管理 | 熟练 |

## 7. 链接与媒体 (Links & Images)

这是一个外部链接：[VitePress 官方中文文档](https://vitepress.dev/zh/)。  
这是一个带 Title 属性的链接：[鼠标悬停查看 Title](https://github.com/ "GitHub Homepage")。

这是一张测试图片及其描述（Alt Text）：
![VitePress Logo](https://vitepress.dev/vitepress-logo-large.webp)

## 8. 代码高亮与代码块 (Code Blocks)

测试 Prism.js / Shiki 在暗黑和明亮模式下的语法高亮：
```typescript
import { defineStore } from 'pinia'

// 测试 Pinia 状态管理器的代码渲染
export const useMainStore = defineStore('main', {
  state: () => ({
    isDarkTheme: true,
    userRole: 'developer'
  }),
  actions: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme
    }
  }
})
```

```python
# 测试 Python 代码渲染
import pandas as pd
from sklearn.cluster import KMeans

def cluster_traffic(data):
    kmeans = KMeans(n_clusters=3, random_state=42)
    return kmeans.fit_predict(data)
```

## 9. VitePress 专属语法 (Custom Containers)

VitePress 提供了内置的自定义容器，用于呈现不同类型的信息块：

::: info 提示信息
这是一个 `info` 块。适合用于放置一般的补充说明或环境前置要求。
:::

::: tip 最佳实践
这是一个 `tip` 块。例如：在 Element Plus 中处理抽屉或弹窗组件的挂载时，`append-to-body` 才是正确的标准属性名。
:::

::: warning 注意事项
这是一个 `warning` 块。例如：使用 Conda 移除环境时，请注意 `conda-script.py: error: unrecognized arguments: --all` 错误，说明该参数可能已被弃用或输错。
:::

::: danger 危险操作
这是一个 `danger` 块。通常用于警告用户该操作可能导致数据丢失或服务中断。
:::

::: details 点击查看详细配置文件
这是一个折叠块。适合用于放置长段日志、完整的 Nginx 配置或 Webpack/Vite 的长篇配置项。
```json
{
  "name": "deneblog-theme",
  "version": "1.0.0",
  "dependencies": {
    "vitepress": "^1.0.0"
  }
}
```
:::

## 10. 代码组 (Code Groups)

测试多标签页的代码组（VitePress 专属特性）：

::: code-group
```npm [npm]
npm install vitepress vue
```

```yarn [yarn]
yarn add vitepress vue
```

```pnpm [pnpm]
pnpm add vitepress vue
```

:::

## 11. 数学公式 (Math Equations)

*注：此项测试需要 VitePress 已正确配置 `markdown-it-mathjax3` 或相关数学插件才能正常渲染。*

内联公式渲染测试：差异表达分析中的 $\log_2(\text{Fold Change})$ 值用于衡量基因表达的变化幅度。

独立块级公式渲染测试：
$$
\text{DESeq2 Model: } K_{ij} \sim \text{NB}(\mu_{ij}, \alpha_i)
$$
$$
\mu_{ij} = s_j q_{ij}
$$

## 12. 分隔线 (Horizontal Rules)

下方是一条标准的分隔线，用于测试区块间的视觉分割效果。

---

渲染测试结束。