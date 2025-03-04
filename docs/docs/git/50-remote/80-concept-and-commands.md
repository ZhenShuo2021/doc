---
title: Git 遠端概念和常見錯誤
sidebar_label: 遠端概念和常見錯誤
description: 操作遠端儲存庫的指令都在這。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2025-02-13T23:03:42+08:00
  author: zsl0621
first_publish:
  date: 2024-08-25T22:24:42+08:00
---

## 原理說明

Git 遠端的邏輯是使用 remote 設定遠端的「別名」，然後每個分支可以根據使用這個別名與遠端儲存庫中的特定分支建立「追蹤關係」。

## 找不到遠端的處理方式{#remote-debug}

如果在遠端設定遇到任何問題可以使用這個流程

1. 列出和新增遠端

    ```sh
    git remote -vv
    git remote add <name> <url>
    ```

2. 假設剛才設定的別名是預設的 `origin`，接著我們指定分支要追蹤的遠端，其中 `<local-branch>` 是可選參數，如果不填入，預設為目前分支

    ```sh
    # 如果遠端已經更新記得使用 git fetch/git pull 獲取更新到本地

    git branch -u origin/<remote-branch> [<local-branch>]
    git branch -vv   # 檢查設定是否成功，如果成功會出現 [<遠端名稱>/<遠端分支名稱>]
    ```

3. 之後我們就可以推送了  
如果顯示沒有設定上游分支的話，使用此 -u 選項

    ```sh
    git push
    git push -u <遠端名稱> <分支名稱>
    ```

這樣以後就可以正常推送了，如果還是不行請見 [各種日常問題](../troubleshooting/daily-issues#設定遠端分支)。

## 常用遠端指令列表

### Git Remote

設定遠端名稱和地址的相關指令

```sh
git remote -vv                                # 顯示遠端倉庫
git remote add <name> <URL>                   # 增加遠端倉庫並指定名稱
git remote remove <name>                      # 刪除遠端倉庫

git remote rename <old> <new>                 # 重命名遠端倉庫
git remote set-url <name> <newurl>            # 修改遠端倉庫的 URL
```

### Git Branch

設定分支對應的遠端指令

```sh
# 更詳細的列出分支資訊
git branch -vv

# 列出所有本地分支和遠端追蹤分支
git branch -av

# 只列出遠端追蹤分支
git branch -rv

# 指定目前所在分支要追蹤的遠端，例如 git branch -u origin/main
git branch -u <remote-name>/<remote-branch>

# 指定特定分支要追蹤的遠端，例如 git branch -u origin/custom custom
git branch -u <remote-name>/<remote-branch> <local-branch>
```

### Git Clone/Pull/Fetch

推拉相關指令

```sh
git clone <repo> [<dir>]                      # 克隆遠端倉庫，dir為可選
git push [<remote-name>] [<local-branch>]     # 推送到遠端，後兩項可選
git pull [<remote-name>] [<local-branch>]     # 拉取更新本地提交歷史，後兩項為可選
git fetch [remote-name]                       # 獲取資訊但不更新提交
```

pull 和 fetch 最大的差異是 pull 會直接新增提交，fetch 只是獲取而不更新提交歷史。

## 工作流程

現在我們基本上已經學會所有會用到的 Git 指令，結合之前的文章這裡給出完整工作流程

1. 克隆專案到本地 `git clone`
2. 進入工作的分支 `git checkout <branch>`，如果工作分支尚未建立，使用 `git checkout -b <branch> <hash>`
3. 提交更新 `git commit`
4. 提交前整理 `git rebase -i HEAD~n`
5. 提交前更新遠端到本地
   1. 如果一個分支有多人進行工作，使用 `git pull`
   2. 否則直接更新主分支 `git rebase origin/main <branch>`
6. 推送到遠端 `git push -u origin <branch>`
7. 進行下一次開發，重新這個循環

如果推送後發現有錯，想要覆寫需要使用 `git push --force` 指令，然而此指令會覆蓋別人的提交，比較安全的方法是使用 `git push --force-with-lease`，此指令可以避免覆蓋別人的提交；如果已經有人在你的錯誤提交之上推送了更新的提交，那就改用 `git revert` 方式移除錯誤的推送。想深入理解 lease push 可以看我寫的文章：[使用 Force if Includes 安全的強制推送](../advance/dive-into-force-if-includes)。

## QA：遠端追蹤分支是什麼？和遠端分支一樣嗎？追蹤分支又是什麼？{#remote-checking-branches}

遠端追蹤分支 (Remote-tracking Branch) 是本地儲存庫用來記錄遠端分支最新狀態的本地參考，其名稱格式為 `<遠端名稱>/<分支名稱>`，例如預設的 `origin/main`。

執行 `git clone` 後，Git 會自動檢出 (checkout) 一個預設的本地分支，並將其設定為追蹤分支（Tracking Branch），該分支會與對應的遠端追蹤分支建立追蹤關係。例如 `git clone` 後預設檢出的 `main` 分支，會追蹤 `origin/main` 這個遠端追蹤分支，而 `origin/main` 也可稱為 `main` 分支的上游分支（Upstream Branch）。

所謂口語上的遠端分支就是在遠端中的本地分支，和遠端追蹤分支是不同的概念
