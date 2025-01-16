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
first_publish:
  date: 2024-09-10T03:07:33+08:00
---

## 安裝

命令列介面在[官網](https://git-scm.com/downloads)選擇自己的系統安裝，就算一路 next 都可以安裝完。

圖形介面筆者只用 VSCode 裡面的 [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) 和 [Git History](https://marketplace.visualstudio.com/items?itemName=donjayamanne.githistory)，其餘可選項目有 [Git Blame](https://marketplace.visualstudio.com/items?itemName=waderyan.gitblame) 可以看程式是誰寫的， [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) 功能看起來和 Git Graph 大同小異，但是太臃腫我不喜歡而且還會要你付費升級。

請先學 CLI 再學 GUI，GUI 只是輔助使用。

## 設定

安裝後先完成基礎設定。開啟終端機設定使用者名稱和 email:

```sh
git config --global user.name "example"
git config --global user.email example@example.com

git config --global alias.ll "log --graph --all --oneline --decorate --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'"
```

第三項是設定別名，非必要但是是最有感的，之後就可以使用 `git ll` 指令印出漂亮且易讀的歷史紀錄。

每個儲存庫可以新增 `.gitignore` 檔案設定忽略追蹤的清單。根據你的專案到 [github/gitignore](https://github.com/github/gitignore) 直接複製模板或者網路搜尋，不要浪費時間自己寫，切記務必把萬惡的 .DS_Store 和 desktop.ini 加入忽略清單。
