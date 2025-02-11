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

你真的看得懂 Git 文檔嗎？似懂非懂不算懂喔。別擔心，本文教你如何閱讀 Git 文檔，保證是第一篇教你看懂文檔的中文教學，初學者可以放心的跳過這個章節，因為很多教學文章甚至到已經出書了的作者本身也看不懂文檔，所以就算讀不懂還是可以快樂的使用 Git。本文的目標是解析最難懂的指令：`git rebase --onto`。

你說我怎麼知道他們看不懂文檔，因為他們給的範例指令是錯的，如果看過文檔就不會那樣用，而且還不是一兩篇，是八成以上文章都是這樣，google rebase 就知道了錯的一塌糊塗[^error]。

[^error]: 深入使用 Git 後在網路上搜尋資訊就會發現這些資訊怪怪的，我就是越看越怪，親自對照文檔後就發現這些文章的作者全都沒看過或看不懂文檔，否則是不可能寫出這種指令的。由於我是自學所以多方參考並且有任何問題就是拿文檔對照實際行為，最後才確定是他們錯，並且所有錯誤都從某幾篇文章開始的，因為用語和結尾的參考資訊可以追溯到那幾篇文章，包含已經出書的那位先生寫的也有好幾個錯誤。

## 讀懂文檔

本段落一步一步解析如何閱讀文檔，首先 git 會把指令分成大項目，不同項目代表行為模式不同，以 git rebase 為例，他有三種不同行為模式[^guideline]。

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

## pathspec 是什麼{#pathspec}

開始解析之前先解釋這個名詞，`<pathspec>` 是指定檔案路徑的表達式系統，讓使用者能精準選擇要操作的檔案與目錄，支援的表達式如下：

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
    <table style={{ width: '95%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
            <tr>
                <th style={{ width: '40%' }}>規則</th>
                <th style={{ width: '60%' }}>說明</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style={{ textAlign: 'left' }}>匹配單層任意字元（不含斜線 /）</td>
                <td><code>*</code></td> {/* 將說明文字靠左 */}
            </tr>
            <tr>
                <td style={{ textAlign: 'left' }}>匹配任意層級目錄</td>
                <td><code>**</code></td>
            </tr>
            <tr>
                <td style={{ textAlign: 'left' }}>匹配僅當前資料夾的 .py 檔案</td>
                <td><code>*.py</code></td>
            </tr>
            <tr>
                <td style={{ textAlign: 'left' }}>匹配所有子目錄下的 .py 檔案</td>
                <td><code>**/*.py</code></td>
            </tr>
            <tr>
                <td style={{ textAlign: 'left' }}>匹配指定目錄下所有子目錄的 .js 檔案</td>
                <td><code>dir/**/*.js</code></td>
            </tr>
            <tr>
                <td style={{ textAlign: 'left' }}>排除所有 .txt 和 .md 檔案</td>
                <td><code>git add . -- ':!**/*.txt' ':!**/*.md'</code></td>
            </tr>
        </tbody>
    </table>
</div>

<br/>

發現竟然沒什麼文章寫 pathspec 於是把他獨立成一個段落。

## 簡單範例

我們由淺入深，先用簡單的 `git reset` 指令作為範例

```sh
git reset [-q] [<tree-ish>] [--] <pathspec>…​
git reset [-q] [--pathspec-from-file=<file> [--pathspec-file-nul]] [<tree-ish>]
git reset (--patch | -p) [<tree-ish>] [--] [<pathspec>…​]
git reset [--soft | --mixed [-N] | --hard | --merge | --keep] [-q] [<commit>]
```

指令出現四次表示有四大類用法，我們把每一類挑出比較複雜的解釋

- 第一類表示 pathspec 必填並且可出現多次，其餘選填
- 第二類表示 `--pathspec-from-file` 選填，使用時必定要加上 `=<path/to/file>`，如果使用該參數可以再選填 `--pathspec-file-nul`
- 第三類換成圓括弧，代表你要使用 `--patch | -p` 其中一個才能對應此類用法，也就是作者特地把方括弧換成圓括弧，告訴你使用 `--patch` 才能啟用這類用法
- 第四類表示在這些 `|` 隔開的類型只能選一個，使用 `--mixed` 選項可以額外再啟用 `-N` 可選項

## 解讀 `git rebase --onto`

完整[文檔](https://git-scm.com/docs/git-rebase)如下所示：

```sh
git rebase [-i | --interactive] [<options>] [--exec <cmd>]
	[--onto <newbase> | --keep-base] [<upstream> [<branch>]]
git rebase [-i | --interactive] [<options>] [--exec <cmd>] [--onto <newbase>] --root [<branch>]
git rebase (--continue|--skip|--abort|--quit|--edit-todo|--show-current-patch)
```

我們先挑出使用 `--onto` 選項時常用的參數簡化討論：

```sh
git rebase [--onto <newbase>] [<upstream> [<branch>]]
```

經過上述的範例應該自信滿滿，但深入一點會發現其實還是不懂要怎麼用。你會想說簡單啊，不就是 `git rebase --onto A B C` 時，A/B/C分別代表 newbase/upstream/branch 嗎？你想的沒錯，但是他也可以這樣用：

```sh
git rebase B --onto A C
git rebase B C --onto A
```

在這種用法之下，B 會被解析為 upstream，C 則是 branch，因為一開始就給他佔位符參數，git 就會往後尋找可解析的參數，直到遇到 `--onto` 後， `--onto` 的下一個佔位符必須是 `<newbase>`，最後 B/C 就分別對應了剩下的佔位符。所以這兩個指令等效一開始的 `git rebase --onto A B C`，現在你知道為什麼要讀懂文檔了。

:::danger

我不確定這樣變換順序是官方的 feature 還是僅僅只是 behavior，找不到相關討論，建議照順序打才不會出錯。

:::

## `git rebase --onto` 用法

超出本文範圍了，請看我寫的文章：[看懂 rebase onto](../advance/rebase-onto)。

## 參考

- [How do I read git synopsis documentation? [closed]](https://stackoverflow.com/questions/60906410/how-do-i-read-git-synopsis-documentation)
- [What's the meaning of `()` in git command SYNOPSIS?](https://stackoverflow.com/questions/32085652/whats-the-meaning-of-in-git-command-synopsis)
- [CodingGuidelines](https://github.com/git/git/blob/master/Documentation/CodingGuidelines) 我看不下去，有一千行
- [【笨問題】CLI 參數為什麼有時要加 "--"？ POSIX 參數慣例的冷知識](https://blog.darkthread.net/blog/posix-args-convension/)
- POSIX 語法約定: [12. Utility Conventions](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html)
- GNU 語法約定: [Program Argument Syntax Conventions](https://www.gnu.org/software/libc/manual/html_node/Argument-Syntax.html)
