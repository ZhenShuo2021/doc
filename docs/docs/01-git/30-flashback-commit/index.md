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
## 什麼情況會用到
當你需要舊版本的一些功能，或者需要在舊版的基礎上添加新功能時，又或者 de 某些只出現在舊版本的 bug 時需要回到過去這個功能。本文介紹從舊 commit 新增 feature 的方式，由於新版 git 把 checkout [拆分](https://dwye.dev/post/git-checkout-switch-restore/)為 restore 和 switch，這裡也與時俱進使用新指令。

- git restore 恢復工作區文件
- git switch 切換或創建新分支

## 回到過去
如果我想回到某個 commit，從該 commit 開始修改：

```sh
git log
git switch -d <hash>
```

這個指令會：
1. 切換到指定的 commit，進入 detached HEAD[^1]模式
2. 用於檢視舊版本或進行臨時測試，這個狀態下的修改不會自動保存
4. 等同於舊版 `git checkout <hash>`

如果不需要回到以前，直接使用 `git switch -c` 創建新分支，c = create。

[^1]: 沒有家的 HEAD，如果有記 hash 可以找回，否則會被 git gc 機制一段時間後丟掉。

## 新增 feature
接下來修改文件，完成後合併回主分支，依照工作量有兩種合併方式：

- 只是小 feature:  
使用cherry-pick: 修改完成 add commit 之後，直接回到 main branch `git switch main`，並且撿回剛剛的 commit `git cherry-pick <new-hash>`

- 需要延伸修改:  
新建分支: 用新的 branch 儲存，`git switch -c <new-branch>`，接下來依照[前一篇教學](/docs/git/remote-best-practice)完成合併。

當你改到昏頭可以用 `git diff branch1..branch2` 查看兩個分支的差異。
