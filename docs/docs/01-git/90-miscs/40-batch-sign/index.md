---
title: 幫所有 commit 加上 GPG 簽名
description: 幫 commit 加上已認證標籤。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-08-22T05:31:07+08:00
  author: zsl0621
first_publish:
  date: 2024-08-22T05:31:07+08:00
---

# 幫所有過往 commit 加上 GPG 簽名

## 起因
發現 gpg 認證失敗沒辦法 commit，當時腦袋一熱就想著藉此機會把所有以前設定錯誤的金鑰全部移除，移除完再新增金鑰所有操作都正常除了以前所有的簽名資訊全部失敗以外...因為我把 Github 上面的金鑰也一起刪了導致舊 commit 在遠端上無法驗證。

不過現在想想可能是 gpg 金鑰過期了。

## 修復
很簡單，[一行指令完成](https://stackoverflow.com/questions/41882919/is-there-a-way-to-gpg-sign-all-previous-commits)

```sh
git filter-branch --commit-filter 'git commit-tree -S "$@";' -- --all
```

最後可以用 `git log --show-signature` 檢查簽名情況。