---
title: 一分鐘入門
author: zsl0621
description: 最快速上手 Git 的文章沒有之一。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-06-02T04:07:33+08:00
  author: zsl0621
first_publish:
  date: 2024-06-02T04:07:33+08:00
---

# Git 一分鐘入門

這篇會介紹 Git 的基礎指令，會先介紹最簡單可操作的指令。

## 基礎操作指令

以下指令就是最基本的操作方式：

```sh
git init                    # 初始化
git add <file-name>         # 放到預存區，使用 git add . 預存所有檔案
git commit -m <messages>    # 提交到儲存庫
```

這些指令完成了上一篇中描述的[檔案標記狀態](../git/preliminaries/basic-knowledge#概念)。接下來可以用這些指令查看檔案狀態和歷史：

```sh
git status                  # 檔案狀態（新增A、修改M、刪除D、未追蹤U）
git log                     # 提交歷史
```

1. `git status` 查看尚未提交的修改狀況，當修改告一段落時可以 add and commit
2. `git log` 查看提交歷史，加上 --oneline 印出乾淨的提交歷史

使用情境是 `git status` 查看修改了哪些檔案，修改完成後 add and commit，再用 `git log` 查看提交歷史。

:::info 什麼時候該 commit?

每次 commit 不該累積太多修改，每有一個基本可運行的模組就該提交，原因有：

1. 定位：當出現問題時回到前一個小提交很容易。如果累積大量更新則難以單獨還原一個功能。
2. 可讀性：提升可讀性。
3. 協作：多人協作時減少合併衝突。

:::

<br /><br />

接下來是兩個簡單的範例，首先是 git status，分成三種狀態，從上到下分別是已預存、已修改、未追蹤。

![git status](git-status.webp "git status")
<br />

再來是 git log 範例，黃色字體是 `commit <hash> (目前位置 -> 所在分支)`

![git log](git-log.webp "git log")
