---
title: "[進階] 看懂 git 文檔和 rebase onto"
author: zsl0621
description: 不要再亂教 rebase onto 了
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2025-01-14T14:05:00+08:00
  author: zsl0621
first_publish:
  date: 2025-01-13T14:40:00+08:00
---

本文延續[上一篇](./rebase)的 `git rebase` 繼續說明 onto 用法，要搞懂他的用法之前一定要能看懂文檔，而所有教學 `git rebase --onto` 卻不講指令如何解析的文章都在亂教，連輸入的指令都不知道對應到哪個變數，我們怎麼敢用這個指令？

我敢保證繁體中文沒有任何一篇文章正確的搞懂 onto 到底在做什麼，本文嘗試釐清各項參數，並且使用官方名稱而不是自作聰明自創名詞搞混所有人。在 rebase 真實專案前請先用這個[迷你範例](https://github.com/ZhenShuo2021/rebase-onto-playground)測試 rebase onto 結果是否符合預期。

## TL;DR

`git rebase --onto A B C` 的作用是

1. 先 `git switch` 切換分支到 C
2. 尋找 B 和 C 的共同祖先
3. 把共同祖先到 C 的之間的所有提交，以 A 為基底重演在 A 之後（C 沒有的提交才會進行重演）

或是把這三個步驟用一句話記起來：

:::tip 口訣

比較 `B` `C` 後找到共同祖先，把共同祖先到 `C` 之間的提交重演在新基底 `A` 之後。

註：C 沒有的提交才會進行重演，或者反過來說 C 本來舊有的提交會忽略重演[^exclude]。

[^exclude]: 原文: Note that any commits in HEAD which introduce the same textual changes as a commit in `HEAD..<upstream>` are omitted (i.e., a patch already accepted upstream with a different commit message or timestamp will be skipped).

:::

B 預設是當前分支的 remote，C 預設為 HEAD，通常是當前分支。三個參數可以是 commit 不一定得是分支，分支是依照文檔用語。

## 序

你知道 rebase 加上 onto 參數之後總共有幾種輸入方式嗎？有六種！

> git rebase --onto 各種排列組合
>
> 1. git rebase --onto x
> 2. git rebase --onto x y
> 3. git rebase --onto x y z
> 4. git rebase x --onto y
> 5. git rebase x --onto y z
> 6. git rebase x y --onto z

這時候文章再輕輕的說一句「改接」「嫁接」「任意改接」那有講跟沒講一樣，因為所有 rebase 都是改接，讀者看完之後因為不明所以導致要嘛死記要嘛乾脆不敢用。想一次性搞懂他的用途勢必得讀懂文檔，然而看文檔又昏了，因為這是 POSIX 用語，版本管理都還不會用，看 POSIX 我哪讀的懂[^somewhat]？

[^somewhat]: 似懂非懂不算懂，我寫這篇文章前也是似懂非懂的看文檔。

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

我們終於看懂參數怎麼解析了，接下來解釋三個參數的意思。

```sh
git rebase --onto <newbase> [<upstream> [<branch>]]
```

- [upstream](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt-ltupstreamgt): 要和目前分支比較，用於<u>**尋找共同祖先**</u>的分支或提交。如果沒有設定，預設為當前分支的 remote（`branch.<name>.remote` 和 `branch.<name>.merge`），因此文檔將這個變數命名為 upstream
- [branch](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt-ltbranchgt): 設定 branch 後，在 rebase 操作前都會提前執行 `git switch <branch>`，否則預設為 HEAD，也就是在當前分支進行 rebase
- [newbase](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---ontoltnewbasegt): 使用 `--onto` 時必須設定 newbase，用來指定 rebase 時生成的 commit 起點

全部加起就是開頭說的「比較 `<upstream>` 和 `<branch>` 後找到共同祖先，把共同祖先到 `<branch>` 之間的提交重演在新基底 `<newbase>` 之後，並且 `<upstream>` 沒有的提交才會進行重演」。

#### 用一個變數{#single_var}

<details>
<summary>這段不要看，這個指令用不到看了只會混淆自己</summary>

我想不到什麼情況需要只用 `git rebase --onto <newbase>` 而不帶其他參數，這個 rebase onto 已經夠複雜了最好跳過這段，看了只會搞亂自己。因為標題有用兩個變數、三個變數卻沒寫怎麼用一個變數感覺好像是作者忘記一樣，所以最後用折疊形式放上來。

這個用法將另外兩個變數使用預設值套上之後，指令目的變成「把 HEAD 移動到 `<newbase>`」，基本上不會用到這個功能，在我的 [範例 repo](https://github.com/ZhenShuo2021/rebase-onto-playground) 中可以用這個指令測試：

```sh
git rebase --onto feat
git rebase --onto origin/main
```

使用第二個指令時會發現切回來會把 feat 分支的提交一起帶上來，原因是第二次使用時 main 已經位於 origin/feat，和 origin/main 比較後，等同將一般 rebase 並且設定根基是 origin/main，兩個指令加起來的效果等同於 `git cherry-pick 37eced9b^..feat`。
</details>

#### 用兩個變數{#duo_var}

一般情況下使用 `--onto` 功能至少都會帶兩個參數，也就是說設定 `<newbase>` 和 `<upstream>`：

```sh
# 兩者等效
git rebase A --onto B
git rebase --onto B A
```

複習一下前面說的，這時候 B 代表 `newbase`，而 A 是 `upstream`，這代表將「目前分支」和「A的分支」進行比較，找到共同祖先後，以 B commit 作為新的基底，將共同祖先到目前分支的所有提交重演到 B 的後面。讀者可以 clone [我的範例 repo](https://github.com/ZhenShuo2021/rebase-onto-playground) 測試指令行為，使用以下指令：

```sh
git switch fix
git rebase --onto feat fix~2
```

把指令翻譯成人話就是「將目前分支和 fix~2 比較，找到共同祖先後，以 feat 作為基底開始重演」。這裡不貼執行結果，因為截圖看了反而頭痛，自己真正使用過一次就很清楚他在做什麼了，會把 `fix~1` 和 `fix` 移動到 `feat` 後面。

另外提醒多次測試時可以使用 `git reset --hard origin/<branch>` 還原變更。

#### 用三個變數

三個參數的用法非常簡單，因為第三個變數只是提前變換分支的縮寫，這除了讓你少打一次 switch 以外，最重要的功能是可以在任何位置執行 rebase 都有同樣效果，否則 rebase 會因為目前所在位置不同而有不同結果。由於一個參數的指令沒機會用、三個參數的指令只是提前切換，所以可以整理出 onto 其實只有兩個變數這種用法。看似簡單，但是如果沒真正研究你永遠搞不清楚 `--onto` 究竟在做什麼。

有一點需要注意，網路文章說 `git rebase --onto A B C` 這個指令的用途是*將 B\~C 之間的 commit 重演在 A 之上*，這個說法對也不對，可以在範例 repo 執行 `git rebase --onto main~3 feat fix` 進一步驗證，這個指令 B, C 是不同分支，很明顯的就不符合上述說明（跨分支是要怎麼複製 B\~C 之間），可以自己念過一次口訣就會知道他的行為符合我的說明，並且不符合網路上所有繁體中文說明。

:::tip
筆者建議只要使用 `--onto` 選項，無論何時都使用三個變數的語法。
:::

#### 提醒

為了避免有人搞混，特地強調一下這篇是在講 onto，如果不使用 onto 又只用兩個參數，這兩個參數會變成 upstream 和 branch。

## 實用指令整理

自己寫完都能感覺到「OK 現在我指令看懂了但是不會用」，`git rebase --onto` 確實比較複雜，於是把[文檔](https://git-scm.com/docs/git-rebase)中不錯的用法搬過來讓讀者知道這可以拿來做什麼，並且用我的 [範例 repo](https://github.com/ZhenShuo2021/rebase-onto-playground) 進行說明。

### 刪除中間一段提交

`git rebase --onto main~5 main~1 main`

如果要刪除提交應該使用 `git rebase -i` 更方便，但是這是一個理解 onto 用法的好例子
> 比較 `main~1` `main` 後找到共同祖先 (`main~1`)，把共同祖先到 `main` 之間的提交重演在新基底 `main~5` 之後（之間的提交不包含共同祖先本身，包含 `main` 本身）。

```sh
    E---F---G---H---I---J  main
```

變成

```sh
    E---J'  main
```

### 將某一段提交移動到主分支

`git rebase --onto main feat fix`

> 比較 `feat` `fix` 後找到共同祖先 (`feat^`)，把共同祖先到 `fix` 之間的提交重演在新基底 `main` 之後。

```
    o---o---o---o---o---o  main
         \
          o---o---o---o  feat
                   \
                    o---o---o  fix
```

變成

```
    o---o---o---o---o---o  main
        |                \
        |                 o'--o'--o'  fix
         \
          o---o---o---o  feat
```

### 把子分支的提交改為主分支的提交

`git rebase --onto feat~2 feat main`

> 比較 `feat` `main` 後找到共同祖先 (`B`)，把共同祖先到 `main` 之間的提交重演在新基底 `feat~2` 之後。

```
    o---B---m1---m2---m3  main
         \
          f1---f2---f3---f4  feat
                     \
                      o---o---o  fix
```

變成

```
    o---B---f1---f2---m1'---m2'---m3'  main
                  \
                   f3---f4  feat
                    \
                     o---o---o  fix
```

### 進階題

這兩個指令留給讀者猜是什麼用途，可以自行 clone 驗證和想的一不一樣。

```sh
git rebase --onto main main fix
git rebase --onto main fix main
```

## 參考

- [How do I read git synopsis documentation? [closed]](https://stackoverflow.com/questions/60906410/how-do-i-read-git-synopsis-documentation)
- [What's the meaning of `()` in git command SYNOPSIS?](https://stackoverflow.com/questions/32085652/whats-the-meaning-of-in-git-command-synopsis)
- [CodingGuidelines](https://github.com/git/git/blob/master/Documentation/CodingGuidelines) 我看不下去，有一千行
- [【笨問題】CLI 參數為什麼有時要加 "--"？ POSIX 參數慣例的冷知識](https://blog.darkthread.net/blog/posix-args-convension/)
- POSIX 語法約定: [12. Utility Conventions](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html)
- GNU 語法約定: [Program Argument Syntax Conventions](https://www.gnu.org/software/libc/manual/html_node/Argument-Syntax.html)
- [Git合并那些事——神奇的Rebase](https://morningspace.github.io/tech/git-merge-stories-6/)

## 結語

為了寫這篇文章想老半天終於幫 `git rebase --onto` 想出一套能兼容上一篇基礎文章口訣的說法，而不是像其他文章亂造詞造成大家困擾，變成每種用法都要一套名詞才能解釋。

這個文檔從我根本就還不熟 Git 的時候開始寫，開宗明義就說<u>**使用官方翻譯而不是自己造詞**</u>，現在回頭看我最初講的話是對的。在蒐集 rebase onto 資料時發現很多文章寫了「onto 之後的參數是 `<new base-commit> <current base-commit>`」，這就是明顯的亂造詞問題，後來發現所有的錯誤用法都來自於同一篇文章，也可以算是一種 error propagation 吧。

我就問寫第一篇文章的人，如果 onto 使用三個參數，你這參數說明是不是要改成 `<new base-commit> <start-commit> <end-commit>`？還沒完，再照他文章中自己的範例指令 `git rebase 分支 --onto 哈希值` 用法，是不是又要多一種解釋？官方這樣設定參數名稱自然有他的道理，沒想清楚就自己亂改又放在網路上，結果就是讓所有讀過文章的人都搞混。

最扯的是竟然把 rebase onto 排版在 rebase interactive 前面。
