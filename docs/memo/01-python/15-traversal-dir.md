---
title: Python 遍歷資料夾方式
description: Python 遍歷資料夾方式
sidebar_label: 遍歷資料夾方式
tags:
  - Programming
  - Python
keywords:
  - Programming
  - Python
  - Regex
last_update:
  date: 2024-12-13T16:42:10+08:00
  author: zsl0621
first_publish:
  date: 2024-12-13T16:42:30+08:00
---

# Python 遍歷資料夾方式

如果你對遍歷資料夾有疑惑那是正常的，因為光是內建就有超過八種方法，網路又又又再度沒有任何一篇可以把他們說清楚，所以有這篇文章。本文由 LLM 整理但是人工重新編排、修正範例程式碼、校稿。

注意以下所有方式在進入迴圈之後的資料夾內容變化都不會被追蹤。

## 何時用 Pathlib

Pathlib 是對所有作業系統路徑處理方式包裝的高階 API，不需要效能就一律使用他，除非已經寫了一堆使用 os 處理的程式碼很難改。Pathlib 很慢，[這個測試](https://discuss.python.org/t/is-there-a-pathlib-equivalent-of-os-scandir/46626/18)列出資料夾中的檔案總共五萬個空白文件檔，Pathlib 比 os 慢了一萬倍。

## 遍歷方式介紹

表格會列出返回類型，因為<u>**所有文章都不講清楚**</u>，重點是他是直接返回物件還是需要用迴圈迭代的 Generator/Iterator，以及返回的是特殊物件 (Path object 等) 或是簡單的字串。

### 基本遍歷第一層

基本方式只會列出第一層，不會遞迴搜尋子資料夾。listdir 和 scandir 差別是一個用 C 寫的一個呼叫 system call 所以後者比較慢。

<table>
<tr>
    <th>方法</th>
    <th>返回類型</th>
    <th>備註</th>
</tr>
<tr>
    <td>os.listdir()</td>
    <td>list[str]</td>
    <td>只返回名稱</td>
</tr>
<tr>
    <td>os.scandir()</td>
    <td>Iterator[DirEntry]</td>
    <td>DirEntry提供更多訪問方式，如 is_file(), is_dir()</td>
</tr>
<tr>
    <td>pathlib.iterdir()</td>
    <td>Generator[Path]</td>
    <td>Path 物件也有很多訪問方式，如 stem</td>
</tr>
</table>

使用範例如下

```python
# os.listdir()
import os
files = os.listdir('.')
print(files)
print("**************************************************\n")

# os.scandir()
with os.scandir('.') as entries:
    for entry in entries:
        print(entry.name)  # entry 是 DirEntry 物件
print("**************************************************\n")

# pathlib
from pathlib import Path
path = Path('.')
for item in path.iterdir():
    print(item)
```

### 遞迴搜尋

遞迴搜尋子資料夾的方式，pathlib 也可以 walk。

<table>
<tr>
    <th>方法</th>
    <th>是否遞迴</th>
    <th>返回類型</th>
    <th>適用情境</th>
</tr>
<tr>
    <td>os.walk()</td>
    <td>是</td>
    <td>Iterator[tuple[str, list[str], list[str]]]</td>
    <td>返回根目錄、子目錄和檔案列表</td>
</tr>
<tr>
    <td>glob.glob</td>
    <td>可選</td>
    <td>list[str]</td>
    <td>小資料夾用，一次返回所有結果</td>
</tr>
<tr>
    <td>glob.iglob</td>
    <td>可選</td>
    <td>Iterator[str]</td>
    <td>大量資料夾用，節省記憶體</td>
</tr>
<tr>
    <td>Path.glob</td>
    <td>可選</td>
    <td>Generator[Path]</td>
    <td>可以理解為 Pathlib 版本的 iglob</td>
</tr>
<tr>
    <td>Path.rglob</td>
    <td>一定遞迴</td>
    <td>Generator[Path]</td>
    <td>可以理解為 Pathlib 版本的 iglob 但是必定遞迴</td>
</tr>
</table>

使用範例如下

```python
import os
import glob
from pathlib import Path

# os.walk
for root, dirs, files in os.walk("."):
    if "venv" in root:
        continue
    for file in files:
        print(os.path.join(root, file))

# glob.glob
files = glob.glob("./**/*", recursive=True)
for file in files:
    print(file)

# glob.iglob
for file in glob.iglob("./**/*", recursive=True):
    print(file)

# Path.glob
for file in Path(".").glob("**/*"):
    print(file)

# Path.rglob
for file in Path(".").rglob("*"):
    print(file)
```

### 模式匹配

此方式可以篩選特定關鍵字的檔案進行匹配，只有 glob.glob() 直接返回列表，適用於小資料夾。

<table>
<tr>
    <th>方法</th>
    <th>返回類型</th>
    <th>備註</th>
</tr>
<tr>
    <td>glob.glob()</td>
    <td>list[str]</td>
    <td>直接返回列表</td>
</tr>
<tr>
    <td>glob.iglob()</td>
    <td>Iterator[str]</td>
    <td></td>
</tr>
<tr>
    <td>pathlib.glob()</td>
    <td>Iterator[Path]</td>
    <td></td>
</tr>
<tr>
    <td>pathlib.rglob()</td>
    <td>Iterator[Path]</td>
    <td></td>
</tr>
</table>

使用範例如下

```python
import glob
import os
from pathlib import Path

print("glob.glob() 遞歸搜索:")
glob_files = glob.glob('**/*.py', recursive=True)
glob_files = [f for f in glob_files if '.venv' not in f]
print(glob_files)

print("\nglob.iglob() 遞歸搜索:")
iglob_files = list(glob.iglob('**/*.py', recursive=True))  # 返回生成器，使用 list 取出迭代所有值
iglob_files = [f for f in iglob_files if '.venv' not in f]
print(iglob_files)

print("\nPath.glob() 遞歸搜索:")
path_glob_files = list(Path('.').glob('**/*.py'))  # 返回生成器
path_glob_files = [str(f) for f in path_glob_files if '.venv' not in str(f)]
print(path_glob_files)

print("\nPath.rglob() 遞歸搜索:")
path_rglob_files = list(Path('.').rglob('*.py'))  # 返回生成器
path_rglob_files = [str(f) for f in path_rglob_files if '.venv' not in str(f)]
print(path_rglob_files)
```

## 如果就是要用 os

那 listdir/walk/scandir 如何選擇？

listdir 只用來簡單列出名稱，scandir 只掃描第一層，walk 用於遞迴並且返回 tuple 方便操作。

- 參考資料：[Why is os.scandir() as slow as os.listdir()?](https://stackoverflow.com/questions/59268696/why-is-os-scandir-as-slow-as-os-listdir)
- 註記：os.walk 很慢已經在 Python 3.5 [修正](https://github.com/benhoyt/scandir)

## Pathlib cheat sheet 小抄

不要再看 medium 上的爛文章了，看這篇。

### 基本操作

| Path-related task               | pathlib approach                | Example                                      |
|----------------------------------|---------------------------------|----------------------------------------------|
| 合併路徑元件                   | `path / name`                   | `Path('/path/to/target.txt')`          |
| 取得檔案名稱                   | `path.name`                     | `'readme.md'`                                |
| 取得不含副檔名的檔案名稱       | `path.stem`                     | `'readme'`                                   |
| 取得檔案副檔名                 | `path.suffix`                   | `'.md'`                                      |
| 取得父目錄路徑                 | `path.parent`                   | `Path('home/trey/proj')`                    |
| 驗證路徑是否為目錄             | `path.is_dir()`                 | `False`                                      |
| 驗證路徑是否為檔案             | `path.is_file()`                | `True`                                       |
| 取得祖先目錄                   | `path.parents`                  | `[Path('/home/trey/proj'), ...]`             |
| 取得當前目錄                   | `Path.cwd()`                    | `Path('/home/trey/proj')`                    |
| 取得使用者主目錄               | `Path.home()`                   | `Path('/home/trey')`                         |
| 取得絕對路徑                   | `relative.resolve()`            | `Path('/home/trey/proj')`          |
| 取得相對於基礎目錄的路徑       | `path.relative_to(base)`        | `Path('readme.md')`                          |
| 檢查是否為同一檔案或目錄       | `path.samefile(other_path)`     | `True/False`                                 |
| 檢查檔案是否為符號連結         | `path.is_symlink()`             | `True/False`                                 |

### 遍歷資料夾

| Path-related task               | pathlib approach                | Example                                      |
|----------------------------------|---------------------------------|----------------------------------------------|
| 遍歷檔案樹                     | `path.walk()`                   | 可遍歷的 `(path, subdirs, files)`           |
| 列出目錄中的檔案與子目錄       | `path.iterdir()`                | `[Path('home/trey')]`                        |
| 根據模式尋找檔案               | `path.glob(pattern)`            | `[Path('/home/trey/proj/readme.md')]`        |
| 遞迴尋找檔案                   | `path.rglob(pattern)`           | `[Path('/home/trey/proj/readme.md')]`        |

### 操作檔案系統

| Path-related task               | pathlib approach                | Example                                      |
|----------------------------------|---------------------------------|----------------------------------------------|
| 新建目錄                       | `path.mkdir()`                   | 新建目錄                                     |
| 刪除檔案                       | `path.unlink()`                 | 刪除檔案                                     |
| 重新命名檔案或目錄             | `path.rename(target)`           | 新的路徑物件                                 |
| 讀取所有檔案內容               | `path.read_text()`              | `'Line 1\nLine 2\n'`                         |
| 寫入檔案內容                   | `path.write_text('new')`        | 寫入 `new` 到檔案                           |

### 取得路徑資訊

| Path-related task               | pathlib approach                | Example                                      |
|----------------------------------|---------------------------------|----------------------------------------------|
| 取得檔案大小（位元組）         | `path.stat().st_size`           | `14`                                         |
| 取得檔案創建時間               | `path.stat().st_ctime`          | `1595554954.0`                               |
| 取得檔案修改時間               | `path.stat().st_mtime`          | `1595554954.0`                               |
| 取得檔案訪問時間               | `path.stat().st_atime`          | `1595554954.0`                               |
| 取得檔案的inode號碼            | `path.stat().st_ino`            | `1234567890`                                 |

## 還是要抱怨

Google SEO 推薦的中文文章爛到令人生氣，第一篇是 medium 轉錄廢話一堆，medium 本身沒有 code highlight 已經看得很痛苦了，又扯 3.6 版本，拜託一下 2020 年 3.6 都要 EOL 了誰會管這個？第二篇把路徑拼接放在最後一個介紹我真的傻眼，第三篇是超級新手向的文章，花了一半的篇幅講到如何 mkdir，第四篇終於有一個正常人會把路徑拼接放在第一個講了，但是神奇的 Google SEO 把他放到搜尋結果第九，而且我個人不喜歡該作者的文章，話太多資訊密度太低，整篇看完沒有重點。

就怪其他家搜尋引擎不爭氣，微軟 Bing 搜尋連文章都搜尋不到更不要說什麼文章推薦了。
