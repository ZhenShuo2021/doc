---
title: 幫重要版本打上標籤
author: zsl0621
description: 幫提交上標籤
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-10-20T02:21:33+08:00
  author: zsl0621
first_publish:
  date: 2024-10-20T02:21:33+08:00
---

用標籤標示重要版本，分為 lightweight 和 annotated 兩種，官方建議使用 annotated。

lightweight 直接在 commit 上增加標記，annotated 是獨立的 refs。

## 常用指令

| 功能 | 本地指令 | 遠端指令 |
|---|---|---|
| 列出 | `git tag` | `git ls-remote --tags origin` |
| 建立 | `git tag -a v1.0.0 -m "messages"` | `git push origin v1.0.0` |  
| 刪除 | `git tag -d v1.0.0` | `git push origin --delete v1.0.0` |  
| 推送 | `git push origin v1.0.0` |  |  

```bash
# 上標籤並且簽名、加上訊息、指定 hash
git tag -s -a v1.0.0 -m "msg" <hash>

# 推送標籤
git push origin v1.0.0

# 列出標籤，使用 `-n9` 可以同時印出訊息
git tag -n<num>

# 列出特定標籤
git tag -l "v1.8.5*"

# 印出標籤訊息
git tag -l --format='%(contents)' <tag name>

# 編輯標籤（刪除並且重建）
git tag <tag name> <tag name>^{} -f -m "<new message>"
```

列出標籤的指令雜亂且複雜保證記不起來，建議直接用 alias 完成。僅適用 ZSH，Bash 改一下應該能用，Windows 搞了半小時還是失敗我放棄。在 .zshrc 加入這行：

```sh
alias 'gtl'='gtl(){ git tag --sort=-v:refname -n999 --format="[%(objectname:short) %(refname:short)] %(contents:lines=999)%0a" --list "${1}*" }; noglob gtl'
```

之後就可以使用 gtl 指令列出所有標籤，並且支援使用 gtl v0.2 列出所有 v0.2 開頭的標籤。如果想用更多這種奇特簡寫歡迎使用[我的 dotfile](https://github.com/ZhenShuo2021/dotfiles)。

## 第二常用指令

| 功能 | 本地指令 | 遠端指令 |
|---|---|---|
| 推送所有標籤 | `git push origin --tags` |  |  
| 更新本地標籤 | `git fetch origin --tags` |  |  
| 檢出 | `git checkout v1.0.0` |  |  
| 驗證 | `git tag -v v1.0.0` |  |  
