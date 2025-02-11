---
title: JSON、YAML、TOML 簡易說明
description: JSON、YAML、TOML 資料格式簡易說明
sidebar_label: JSON/YAML/TOML
tags:
  - Programming
  - Python
  - yaml
  - toml
keywords:
  - Programming
  - Python
  - yaml
  - toml
last_update:
  date: 2025-01-11T23:09:00+08:00
  author: zsl0621
first_publish:
  date: 2025-01-11T23:09:00+08:00
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

本文會從什麼是資料序列化開始介紹，並且說明常見的資料格式（有哪些標題已經破梗），還有如何選擇他們和格式範例，最後是同場加映的 JSON 讀取範例。

## 序列化

序列化 (Serialization) 是將資料結構轉換為可儲存或傳輸的格式，而反序列化則將其還原為程式語言中可操作的資料結構或物件。它是資料交換和配置儲存的核心技術。

- 序列化：將記憶體中的資料結構或物件轉換為特定格式，使其適合儲存或傳輸
- 反序列化：將已序列化的資料轉換回程式語言中的資料結構或物件

本文只介紹設定檔常用的 JSON/YAML/TOML 格式。

## 常見資料格式簡介  

- JSON 是最通用的序列化方式，最大弱點是不支援註解
- YAML 誕生的目的是設計一個人類可讀的資料格式，解決以往 JSON 不好閱讀、無法註解的問題
- TOML 最新穎，因為高可讀以及可任意縮排受到歡迎，例如各種 markdown 工具就很喜歡使用 TOML 為配置檔案（例如 Hugo）。

| 格式  | 特性 | 優點 | 缺點 |
| ----- | ---- | ---- | ---- |
| **JSON** | 結構簡單，語法直觀 | 人類可讀性高，跨語言相容性強 | 不支援註解 |
| **YAML** | 簡潔，支援註解，可讀性強 | 適合配置檔案 | 格式靈活，易因縮排出錯 |
| **TOML** | 結構清晰，易讀易寫 | 專為配置檔案設計 | 相較支援工具較少 |

## 格式範例

