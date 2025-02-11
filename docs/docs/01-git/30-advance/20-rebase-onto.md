---
title: "Git Rebase Onto 全中文圈最完整教學"
sidebar_label: "搞懂 Rebase Onto"
author: zsl0621
description: 不要再亂教 rebase onto 了
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2025-02-09T23:58:00+08:00
  author: zsl0621
first_publish:
  date: 2025-01-13T14:40:00+08:00
---

本文延續 [[微進階] 使用 Rebase 重構提交](../beginner/rebase) 繼續說明 onto 用法，與其說是搞懂 onto 用法倒不如說是完整解析 rebase，只是 rebase 實際行為大家本來就不熟，這些問題又常見於和 onto 參數同時使用。本文可以視為上一篇教學的完整解析版本，把口訣擴展成一板一眼的定義，目的是讓這個解釋到哪裡都通用。

和上一篇相同，筆者保證本文絕對正確，所有和本文矛盾的說法都是錯的。

:::info

rebase 真實專案前請先用這個[迷你範例](https://github.com/ZhenShuo2021/rebase-onto-playground)測試結果是否符合預期。

:::

## TL;DR

整篇文章的精華在這裡，`git rebase --onto A B C` 的作用是

1. 先 `git switch` 切換分支到 C
2. **解析範圍**：解析 B 和 C 的共同祖先，找到共同祖先到 C 的之間的分歧[^exclude]提交並且暫存他們
3. **重演提交**：以 A 為基底將剛才暫存的提交重演[^replay]在 A 之後

[^replay]: 重演 (replay)，用於表示不只是簡單的將提交複製貼上，而是會重新生成 commit hash。
[^exclude]: 分歧提交代表在尋找路徑之間的提交時，如果這些提交也是 B 的一部分則不會進行重演。英文原文中沒有提到分歧，是簡體翻譯自己加上的，繁體則把他改為變化，我覺得講分歧或者差異會比變化更好。在 Reference 中的原文則寫: Note that any commits in HEAD which introduce the same textual changes as a commit in `HEAD..<upstream>` are omitted (i.e., a patch already accepted upstream with a different commit message or timestamp will be skipped).

或是把這三個步驟用一句話記起來：

:::tip 口訣

比較 `B` `C` 後找到共同祖先，找出從共同祖先到 `C` 之間的分歧的提交，將其重演在新基底 `A` 之後。

**B 預設是當前分支的 remote，C 預設為 HEAD**，三個參數可以是 commit 不強迫是分支。

:::

怎麼有點複雜不像是能輕鬆背誦的口訣，因為他就是這麼運作的，而且本文不是網路上那些隨處可見不負責任亂寫的文章。強烈建議如果使用 --onto 參數就一次把 B C 這兩個可選參數也附上，因為這個指令太複雜了。

附帶一提在大部分情況下，<u>**這個指令可以被簡單的理解為把 B\~C 之間的提交放在 A 之後，但是請注意這個說法不完全正確**</u>，大部分指的是在沒有把 B\~C 之間跨越複雜的分支路徑的情況，可以想想 B\~C 之間如果跨越多個分支，甚至是 A 設定為半路上隨意一個 commit 情況就複雜了，一個不符合這個說法的例子是本文範例中的[修改提交所屬分支](#change_parent)，所以特別闢謠，這個說法已經算是相對正確了但還是錯，而網路上更多的是從頭錯到尾的文章還更多人分享。

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

想搞懂他勢必得讀懂文檔，然而看文檔又昏了，因為這是 POSIX 用語，版本管理都還不會用看 POSIX 我哪讀的懂（似懂非懂不算懂），開始閱讀前請務必確保自己有能力看的懂文檔，或者閱讀我寫的[看懂 Git 文檔](../preliminaries/read-git-docs)。

## git rebase --onto 用法

### 參數解釋

看懂參數怎麼解析後，接下來解釋三個參數的意思。

```sh
git rebase --onto <newbase> [<upstream> [<branch>]]
```

- [upstream](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt-ltupstreamgt): 要和目前分支比較，用於<u>**尋找共同祖先**</u>的分支或提交。如果沒有設定，預設為當前分支的 remote（`branch.<name>.remote` 和 `branch.<name>.merge`），因此文檔將這個變數命名為 upstream
- [branch](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt-ltbranchgt): 設定 branch 後，在 rebase 操作前都會提前執行 `git switch <branch>`，預設為 HEAD，也就是在當前分支進行 rebase
- [newbase](https://git-scm.com/docs/git-rebase#Documentation/git-rebase.txt---ontoltnewbasegt): 使用 `--onto` 時必須設定 newbase，用來指定 rebase 時生成的 commit 起點，如果不指定 `--onto`，等效於將起點設定在 `<upstream>`

全部組合起來就是開頭說的：

1. 比較 `<upstream>` 和 `<branch>` 後找到共同祖先
2. 找出從共同祖先到 `<branch>` 之間的分歧的提交並且暫存他們
3. 將其重演在新基底 `<newbase>` 之後

附帶一提，把 `<newbase>` 去掉後，這個說法完全兼容[前一篇文章](../beginner/rebase)說的：

1. 找到共同祖先
2. 找到需要被變基的提交並且暫存他們  
3. 將目標分支最後一個提交作為出發點，把暫存的提交逐個重演到目標分支後面

可以發現這個解釋是[原有解釋](../beginner/rebase)的超集 (superset) 而不是推翻原有解釋，僅是根據文檔就已經是最通用的解釋。某些文章自作聰明自創名詞解釋，結果照他的說法不同用法不同分支結構下每個參數的目的都不一樣。

### 用一個變數{#single_var}

<details>
<summary>這段不要看，這個指令用不到看了只會混淆自己</summary>

我想不到什麼情況需要只用 `git rebase --onto <newbase>` 而不帶其他參數，把這個段落放進來的原因是沒寫感覺好像是作者忘記一樣，所以用折疊形式放上來，rebase onto 已經夠複雜了最好跳過這段免得搞亂自己。

將另外兩個變數的預設值套上後，指令目的變成「把 HEAD rebase 到 `<newbase>`」，基本上不會用到這個功能，在我的 [範例 repo](https://github.com/ZhenShuo2021/rebase-onto-playground) 中可以用這個指令測試：

```sh
git rebase --onto feat
git rebase --onto origin/main
```

第一個指令的作用會是把目前分支的 HEAD 直接跳到指定位置，然而回來就沒辦法了，因為這時候等同於在別的分支進行 rebase 並且設定根基是 origin/main，如果你需要移動分支 HEAD 位置這個指令算是比刪除分支重建還要快一點。
</details>

### 用兩個變數{#duo_var}

一般情況下使用 `--onto` 功能至少都會帶兩個參數，也就是說設定 `<newbase>` 和 `<upstream>`：

```sh
# 兩者等效
git rebase --onto A B
git rebase B --onto A
```

複習一下前面說的，這時候 A 代表 `newbase`，而 B 是 `upstream`，這代表將「目前分支」和「B的分支」進行比較，找到共同祖先後，以 A commit 作為新的基底，將共同祖先到目前分支的所有提交重演到 A 的後面。讀者可以 clone [我的範例 repo](https://github.com/ZhenShuo2021/rebase-onto-playground) 測試指令行為，使用以下指令：

```sh
git switch fix
git rebase --onto feat fix~2
```

把指令翻譯成人話就是「將 fix 和 fix~2 比較，找到共同祖先後，以 feat 作為基底開始重演」。這裡不貼執行結果，因為截圖看了反而頭痛，自己真正使用過一次就很清楚他在做什麼了，會把 `fix~1` 和 `fix` 移動到 `feat` 後面。

另外提醒多次測試時可以使用 `git reset --hard origin/<branch>` 還原變更。

### 用三個變數

三個參數的用法非常簡單，因為第三個變數只是提前變換分支的縮寫，這除了讓你少打一次 switch 以外，最重要的功能是可以在任何位置執行 rebase 都有同樣效果，否則 rebase 會因為目前所在位置不同而有不同結果。由於一個參數的指令沒機會用、三個參數的指令只是提前切換，所以可以整理出 onto 其實只有一種用法。總結得很簡單，但是沒真正研究永遠都搞不清楚 `--onto` 究竟在做什麼，我講的就是網路上那些亂教一通的文章。

有一點需要注意，網路文章說 `git rebase --onto A B C` 這個指令的用途是*將 B\~C 之間的 commit 重演在 A 之上*，這個說法對也不對，可以在範例 repo 執行 `git rebase --onto main~3 feat fix` 進一步驗證，這個指令 B, C 是不同分支，很明顯的就不符合上述說明，依照[文檔](https://git-scm.com/docs/git-rebase)比較類似的說法，之間應該改成 `git log <upstream>..HEAD` 的提交。

:::tip
筆者建議只要使用 `--onto` 選項，無論何時都使用三個變數的語法避免混亂。
:::

### 提醒

為了避免有人搞混特別強調這篇是在講 onto，如果不使用 onto 又只用兩個參數，這兩個參數會變成 upstream 和 branch。關於變數順序的問題也請注意：

:::danger

我不確定像[序](#序)裡面說的這樣排列組合修改變數順序是官方的 feature 還是僅僅只是 behavior，我找不到任何相關討論，建議照順序打比較穩妥。

:::

## 實用指令整理

自己寫完都能感覺到「OK 現在我指令看懂了但是不會用」，`git rebase --onto` 確實比較複雜，於是把[文檔](https://git-scm.com/docs/git-rebase)中不錯的用法搬過來讓讀者知道這可以拿來做什麼。

以下情境題可以用我的 [範例 repo](https://github.com/ZhenShuo2021/rebase-onto-playground) 進行測試，分支結構完全相同。

### 刪除中間一段提交

`git rebase --onto main~5 main~1 main`

如果要刪除提交應該使用 `git rebase -i` 更方便，但是這是一個理解 onto 用法的好例子
> 比較 `main~1` `main` 後找到共同祖先 (`main~1`)，把共同祖先到 `main` 之間的提交重演在新基底 `main~5` 之後。

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

### 把子分支的提交改為主分支的提交{#change_parent}

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

這幾個指令留給讀者猜是什麼用途，可以自行 clone 範例 repo 驗證和想的一不一樣。

```sh
git rebase --onto main main fix
git rebase --onto main fix main

# 猜猜看為何這個指令沒有任何修改
git rebase --onto feat~2 main fix
# 提示是這個指令，想懂他就知道原因了
# 如果還是想不透，第二個提示是 footnotes 裡面的「分歧」
git rebase --onto main~4 main fix
```

## 參考

- [Git合并那些事——神奇的Rebase](https://morningspace.github.io/tech/git-merge-stories-6/)

## 結語

rebase onto 用法這麼複雜的指令，網路上教學文章只說一句「改接」「嫁接」「任意改接」有講跟沒講一樣，因為所有 rebase 都是改接，讀者看完之後不明所以要嘛死記要嘛乾脆不敢用，而所有講解 `git rebase --onto` 卻又不講指令如何解析的文章都在亂教，連輸入的指令都不知道對應到哪個變數，我們怎麼敢用這個指令？更糟糕是自創名詞的文章，指令用法只在他說的那種情況下適用，這種文章非常差勁

這個文檔從我還不熟 Git 的時候開始寫，開宗明義就說<u>**使用官方翻譯而不是自己造詞**</u>，現在回頭看我最初講的話是對的。在蒐集 rebase onto 資料時發現很多文章寫了「onto 之後的參數是 `<new base-commit> <current base-commit>`」，這就是明顯的亂造詞問題，後來發現所有的錯誤用法都來自於同一篇文章，也可以算是一種 error propagation 吧。

我就問寫第一篇文章的人，如果 onto 使用三個參數，你這參數說明是不是要改成 `<new base-commit> <start-commit> <end-commit>`？還沒完，再照他文章中自己的範例指令 `git rebase 分支 --onto 哈希值` 用法，是不是又要多一種解釋？官方這樣設定參數名稱自然有他的道理，沒想清楚就自己亂改又放在網路上，結果就是讓所有讀過文章的人都搞混。

最扯的是竟然把 rebase onto 排版在 rebase interactive 前面，把難理解使用頻率又低的指令放在前面到底什麼意思。
