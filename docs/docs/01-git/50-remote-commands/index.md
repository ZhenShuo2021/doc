---
title: 遠端指令
description: 操作遠端儲存庫的指令都在這。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-08-25T22:24:42+08:00
  author: zsl0621
first_publish:
  date: 2024-08-25T22:24:42+08:00
---

# Git 遠端指令

這篇介紹遠端工作時常用的指令，這邊實在沒什麼好介紹的，只好列出所有選項。  

## 基本遠端指令

設定遠程倉庫地址，clone 下來後可用

```sh
git clone [remote.git] [dir]                  # 克隆遠端倉庫，dir為可選
git push [remote-name] [local-branch-name]    # 推送到遠端，後兩項可選
git pull [remote-name] [local-branch-name]    # 拉取並合併，後兩項可選
git fetch [remote-name]                       # 拉取但不合併
git remote -v                                 # 顯示遠端倉庫
git remote add [remote-name] [remote.git]     # 增加遠端倉庫並指定名稱
git remote remove [name]                      # 刪除遠端倉庫
git remote rename [old-name] [new]            # 重命名遠端倉庫
git remote set-url [name] [url]               # 更改遠端倉庫的 URL
```

> [問題] 修改本地提交後歷史記錄不同無法提交

```sh
git push -f
git push --force-with-lease
```

-f 參數強制修改遠端為本地提交，--force-with-lease也是，但是不會修改到別人的提交，是較為安全的方式。

> [問題] 找不到遠端可以用以下指令

```sh
git remote -v
git remote add
git remote set-url
```

> [問題] 第一次推送分支時使用此命令，將本地 main 分支與遠程 main 分支關聯起來。

```sh
git push --set-upstream origin [branch]
```

> [問題] 預防推錯分支，確保推送到遠端同名分支

```sh
git config --global push.default simple
```

> [問題] 第一次 clone 完後進入 main 以外的分支

```sh
git branch -av                    # 列出所有+遠端
git checkout -b dev origin/dev    # 創建並切換到dev
```