YAML 誕生的目的是為了人類高可讀性，然而他不規範的縮排讓筆者本身覺得他可讀性比 JSON 還不如，例如 [pre-commit](https://pre-commit.com/#2-add-a-pre-commit-configuration) 這種格式也是合法的，並且因為沒有括弧所以在複雜設定時就考驗你的眼力，你要往上對齊找到現在在哪個列表或字典中，而不是 JSON 可以用括弧瞬間定位，或者 TOML 每個項目的標題就直接寫清楚了。除了可讀性問題 [The yaml document from hell](https://ruudvanasseldonk.com/2023/01/11/the-yaml-document-from-hell) 還有更多抱怨。

下方範例可以作為 cheatsheet 使用，對照原始資料結構一目了然知道應該如何設定。可以看到 YAML 有夠傻，這到底在寫啥。

<Tabs>
  <TabItem value="python_dict" label="Python Dictionary" default>
    ```python
    # Python 字典結構，包含不同層級的key-value
    data = {
        "simple_string": "Hello, world",  # 第一層 key-value
        "simple_integer": 100,  # 第一層 key-value
        "nested_dict": {
            "level_1": {
                "level_2": {
                    "key": "deep_value"
                }
            },
            "first_level_in_nested": "Nested first level"
        },
        # nested_list 為非同質化數據，"toml" 套件無法讀，要改用 "tomlkit" 套件
        "nested_list": [
            ["a", "b", "c"],
            [1, 2, 3, [10, 20, 30]]
        ],
        "mixed_structure": {
            "list_in_dict": [
                {"id": 1, "name": "Item 1"},
                {"id": 2, "name": "Item 2"}
            ],
            "dict_in_list": [
                {
                    "key1": "value1",
                    "nested": {
                        "key2": "value2"
                    }
                }
            ]
        },
        "boolean_key": True  # 第一層 key-value
    }
    ```
  </TabItem>
  <TabItem value="json" label="JSON">
```json
{
  "simple_string":"Hello, world",
  "simple_integer":100,
  "nested_dict":{
    "level_1":{
      "level_2":{
        "key":"deep_value"
      }
    },
    "first_level_in_nested":"Nested first level"
  },
  "nested_list":[
    [
      "a",
      "b",
      "c"
    ],
    [
      1,
      2,
      3,
      [
        10,
        20,
        30
      ]
    ]
  ],
  "mixed_structure":{
    "list_in_dict":[
      {
        "id":1,
        "name":"Item 1"
      },
      {
        "id":2,
        "name":"Item 2"
      }
    ],
    "dict_in_list":[
      {
        "key1":"value1",
        "nested":{
          "key2":"value2"
        }
      }
    ]
  },
  "boolean_key":true
}
```
  </TabItem>
  <TabItem value="yaml" label="YAML">
```yaml
boolean_key: true
mixed_structure:
  dict_in_list:
  - key1: value1
    nested:
      key2: value2
  list_in_dict:
  - id: 1
    name: Item 1
  - id: 2
    name: Item 2
nested_dict:
  first_level_in_nested: Nested first level
  level_1:
    level_2:
      key: deep_value
nested_list:
- - a
  - b
  - c
- - 1
  - 2
  - 3
  - - 10
    - 20
    - 30
simple_integer: 100
simple_string: Hello, world
```
  </TabItem>
  <TabItem value="toml" label="TOML">
    ```toml
    simple_string = "Hello, world"
    simple_integer = 100
    nested_list = [ [ "a", "b", "c",], [ 1, 2, 3, [ 10, 20, 30,],],]
    boolean_key = true   # 在第一層級的一定要放在最前面

    [nested_dict]
    # [xxx]語法一個 section，該區域下的鍵值對屬於 nested_dict 節點
    first_level_in_nested = "Nested first level"

    [mixed_structure]
    [[mixed_structure.list_in_dict]]
    # [[xxx]]語法代表列表，且每個列表元素是字典。
    id = 1
    name = "Item 1"

    [[mixed_structure.list_in_dict]]
    id = 2
    name = "Item 2"

    [[mixed_structure.dict_in_list]]
    key1 = "value1"

    [mixed_structure.dict_in_list.nested]
    key2 = "value2"

    [nested_dict.level_1.level_2]
    key = "deep_value"
    ```
  </TabItem>
</Tabs>

## 如何選擇

如果要儲存大型數據結構，在這三者選擇毫無疑問就是使用 JSON，其他兩個是給人類讀的。

- **JSON**：最通用標準的方式，拿不定主意用他、大型數據用他
- **YAML**：需要可讀性的配置檔案
- **TOML**：語法簡單，小型配置檔案的首選
- **高效能**：高效能還用文字格式是不是搞錯了什麼？

這樣看似使用 YAML 和 TOML 作為需要手動配置的文件格式是好選擇，然而有一些問題需要注意，首先是 YAML 利用縮排解析資料結構非常反人類，回想那些 bug 是空白鍵的痛苦就知道了；TOML 的缺點說大不大說小不小，分別有以下幾個：

1. 字典第一層的一定要寫在 TOML 最上面，無法保持原有位置
2. 在複雜配置可讀性就大幅降低（至少對我來說）
3. 異質化的數據不是所有解析工具都支援
4. 會的人相對少、相關工具也少

TOML 看似很多缺點，但是經歷過 YAML 除錯之後，要我在兩者之間選擇我還是會毫不猶豫選擇 TOML。

## YAML 獨有語法

YAML 的 `|` 和 `>` 符號用於控制多行字串的格式化，`|` 會保留換行符，`>` 會將換行折疊為單一空格。

```yaml
key: |
  Line 1
  Line 2
  Line 3  
key: >
  Line 1
  Line 2
  Line 3  
```

這兩個是一樣的

```yaml
channels:
  - conda-forge
dependencies:
  - latexindent.pl

channels:
- conda-forge
dependencies:
- latexindent.pl
```

## 同場加映：JSON 讀寫

Python 內置庫 json 有 load/loads/dump/dumps 四種方式

- 有 s 代表字串處理，沒有 s 代表檔案讀寫
- load/loads 是反序列化變成物件，dump/dumps 是序列化變成字串
- 遇到亂碼可以設定 encoding="utf-8" 設定編碼，或者其餘編碼方式
- 使用 json.dumps(data, indent=4) 可以漂亮印出字典

使用範例如下

```py
import json
data = {"name": "Alice", "age": 25}

# 序列化：來源是一個物件
# 讀取檔案
with open("data.json", "w") as file:
    json.dump(data, file)

# 漂亮印出
print(json.dumps(data, indent=4))

# 反序列化：來源是字串
# 載入檔案
with open("data.json", "r") as file:
    data = json.load(file)

# 讀取字串形式的字典
json_str = '{"name": "Alice", "age": 25}'
data = json.loads(json_str)
```

毫不意外的網路上又在亂寫一通，這麼簡單四點一個段落可以水成一篇文章還寫的不清不楚。

## 同場加映：JSON 第三方套件

內建 json 慢是當然的，這裡列出第三方套件提供選擇：

1. ujson: 內建 json 的輕量替代品
2. orjson: 高效的替代品
3. msgspec: [利用數據類型](https://blog.ferstar.org/post/issue-62/)加速讀取

<details>
<summary>偷偷罵人</summary>

這篇文章原本是想寫一個 YAML cheatsheet，因為 YAML 真的是我遇過最反人類的格式，在 ubuntu server 設定過 docker-compose.yml 就知道用 vim/nano 編輯根本是人間地獄，用縮排解析蠢到不行到底哪個天才想出來的。想一想又覺得可以連 JSON/TOML 一起寫一寫，順便說序列化、反序列化，因為這些內容看網路文章又是一如既往的爛，語言模型十秒寫完的都比這些爛文章還好理解，這些爛文章的存在意義只剩下兩個

1. 當訓練資料
2. 浪費大家時間

所以這篇文章我也叫語言模型寫，沒有安全性討論沒有效能比較什麼都沒，很快能讀完，而且就算是笨蛋都看得懂。

:::note prompt

ChatGPT 4o#2025/01/11

第一段先叫他想出段落

```shell
我正在寫一篇文章介紹資料相關，從序列化、反序列化，到json/yaml/toml，幫助我完成這兩項任務

1. 想出中文標題/slug，簡短超簡潔易懂，符合google seo
2. 規劃段落
```

第二段叫他開始寫

```shell
根據此規劃寫出「超簡潔」介紹文章，簡潔不代表沒有內容深度，而是去蕪存菁，不講廢話，只講重點，不浪費排版

一切以資訊吸收速度為考量撰寫高可讀、超簡潔文章
```

不過還是自己改了大概有一半的篇幅。

:::

</details>
