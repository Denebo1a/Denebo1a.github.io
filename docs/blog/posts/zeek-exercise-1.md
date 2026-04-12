---
layout: article
title: 网络入侵检测与数字取证 - 课程笔记1 - zeek 基础
date: 2026-04-11
category: 课程笔记
tags: [zeek, 网络安全, 入侵检测, 数字取证]
cover: /covers/zeek-exercise-1.png
summary: 基于VitePress的个人博客网站搭建教程！
---

## 一、 Zeek 简介

“机制与策略分离 (Mechanism separate from policy)”

**Zeek**（原名 Bro，由 Vern Paxson 开发）是一个开源的**网络安全监控工具（Network Security Monitoring Tool）**。与传统的基于签名（Signature-based）的入侵检测系统（如 Snort）不同，Zeek 的核心理念在于**机制与策略分离 (Mechanism separate from policy)**。

-   **工作原理：** 底层的**事件引擎 (Event Engine)** 负责抓取网络数据包，将其解析为中性的、高层次的“事件”（如“建立了一个新连接”、“收到一个 HTTP 请求”）。上层的**策略脚本解释器 (Policy Script Interpreter)** 则执行用户编写的脚本，决定如何处理这些事件。
    
-   **核心优势：** 它不仅仅用于“检测报警”，更擅长于“网络行为记录与状态追踪”。它默认会生成丰富且结构化的日志文件（如 `conn.log`, `http.log`, `dns.log`），为数字取证和深层威胁追踪提供全方位的数据支持。
-   
### 正确的修改建议

为了让代码既符合逻辑，又具有高可读性，强烈建议将变量名从 `total_req` 修改为 `total_resp` 或 `all_response`，使其与课件中公式的语义完全对齐。

```zeek [test.zeek]
# 1. 修改 Record 的字段命名
type ScanStats: record {
    total_resp: count;         # 修改为 total_resp：记录总响应数
    total_404: count;          # 记录 404 响应总数
    unique_urls: set[string];  # 记录返回 404 的唯一 URL 集合
};

# ... 省略中间代码 ...

# 2. 计算比例时使用新变量名
local ratio_404: double = (s$total_404 + 0.0) / (s$total_resp + 0.0);

# ... 省略中间代码 ...

# 3. 在 http_reply 事件结尾处累加响应数
ip_stats[src_ip]$total_resp += 1;
```

```typescript [test.vue] {1}
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { Icon } from "@iconify/vue";

// 1. 修正主题定义：default 现在对应海洋蓝 (Ocean)
const themes = [
  {
    id: "default",
    name: "Ocean",
    color: "#0284c7",
    icon: "ph:drop-half-bottom-bold",
  },
  {
    id: "forest",
    name: "Forest",
    color: "#0f766e",
    icon: "ph:tree-evergreen-bold",
  },
  { id: "autumn", name: "Autumn", color: "#ea580c", icon: "ph:leaf-bold" },
  { id: "dark", name: "Dark", color: "#f8fafc", icon: "ph:moon-stars-bold" }, // 暗黑模式预览点使用白色
];

const currentTheme = ref("default");
const isOpen = ref(false);
const dropdownRef = ref(null);

// 2. 点击外部关闭下拉菜单的逻辑
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  // 读取本地存储
  const savedTheme = localStorage.getItem("blog-theme") || "default";
  currentTheme.value = savedTheme;
  applyTheme(savedTheme);

  // 绑定全局点击事件
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// 监听主题变化
watch(currentTheme, (newTheme) => {
  applyTheme(newTheme);
  localStorage.setItem("blog-theme", newTheme);
});

const applyTheme = (themeId) => {
  if (themeId === "default") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", themeId);
  }
};

const selectTheme = (id) => {
  currentTheme.value = id;
  isOpen.value = false; // 选完后自动关闭
};

// 计算当前选中的主题对象（用于按钮显示）
const activeTheme = computed(
  () => themes.find((t) => t.id === currentTheme.value) || themes[0],
);
</script>
```

## 二、 Zeek 脚本语言特性 (Script Language Features)

Zeek 使用的是一种专为网络流量分析设计的领域特定语言（DSL），语法上受到了 C 和 Python 的影响，但有着极强的网络特性。

### 1\. 核心运行机制：事件驱动 (Event-Driven)

