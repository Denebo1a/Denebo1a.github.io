---
layout: article
title: 面向 Vibe Coding 的 JS 速成手册(1)：数据类型
date: 2026-05-12
category: 学习笔记
tags:
  - Vibe Coding
  - JavaScript
summary: 这期我们来看看最基础的 JavaScript 数据类型。
cover: /blog/covers/default.png
---

## 数据类型
JavaScript 是一门动态的、弱类型的语言。这意味着你不需要在声明变量时指定其类型，而且同一个变量可以在不同的时间保存不同类型的值。

在最新的 ECMAScript 标准中，JavaScript 的数据类型被严格划分为两大阵营：**原始数据类型（Primitive Types）** 和 **引用数据类型（Reference Types）**。而在这之上，又衍生出了丰富的**数据结构（Data Structures）**。

### 原始数据类型（Primitive Types）

原始类型是最基本的数据类型，它们的值是**不可变的（Immutable）**，并且按值（Value）**直接存储在内存的**栈（Stack）中，访问速度极快。目前共有 7 种：

#### 1\. Number（数字）

JavaScript 内部只有一种数字类型：基于 IEEE 754 标准的双精度 64 位浮点数。这意味着它没有专门的“整数”类型。

-   **特性**：由于浮点数计算的特性，会产生经典的精度丢失问题（如 `0.1 + 0.2 !== 0.3`）。
    
-   **特殊值**：
    
    -   `NaN` (Not a Number)：表示非数字，用于计算出错时的占位符。有趣的是 `typeof NaN === 'number'`，且 `NaN !== NaN`。
        
    -   `Infinity` / `-Infinity`：表示正/负无穷大。
        

#### 2\. String（字符串）

用于表示文本数据，由 UTF-16 代码单元序列组成。

-   **特性**：一旦创建就无法修改。对字符串的方法操作（如 `toUpperCase()`）实际上是返回了一个全新的字符串。
    

#### 3\. Boolean（布尔值）

只有两个值：`true` 和 `false`，通常用于逻辑判断。

#### 4\. Undefined（未定义）

当声明了一个变量但未赋予初始值时，它的默认值就是 `undefined`。

-   **注意**：函数没有显式使用 `return` 返回值时，也会默认返回 `undefined`。
    

#### 5\. Null（空值）

表示“故意缺失的值”，通常用于主动释放一个对象的引用。

-   **历史遗留 Bug**：`typeof null === 'object'`。这是 JS 初版语言设计留下的 bug，但为了兼容性一直保留至今。
    

#### 6\. Symbol（符号 - ES6 引入）

创建后独一无二且不可变的数据类型。

-   **用途**：主要用于给对象添加唯一的属性名，防止属性名冲突（如在底层库或框架中给外部对象打补丁时）。
### 引用数据类型（Reference Type）

引用类型的值是**可变的（Mutable）**。它们存储在内存的**堆（Heap）**中，而栈中只保存了指向堆内存地址的**指针（Reference）**。

#### 1\. Object（对象）

对象是 JavaScript 中唯一的核心引用类型。**在 JS 中，除了上述 7 种原始类型，其他所有一切本质上都是对象（Object）**。

对象是一组键值对（Key-Value pairs）的无序集合。

-   **键（Key）**：只能是 String 或 Symbol。
    
-   **值（Value）**：可以是任何数据类型（包括另一个对象或函数）。
    

### 基于 Object 衍生的核心数据结构

基于 Object，JavaScript 提供了极其丰富的高级数据结构来处理复杂的逻辑和数据组织。

#### 1\. Array（数组）

有序的数据集合。JS 的数组是动态的，并且可以在同一个数组中存放不同类型的数据。

-   **底层机制**：本质上，数组是带有特殊 `length` 属性以及数字索引键的对象。
    
-   **常用方法**：`push/pop`（栈操作）、`shift/unshift`（队列操作）、`map/filter/reduce`（函数式迭代）。
    

#### 2\. Function（函数）

在 JS 中，函数是**一等公民（First-class Function）**。

-   **本质**：函数也是对象（Callable Object），它可以拥有自己的属性和方法，可以作为参数传递给其他函数，也可以作为返回值被返回（这是实现**闭包**的基础）。
    

#### 3\. Map 与 WeakMap（键值对集合 - ES6 引入）

| 特性       | Object                         | Map                    |
| :------- | :----------------------------- | :--------------------- |
| **键的类型** | 仅限 String 或 Symbol             | **任何类型**（包括函数、对象、基本类型） |
| **顺序性**  | 属性遍历顺序复杂且不完全可靠                 | 严格按照插入顺序遍历             |
| **大小获取** | 需要手动遍历或 `Object.keys().length` | 直接通过 `map.size` 获取     |

-   **WeakMap**：Map 的兄弟。它的键**必须**是对象，且这些对象是**弱引用**的。这意味着如果没有其他地方引用该键对象，垃圾回收机制（GC）会自动回收它，非常适合用于缓存或关联 DOM 节点的数据，防止内存泄漏。
    

#### 4\. Set 与 WeakSet（集合 - ES6 引入）

值的集合，其最大特点是**任何值在 Set 中都是唯一的（不重复）**。

-   **常见用途**：数组去重（`[...new Set(array)]`）、交集/并集计算。
    
-   **WeakSet**：与 WeakMap 类似，成员只能是对象，且为弱引用。
    

#### 5\. 其他内置专用对象

-   **Date**：处理日期和时间。
    
-   **RegExp**：正则表达式，用于复杂的模式匹配和文本搜索。
    
-   **Error**：用于异常处理（包括 `TypeError`, `ReferenceError` 等子类型）。
    
-   **Math** / **JSON**：这两个不是构造函数，而是提供静态属性和方法的单例对象。
    

###  数据类型检测的“三大金刚”

判断一个变量到底属于什么结构，是 JS 开发中的常见痛点。

1.  **`typeof`**：适合检测原始类型。
    
    -   `typeof 'abc'` ➔ `'string'`
        
    -   `typeof []` ➔ `'object'` _(无法区分数组、普通对象和 null)_
        
    -   `typeof function(){}` ➔ `'function'` _(特殊对待)_
        
2.  **`instanceof`**：用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。适合检测复杂的引用类型。
    
    -   `[] instanceof Array` ➔ `true`
        
    -   `new Date() instanceof Date` ➔ `true`
        
3.  **`Object.prototype.toString.call()`**：**最精准、最万能的检测方法**。
    
    -   `Object.prototype.toString.call([])` ➔ `'[object Array]'`
        
    -   `Object.prototype.toString.call(null)` ➔ `'[object Null]'`
        
    -   `Object.prototype.toString.call(new Map())` ➔ `'[object Map]'`