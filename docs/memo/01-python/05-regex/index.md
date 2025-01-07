---
title: 正則表達式
description: Python 正則表達式 Regex
tags:
  - Programming
  - Python
keywords:
  - Programming
  - Python
  - Regex
last_update:
  date: 2024-09-11T00:00:00+08:00
  author: zsl0621
first_publish:
  date: 2024-09-11T00:00:00+08:00
---

# Python 正則表達式 \*\*還沒完成\*\*

```py
pattern = re.compile(r"^(.*?)\s*\((\d+)\)(\..+)?$")
```
第一次看到正則表達式的感想只有「？？？」，不過簡單來說就是一套可以描述字符匹配的表達方式。

## 入門函式
不造輪子，直接看使用[正規表達式 re](https://steam.oxxostudio.tw/category/python/library/re.html#a01)。

## 入門匹配方式
匹配非保留字符時直接用中括號 `[]` 表示要匹配的字符，例如
```py
text = "ABC 123"
A = re.search("[a-zA-Z]", text).group()   # 'A'
B = re.search("[a-zA-Z]+", text).group()   # 'ABC'
```

也可以加上 `^` 排除字符：
```py
text = "ABC 123"
C = re.search("[^a-zA-Z]", text).group()   # ' '
D = re.search("[^a-zA-Z]+", text).group()   # ' 123'
```

接著介紹如何匹配任意字符，進入滿臉問號的開始。
  
### 字符類型匹配
- `.`：任意字符（不包括換行符）。
- `\d`：任意數字（0-9）。
- `\D`：任意非數字。
- `\w`：任意字母、數字或下劃線（等同[a-zA-Z0-9_]）。
- `\W`：任意非字母、數字或下劃線的字符。
- `\s`：任意空白字符（空格、制表符、換行符）。
- `\S`：任意非空白字符。

使用範例，依序匹配整個字串這樣比較好理解
```py
text = "ABC 123"
# 只匹配單字符
print(re.search(r"\w", text).group())   # 'A'
# 加上"+"匹配多字符
print(re.search(r"\w+", text).group())   # 'ABC'
# 加上"\s"匹配空格
print(re.search(r"\w+\s", text).group())   # 'ABC '
# 加上"\W"匹配字母、數字或下劃線的字符
print(re.search(r"\w+\W", text).group())   # 'ABC '
# 加上"\w+"匹配空格後面的字符
print(re.search(r"\w+\W\w+", text).group())   # 'ABC 123'
```

這就是基本使用方法了。

### 量詞 Quantifier
- `*`：匹配前面的元素 0 次或多次。
- `+`：匹配前面的元素 1 次或多次。
- `?`：匹配前面的元素 0 次或 1 次。
- `{n}`：精確匹配前面的元素 n 次。
- `{n,m}`：匹配前面的元素至少 n 次，至多 m 次。

### 邊界設定
- `^`：匹配字符串的開始。
- `$`：匹配字符串的結尾。
- `\b`：匹配單詞邊界（例如單詞前後的空格或標點）。
- `\B`：匹配非單詞邊界。

如果規則前後加上 `^` 和 `$`，即要求完整匹配開頭到結尾。

#### 範例：移除電話號碼中的空白

```python
import re

text = "123 456 7890"
result = re.sub(r"\s+", "", text)
print(result)   # 1234567890
```

---

## 高階匹配方式

### 捕獲
- 小括號 `( )`：捕獲一個匹配，以便後續引用
  - EX: `(\d{3})` 匹配並捕獲三位數字
  
- 管道符 `|`：匹配任意一個可能
  - EX: `cat|dog` 匹配 "cat" 或 "dog"

- 非貪婪匹配 `?`：在量詞後加 `?`，使匹配最少次數。正則表達式預設貪婪，它會找最長的匹配

- 小括號加問號 `( )?`：表示可選

#### 範例：取出 HTML 標籤內內容

提取 `"<h1>Hello World</h1>"` \<h1\> 標籤的內容，即 `"Hello World"`。

```python
html = "<h1>Hello World</h1>"
result = re.sub(r"<.*?>(.*?)</.*?>", r"\1", html)
print(result)   # Hello World
```

- `<.*?>`：使用非貪婪模式匹配 HTML 標籤（）。
- `(.*?)`：捕獲標籤中的內容。
- `r"\1"`：取出匹配結果。

#### 範例：移除 URL 的查詢參數

移除所有的查詢參數，只保留基礎 URL （移除問號後面的所有文字）。

```python
url = "https://example.com/page?param1=value1&param2=value2"
result = re.sub(r"\?.*$", "", url)   # 'https://example.com/page'
```

- `\?.*$`：匹配 `?` 後面的所有內容（`$` 表示匹配到行尾）。
- `re.sub` 將匹配到的內容替換成空字符串，從而移除查詢參數。

#### 範例：格式化日期

把日期字串 `"20240908"`格式化成 `"2024-09-08"` 。

```python
text = "20240908"
result = re.sub(r"(\d{4})(\d{2})(\d{2})", r"\1-\2-\3", text)
print(result)   # 2024-09-08
```

- 三個捕獲群組（三個括弧）
- 每個括弧填入匹配規則，分別捕獲年份月份日期
- `r"\1-\2-\3"`：引用捕獲群組，`\1` 是第一個捕獲的組，`\2` 是第二個，`\3` 是第三個。

#### 範例：電子郵件

驗證 `"example@test.com"` 是否符合電子郵件格式。

```python
def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\D{3}$'
    return re.match(pattern, email) is not None

validate_email("example@test.com")   # True
validate_email("example@test.")   # False
validate_email("example@test.s")   # False
validate_email("example@test.sss")   # True
```

- `^`：表示字串開頭
- `[]`：匹配裡面的元素，包含 `\w`, `.`, `-`，
- `[]+`：匹配元素到最長
- `[\w\.-]+`：匹配次級域名
- `\D{3}`：匹配頂級域名，只能是字符不能有數字
- `$`：表示字串結束。

## 結語
這誰記得起來，所以接下來是我的個人筆記，我才不要每次寫個小腳本還要重看文章。

#### 範例：檔案重新命名一
如果檔名符合規則 `"{digits} <xxx>.<extension>"`，把花括弧前加上空格移到最後，例如：  
- `{123} example.txt` 變成 `example {123}.txt`
- `{456} folder` 變成 `folder {456}`

```py
def rename_item0(directory, item):
    pattern = re.compile(r"^{(\d+)}\s+(.+?)(\..+)?$")
    match = pattern.match(item)
    if match:
        number, name, extension = match.groups()
        if extension:
            new_name = f"{name} {{{number}}}{extension}"
        else:
            # 資料夾
            new_name = f"{name} {{{number}}}"
        old_path = os.path.join(directory, item)
        new_path = os.path.join(directory, new_name)
        os.rename(old_path, new_path)
```

- `^` 匹配字符串開始
- `{(\d+)}` 匹配花括號中的數字並捕獲這個數字
- `\s+` 匹配空格
- `(.+?)` 非貪婪地匹配任何字符（除了換行符），這是文件名主體
- `(\..+)?` （可選）匹配副檔名


## 參考資料
[使用正規表達式 re](https://steam.oxxostudio.tw/category/python/library/re.html)
[正規表示式（Regular Expression）](https://hackmd.io/@aaronlife/regular-expression)