Zeek 脚本的核心执行单元是**事件 (Event)**，而不是传统的按顺序执行的 Main 函数。

-   **被动触发：** 脚本不主动抓包，而是等待 Zeek 引擎在解析流量时抛出事件（如 `zeek_init`, `new_connection`, `http_header`, `http_reply`）。
    
-   **上下文传递：** 每次事件触发时，引擎会将解析好的网络上下文（如 `connection` 记录）作为参数自动传递给事件处理程序。
    

### 2\. 网络特化数据类型 (NMS Types)

除常规的 `string`, `int`, `count` (无符号整数，常用作计数器或状态码), `double` 外，Zeek 原生支持网络数据：

-   `addr`: IP 地址（原生兼容 IPv4 和 IPv6）。
    
-   `port`: 端口（如 `80/tcp`，内置了协议属性）。
    
-   `subnet`: 子网（如 `192.168.1.0/24`），方便进行网段归属判断。
    

### 3\. 强大的复合数据结构 (Data Structures)

在编写跨数据包的状态追踪策略时，以下三种结构最为关键：

-   **`table` (哈希表/字典)：** 键值对映射，查找效率极高。例如 `table[addr] of count` 可用于统计每个 IP 的请求量。
    
-   **`set` (集合)：** 自动去重的数据结构，极其适合成员测试和统计“唯一性”（如统计单一 IP 关联的 _不同_ User-Agent 数量）。
    
-   **`record` (记录/结构体)：** 用于将多个相关的状态打包在一起。Zeek 绝大多数的内置状态（如 `connection`）都是通过 record 组织的。
    

---

## 三、 实验演示与经验总结 (Practical Experience)

在之前的实验中，我们利用 Zeek 完成了两个经典的威胁检测任务：

1.  **Experiment III (代理检测)：** 监控同一源 IP 是否关联了 3 个及以上的不同 User-Agent。
    
2.  **Homework IV (扫描器检测)：** 在 10 分钟窗口内，监控某 IP 的 404 响应总数及比例，识别恶意目录扫描行为。
    

结合代码调试与编写过程，我们总结出以下宝贵的实战经验与避坑指南：

### 经验结论 1：复杂状态追踪依赖于全局变量与嵌套结构

网络检测通常需要跨越多个数据包甚至长达数十分钟的时间窗口。

-   **最佳实践：** 使用 `global` 声明全局字典，将源 IP (`addr`) 作为键。
    
-   **结构嵌套：** 对于复杂的业务逻辑，不要定义多个零散的字典。应采用 `table[addr] of record` 的形式（如实验四中定义了包含总请求数、404 数、唯一 URL 集合的 `ScanStats` record），使得状态管理高度聚合且易于维护。
    

### 经验结论 2：严防数据类型陷阱与精度丢失

在 Zeek 中处理数值时，类型推断非常严格。

-   **整数除法陷阱：** 实验四中计算 404 响应比例时，如果直接用 `count / count`（如 3/10），Zeek 会执行整数除法结果为 `0`。
    
-   **解决方案：** 必须在变量后隐式转换为浮点数：`local ratio: double = (total_404 + 0.0) / (total_resp + 0.0);`。
    

### 经验结论 3：严格的命名规范与关键字冲突

Zeek 的编译器具有极高的警惕性。

-   **严禁数字开头：** 变量名绝不能以数字开头（如 `404_total` 是致命的语法错误）。应改为 `total_404` 或 `count_404`。
    
-   **小心内置标识符冲突：** 在定义时间变量时，不要使用 `current_time`。因为 `current_time()` 是 Zeek 获取系统绝对时间的内置系统函数（BIF），覆盖它会引发一连串的重定义错误。建议使用 `now` 或 `current_ts`。
    
-   **语义准确：** 统计 HTTP 返回码数量时，变量名应明确为 `total_resp`（响应总数），而非 `total_req`（请求总数），以保证代码在网络协议语境下的严谨性。
    

### 经验结论 4：防御性编程与底层字段提取

-   **安全检查操作符 (`?`)：** 在提取深层嵌套的记录数据时（如提取 HTTP 请求的相对路径 URI：`c$http$uri`），可能因为抓包不全或连接异常导致 `c$http` 为空。必须使用 `if ( c?$http && c$http?$uri )` 进行安全检查，防止脚本抛出空指针异常导致 Zeek 崩溃。