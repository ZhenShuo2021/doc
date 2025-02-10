---
title: 在 Github README 中嵌入影片
description: 在 README 中嵌入影片
sidebar_label: README 嵌入影片
tags:
  - Git
  - Github
  - Programming
keywords:
  - Git
  - Github
  - Programming
last_update:
  date: 2024-12-28T00:03:30+08:00
  author: zsl0621
first_publish:
  date: 2024-12-28T00:03:30+08:00
---

# 在 README 中嵌入影片

> 開啟網頁版進入 README 編輯頁面，把影片拖入就完成了@2024/12/28。

這麼簡單為啥要寫一篇，因為就是這麼簡單的東西我隔了好幾個月才偶然找到解答。嵌入的影片網址是 `https://github.com/user-attachments/assets/<ID>`，相關資訊經過好一番搜尋勉強能找到的是

1. [檔案貌似會被上傳到 Amazon S3 bucket](https://www.reddit.com/r/github/comments/1gpv0wn/where_are_the_files_uploaded_via_the_readmemd/)
2. [文檔](https://www.reddit.com/r/github/comments/1gpv0wn/where_are_the_files_uploaded_via_the_readmemd/)只輕描淡寫說可以上傳到 md, issues, pull requests, comments

我是照關鍵字 `github repository readme "assets"` 再加上限制時間搜尋才找到這些資訊。是說搜尋結果中 GeeksforGeeks 兩篇文章中的第二篇文章其實就是這個解法，結果我把第一篇文章的所有方法都試了一輪之後全都不滿意就沒看第二篇，答案遠在天邊近在眼前...

最後附上一篇列出多種[插入圖片](https://www.baeldung.com/ops/github-readme-insert-image)方式的文章。
