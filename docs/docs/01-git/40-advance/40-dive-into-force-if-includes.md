---
title: 使用 Force if Includes 安全的強制推送
description: 使用 force-if-includes 安全的進行強制推送
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2025-02-13T20:44:00+08:00
  author: zsl0621
first_publish:
  date: 2025-02-12T00:44:00+08:00
---

本文主要來自 [When should I use "git push --force-if-includes"](https://stackoverflow.com/questions/65837109/when-should-i-use-git-push-force-if-includes)，經過消化理解後重新編排。

## TL;DR

### --force-if-includes 應該如何使用？

`--force-if-includes` 一定要和 `--force-with-lease` 同時使用才會生效。如果 `--force-with-lease=<refname>:<hash>` 兩個參數都設定了，則 `--force-if-includes` 也會變成 no-op (無作用)。

```sh
# 使用語法
git push --force-if-includes --force-with-lease[=<refname>] [<repo> [<refspec>​]]
```

一般的使用方式是 `git push --force-if-includes --force-with-lease origin main`

> 看不懂文檔用語？請見[讀懂文檔](../preliminaries/read-git-docs)

<br />

### 應該使用 --force-if-includes 嗎？

作者建議不要使用，原因是

1. 他認為是否能在所有情況下成功攔截錯誤仍有待驗證。
2. 他認為工作原理類似於 `git rebase --fork-point`，而 `--fork-point` 並非在所有情況下都能可靠運作。

並且給出作者本人強制推送的工作流程，也就是手動檢查：

```sh
# 檢查
git fetch <remote>         # get commit(s) from remote
git show <remote>/<name>   # inspect their most recent commit
                           # to make sure it's what we think
                           # it is, so that we're sure of what
                           # we're tossing *from* their Git repo

# 手動解決遠端更新應該怎麼處理

# 強制推送，如果不處理遠端更新，就代表把剛才 fetch 的結果全部覆蓋
git push --force-with-lease <remote> <name>
```

他的說明非常詳細但是不推薦的原因沒有仔細解釋，而我的看法是可以嘗試使用。

<br />

### --force-if-includes 檢查了什麼？

原文作者建議不要用，但到底該不該用由用戶自行判斷，這裡我們說明此選項做了什麼事。他不是一個全新的邏輯或功能，而是延伸了 `--force-with-lease`，額外檢查「遠端最新提交是否存在於本地目標分支的 reflog 紀錄中」，以確保被推送的分支確實整合過這個提交。

<br />

## 深入強制推送

### --force-with-lease 原理

大家應該都聽過 `--force-with-lease` 是不允許覆蓋別人的提交，那你有想過他是怎麼避免的嗎？有沒有可能 `--force-with-lease` 也會意外覆蓋他人提交？

答案是肯定的，`--force-with-lease` 只檢查「遠端最新提交是否出現在本地儲存庫」，所以在 `--force-with-lease` 前使用 `git fetch` 就等同於強制覆蓋，因此需要更嚴格的檢查手段。

### 深入 --force-with-lease

在介紹更嚴格的檢查手段之前，也就是 `--force-if-includes`，我們先搞清楚 `--force-with-lease` 的全部設定，語法如下：

```sh
# 語法
git push --force-with-lease[=<refname>[:<expect-remote-hash>]] [<repo> [<refspec>…​]]
```

完整的使用範例如下：

```sh
# 推送到名為 origin 的遠端，推送的項目是 main 分支，只推送到 <dst-hash> 後續不推送
# 檢查項目為 refs/heads/main 的 hash 是否等於 expect-remote-hash
git push --force-with-lease=refs/heads/main:expect-remote-hash origin <dst-hash>:refs/heads/main

# 同上，除非你的 main 不是分支
git push --force-with-lease=refs/heads/main:expect-remote-hash origin <dst-hash>:main

# 推送本地 main 分支所有提交
git push --force-with-lease=refs/heads/main:expect-remote-hash origin main
```

以第一個指令作為範例，因為他最完整，意思是設定需要被檢查的遠端是 `refname` ，並且預期他的 hash 應該是 `expect-remote-hash`，推送到名為 origin 的遠端，只推送到 `dst-hash` 後續不推送。

他內部還有一些規則：

1. 設定 `refname` 代表只保護指定的 `refname` 歷史不被覆蓋，否則保護全部 refs
2. 如果連 `expect-remote-hash` 都一起設定，那麼要求 `refname` 的 hash 和其完全相同

我們一般不會這麼仔細設定，而是直接使用

```sh
git push --force-with-lease origin main
```

### 介紹 --force-if-includes

由於 lease 只檢查遠端歷史是否出現在本地儲存庫中，所以在 lease push 前只要用了 fetch 就等於 force push，於是 `--force-if-includes` 擴展了 `--force-with-lease`，額外檢查目前分支的 reflog 是否包含遠端的最新提交。

> --[no-]force-if-includes
>   Force an update only if the tip of the remote-tracking ref has been integrated locally.

如果 `--force-with-lease[=<refname>[:<expect-remote-hash>]]` 兩個參數都提供則 `--force-if-includes` 會變成 no-op。

## 這樣也可以一篇文章喔

因為沒人寫，這東西 2020 就有了結果到現在 2025 繁體中文資訊等於零。你別說 force-if-includes，連 `refname` 和 `expect` 都沒人講過他們的用途。不然再來點乾貨，不知道大家有沒有想過 lease 這什麼奇怪名字到底是在租什麼，命名原因是

1. 想像使用 fetch 等同於獲得 ref 的租約
2. 租了這個 refs 代表其屬於自己，可以隨意使用
3. 別人 push 後有更新的提交，租賃失效，所以不能覆寫了

我只能說真會想，滿有創意的，來源在[這裡](https://stackoverflow.com/a/52937476/26993682)。
