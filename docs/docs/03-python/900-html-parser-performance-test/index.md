---
title: "Comparing BeautifulSoup4, LXML, and Selectolax: A Simple HTML Parser Performance Test"
sidebar_label: HTML 解析器效能測試
tags:
  - Programming
  - Python
keywords:
  - Programming
  - Python
last_update:
  date: 2024-12-25T11:49:30+08:00
  author: zsl0621
first_publish:
  date: 2024-12-24T21:53:30+08:00
---

This evaluation compares the performance of popular HTML parser libraries in Python. The test involves extracting product names, ratings, prices, and monthly sales from a Shopee page. To simulate the handling of very large HTML files, the `duplicate_div_main` function duplicates the `<div id="main">` section 100 times, creating a significantly larger document.

You can find the code on my [repo](https://github.com/ZhenShuo2021/blog-script/tree/main/python/html-parser).

### Results

Testing Environment:

- Hardware: M1 MacBook Pro with 8GB RAM
- Test Case: Shopee product page parsing
- Package version:
  - beautifulsoup4==4.12.3
  - cssselect==1.2.0
  - lxml==5.3.0
  - selectolax==0.3.27

```none
Start resolving the original HTML...
Execution time of the original HTML (seconds):
--------------------------------------------------
selectolax     : 0.005336 (1.00x)
lxml           : 0.023221 (4.35x)
lxml_css       : 0.045544 (8.53x)
bs4            : 0.127979 (23.98x)

Start resolving the large HTML...
Execution time of the large HTML (seconds):
--------------------------------------------------
selectolax     : 1.160970 (1.00x)
lxml           : 2.236277 (1.93x)
lxml_css       : 4.248061 (3.66x)
bs4            : 71.444133 (61.54x)
```

### Conclusion

lxml demonstrates strong performance and is sufficient for most use cases.

Selectolax offers approximately 4 times the speed of lxml but comes with limitations. Its lack of XPath support is a significant drawback, and it struggles with certain CSS syntax, such as class names containing brackets or slashes, which are increasingly common on modern websites. These limitations may impact its usability in more complex scenarios.

> Note: [html5-parser](https://github.com/kovidgoyal/html5-parser) was excluded due to its limited popularity and maintenance status.

# HTML 解析器效能測試：BeautifulSoup4、LXML 和 Selectolax

:::info
寫完原文英文版本後懶得翻譯，所以叫 ChatGPT 翻成中文。
:::

這篇評測比較了 Python 中流行的 HTML 解析器庫的性能。測試內容包括從 Shopee 頁面提取產品名稱、評分、價格和月銷量。為了模擬處理超大 HTML 文件的情境，`duplicate_div_main` 函數將 `<div id="main">` 區塊重複了 100 次，從而創建了一個顯著更大的文件。

測試程式碼可以在我的 [repo](https://github.com/ZhenShuo2021/blog-script/tree/main/python/html-parser) 中找到。

### 結果

測試環境：

- 硬體：M1 MacBook Pro，8GB RAM
- 測試案例：Shopee 產品頁面解析
- Package version:
  - beautifulsoup4==4.12.3
  - cssselect==1.2.0
  - lxml==5.3.0
  - selectolax==0.3.27

```none
開始解析原始 HTML...
原始 HTML 執行時間（秒）：
--------------------------------------------------
selectolax     : 0.005336 (1.00x)
lxml           : 0.023221 (4.35x)
lxml_css       : 0.045544 (8.53x)
bs4            : 0.127979 (23.98x)

開始解析大 HTML...
大 HTML 執行時間（秒）：
--------------------------------------------------
selectolax     : 1.160970 (1.00x)
lxml           : 2.236277 (1.93x)
lxml_css       : 4.248061 (3.66x)
bs4            : 71.444133 (61.54x)
```

### 結論

lxml 表現出色，對大多數使用情境來說已經足夠。

Selectolax 的速度大約是 lxml 的 4 倍，但它也有一些限制。缺少對 XPath 的支持是其主要缺點，並且在某些 CSS 語法上也存在問題，例如不支持包含括號或斜線的類名，這在現代網站中越來越常見。這些限制可能會影響它在複雜場景中的使用。

> 注意：[html5-parser](https://github.com/kovidgoyal/html5-parser) 被排除在外，因為它的受歡迎程度和維護狀況較差。
