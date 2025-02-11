---
title: "從過去提交修改程式碼"
description: 回到過去 commit 修改程式碼。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-08-17T00:07:33+08:00
  author: zsl0621
first_publish:
  date: 2024-08-17T00:07:33+08:00
---

# 從過去提交修改程式碼

> 什麼情況會用到？

當你需要

1. 需要在舊版的基礎上添加新功能時
2. 或者 de 某些只出現在舊版本的 bug 時
3. 又或者 bug 從特定版本才開始出現，回到那裡進行測試

## 回到過去

如果我想回到某個 commit，從該 commit 開始修改：

```sh
git checkout -b fix/old <hash>
```

`-b` 代表新建一個名為 `fix/old` 的分支。

## 新增 feature

接下來修改文件，完成後合併回主分支，依照工作量有兩種合併方式：

- 只是小 feature:  
使用cherry-pick: 修改完成 add commit 之後，直接回到 main branch `git switch main`，並且撿回剛剛的 commit `git cherry-pick <new-hash>`

- 需要延伸修改:  
新建分支: 用新的 branch 儲存，`git switch -c <new-branch>`，接下來依照[前一篇教學](./remote-best-practice)完成合併。

很久後回來校稿發現以前的自己問題真可愛（但還是對的，網路上一堆錯到底是怎樣傻眼欸= =）
