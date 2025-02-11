---
title: Git Cherry-Pick 教學
sidebar_label: 使用 cherry-pick 引入提交
author: zsl0621
description: 使用 cherry-pick 引入指定提交
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-09-07T14:10:12+08:00
  author: zsl0621
first_publish:
  date: 2024-09-07T14:10:12+08:00
---

把指定提交像是摘櫻桃一樣取過來，開發社群通常不鼓勵使用Cherry Pick，詳情請見 [Git Cherry Pick 的後遺症](https://blog.darkthread.net/blog/git-cherry-pick-cons/)，我們先不管這個問題只學如何使用。

```sh
git cherry-pick <commit-hash>
git cherry-pick <commit-hash1>^..<commit-hash2>
git cherry-pick <commit-hash1> <commit-hash2> <commit-hash3>
```

就是把指定提交由左至右一個一個重演在現在的提交之後，如果遇到合併衝突，解決方式和 rebase 一模一樣。

> [如何解決合併衝突？](../preliminaries/keyword#進階)

實用選項有這幾個

- `-e`: 手動設定提交訊息
- `-n`: 只引入提交內容不新增提交歷史
- `-x`: 自動加上註記說明是 cherry-pick 還有原始 hash
