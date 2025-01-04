---
title: 在本地執行 Github Actions
description: 在本地執行 Github Actions
sidebar_label: 在本地執行 Github Actions
tags:
  - Git
  - Github
  - Programming
keywords:
  - Git
  - Github
  - Programming
last_update:
  date: 2025-01-05T02:51:00+08:00
  author: zsl0621
first_publish:
  date: 2025-01-05T02:51:00+08:00
---

# 在本地執行 Github Actions

本篇接近隨筆紀錄，未來有更複雜用法再慢慢補充，中文 act 資源趨近於零所以趁熱先發一篇。

根據 [Github Actions 自動化 CI/CD](/docs/git/github/github-actions)，我們可以在本地執行 Github Actions 用於在本地先偵錯 Workflow 語法設定/節省 Actions 使用流量。首先需要安裝 [act](https://nektosact.com/installation/index.html) 套件以及 docker，並且手動打開 docker 才能執行。

## 用法

假設專案中已經設定好 workflow，應該位於 project_root/.github/workflows/*.yml，使用此命令來執行 job

```sh
act -j <job_id> -s VAR1=xxx -s VAR2=xxx
```

- `job_id` 是你在 workflows 中設定的名稱
- 使用 `--list` 參數可以列出所找到的所有 workflows

並且有以下幾個常用參數

- `--var` 設定 repository variables，不知道這是啥的我上一篇文章有講
- `--env-file` 設定多個 var 的 .env 檔案，預設 `.env`
- `-s, --secrets` 用於設定敏感環境變數，
- `--secret-file` 設定多個 secrets 的 .env 檔案，預設 `.secrets`
- `-W` 用於指定檔案(s, 複數)
- `-e` 指定 event.json，可用於[跳過任務](https://nektosact.com/usage/index.html#skipping-jobs)
- `--action-offline-mode` 啟用快取

## FAQ

- macOS latest: 他不支援，但是如果你的電腦剛好就是 mac 可以使用 `-P macos-latest=-self-hosted` 執行。
- 雖然官方文檔沒講清楚，但猜測 `--var` 是 `${{ var.xxx }}` 設定的環境變數，而 `--secrets` 就是 `${{ secrets.xxx }}` 設定的。執行時要記得加上 GITHUB_TOKEN 以取得 Github 相關服務，在[這裡](https://github.com/settings/tokens)可以生成，選擇 classic 版本。
- `-P` 參數可以選擇自己要的平台鏡像。
- 如果要避免密碼被命令行紀錄，可以把環境變數以 `.env` 形式儲存在 `.secrets` 檔案中，或者在 `act` 指令前綴加上空格（不是所有終端都適用，測試 Zsh 可以 Bash 不行）。
