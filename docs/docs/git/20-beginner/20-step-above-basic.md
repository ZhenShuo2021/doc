---
title: 基礎操作
author: zsl0621
description: 挑選日常常用指令集合，囊括 99% 的日常使用問題。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-09-10T16:15:33+08:00
  author: zsl0621
first_publish:
  date: 2024-09-10T16:15:33+08:00
---

# Git 基礎操作

一分鐘入門只說明如何提交檔案，但是在版本之間切換才是版本管理工具的精華，接下來的兩篇文章會這樣進行說明：

1. 兩篇文章分別為基礎操作（單一分支）和分支操作（多分支）
2. 每個操作會先列出該操作的常用命令，並說明每個命令的目的
3. 最後提供情境範例

快速檢索的方式是從右側目錄快速定位操作內容，例如提交錯誤時可以找到「清除提交」定位到 git reset。本文只介紹基礎操作，[下一篇文章](./branch)我們會介紹比較難上手的分支操作。

基礎操作包含了對於單一分支的各項操作，包含更靈活的 add/commit 檔案，以及檔案復原。

```sh
git add                              # 預存檔案
git commit                           # 提交檔案
git reset                            # 清除提交狀態
git checkout                         # 檔案還原的舊版指令，本文不介紹
git restore                          # 檔案還原的新版指令
git reflog                           # git 操作救命稻草
```

---

## 新增檔案 git add

`git add` 使用 `<pathspec>` 來指定檔案，可以輕鬆的區分檔案，例如

```sh
git add *.py                         # 追蹤目前資料夾第一層的所有 py 檔
git add **/*.py                      # 追蹤所有 py 檔
git add src/**/*.py                  # 追蹤 src 資料夾中的所有 py 檔
```

除了此之外兩個方便的指令：

