---
title: 使用互動式變基 Interactive Rebase 任意修改提交歷史
author: zsl0621
sidebar_label: 使用互動式變基任意修改提交歷史
description: 最快最清楚而且最正確的搞懂變基 git rebase。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2025-01-12T23:40:00+08:00
  author: zsl0621
first_publish:
  date: 2025-01-12T23:40:00+08:00
---

使用 `git rebase -i` 可進行互動式變基，這個指令用途強大並且簡單易懂，使用時可以把腦袋丟掉不用像一般的 rebase 還要背[口訣](./rebase#口訣)。

筆者使用這個的頻率比前面的合併分支高多了，到目前的使用體驗為止，筆者認為這是 git 最強大的指令，包含移動提交、刪除提交、修改提交內容、修改提交訊息全部都可以做到。他的原理仍舊是基於上述，其實際運作仍是暫存提交後再接上暫存的提交，但是使用時完全不會感覺到分支操作，因為用戶不需要輸入分支。互動式變基常用的選項有五個：

- p, pick 預設，選擇該提交
- r, reword 修改提交訊息
- e, edit 修改提交內容
- s, squash 合併到前一個提交
- f, fixup 合併到前一個提交，不顯示被合併的提交的提交訊息

[下一篇文章](./edit-commits)會更仔細的介紹各種修改提交的情況，這邊簡單示範幾個 rebase 選項，要練習的話請使用 [範例 repo](https://github.com/PIC16B/git-practice) 操作，還想學會大魔王 onto 的話請看[搞懂 Rebase Onto](../advance/rebase-onto)。

## 修改範例

```sh
# 複製範例 repo
git clone https://github.com/PIC16B/git-practice -q && cd git-practice

# rebase 最近三個提交
git rebase -i HEAD~3

# 進入文件編輯，把三個 commit 第一個單字
# 由上到下依序改為 r(修改提交訊息) e(編輯提交) s(合併到前一個提交)
r <hash> <msg>
e <hash> <msg>
s <hash> <msg>
# Esc後使用冒號進入指令模式，輸入wq儲存退出

# 1. 進入第一個編輯視窗，這時你位於「r修改提交訊息階段」，修改完成後儲存退出
# 2. 進入「e編輯提交階段」，在這裡可以對文件作任何改動，完成後 git add 不需 commit
#    使用 git rebase --continue 繼續下一個 rebase
# 3. 進入「s合併提交階段」，這裡會出現原有的兩個提交訊息，讓你修改合併後的提交訊息
```

第一次操作肯定會有點害怕，不過使用範例 repo 怎麼亂試都沒關係，也可以上 YT 隨便找一個實作影片看指令怎麼打。

## 可以在互動式提交過程中進行提交嗎？

一般的互動式提交，在 edit 模式中不需要使用 `git commit -m <msg>` 直接 `git rebase --continue` 就會修改該次提交，那如果用了會怎樣？答案是會直接插入一個新的提交。

請記住筆者[前一篇文章](./rebase)說的原理，變基過程中的提交只是被暫存沒有說你不能作這些事情，所以甚至可以在變基過程中使用 `git cherry-pick` 插入一個新的提交。

## 更複雜的 `git rebase --onto`

過於複雜，他可以直接寫成一篇文章，請看 [[進階] 看懂 git 文檔和 rebase onto](../advance/rebase-onto)。

## 重構初始提交

使用 `--root` 可以重構初始提交，但是 rebase 就已經夠危險了，除非有絕對需求要重構 root 否則還是盡量避免吧。
