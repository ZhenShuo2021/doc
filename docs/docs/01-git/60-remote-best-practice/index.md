---
title: "[實戰] 團隊協作最佳實踐🔥"
author: zsl0621
description: 實戰搞懂如何多人協作，與開源作者使用相同流程開發。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-06-02T00:00:00+08:00
  author: zsl0621
first_publish:
  date: 2024-06-02T00:00:00+08:00
---

# Git 在團隊中操作分支的最佳實踐

本文介紹多人協作中推送和合併分支的最佳實踐，整理自[码农高天的影片](https://www.youtube.com/watch?v=uj8hjLyEBmU)，人家是微軟工程師，CPython core dev，不是網路上的半桶水。

## 開始

一開始都一樣

```sh
git clone xxx.git                # 拉取遠端儲存庫
git checkout -b <my-feature>     # 新建分支進行工作
git add <file>
git commit -m <comments>
# git push origin <my-feature>   # 如果是單人作業會執行這個步驟，但是因為多人協作所以不能直接推送
```

因為遠端已經有其他更新，所以回到 main branch 同步遠端的新 commit，之後 [rebase](./rebase#interactive) main branch，這樣就可以push。

```sh
git checkout main                # 回到 main 分支
git pull origin main             # 從遠端倉庫更新到main分支到本地
git rebase main <my-feature>     # 把 feature 分支的更新接到 main 的後面
git push origin <my-feature>     # 再推送到遠端
```

接下來可以:

- Pull request 請求合併
- Squash and merge 合併並整合為一個commit
- Delete branch 刪除合併完的分支

遠端都處理好剛剛的分支後，刪除 feature-branch 再同步主分支就完成一輪的作業流程，現在你又可以繼續快樂的進行下一輪任務。

```sh
git checkout main                 # 回到 main 分支
git pull origin main              # 推送 main
git branch -D <my-feature>        # 刪除完成的 my-feature
```

有些專案是不喜歡你直接修改 main 分支的（例如 [Blowfish](https://github.com/nunocoracao/blowfish/blob/main/CONTRIBUTING.md#have-a-patch-that-fixes-an-issue)）那就不需要自行 rebase。

## 示意圖

我一開始看以為我懂了，第一次用的時候才發現其實我好像不是很懂，於是回來做了示意圖

1. Clone 遠端儲存庫（初始狀態）：

```sh
    A---B---C              main
```

2. 新建功能分支並進行工作：

```sh
    A---B---C              main 
             \
              D---E---F    feature
```

3. 回到 main 分支，同步遠端的新提交：

```sh
    A---B---C---G          main 
             \
              D---E---F    feature
```

4. 在 feature 分支上進行 rebase：

```sh
    A---B---C---G main 
                 \
                  D'---E'---F' feature
```

注意 rebase 會重新計算 hash，所以這裡加上了 prime symbol `'`。

5. 推送 feature 分支後刪除並且回到 main 分支

```sh
    A---B---C---G main
```

經過這段操作就成功提交並且分支和遠端完全相同。因為很重要所以再講一次，rebase 的意思是

:::tip 口訣

<center>**比較「目前分支」和「目標分支」**</center>
<center>**把「目前分支」的提交移動到「目標分支」之後**</center>

:::

## 別用 git pull?

By [Philomatics](https://www.youtube.com/watch?v=xN1-2p06Urc)

码农高天的教學沒有涵蓋到多人共同修改同一分支，這裡描述這個情況，原理是使用 `git pull --rebase` 避免一般的 `git pull` 產生無用的 merge。如果沒衝突那很好，有衝突則 git rebase --abort 回復再做一般的 git pull。

如果要預設使用 `git pull --rebase` 請設定 `git config --global pull.rebase true`。