- `-u`: 只預存已追蹤的檔案。
- `-p`: 補丁模式，互動式加入預存，常用選項為
  - y, yes
  - n, no
  - d, 該檔案之後都不要加入
  - s, 切成更小的區塊 (hunk)
  - 不太需要用補丁模式，改用 [lazygit](https://github.com/jesseduffield/lazygit) 完成相同功能方便一百倍

> 看不懂 pathspec？請見[看懂文檔](../preliminaries/read-git-docs)。

### 情境：略過特定副檔名的檔案

```sh
# 方法一：使用表達式  
git add . ':!*.txt' ':!*.py'

# 方法二：使用 git reset
git add .                            # 預存全部檔案
git reset *.py                       # 移除 py 檔案，或者 **/*.py 遞迴移除
```

---

## 提交檔案 git commit

- `git commit -am <message>`: 懶人指令，略過 `git add .`。
- `git commit -m "<Title><按兩下Enter>`: 提交有標題的 commit message 的方式，打好標題後按兩次 enter，到第三行繼續寫內容。

### 情境：修改上一次提交

常常會提交完成後馬上發現訊息寫錯、程式 typo，要怎麼修改？

直接修改現在的檔案內容並且使用下列指令可以完成，amend 的意思是修復（複寫）最近一次的提交

- `git commit --amend`: 修改上次的提交訊息和檔案。
- `git commit --amend --no-edit`: 修改上次的提交檔案，訊息不變。

---

## 還原檔案 git restore

```sh
git restore [<options>] <pathspec>
```

用於檔案還原，只會回復檔案內容不會修改提交歷史，常用參數有三個，分別是

- `-s, --source`: 指定恢復的提交來源。
- `-S, --staged`: 還原已預存的檔案（白話文：取消 add 或稱作 unstage）。
- `-W --worktree`: 還原到工作目錄（白話文：還原檔案在工作目錄（硬碟）的狀態）。預設開啟，但是使用 -S 時會關閉，原因是讓你可以只取消預存而不是連檔案修改都還原了。

<details>
  <summary>為什麼用新版 git restore 不用舊版 checkout？</summary>

新手學習這個指令是最好的，因為舊版本用於檔案還原的指令混雜，例如 `git reset <pathspec>` 可以指定檔案踢出預存，但是 `git reset --hard` 卻不能指定檔案；而 `git checkout -- .` 可以還原未預存的檔案，卻又不能處理已預存的檔案。
</details>

### 情境：放棄未預存的程式碼

```sh
git restore <pathspec>
```

### 情境：放棄程式碼，不管是否預存

```sh
git restore -SW <pathspec>
```

### 情境：查看舊版的檔案

```sh
git restore --source=<hash> <pathspec>
```

---

## 清除提交 git reset

```sh
git reset [<mode>] [<commit>] [<pathspec>]
```

用於清除提交版本，reset 雖然聽起來是重設/還原，但實際做的是<u>**清除**</u>提交，預設模式是 mixed，預設檔案是全部檔案。三種模式分別是代表

1. soft: 只清除 commit，其他不動
2. mixed: 清除 commit 和 add
3. hard: 除了 commit 和 add 以外，連你的寫的程式都刪了，謹慎使用！

接下來提供幾個使用情境方便記憶。

### 情境：程式改壞了想回復到遠端版本

```sh
git reset --hard origin/main
```

origin 代表遠端別名，main 是遠端分支名稱，這是 reset 最常用的情境，下方幾個都不常用。

### 情境：不小心提交，想繼續編輯

```sh
git reset --soft HEAD^
```

這個指令會取消最新的提交，但保留所有程式碼修改，使用 `git commit --amend` 也可達成相同效果（但是 amend 僅限最近一次提交）。

### 情境：放棄未提交的修改

更生動的描述：寫到一半發現自己寫的 code 是垃圾，直接回到上一次提交。

```sh
# 等同於 git restore -SW .
git reset --hard
```

### 情境：提交了多個小變更，想整理成一個提交

```sh
git reset HEAD~3
```

這會移除包含現在的三個提交。

### 情境：補充說明

reset 不常用的原因是這些情境都能被更方便的互動式變基 (interactive rebase) 取代，最常用的應該只有從遠端還原，如果你想彎道超車直接學互動式變基可以閱讀我寫的文章：[[微進階] 使用 Rebase 變基提交](../history-manipulation/interactive-rebase)。

:::info

1. HEAD 代表目前工作的 commit 位置
2. "^" 代表前一個提交，"~n" 代表前 n 個提交

:::

:::danger

雖然初學暫時不會碰到多人合作，但還是必須強調修改提交歷史 **永遠只該用於個人分支**！

:::

---

## 任意修改 git rebase

git rebase 實際上是對分支進行操作，原本應該放在後續文章，但是單純進行這裡要講的互動式變基 (interactive rebase) 時你完全感受不到分支操作，而他的功能之強大值得放在這裡，請見我寫的教學 [互動式變基 Interactive Rebase](../history-manipulation/interactive-rebase)，請先只看這個段落，初學者看完整篇文章應該會懵。

注意 rebase 本質也是在修改提交歷史，而修改提交歷史永遠只該用於個人分支。

---

## 救命稻草 git reflog

當操作錯誤時，git 的日誌功能 git reflog 可以還原操作。直接講使用方法：

```sh
$ git reflog
5293902 (HEAD -> main, origin/main, origin/HEAD) HEAD@{0}: commit: add article: python/regex
62b2d38 HEAD@{1}: rebase (finish): returning to refs/heads/main
62b2d38 HEAD@{2}: rebase (reword): add tags to article
72c5477 HEAD@{3}: rebase (start): checkout HEAD~2
37334c5 HEAD@{4}: commit: add: article tags  # <-- 現在想還原到這個修改

$ git reset --hard HEAD@{4}
```

這樣會回到 rebase 前的狀態。reflog 只會紀錄本地操作，推送到遠端再 clone 下來後不會有 reflog 紀錄，所以為你自己學 Git 的[這篇文章](https://gitbook.tw/chapters/faq/remove-files-from-git)寫錯了。

## 結語

到這邊就結束單一分支的操作，你已經可以基本的操作 Git 了，在[下一篇文章](./branch)中我們會介紹多分支操作。在初學階段個人使用時不太會用到分支功能，根據需求可以快轉到[遠端儲存庫設定](../remote/setup)。
