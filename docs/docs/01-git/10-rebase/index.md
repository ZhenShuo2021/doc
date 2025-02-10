---
title: "[微進階] 使用 Rebase 變基提交"
author: zsl0621
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
  date: 2024-09-07T14:10:12+08:00
---

我認為網路文章每篇講的都不一樣是初學者對變基 (rebase) 感到畏懼的原因，為了確保本文的說法絕對正確，撰寫時同時參考 Git 官方文檔以及 Pro Git Book，比對英文繁中簡中三個版本的說法以及指令實際作用才寫成此篇文章，筆者保證本文絕對正確，所有和本文矛盾的說明都是錯的。

本文的目標是最快、最清楚且正確的搞懂 rebase，不會東拉西扯混淆視聽。

:::danger 提醒

Rebase 很危險，請用範例 repo 進行測試！

- [單分支範例](https://github.com/PIC16B/git-practice)  
- [仿照文檔的多分支範例](https://github.com/ZhenShuo2021/rebase-onto-playground)  
:::

## 什麼是變基 Rebase

介紹 rebase 前我們要了解 merge。merge 是把兩個分支合併成一個分支，以下方原始狀態為例，使用 git merge 會產生新的提交 F 紀錄合併，並且保留分支結構：

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

但如果我們想保持提交樹的乾淨，這時候我們就可以使用 `git rebase` 完成。在原始狀態使用 git rebase 效果如下：

```sh
# 使用 git rebase
# git checkout feature  # 切換目前分支到 feature
# git rebase main       # 目標分支是 main

main     A---B---C---D---E
                           \
feature                    A1'--B1'--C1'
```

可以看到目前分支 (feature) 被接在目標分支 (main) 的後面而且沒有用於紀錄合併的提交。細心的人可能會發現多了 prime symbol `'`，這裡我們詳細解釋 `git rebase main` 做了什麼：

1. 找到共同祖先 (B)
2. 找到需要被變基的提交並且暫存他們  
  這些提交包含<u>**從共同祖先到目前分支之間的所有提交，並且剃除目標分支原本就已經有的提交**</u> (此範例沒有被剃除的提交，暫存 A1 B1 C1)
3. 將目標分支最後一個提交作為出發點，把暫存的提交逐個重演[^1]到目標分支後面 (接上後成為 A1' B1' C1')
4. 如果需要，處理合併衝突

[^1]: 重演 (replay)，用於表示不只是簡單的將提交複製貼上，而是會重新生成 commit hash。

re-base 的核心兩個單字分別代表 `重新` 以及 `基底`，表示此指令用於幫提交修改基底。第一次看到覺得很複雜是正常的，如果看完細節覺得頭昏腦脹，可以用簡化的口訣將 rebase 理解為

:::tip 口訣

<center>**比較「目前分支」和「目標分支」**</center>
<center>**把「目前分支」的提交移動到「目標分支」之後**</center>

:::

請務必記住口訣，這可以讓你正常使用好一段時間。

筆者保證這段敘述的絕對正確，所有違背這段敘述的說明都是錯的。

## 誰 Rebase 誰才對？

[這篇文章](https://myapollo.com.tw/blog/git-tutorial-rebase/)的用法存在致命錯誤請不要被誤導，錯誤原因是他在主分支使用 `git rebase feature`，這會造成主分支的提交改變，而主分支是最穩定的分支，<u>**絕對不可能為了合併子分支而修改主分支既存的提交歷史**</u>。

正確的使用方式應該是先移動到要被合併的分支，再使用 `git rebase main`：

```sh
# 這四個指令代表把 feature-1 和 feature-2 在 main 之後進行重演
git switch feature-1
git rebase main
git switch feature-2
git rebase main

# 或者使用兩個參數，第二個參數代表預先 switch 到該分支，效果和上面的指令完全相同
git rebase main feature-1
git rebase main feature-2
```

如果按照該文章的方式，每次提交會變成將 feature 作為基底，把 main 分支放在 feature 後面，然而 feature 是新的、未經過時間驗證的提交，出現問題會導致要修復的提交歷史反而在穩定的提交之前。

:::danger 再提醒一次

絕對不要在主分支上 rebase 其餘分支，因為這會修改穩定的主分支提交紀錄。

:::

## 互動式變基 Interactive Rebase{#interactive}

使用 `git rebase -i` 可進行互動式變基，這個指令用途強大並且簡單易懂，使用時可以把腦袋丟掉不用像上面還要背口訣。

筆者使用這個的頻率比前面的合併分支高多了，到目前的使用體驗為止，筆者認為這是 git 最強大的指令，包含移動提交、刪除提交、修改提交內容、修改提交訊息全部都可以做到。他的原理仍舊是基於上述，其實際運作仍是暫存提交後再接上暫存的提交，但是使用時完全不會感覺到分支操作，因為用戶不需要輸入分支。互動式變基常用的選項有五個：

- p, pick 預設，選擇該提交
- r, reword 修改提交訊息
- e, edit 修改提交內容
- s, squash 合併到前一個提交
- f, fixup 合併到前一個提交，不顯示被合併的提交的提交訊息

[下一篇文章](./edit-commits)會更仔細的介紹各種修改提交的情況，這邊簡單示範幾個 rebase 選項，要練習的話請使用 [範例 repo](https://github.com/PIC16B/git-practice) 操作。

### 修改範例

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

## 更複雜的 `git rebase --onto`

過於複雜，他可以直接寫成一篇文章，請看 [[進階] 看懂 git 文檔和 rebase onto](./rebase-onto)。

## 重構初始提交

使用 `--root` 可以重構初始提交，但是 rebase 就已經夠危險了，除非有絕對需求要重構 root 否則還是盡量避免吧。

## 翻譯：變基和衍合

為了不模糊焦點把此段落放在最後，中文有變基和衍合兩種翻譯，衍為散佈、滋生，我看不出來 rebase 從單字、處理方式到用途哪裡跟衍有關係，所以我投變基一票。

## 參考

- [官方英文文檔](https://git-scm.com/docs/git-rebase)
- [官方簡中文檔](https://git-scm.com/docs/git-rebase/zh_HANS-CN)
- [官方簡中 Pro Git](https://git-scm.com/book/zh/v2/Git-%e5%88%86%e6%94%af-%e5%8f%98%e5%9f%ba)
- [官方英文 Pro Git](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
- [繁體中文 Pro Git](https://iissnan.com/progit/html/zh-tw/ch3_6.html)
