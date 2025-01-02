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
  date: 2024-06-02 GMT+8
  author: zsl0621
---

# Git 在團隊中操作分支的最佳實踐

本文介紹多人協作中推送和合併分支的最佳實踐，整理自[码农高天](https://www.youtube.com/watch?v=uj8hjLyEBmU)的影片，不是營銷號，人家是微軟工程師，CPython core dev。

## 開始
一開始都一樣
```sh
git clone xxx.git                # 拉取遠端儲存庫
git checkout -b <my-feature>     # 新建分支進行工作
git add <file>
git commit -m <comments>
# git push origin <my-feature>   # 因為多人協作所以不能直接推送
```

因為遠端已經有其他更新，所以回到 main branch 同步遠端的新 commit，之後 [rebase](/docs/git/basics#修改-git-rebase) main branch，這樣就可以push。


```sh
git checkout main                # 回到 main 分支
git pull origin main             # 從遠端倉庫更新到main分支到本地
git checkout <my-feature>        # 回到 feature 分支
git rebase main                  # 把 feature 分支的更新接到 main
git push origin <my-feature>     # 再推送到遠端
```

接下來可以:
- Pull request 請求合併
- Squash and merge 合併並整合為一個commit
- Delete branch 刪除合併完的分支

遠端都處理好剛剛的分支後，刪除 branch 再同步 main branch。
```sh
git checkout main                 # 回到 main 分支
git pull origin main              # 推送 main
git branch -D <my-feature>        # 刪除完成的 my-feature
```

## 示意圖
我一開始看以為我懂了，第一次用的時候才發現其實我好像不是很懂，於是回來做了示意圖

1. Clone 遠端儲存庫（初始狀態）：
```
A---B---C main
```

2. 新建功能分支並進行工作：
```
A---B---C main 
         \
          D---E---F feature
```

3. 回到 main 分支，同步遠端的新提交：
```
A---B---C---G main 
         \
          D---E---F feature
```

4. 在 feature 分支上進行 rebase：

```
A---B---C---G main 
                \
                 D'---E'---F' feature
```
注意 rebase 是破壞性的，他會重新計算 hash，所以這裡加上了 prime `'`。

5. 推送 feature 分支後刪除並且回到 main 分支
```
A---B---C---G main
```

經過這段操作就成功提交並且分支和遠端完全相同。因為很重要所以再講一次，rebase 的意思是

<center><h5>將「目前分支」移到旁邊，放進「目標分支」，再想辦法把移到旁邊的「目前分支」接上去。</h5></center>

## 別用 git pull?
By [Philomatics](https://www.youtube.com/watch?v=xN1-2p06Urc)

码农高天的教學沒有涵蓋到多人共同修改同一分支，這裡描述這個情況，原理是避免 git pull 產生一堆無用的 merge，而是用 git pull --rebase。如果沒衝突那很好，有衝突則 git rebase --abort 回復再做一般的 git pull。
