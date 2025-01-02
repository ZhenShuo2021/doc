---
title: 常用指令
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
---

# Git 常用指令

一分鐘入門只學會一股腦記錄版本提交，接下來才是 Git 真正的精華。本文介紹日常常用的指令，結構為

1. 根據是否操作的分支分成基礎操作（單一分支）和進階操作（多分支）
2. 每個操作會先列出該操作的常用命令，並說明每個命令的目的
3. 最後提供情境範例

快速檢索的方式是從右側清單查找操作內容快速定位，例如提交錯誤時可以找到「清除提交」定位到 git reset。為了避免文章過長本文只有基礎使用，但是也涵蓋了 70% 的日常使用，剩下 30% 在後續的實戰文章。

## 基礎操作
基礎操作包含了對於單一分支的各項操作，包含更靈活的 add/commit 檔案，以及檔案復原。
```sh
git add                              # 預存檔案
git commit                           # 提交檔案
git reset                            # 修改檔案狀態
git checkout                         # 舊版指令，同時處理檔案管理和切換分支
git restore                          # 新版指令，專責檔案管理
git reflog                           # git 操作救命稻草
```


### 新增檔案 git add
`git add` 除了一一新增或者新增全部以外，其實還有補丁模式可以更方便使用：
- `-u`: 只預存已追蹤的檔案。
- `-p`: 補丁模式，互動式加入預存，常用選項為
  - y, yes
  - n, no
  - d, 該檔案之後都不要加入
  - s, 切成更小的區塊 (hunk)

#### 情境：略過特定副檔名的檔案

方法一：使用 git reset
```sh
git add .                            # 預存全部檔案
git reset *.py                       # 移除 py 檔案，或者 **/*.py 遞迴移除
```

方法二：使用管道符  
```sh
git add $(git ls-files | grep -v '\.py$')
```

<br/>

### 提交檔案 git commit
- `git commit -am <message>`: 懶人指令，略過 `git add .`。
- `git commit --amend`: 修改上次的提交訊息和檔案。
- `git commit --amend --no-edit`: 修改上次的提交檔案，訊息不變。
- `git commit -m "<Title> <enter>`: 提交有標題的 commit message 的方式，打好標題後按兩次 enter，到第三行繼續寫內容。

<br/>

### 管理檔案 git restore

```sh
git restore [<options>] <file>
```

restore 命令用於檔案管理，常用參數有三個，分別是
- --source, -s  
  指定欲恢復的提交，例如 git restore --source=HEAD~3 恢復到三個提交前。
- --staged, -S  
  踢出已預存的檔案（取消 add）。
- --worktree, -W  
  還原到目錄樹（白話文：還原沒有預存的程式碼，讓他從工作目錄中移除），這個參數預設開啟，使用 -S 時會關閉要手動打開。

#### 情境：放棄未預存的程式碼
```sh
git restore <file>
```
等同於 git restore -W

#### 情境：放棄程式碼，不管是否預存
```sh
git restore -S -W <file>
```

#### 情境：查看舊版的檔案
```sh
git restore --source=<hash> <file>
```

<details>
  <summary>註記：為什麼用新版指令 git restore？</summary>

新手學習這個指令是最好的，因為舊版本檔案管理指令混雜，例如 `git reset <file>` 可以指定檔案踢出預存，但是 `git reset --hard` 還原工作目錄卻不能指定檔案；而 `git checkout -- .` 可以還原未預存的檔案卻又不能處理已預存的檔案。

