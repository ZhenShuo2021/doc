---
title: 使用變基 Rebase 合併分支
sidebar_label: 使用變基 Rebase 合併分支
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

# 使用變基 Rebase 合併分支提交

筆者認為網路文章每篇講的都不一樣是初學者對變基 (rebase) 感到畏懼的原因，所以撰寫時同時參考 Git 官方文檔以及 Pro Git Book，比對英文繁中簡中三個版本的說法以及指令實際作用以確保本文敘述絕對正確，所有和本文矛盾的說明都是錯的。

本文的目標是最快、最清楚且正確的搞懂 rebase，不會東拉西扯混淆視聽。

:::danger 提醒

Rebase 很危險，請用範例 repo 進行測試！

- [單分支範例](https://github.com/PIC16B/git-practice)  
- [仿照文檔的多分支範例方便對照測試](https://github.com/ZhenShuo2021/rebase-onto-playground)  
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

[^1]: 重演 (replay)，用於表示不只是簡單的將提交複製貼上，而是會重新生成 commit hash。

所以總共只有三步驟，找到共同祖先，以祖先為起點開始尋找目標提交，重演這些提交。

## 口訣

re-base 的核心兩個單字分別代表 `重新` 以及 `基底`，表示此指令用於幫提交修改基底。第一次看到覺得很複雜是正常的，如果看完細節覺得頭昏腦脹，可以用簡化的口訣將 rebase 理解為

:::tip 口訣

<center>**比較「目前分支」和「目標分支」**</center>
<center>**把「目前分支」的提交移動到「目標分支」之後**</center>

:::

請務必記住口訣，這可以讓你正常使用好一段時間，筆者保證這段敘述的絕對正確，所有違背這段敘述的說明都是錯的。

## 誰 Rebase 誰才對？{#correctly-rebase}

非常多文章都錯誤使用 rebase，小到個人 medium 和部落格，或者是系列教學文章，甚至是已經出書的人都寫錯，不就是只有一個參數的指令那究竟是哪裡用錯呢？他們<u>**錯在位於主分支使用 `git rebase feature`**</u>，這會造成主分支的提交歷史改變，而主分支是最穩定的分支，<u>**絕對不可能為了合併子分支而修改主分支既存的提交歷史**</u>。

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

錯誤的使用方式會變成將 feature 作為基底，把 main 分支放在 feature 後面，然而 feature 是新的、未經過時間驗證的提交，出現問題會導致要修復的提交歷史反而早於穩定的提交，只要看懂文檔任何人就不會犯這種錯，因為文檔就是這樣用的，很可惜大家都錯了。

你可能會覺得筆者口氣很大，覺得我是哪來的野台子在這裡大吼大叫，如果不相信筆者那 Python Core Dev，微軟安全部門員工總該相信吧：[十分钟学会正确的github工作流，和开源作者们使用同一套流程](https://www.youtube.com/watch?v=uj8hjLyEBmU&t=439s&pp=ygUM56K86L6y6auY5aSp)。

:::danger 再提醒一次

絕對不要在主分支上 rebase 其餘分支，因為這會修改穩定的主分支提交紀錄。

:::

## 翻譯：變基和衍合

為了不模糊焦點把此段落放在最後，中文有變基和衍合兩種翻譯，衍為散佈、滋生，我看不出來 rebase 從單字、處理方式到用途哪裡跟衍有關係，所以我投變基一票。

## 參考

- [官方英文文檔](https://git-scm.com/docs/git-rebase)
- [官方簡中文檔](https://git-scm.com/docs/git-rebase/zh_HANS-CN)
- [官方簡中 Pro Git](https://git-scm.com/book/zh/v2/Git-%e5%88%86%e6%94%af-%e5%8f%98%e5%9f%ba)
- [官方英文 Pro Git](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
- [繁體中文 Pro Git](https://iissnan.com/progit/html/zh-tw/ch3_6.html)
