---
title: 安裝與設定
author: zsl0621
description: 安裝與設定。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-09-10T03:07:33+08:00
  author: zsl0621
---

## 安裝
https://git-scm.com/downloads

就算一路 next 都可以安裝完。

圖形介面我個人只用 VS code 裡面的 [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)。其他可選插件還有 [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory) 用來查看檔案在哪個版本修改的， [Git Blame](https://medium.com/starbugs/git-blame-%E5%87%BA%E6%88%91%E7%9A%84%E5%90%8D%E5%AD%97-%E7%AD%89%E4%B8%80%E7%AD%89-%E6%88%91%E6%98%AF%E5%86%A4%E6%9E%89%E7%9A%84-feat-%E7%B0%A1%E4%BB%8B-git-%E7%89%88%E6%8E%A7-ec2c5b8fee69) 看程式是誰寫的， [GitLens](https://tokileecy.medium.com/%E5%B7%A5%E5%85%B7-vscode-%E5%A5%97%E4%BB%B6-gitlens-1e9807230fee) 功能看起來和 Git Graph 大同小異。

## 設定
安裝後先完成基礎設定。開啟終端機設定使用者名稱和 email:
```sh
git config --global user.name "example"
git config --global user.email example@example.com
```

在每個儲存庫可以新增 `.gitignore` 檔案設定忽略清單。根據你的專案項目可以到 [github/gitignore](https://github.com/github/gitignore) 直接複製模板或者網路搜尋 \<programming language\> gitignore，不要浪費時間自己寫這個。切記務必把萬惡的 .DS_Store 和 desktop.ini 加入忽略清單。