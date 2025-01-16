---
title: 看懂 Git 文檔
author: zsl0621
description: 教你看懂 Git 文檔
sidebar_label: 看懂文檔
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2025-01-16T15:30:00+08:00
  author: zsl0621
first_publish:
  date: 2025-01-13T14:40:00+08:00
---

你真的看得懂 Git 文檔嗎？先說似懂非懂不算懂喔。本文簡單教學如何閱讀 Git 文檔，絕對是你在中文圈沒看過的教學，初學者可以放心的跳過這個章節，就算文檔讀不懂你還是可以用很久，因為我發現很多教學文章自己也看不懂文檔。本文的目標是讀懂最難懂的指令：`git rebase`。

> [git rebase 文檔](https://git-scm.com/docs/git-rebase)

```sh
git rebase [-i | --interactive] [<options>] [--exec <cmd>]
	[--onto <newbase> | --keep-base] [<upstream> [<branch>]]
git rebase [-i | --interactive] [<options>] [--exec <cmd>] [--onto <newbase>] --root [<branch>]
git rebase (--continue|--skip|--abort|--quit|--edit-todo|--show-current-patch)
```

## 讀懂文檔

我們一步一步解析文檔，首先 git 會把指令分成大項目，不同項目代表行為模式不同，以 git rebase 為例，他有三種不同行為模式[^guideline]。

[^guideline]: 分成大項目是 git 自己的規則不是 [POSIX 規範](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html)，Git 官方的 [CodingGuidelines](https://github.com/git/git/blob/master/Documentation/CodingGuidelines) 第一句話說明不是所有語法都遵循 POSIX 建議。

接下來解釋符號，在 git 文檔中基本上會看到以下幾種

- `[ ]` 代表可選
- `< >` 代表必填，需要用戶填入，裡面是佔位符 placeholder 用於提醒用戶輸入類型[^foolish]
- `( )` 代表分組，不在 POSIX 規範中，單純用於提醒你這是同一組選項[^grouping]
- `|` 代表多個選項擇一
- `--` 使用此符號隔開參數和輸入，例如 `git restore -SW -- file1 file2 ...` 代表 `--` 後面不會是參數，這讓 `-` 開頭的檔案可以正確解析
- `...` 代表可以出現多次
- `<pathspec>` 路徑相關，也可以是表達式，例如 `'*.js'`

現在就很直觀了，以第一類用法為例，所有選項都是可選，在使用第一個可選項目 `[-i | --interactive]` 時，可以在縮寫 `-i` 和全名 `--interactive` 選一個使用。

[^foolish]: 網路上說他是 positional arguments 的在亂講。
[^grouping]: 語言模型會告訴你圓括弧是必填，這是錯的，請見 [What's the meaning of `()` in git command SYNOPSIS?](https://stackoverflow.com/questions/32085652/whats-the-meaning-of-in-git-command-synopsis)。

## 解讀範例

以 `git reset` 作為範例解析

```sh
git reset [-q] [<tree-ish>] [--] <pathspec>…​
git reset [-q] [--pathspec-from-file=<file> [--pathspec-file-nul]] [<tree-ish>]
git reset (--patch | -p) [<tree-ish>] [--] [<pathspec>…​]
git reset [--soft | --mixed [-N] | --hard | --merge | --keep] [-q] [<commit>]
```

指令出現四次表示有四大類用法，我們把每一類挑出比較複雜的解釋

- 第一類表示 pathspec 必填並且可出現多次，其餘選填
- 第二類表示 `--pathspec-from-file` 選填，使用時必定要加上 `=<path/to/file>`，如果使用該參數可以再加上 `--pathspec-file-nul`
- 第三類換成圓括弧，代表你要使用 `--patch | -p` 其中一個才能對應此類用法，也就是作者特地把方括弧換成圓括弧告訴你使用他才能啟用這類用法
- 第四類表示在這些 `|` 隔開的類型只能選一個，使用 `--mixed` 選項可以額外再啟用 `-N` 可選項

## 解讀 `git rebase --onto`

我們先挑出使用 `--onto` 選項時常用的參數簡化討論：

```sh
git rebase [--onto <newbase>] [<upstream> [<branch>]]
```

文章看到這裡會以為自己懂了，但深入一點會發現其實還是不懂要怎麼用。你會想說簡單啊，不就是 `git rebase --onto A B C` 時，A/B/C分別代表 newbase/upstream/branch 嗎？你想的沒錯，但是他也可以這樣用：

```sh
git rebase B --onto A C
git rebase B C --onto A
```

在這種用法之下，B 會被解析為 upstream，C 則是 branch，因為一開始就給他佔位符參數，git 就會往後尋找可解析的參數，直到遇到 `--onto` 後， `--onto` 的下一個佔位符必須是 `<newbase>`，最後 B/C 就分別對應了剩下的佔位符。所以這兩個指令等效一開始的 `git rebase --onto A B C`，現在你知道為什麼要讀懂文檔了。

### 指令用途

超出本文範圍了，請看我寫專門寫的文章：[看懂 rebase onto](../rebase-onto)。

## 參考

- [How do I read git synopsis documentation? [closed]](https://stackoverflow.com/questions/60906410/how-do-i-read-git-synopsis-documentation)
- [What's the meaning of `()` in git command SYNOPSIS?](https://stackoverflow.com/questions/32085652/whats-the-meaning-of-in-git-command-synopsis)
- [CodingGuidelines](https://github.com/git/git/blob/master/Documentation/CodingGuidelines) 我看不下去，有一千行
- [【笨問題】CLI 參數為什麼有時要加 "--"？ POSIX 參數慣例的冷知識](https://blog.darkthread.net/blog/posix-args-convension/)
- POSIX 語法約定: [12. Utility Conventions](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html)
- GNU 語法約定: [Program Argument Syntax Conventions](https://www.gnu.org/software/libc/manual/html_node/Argument-Syntax.html)
