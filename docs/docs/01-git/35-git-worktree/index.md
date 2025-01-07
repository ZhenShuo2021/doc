---
title: "[進階] 比 stash 更方便的 worktree"
author: zsl0621
description: Git Worktree
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-09-10T16:15:33+08:00
  author: zsl0621
first_publish:
  date: 2024-09-10T16:15:33+08:00
---

# Git Worktree：有效管理多個分支和工作目錄的秘訣

https://notes.boshkuo.com/docs/DevTools/Git/git-worktree

已經有很好的文章了，所以直接看他的。

> 解決什麼問題？  

1. 使用 git stash 在分支之間切換步驟太多
2. 工作時間拉長也記不起來 stash 了什麼
3. 而且如果需要觀看 stash 暫存的內容也不方便

git worktree 管理的資料夾 _不在原 Git 專案的資料夾底下，但它仍受原 Git 專案所管理_

其實沒有很進階，但是他是新功能所以放在進階。
