---
title: 標籤
author: zsl0621
description: 幫 Git 上標籤
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


# 幫 Git 上標籤

用標籤標示重要版本，分為兩種lightweight 和 annotated，官方建議使用 annotated。

## 快速清單

非常直觀，直接上指令。

### 常用

| 功能 | 本地指令 | 遠端指令 |
|---|---|---|
| 列出 | `git tag` | `git ls-remote --tags origin` |
| 建立 | `git tag -a v1.0.0 -m "messages"` | `git push origin v1.0.0` |  
| 刪除 | `git tag -d v1.0.0` | `git push origin --delete v1.0.0` |  
| 推送 | `git push origin v1.0.0` |  |  

```bash
# 為先前 commit 加標籤
git tag -a 1.0.0 3b7de7f

# 列出標籤
git tag -n

# 列出特定標籤
git tag -l "v1.8.5*"

# 印出標籤訊息
git tag -l --format='%(contents)' <tag name>

# 編輯標籤（刪除並且重建）
git tag <tag name> <tag name>^{} -f -m "<new message>"
```

### 第二常用

| 功能 | 本地指令 | 遠端指令 |
|---|---|---|
| 推送所有標籤 | `git push origin --tags` |  |  
| 更新本地標籤 | `git fetch origin --tags` |  |  
| 檢出 | `git checkout v1.0.0` |  |  
| 驗證 | `git tag -v v1.0.0` |  |  
