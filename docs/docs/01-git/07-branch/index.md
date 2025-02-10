---
title: 分支操作
author: zsl0621
description: 基礎分支操作，讓你用最快速度上手 Git。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2025-01-16T14:38:33+08:00
  author: zsl0621
first_publish:
  date: 2024-09-10T16:15:33+08:00
---

# Git 分支操作

分支操作主要有以下五大項目，本文會一一說明，扣掉複雜的 rebase 以外其餘根本不需要每個寫成一篇文章來介紹，所以才說本教學是最快上手的教學，如果還不熟悉 Git 的[本文檔](./preliminaries/introduction)有完整且精練的教學。

本文只會有本地不會有遠端操作，遠端操作的第一篇文章要從[遠端儲存庫設定](./remote-setup)開始。

```sh
git branch                           # 分支操作
git switch                           # 切換分支
git stash                            # 暫存檔案（非預存）
git rebase                           # 任意修改提交歷史
git revert                           # 恢復提交
```

### 分支 git branch

分支用於開發新功能、問題修復、或者是準備發佈新版本。

```sh
git branch                           # 查看分支清單
git branch <name>                    # 新建分支
git switch <name>                    # 切換，舊版為 git checkout

git branch -D <name>                 # 刪除
git branch -m <old> <new>            # 改名
```

### 切換 git switch

`git switch` 是專門用來切換分支的新版指令，比傳統的 `git checkout` 更簡單明確。

```sh
git switch branch_name               # 切換到現有分支
git switch -d commit_hash            # 分離模式，用於臨時查看、不建立分支的切換，d=detach
git switch -c <new-name>             # 建立新分支並切換
git switch -c <new-name> <hash>      # 從指定的提交建立並切換
```

使用 checkout 來切換分支也是沒問題的，完全沒有任何差別，指令也大同小異不重複介紹。

### 暫存 git stash

這是一個特別的指令，會把目前所有尚未提交的檔案放進獨立的暫存空間中，使用情境主要有以下幾個：

1. 使用 git checkout/switch/rebase 時目錄不能有未提交檔案，可以用他暫存
2. 改到一半需要改一個更重要的東西
3. 改到一半需要跳到別的分支

可以看出都是暫時的擋刀用指令。

基本選項：

```sh
# 基本上只要記得前三個用法
git stash                            # 暫存變更
git stash -- <pathspec>              # 暫存指定檔案
git stash pop                        # 還原暫存並且移除紀錄，等同 apply + drop
git stash list                       # 查看暫存清單

# 比較少用的方式
git stash push -m "my_stash_name"    # 幫暫存取名（只是讓你查看名稱，不支援從名稱恢復）
git stash apply stash@{0}            # 恢復第一個暫存
git stash drop stash@{0}             # 刪除第一個暫存
git stash clear                      # 清除所有暫存
```

<br/>

### 合併 git merge

有了分支下一步就是要合併，使用 `git merge` 是最淺顯易懂的合併方式，一般來說我們都會先進入主分支合併子分支：

```sh
git switch main
git merge feature-branch
```

git merge 有預設模式是 fast-forward，用於在兩者的提交完全相同時不會建立新的分支結構，只會將目前分支的 HEAD 向前移動，我們可以使用 `--no-ff` 關閉此模式，下方是兩者的差異示意圖：

```
# 初始狀態：
  A---B---C  main
           \
            D---E---F  feature-branch
```

使用 Fast-Forward 的結果如下：

```
# 使用 Fast-Forward：
# git merge feature-branch
  A---B---C---D---E---F  main and feature-branch
```

不使用 Fast-Forward 的則會新增一個專門用來紀錄合併的提交 G：

```
# git merge --no-ff feature-branch
  A---B---C-----------G  main
           \         /
            D---E---F  feature-branch
```

兩者的選擇端看是否需要保存分支結構。合併時可能會遇到衝突，這需要手動解決，解決完成衝突部分後需要 add 和 commit，或者使用 --abort 中斷合併。

### 任意修改 git rebase

在這裡我們不講不代參數的 rebase 用法，而是要介紹互動式變基 (interactive rebase)，請見我寫的文章：[[微進階] 使用 Rebase 變基提交](./rebase#interactive)，其餘用法很複雜用不到可以先跳過。

<details>
<summary>有點複雜謹慎閱讀</summary>

這是一個功能非常強大的指令，這個指令可用於取代 `git merge`，因為我們不想讓提交歷史到處都是合併的結構導致閱讀和管理困難。由於比較複雜，本文只講解他的基本邏輯：

:::tip 口訣

<center>**比較「目前分支」和「目標分支」**</center>
<center>**把「目前分支」的提交移動到「目標分支」之後**</center>

:::

為了搞懂 rebase 看了很多文章，最後濃縮成這兩句話（而且是正確的，網路上很多文章講的又臭又長而且還是講錯），真的不需要了解工具怎麼實現的，只要會用工具就好了。用都不會用就講原理的結果就是不會用也不懂原理，要用到的人可以查看本系列文章的 [[微進階] 使用 Rebase 重構提交](./rebase)。

:::danger

git rebase 會修改歷史，再次強調修改提交歷史 **永遠只該用於個人分支**！

:::

</details>

### 恢復 git revert

用實際案例講解比較簡單。假設現在想撤銷提交 A，但是由於團隊合作最好別修改提交歷史，我們可以用 git revert 提交一個 negative A，這樣會產生一個新的提交把提交 A 抵銷，也不用修改歷史。

放在這裡的原因是團隊合作才會用到，一個人的話想怎麼改就怎麼改。

## 結語

到這邊你已經熟悉 Git 的所有常用指令了，只是需要一點時間熟悉，下一步請快轉到[遠端儲存庫設定](./remote-setup)，進階文章初學者用不到建議暫時跳過以免越看越亂。
