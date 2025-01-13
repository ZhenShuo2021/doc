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
  date: 2025-01-13T14:40:00+08:00
  author: zsl0621
first_publish:
  date: 2025-01-13T14:40:00+08:00
---

本文延續[上一篇](./rebase)的 `git rebase`，因為要搞懂 onto 你必須看懂文檔，而所有講 `git rebase --onto` 卻不講指令如何解析的人就是在亂教，連輸入的指令都不知道對應到哪個變數，你怎麼敢用這個指令？

我敢保證全中文圈沒有任何一篇文章試圖去搞懂 onto 到底在做什麼，本文嘗試釐清各項參數，並且使用官方名稱而不是自作聰明自創名詞搞混所有人。

我已經盡量驗證各種指令排列組合，但是不保證覆蓋所有情境。在 rebase 真實專案前請先用這個[迷你範例](https://github.com/ZhenShuo2021/rebase-onto-playground)測試 rebase onto 結果是否符合預期。

## 前言

你知道 rebase 加上 onto 參數之後總共有幾種輸入方式嗎？有五種！這時候如果教學再輕輕的說一句「改接」「嫁接」「任意改接」就是來亂的，因為所有 rebase 都是改接這有講跟沒講一樣，而你讀完之後因為不明所以不是死記就是乾脆不敢用。

> 1. git rebase --onto xxx
> 2. git rebase --onto xxx yyy
> 3. git rebase --onto xxx yyy zzz
> 4. git rebase xxx --onto yyy
> 5. git rebase xxx --onto yyy zzz

要一次性搞懂這到底做了什麼，你勢必得讀懂文檔，然而看文檔又昏了，因為這是 POSIX 用語，版本管理都還不會用，看 POSIX 我哪讀的懂[^somewhat]？

> [git rebase 文檔](https://git-scm.com/docs/git-rebase)

```sh
git rebase [-i | --interactive] [<options>] [--exec <cmd>]
	[--onto <newbase> | --keep-base] [<upstream> [<branch>]]
git rebase [-i | --interactive] [<options>] [--exec <cmd>] [--onto <newbase>] --root [<branch>]
git rebase (--continue|--skip|--abort|--quit|--edit-todo|--show-current-patch)
```

[^somewhat]: 似懂非懂不算懂，我寫這篇文章前也是似懂非懂的看文檔。

## 讀懂文檔

我們一步一步進行解析，首先 git 會把指令分成大項目，每個大項目代表他的行為模式不同因此分開，所以你會看到使用 `--root` 時就不用 `[<upstream> [<branch>]]` 等參數[^guideline]。

[^guideline]: 分成大項目是 git 自己的規則不是 [POSIX 規範](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html)，Git 官方的 [CodingGuidelines](https://github.com/git/git/blob/master/Documentation/CodingGuidelines) 第一句話說明不是所有語法都遵循 POSIX 建議。

接下來解釋符號，在 git 文檔中基本上會看到以下幾種

- `[ ]` 代表可選
- `< >` 代表必填，需要用戶填入，裡面是佔位符 placeholder 用於提醒用戶輸入類型[^foolish]
- `( )` 代表分組，不在 POSIX 規範中，單純用於提醒你這是同一組選項
- `|` 代表多個選項擇一
- `--` 使用此符號隔開參數和輸入，例如 `git restore -SW -- file1 file2 file3` 代表 `--` 後面不會是參數
- `...` 代表可以出現多次
- `<pathspec>` 路徑相關，也可以是表達式，例如 `'*.js'`

現在就很直觀了，在 `rebase --continue` 等指令只能選一個用，`[-i | --interactive]` 是可選項，使用時可以在縮寫 `-i` 和全名 `--interactive` 選一個使用。

[^foolish]: 網路上說他是 positional arguments 的在亂講。

### 範例

以 `git reset` 作為範例解析

```sh
git reset [-q] [<tree-ish>] [--] <pathspec>…​
git reset [-q] [--pathspec-from-file=<file> [--pathspec-file-nul]] [<tree-ish>]
git reset (--patch | -p) [<tree-ish>] [--] [<pathspec>…​]
git reset [--soft | --mixed [-N] | --hard | --merge | --keep] [-q] [<commit>]
```

四行表示有四大類用法，每一類挑出比較複雜的解釋

- 第一類表示 pathspec 必填，其餘選填
- 第二類表示 `--pathspec-from-file` 選填，使用時必定要加上 `=<path/to/file>`，如果使用該參數可以再加上 `--pathspec-file-nul`
- 第三類換成圓括弧，代表你要使用 `--patch | -p` 其中一個才能對應此類用法，也就是文檔撰寫者特意把方括弧換成原括弧告訴你這樣才能啟用
- 第四類就是在這些 `|` 隔開的類型只能選一個

## 解讀 `git rebase --onto`

讀到這裡會以為自己懂了，但其實還是看不懂 git rebase --onto 怎麼用，因為他的文檔長這樣，我們只挑出使用 `--onto` 選項時常用的參數簡化討論：

```sh
git rebase [--onto <newbase>] [<upstream> [<branch>]]
```

你會想說簡單啊，不就是 `git rebase --onto A B C` 時，A/B/C分別代表 newbase/upstream/branch 嗎？你想的沒錯，但是他也可以這樣用：

```sh
git rebase A --onto B C
```

這時候 upstream 會被提前解析變成 A，因為你一開始就給他佔位符參數，他在自己的參數找不到 `A`，所以上面的指令等效於這個用法：

```sh
git rebase --onto B A C
```

現在你知道為什麼要讀懂文檔了。

### 三個變數

我們終於看懂參數怎麼解析了，接下來我們來說使用 onto 時，三個參數 upstream/branch/newbase 的用法。

- [upstream](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt-ltupstreamgt): 要和目前分支比較，用於<u>**尋找共同基底**</u>的分支。如果沒有設定會預設為當前分支的 remote，所以文檔裡面命名為 upstream （預設尋找 `branch.<name>.remote` 和 `branch.<name>.merge`）
- [branch](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt-ltbranchgt): 只要設定 branch，**所有** rebase 操作前都會提前自動執行 `git switch <branch>`。否則，在當前分支執行操作
- [newbase](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---ontoltnewbasegt): 如果使用 --onto 參數，需要設定 newbase 指定生成新的 commit 的起點。

上述三個變數都可以是一個 commit，不一定要是分支。

#### 用兩個變數{#duo_var}

說是這麼說，但是我們通常不會直接只使用一個變數，因為單獨使用 `git rebase --onto <newbase>` 代表自動尋找 remote，組合起來就是把 branch HEAD 直接移動到該 commit 上，比較少用到這個功能，至少都會用兩個參數，也就是說設定 `newbase` 和 `upstream`：

```sh
# 兩者等效
git rebase A --onto B
git rebase --onto B A
```

複習一下前面說的，這時候 B 代表 `newbase`，而 A 是 `upstream`。

使用這兩個參數代表將「目前分支」和「A的分支」進行比較，找到共同基底後，以 B commit 作為新的基底，將 A commit 之後的所有提交複製到 B 之後。如果要測試這個指令的行為可以 clone [我的範例 repo](https://github.com/ZhenShuo2021/rebase-onto-playground) 中使用以下指令進行測試：

```sh
# 可以不使用 `checkout` 或者 `^` 測試結果變化
git checkout feat
git rebase --onto 4a619381 99ded47b^^
```

這個需要解 rebase conflict 是正常的。這裡不貼執行結果的截圖，因為截圖看了頭反而痛，自己真正使用過一次就很清楚他在做什麼了。另外提醒，在不同的測試之間 rebase 後可以使用 `git reset --hard origin/<branch>` 還原變更。

#### 用三個變數

三個參數的用法非常簡單，他只是提前變換分支的縮寫。因為一個參數沒機會用、三個參數只是提前切換，所以寫完整篇之後可以整理出 onto 其實只有兩個變數這種用法。看似簡單，但是如果沒真正研究你永遠搞不清楚 `--onto` 究竟在做什麼。

在我的範例 repo 中，可以使用 `git rebase --onto 998f6ecd 37eced9b^ 99ded47b` 作為範例展示，會看到 feat 中間的三個提交被複製到 998f6ecd 進行重演。

有一點需要注意，網路文章說 `git rebase --onto A B C` 這個指令的用途是*將 B\~C 之間的 commit 重演在 A 之上*，這似乎和前面的結論有點出入？其實不然。當我們把 C 設定為一個 commit hash 後，代表 branch 的範圍就只到該 commit，所以重演分支的範圍只到該分支的位置，也就是現在設定的 commit。

*將 B\~C 之間的 commit 重演在 A 之上*這個說明對也不對，如果要進一步驗證，可以在範例 repo 執行 `git rebase --onto 998f6ecd feat fix`，這個跨分支操作很明顯的就不符合上述說明（跨分支是要怎麼複製），可以用[兩個變數](#duo_var)的方式自己念過一輪這段指令的目的，就會知道他的行為符合我的說明，並且不符合你在網路上能找到的所有說明。

#### 用兩個變數

為了避免有人搞混，特地強調一下這篇是在講 onto，如果不使用 onto 又只用兩個參數，這兩個參數會變成 upstream 和 branch。

## 參考

- [How do I read git synopsis documentation? [closed]](https://stackoverflow.com/questions/60906410/how-do-i-read-git-synopsis-documentation)
- [What's the meaning of `()` in git command SYNOPSIS?](https://stackoverflow.com/questions/32085652/whats-the-meaning-of-in-git-command-synopsis)
- [CodingGuidelines](https://github.com/git/git/blob/master/Documentation/CodingGuidelines) 我看不下去，有一千行
- [【笨問題】CLI 參數為什麼有時要加 "--"？ POSIX 參數慣例的冷知識](https://blog.darkthread.net/blog/posix-args-convension/)
- POSIX 語法約定: [12. Utility Conventions](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html)
- GNU 語法約定: [Program Argument Syntax Conventions](https://www.gnu.org/software/libc/manual/html_node/Argument-Syntax.html)

## 結語

這個文檔從我根本就還不熟 Git 的時候開始寫，開宗明義就說<u>**使用官方翻譯而不是自己造詞**</u>，現在回頭看我最初講的話是對的。在蒐集 rebase onto 資料時發現很多文章寫了「onto 後續參數是 `<new base-commit> <current base-commit>`」，這就是明顯的亂造詞問題，我找了很久突然發現所有的錯誤用法都來自於同一篇文章，也可以算是一種 error propagation 吧。

我就問寫第一篇文章的人，如果 onto 使用三個參數，你這參數說明是不是要改成 `<new base-commit> <start-commit> <end-commit>`？還沒完，再照他文章中自己寫的 `git rebase <branch> --onto <hash>` 用法，是不是又要多一種解釋？官方這樣設定參數名稱自然有他的道理，沒想清楚就自己亂改又放在網路上，結果就是讓所有讀過文章的人都搞混。

最扯的是把 onto 教學寫在 interactive 前面，到底是想害誰。
