---
title: "[微進階] 使用 Rebase 重構提交"
author: zsl0621
description: 最快最清楚的搞懂 git rebase。
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
  date: 2024-09-07T14:10:12+08:00
---

git rebase 有點讓人感到畏懼，除了高風險的分支操作之外，網路文章讓人不好理解也是一個問題。為什麼會不好理解呢，我認為是文章沒有說明清楚**誰接上誰**。本文會用最簡短的文字簡單介紹 rebase，不會講一堆有的沒的混淆視聽。

:::danger 提醒

Rebase 很危險，請用範例 repo 進行測試！

- [單分支範例](https://github.com/PIC16B/git-practice)  
- [我自己做的簡易多分支範例](https://github.com/ZhenShuo2021/rebase-onto-playground)  
:::

## 什麼是 Rebase

介紹 rebase 前我們要了解 merge。merge 是把兩個分支合併成一個分支，以下方原始狀態為例，使用 git merge 會產生新的提交 F 紀錄合併，並且保留分支結構

```sh
# 原始狀態

main     A---B---C---D---E
              \         
feature        A1--B1--C1 
```

```sh
# 使用 git merge
# git checkout main
# git merge feature

main     A---B---C---D---E---F
              \             /
feature        A1---B1----C1 
```

但如果我們想保持提交樹的乾淨，這時候我們就可以使用 `git rebase` 完成。rebase 用一句話講就是

:::tip 口訣

<center>**將「目前分支」移到旁邊，把「目標分支」拿過來**</center>
<center>**再把移到旁邊的「目前分支」想辦法接到後面**</center>

:::

這句話是從码农高天的[影片](https://www.youtube.com/watch?v=uj8hjLyEBmU)偷來的，短短一句話我覺得比所有文章都讓人更好理解。在原始狀態使用 git rebase 效果如下：

```sh
# 使用 git rebase
# git checkout feature
# git rebase main

main     A---B---C---D---E
                           \
feature                    A1'--B1'--C1'
```

可以看到沒有紀錄合併的提交。rebase 看起來很簡單，但是細心的人可能會發現多了 prime symbol `'`，這裡我們詳細解釋 `git rebase main` 做了什麼：

1. 找到共同基礎 (B)
2. 把原先所在分支 (feature) 其基礎之後的提交移到旁邊暫存 (A1, B1, C1)
3. 把目標分支 (main) 移過來，再把基礎向後移動到他自己的最新提交 (基礎變成 E)
4. 把暫存的提交連接到基礎後面[^1] (接上後成為 A1', B1', C1')
5. 如果需要，處理合併衝突

[^1]: 網路上講的「重演」只是在說不是複製而是一個一個重新接上，每個提交都會計算新的 hash，但是寫的落落長實在很模糊焦點。

第一步的「找到共同基礎」就是 re-base 的核心，`重新`加上`基底`，也就表示此指令用於幫提交修改基底。如果覺得看細節反而混淆，記住口訣也可以讓你正常使用好一段時間。

## 互動式操作 rebase

使用參數 `git rebase -i` 可互動式 rebase，我使用這個的頻率比前面的合併分支高多了，到目前的使用體驗為止，我認為這是 git 最強大的指令，包含移動提交、刪除提交、修改提交內容、修改提交訊息全部都可以做到。他的原理仍舊是基於上述，但是使用時完全不會感覺到分支操作，因為用戶不需要輸入分支，但是他的實際使用仍是移動、放進來、再接上。rebase -i 後常用的選項有五個：

- p, pick 預設，選擇該提交
- r, reword 修改提交訊息
- e, edit 修改提交內容
- s, squash 合併到前一個提交
- f, fixup 合併到前一個提交，不顯示被合併的提交的提交訊息

[下一篇文章](./edit-commits)會介紹修改各種 commit 的情況，這邊簡單示範幾個 rebase 選項，使用 [範例 repo](https://github.com/PIC16B/git-practice) 操作。

### 修改提交內容

```sh
# 複製範例 repo
git clone https://github.com/PIC16B/git-practice -q && cd git-practice

# rebase 最近三個提交
git rebase -i HEAD~3

# 進入文件編輯，把三個 commit 第一個單字
# 依序改為 r(修改提交訊息) e(編輯提交) s(合併到前一個提交)
r <hash> <msg>
e <hash> <msg>
s <hash> <msg>
# Esc後使用冒號進入指令模式，輸入wq儲存退出

# 1. 進入第一個編輯視窗，修改完提交訊息後退出
# 2. 進入編輯提交，在這裡可以對文件作任何改動，完成後 git add 不需 commit
#    使用 git rebase --continue 繼續下一個 rebase
# 3. 進入合併提交，這裡會出現原有的兩個提交訊息，讓你修改合併後的提交訊息
```

整體操作和上述基本一樣了，第一次操作肯定會有點抖，不過使用範例 repo 想怎麼作就怎麼作，或者可以上 YT 隨便找一個實作影片看他怎麼打指令的。

## Rebase 兩個分支

[這篇文章](https://myapollo.com.tw/blog/git-tutorial-rebase/#rebase-%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)的範例非常糟糕，原因如下：當我們想要對完成開發的分支進行合併，應該是先 checkout 進入要被合併的分支，再使用 `git rebase main`，因為 main 分支應該是最穩定的分支，在 main 分支 rebase feature 分支會造成 main 分支的提交改變，我被這篇文章誤導很久。

:::danger 再提醒一次

「絕對不要在 main 上 rebase 其餘分支，因為這會修改穩定的 main 的提交紀錄」

:::

雖然他應該是想介紹 rebase 的特性，但是例子舉的太爛混淆視聽，並且新手根本用不到，放在文章開頭只會讓人越讀越混亂。

## 更複雜的 `git rebase --onto`

過於複雜，他可以直接寫成一篇文章，請看 [[進階] 看懂 git 文檔和 rebase onto](./rebase-onto)。

## 重構初始提交

使用 `--root` 可以重構初始提交，但是 rebase 就已經夠危險了，重構初始提交還是別吧。