[參考資料](https://dwye.dev/post/git-checkout-switch-restore/)
</details>

<br/>

### 清除提交 git reset

```sh
git reset [<mode>] [<commit>] [<file>]
```

用於控制提交版本，reset 雖然聽起來是重設/還原，但實際做的是 **清除** 提交，預設模式是 mixed，commit hash 是 HEAD，檔案是全部檔案。三種模式分別是代表
1. soft: 只刪 commit，其他不動
2. mixed: 刪 commit 和 add
3. hard: 除了 commit 和 add 以外，連你的寫的程式都刪了，謹慎使用！

也就是單純使用 `git reset` 等同於 `git restore -S .`，扣掉這個可以當作簡寫的指令以外， git reset 其他的操作都在 **清除** 提交。

接下來提供幾個使用情境方便記憶。

#### 情境：不小心提交，想繼續編輯
```sh
git reset --soft HEAD^
```

這個指令會取消最新的提交，但保留所有程式碼修改（保留在預存區 staging area）。如果模式選擇 hard 非常危險，會將 commit, stage, 工作目錄**全部刪除**，需小心使用。

#### 情境：放棄未提交的修改
更生動的描述：寫到一半發現自己寫的 code 是垃圾，直接回到上一次提交。
```sh
git reset --hard
```

#### 情境：提交了多個小變更，想整理成一個提交
```sh
git reset HEAD~3
```

這會移除包含現在的三個提交。

#### 情境：只還原指定檔案到前一個提交
```sh
git reset HEAD~1 -- <file-name>
```
這個情況建議用 restore 比較不會混亂，而且 reset 操作失誤有可能刪除 commit，而 restore 是很安全的。


:::info 

1. HEAD 代表目前工作的 commit 位置
2. "^" 代表前一個提交，"~n" 代表前 n 個提交
3. -- 代表檔案分界線

:::


:::danger

雖然初學暫時不會碰到多人合作，但還是必須強調修改提交歷史 **永遠只該用於個人分支**！

:::

<br/>

### 救命稻草 git reflog
當操作錯誤時，git 的日誌功能 git reflog 可以還原操作。直接講使用方法：
```sh
$ git reflog
5293902 (HEAD -> main, origin/main, origin/HEAD) HEAD@{0}: commit: add article: python/regex
62b2d38 HEAD@{1}: rebase (finish): returning to refs/heads/main
62b2d38 HEAD@{2}: rebase (reword): add tags to article
72c5477 HEAD@{3}: rebase (start): checkout HEAD~2
37334c5 HEAD@{4}: commit: add: article tags

$ git reset --hard HEAD@{4}
```

這樣會回到 rebase 前的狀態。

到這邊就結束單一分支的基本操作了，接下來是多分支的操作。


<br/>

<br/>

## 進階操作
進階操作包含跨分支的操作，本文中只要實質上是操作分支的都放在這個類別。
```sh
git branch                           # 分支操作
git switch                           # 切換分支
git stash                            # 暫存檔案（非預存）
git rebase                           # 修改提交歷史
git revert                           # 恢復提交
```

<br/>

### 分支 git branch
當你工作變複雜一條分支不夠用就會用到這些，用於功能開發、問題修復、或者是發佈用的分支。
```sh
git branch                           # 查看
git branch <name>                    # 新建
git checkout <name>                  # 切換，新版為 git switch
git branch -D <name>                 # 刪除
git branch -m <old> <new>            # 改名
git merge "NAME"                     # 合併
```

<br/>

### 暫存 git stash
這是一個特別的指令，會把所有檔案都放進獨立的 stash 中，再把工作目錄還原成上一次提交的版本。  
使用情境：
1. 使用 git rebase 時強制目錄不能有未存檔檔案
2. 改到一半需要改一個更重要的東西
3. 改到一半需要跳到別的分支

可以看出來他是一個暫時擋刀用的指令。

基本選項：
```sh
git stash                            # 暫存變更
git stash list                       # 查看所有的 stash
git stash apply stash@{0}            # 恢復第一個暫存的變更
git stash drop stash@{0}             # 刪除 applied stash
git stash pop                        # 等同 apply + drop
git stash clear                      # 清除所有 stash
```

<br/>

### 修改 git rebase
這是一個功能非常強大的指令，甚至有教學說[「不會 rebase, 等於沒學過 Git」](https://myapollo.com.tw/blog/git-tutorial-rebase/)。這裡只講解他的基本邏輯，引用自[码农高天](https://www.youtube.com/watch?v=uj8hjLyEBmU)，是我看過講的最好，最清楚也最簡短的說明：

<center>**將「目前分支」移到旁邊，把「目標分支」拿過來，再把移到旁邊的「目前分支」想辦法接上去**</center>
<br />
為了搞懂 rebase 看了很多文章，直到看到這句話才搞懂，真的不需要了解工具怎麼實現的，只要會用工具就好了。用都不會用就講原理的結果就是不會用也不懂原理，後面會有單獨的文章介紹 rebase。


:::danger

雖然初學暫時不會碰到多人合作，但還是必須強調修改提交歷史 **永遠只該用於個人分支**！

:::

<br/>

### 恢復 git revert
用實際案例講解比較簡單。想撤銷提交 A，但是團隊合作最好別修改提交歷史，我們可以用 git revert 提交一個 negative A，這樣會產生一個新的提交把提交 A 抵銷，也不用修改歷史。

放在這裡的原因是團隊合作才會用到，一個人的話想怎麼改就怎麼改。

<br/>

## 結語
到這邊你已經可以基本流暢的操作 git 了，需要修改過去提交再看實戰文章，不然可以快轉到[遠端儲存庫設定](/docs/git/remote-setup)。