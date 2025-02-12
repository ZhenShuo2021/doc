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
  date: 2025-02-12T00:44:00+08:00
  author: zsl0621
first_publish:
  date: 2025-02-12T00:44:00+08:00
---

使用以下指令進行安全的強制推送

```sh
git push --force-if-includes --force-with-lease[=<refname>[:<expect>]
```

> 看不懂文檔用語？請見[讀懂文檔](../preliminaries/read-git-docs)

`-f` 參數強制用本地歷史覆蓋遠端，而 `--force-with-lease` 也允續覆蓋但是不會修改到別人的提交，是較為安全的方式，然而他在[某些特別的情況](https://www.tartley.com/posts/til-git-push-force-with-lease/)下會失效，因為儲存庫狀態，例如 fetch 就可以讓別人的修改被意外的覆蓋：

```
初始狀態：  
A -> B1（遠端）
你執行了 git fetch，所以你的追蹤分支也指向 B1

之後發生：

1. 別人推送了 C：A -> B1 -> C（遠端）
2. 你又執行了 git fetch，所以你的追蹤分支現在知道有 C

3. 但你的工作分支在一個不同的 commit：
   A -> B2（你的 HEAD）

這種情況下 --force-with-lease 會「成功」，但會意外刪除 C
```

那要怎麼避免呢？在 Git 2.30 增加了 `--force-if-includes`，他會檢查遠端提交是否曾經出現於儲存庫，其實就是檢查 reflog 裡面有沒有這個紀錄，如果曾經出現代表這是你自己寫的，就允許覆蓋遠端提交歷史。

文檔有說明必須要兩者同時使用 `--force-if-includes` 才會生效，如果把 `<refname>` `<expect>` 參數都給了也會失效。`refname` 代表想保護的分支，`expect` 代表預期的遠端 hash。

## 這樣也可以一篇文章喔

因為沒人寫，這東西 2020 就有了結果到現在 2025 繁體中文資訊等於零。你別說 force-if-includes，連 `refname` 和 `expect` 都沒人講過他們的用途。不然再來點乾貨，不知道大家有沒有想過 lease 這什麼奇怪名字到底是在租什麼，命名原因是

1. 假設我們是和遠端儲存庫進行租賃
2. 我們租了這個 refs 這都是我們自己的可以隨意使用
3. 現在別人 push 了，遠端儲存庫易主，租賃失效
4. 所以不給 push 了

我只能說真會想，滿有創意的，來源在[這裡](https://stackoverflow.com/questions/52823692/git-push-force-with-lease-vs-force)。
