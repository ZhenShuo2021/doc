---
title: "[微進階] 從過去提交修改程式碼"
description: 回到過去 commit 修改程式碼。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-08-17T00:07:33+08:00
  author: zsl0621
first_publish:
  date: 2024-08-17T00:07:33+08:00
---

# 從過去提交修改程式碼

> 什麼情況會用到？

當你需要

1. 舊版本的一些功能
2. 需要在舊版的基礎上添加新功能時
3. 又或者 de 某些只出現在舊版本的 bug 時

需要這個功能。

## 回到過去

如果我想回到某個 commit，從該 commit 開始修改：

```sh
git log
git switch -d <hash>
```

只是要修改單一提交的話請使用 `git rebase -i` 的 edit 功能。

## 新增 feature

接下來修改文件，完成後合併回主分支，依照工作量有兩種合併方式：

- 只是小 feature:  
使用cherry-pick: 修改完成 add commit 之後，直接回到 main branch `git switch main`，並且撿回剛剛的 commit `git cherry-pick <new-hash>`

- 需要延伸修改:  
新建分支: 用新的 branch 儲存，`git switch -c <new-branch>`，接下來依照[前一篇教學](/docs/docs/01-git/60-remote-best-practice/index.md)完成合併。

當你改到昏頭可以用 `git diff branch1..branch2` 查看兩個分支的差異。
