---
title: 解決 GPG 無法提交的錯誤
description: 解決 GPG 無法提交的錯誤
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-10-20T03:56:07+08:00
  author: zsl0621
first_publish:
  date: 2024-10-20T03:56:07+08:00
---

提交時遇到問題，出現以下錯誤

```sh
Rewrite COMMIT_ID (1/179) (0 seconds passed, remaining 0 predicted)
error: gpg failed to sign the data
could not write rewritten commit
```

## 解決方法

TL;DR

```sh
export GPG_TTY=$(tty)
```

如果確認此方法可行，在 Unix 系統下你可以使用 `echo 'export GPG_TTY=$(tty)' >> ~/.zshrc` 讓這個指令在每次終端開啟時自動執行，bash 用戶需改成 `.bashrc`。

## 檢查

可以用以下指令檢查檢查 GPG 是否正常運作

```sh
gpg --list-secret-keys --keyid-format LONG
git config --global user.signingkey
echo "test" | gpg --batch --yes --clearsign
```
