---
title: Github 搜尋技巧
description: Github 搜尋技巧
sidebar_label: 搜尋技巧
tags:
  - Git
  - Github
  - Programming
keywords:
  - Git
  - Github
  - Programming
last_update:
  date: 2024-12-27T17:18:30+08:00
  author: zsl0621
first_publish:
  date: 2024-12-27T17:18:30+08:00
---

# Github 搜尋技巧

本文不廢話、僅列出重點、超快速的說明如何在 Github 進行條件搜尋。

## 語法

詳情請參考[官方文檔](https://docs.github.com/en/search-github)，這甚至多達二十篇文章。

### 基本語法

- `> >= ..` 語法為 filter，例如 stars:>100、forks:100..500、pushed:>=2024-01-01
- `OR` `NOT` `AND` bool 語法
- `-` 排除 qualifiers，例如 -language:javascript，與他相似的 NOT 是用於文字搜尋
- `sort` 用於排序，可排序項目很多請看[文檔](https://docs.github.com/en/search-github/getting-started-with-searching-on-github/sorting-search-results)
- `""` 用於精確匹配相同，和 Google 搜尋一樣用法

### 1. 程式碼內容搜尋

在只想搜尋某檔案名稱、檔案包含某文字時非常實用。

- `in:file`/`in:path`/`in:name` - 分別搜尋文件內容/路徑/儲存庫名稱
- `extension:js` - 搜尋特定副檔名
- ~~`filename:webpack.config.js`~~ - 已經失效，放上來提醒大家
- `path` - 搜尋特定路徑，也可以搜尋檔名

### 2. 儲存庫元資料

過濾老專案、沒更新專案、沒流量專案時非常有用。

- `stars:>1000`/`forks:>500`/`size:>1000` - 分別搜尋星星數大於 1000、分支數大於 500、大於 1000KB 的專案。
- `pushed:>2023-01-01`/`created:>2023-01-01` - 分別搜尋指定日期後更新/建立的專案。

### 3. 語言與主題

- `language:javascript` - 搜尋特定程式語言
- `topic:react` - 搜尋特定主題標籤（有些 repo 不見得會標示自己的 topic）

### 4. 使用者相關

- `user:username` - 搜尋特定使用者的儲存庫
- `org:organization` - 搜尋特定組織的儲存庫
- `followers:>1000` - 搜尋關注者超過 1000 的使用者

### 5. 狀態與授權

- `is:public` - 搜尋公開儲存庫
- `is:private` - 搜尋私人儲存庫
- `license:mit` - 搜尋使用 MIT 授權的專案
- `archived:true` - 搜尋已封存的儲存庫

### 6. Issue 搜尋

搜尋 issue 用的 filter，見[文檔](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/filtering-and-searching-issues-and-pull-requests#building-advanced-filters-for-issues)。

- `label:<name>` - 搜尋指定標籤，例如 label:"good first issue"
- `reason:<name>` - 搜尋 reason 標籤
- `state:open` - 還沒解決

## 使用範例

### 情境一：尋找適合新手的 React Native 開源專案

假設你是一位想貢獻開源的 React Native 開發者，想找到：

- 活躍維護的專案（近期有更新）
- 有一定社群支持但不會太大型
- 使用 TypeScript 開發

搜尋語法：

```sh
language:typescript topic:react-native stars:100..1000 pushed:>2024-01-01 archived:false sort:updated
```

這個搜尋會找到：

- TypeScript 專案
- React Native 相關
- 星星數在 100-1000 之間（中型專案）
- 2024 年後有更新（活躍維護）
- 排除已封存的專案
- 按更新時間排序

### 情境二：尋找特定語言、特定授權條款、且近期有更新的專案

你正在尋找使用 Python 語言撰寫，使用 MIT 授權條款，且最近一個月內有更新的開源專案，希望用於機器學習相關的研究。

```none
language:python license:mit pushed:>2023-10-27 topic:machine-learning
```

## 結尾

網路上的文章怎麼可以 這 麼 爛，扣掉第一篇近似於文檔風格太長我不想看以外，第二篇只說了五個語法，第三篇隨筆屬性，第四第五篇 AI 文章，第六篇是無關的錯誤推薦，最精華的第一頁只有保哥的文章和類文檔有用，其餘文章我只能送上*給愛麗絲*等級的評價，後兩頁的文章也都一樣爛。

雖然語言模型生成教學的文字風格看久了很躁，但不得不說很多人寫的文章水準連語言模型都不如，現在都直接丟文檔給模型叫他整理，比起看網路廢文快多了。
