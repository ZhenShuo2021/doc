---
title: Git 遠端指令
sidebar_label: 遠端指令
description: 操作遠端儲存庫的指令都在這。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2025-02-12T01:45:42+08:00
  author: zsl0621
first_publish:
  date: 2024-08-25T22:24:42+08:00
---

## TL;DR

Git 遠端的邏輯是使用 remote 設定遠端的「別名」，然後每個分支可以根據使用這個別名設定對應的「遠端分支」，下方是第一次要設定遠端時的指令，如果在遠端設定遇到任何問題也可以使用這個流程

1. 列出和新增遠端

```sh
git remote -vv
git remote add <name> <url>
```

2. 假設我們剛剛設定的名稱是預設的 `origin`，現在我們有兩種選項
   1. 指定分支要追蹤的遠端，其中本地分支是可選參數，預設為目前分支

    ```sh
    git branch -u origin/<remote-branch> [<local-branch>]
    git branch -vv   # 檢查設定是否成功
    ```

    2. 獲取遠端的版本歷史  
    如果顯示沒有設定上游，使用上面的 branch -u 指令設定

    ```sh
    git pull
    ```

3. 之後我們就可以推送了  
如果顯示沒有設定上游分支的話，使用此 -u 選項

    ```sh
    git push
    git push --set-upstream <遠端名稱> <分支名稱>
    ```

    這樣以後就可以正常推送了。

## 常用遠端指令列表

設定遠端名稱和地址的相關指令

```sh
git remote -vv                                # 顯示遠端倉庫
git remote add [<name>] [<url>]               # 增加遠端倉庫並指定名稱
git remote remove <name>                      # 刪除遠端倉庫

git remote rename <old-name> <new>            # 重命名遠端倉庫
git remote set-url <name> <new-url>           # 修改遠端倉庫的 URL
```

設定分支對應的遠端指令

```sh
# 列出分支遠端資訊
git branch -vv

# 列出本地和遠端的所有分支
git branch -av

# 只列出遠端分支
git branch -r

# 指定分支要追蹤的遠端，其中本地分支是可選參數，預設為目前分支
# 例如 git branch -u origin/dev-remote dev-local
# 這個範例只是展示名稱可以不同，特殊情況才會用到
git branch -u <remote-name>/<remote-branch> [<branchname>]
```

推拉相關指令

```sh
git clone <repo> [<dir>]                        # 克隆遠端倉庫，dir為可選
git push [<remote-name>] [<local-branch-name>]  # 推送到遠端，後兩項可選
git pull [<remote-name>] [<local-branch-name>]  # 拉取並合併，後兩項可選
git fetch [remote-name]                         # 拉取但不合併
```
