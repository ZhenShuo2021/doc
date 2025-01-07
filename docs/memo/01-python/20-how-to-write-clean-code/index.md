---
title: 寫出優雅程式
description: How to Write Clean Code
tags:
  - Programming
  - Python
keywords:
  - Programming
  - Python
last_update:
  date: 2024-10-01T00:00:00+08:00
  author: zsl0621
first_publish:
  date: 2024-10-01T00:00:00+08:00
---

# How to Write Clean Code

Collections of useful infos on the internet for writing clean, readable code.  
码农高天: Core dev of CPython, works in Microsoft kernel security team.

## Principle

These guides are not absolute rules, you should remember that the final purpose is writing a maintainable, extendable, readable and high-performance code.

> This list is organized by myself, the Chinese text is summarized by GPT.

1. 可讀性
    - KISS (Keep It Simple, Stupid)
        - 保持程式碼簡單明瞭，避免不必要的複雜性
        - 使用清晰的命名和簡潔的邏輯
        - 避免為炫耀技巧而寫複雜難懂的程式碼
    - 單一職責原則
        - 每個類別或模組應該只有一個改變的理由
    - 程式碼風格一致性
        - 遵循一致的程式碼風格指南 (PEP 8)
        - 使用程式碼格式化工具確保一致性 ([Black](https://blog.kyomind.tw/flake8-and-black/)) ([Ruff](https://blog.kyomind.tw/migrate-to-ruff/))
        - 補充，Python 身為動態語言也可以加上 [linter](https://blog.kyomind.tw/flake8-yapf-setting/) 進行靜態檢查，可參可這三篇文章
    - 撰寫有意義的註釋
        - 解釋程式碼的目的和邏輯，但避免過度註釋
        - 甚至於程式改了註釋記得刪掉也是，真看過有人抱怨被註釋騙
        - 好的程式碼光是用變數和常見邏輯就可讀懂意義，過多的註釋就是廢話或程式碼太複雜！
    - 顯式優於隱式
      - 程式碼的意圖應該明確，避免隱式表達
      - 隱示代表程式語言本身任何的隱示表達方式，例如
        - `from package import *`
        - [`語法約束好於邏輯約束`](https://youtu.be/7EQsUOT3NKY?si=_0m5QidZkAGhSYM2&t=180)
        - [`字典取鍵值`](https://youtu.be/er9MKp7foEQ?si=JZbsHST4aBu2_pis&t=827)
        - [`顯式的寫出 if-else`](https://youtu.be/vbF5M1L2SnU?si=Zao09Wxk0rHwfFmi&t=236) 就算只是補上 else 都比懶惰不寫好
    - **把握可讀性後，會覺得自己的程式碼瞄過去感覺跟 Github 那些大專案有五六分像，別人也可以輕鬆理解自己的程式邏輯**

2. 可維護性
    - DRY (Don't Repeat Yourself)
        - 避免重複程式碼，提高可重用性和可維護性
        - 將重複邏輯提取到函式或類別中
    - 關注點分離 (Separation of Concerns)
        - 將程式分為不同部分，每部分解決單獨問題
        - 提高模組化，降低耦合度
    - 高內聚低耦合
        - 確保模組內部緊密相關，模組間盡量獨立
    - **把握可維護性，可以減少改一個錯兩個的問題**

3. 可擴展性
    - YAGNI (You Aren't Gonna Need It)
        - 只實現當前需要的功能，避免過度設計
        - 保持程式碼靈活性，降低維護成本
    - 組合優於繼承
        - 優先使用組合而非繼承來實現程式碼重用
    - 迪米特法則 (Law of Demeter / Principle of Least Knowledge)
        - 一個物件應對其他物件有最少的了解
        - 減少耦合，提高模組化
    - **把握可擴展性就不會有每次加東西都覺得到處衝突，或者是增加新功能還要修改舊功能的問題**

4. 錯誤處理
    - Fail-fast 原則
        - 儘早暴露錯誤，以便及時發現和解決問題
        - 使用斷言、異常處理和日誌記錄等技術
    - 錯誤處理 (Error Handling)
        - 預期和處理可能發生的錯誤
        - 提供有意義的錯誤訊息

5. 效能與優化
    - 避免過早優化 (Avoid Premature Optimization)
        - 先寫出可讀性高的程式碼，再進行效能優化
        - 只有在確認效能瓶頸後，才進行程式碼優化
    - 平衡 spaghetti code 和 ravioli code
        - 避免過度複雜 (spaghetti) 或過度分割 (ravioli) 的程式碼結構

其他重要原則
    - 單一職責原則 (很重要就再寫一次)
        - 每個類別或模組應該只有一個改變的理由
    - SOLID 原則
        - 複雜，五個原則可以寫成五篇文章，把握好基本原則再看 SOLID 原則
    - 最小驚訝原則 (Principle of Least Astonishment)
        - 用於前端設計，看過就好
        - 設計應符合使用者的直覺預期，提高可用性
    - 版本控制 (Git)
    - 單元測試
    - 自動化測試 (Github Actions CI)

## Basic Knowledge (Essential)

You should never skip this part.

[Clean Code 實戰之 PHP 良好實踐](https://kylinyu.win/php_best_practice) A clean code guide from beginner to advanced  

[【Code Review】把&当and用可是不行！测试写成这样也有点离谱哦！](https://www.youtube.com/watch?v=ERosfjjY40Y&list=PLSo-C2L8kdSNr5yUJYhyDArnM4FU9iG1S)  
A beginner-friendly code review demonstrating basic code optimization techniques.

[如何優雅地避免程式碼巢狀 | 程式碼嵌套 | 狀態模式 | 表驅動法 |](https://www.youtube.com/watch?v=dzO0yX4MRLM)  
Introduces methods for reducing code nesting, including table methods, early returns, assertions, polymorphism, and useful built-in functions (filter, sort, group, map, any, all). Also covers better null pointer handling.

[【python】原来我可以少写这么多for loop！学会之后代码都pythonic了起来](https://www.youtube.com/watch?v=8DJ6M3tvnwY)  
Introduces useful built-in functions in Python and compares their performance to hand-crafted for loops.

## Clean code

Every article is carefully curated and informative.

[我与微软的代码规范之争——局部变量竟然不让初始化？](https://www.youtube.com/watch?v=cAvAbyadts4)  
Discusses whether to initialize local variables in C and explains the tradeoffs related to code errors.

[【Code Review】传参的时候有这么多细节要考虑？冗余循环变量你也写过么？](https://youtube.com/watch?v=er9MKp7foEQ)  
SELECTED code review

[【Code Review】十行循环变两行？argparse注意事项？不易察觉的异常处理？](https://www.youtube.com/watch?v=7EQsUOT3NKY)  
SELECTED code review

[【Code Review】格式，异常处理和多线程的风险](https://www.bilibili.com/video/BV1iS421Q7Bb)  
Review code for an interesting project about controlling while loop time out.

## Other Knowledge

[Win系統舊代碼導致CPU干冒煙？谷歌程序員慘背鍋 | 谷歌 | 微軟 | Chrome | 負優化 | 內存 | 系統 | Windows | 程序員 | CPU](https://www.youtube.com/watch?v=9RjZxB1M1P0)  
Outdated and unclear Windows API incurs page fault overhead.

[【python】听说Python的多线程是假的？它真的没有存在的价值么？](https://www.youtube.com/watch?v=1Bk3IpNsvIU)  
Explains multi-threading of Python, including asyncio, aiohttp.

[Kotlin颜值为啥遥遥领先 | 不可变变量 | lambda | 语法糖 | 构造函数 | 教程 | 中缀表达式 | val var](https://www.youtube.com/watch?v=iTy13tsi054)  
Good design increases read-only variables from 2.9% to 86.3%, enhancing code quality effortlessly.
