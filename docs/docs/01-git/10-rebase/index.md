---
title: "[微進階] 使用 Rebase 重構提交"
author: zsl0621
description: 最快最清楚的搞懂 git rebase。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-09-07T14:10:12+08:00
  author: zsl0621
first_publish:
  date: 2024-09-07T14:10:12+08:00
---

# 前言
Rebase 是非常強大的工具，到網路上查每個人都會說「移花接木」，概念是對了但就是沒懂，本文提供一個最淺顯易懂的解釋，從操作到原理一一解釋。前面強調了兩次「版本修改永遠只該用於個人分支」，但是 rebase 更加危險，這裡還要強調

:::danger

Rebase 很危險，不熟的請用範例 repo 進行測試！

[單分支範例](https://github.com/PIC16B/git-practice)  
[多分支範例](https://github.com/grayghostvisuals/practice-git)  
:::

## 什麼是 Rebase
要介紹 rebase，首先我們要了解 merge。

所謂 merge 就是把兩個分支合併成一個分支，會保留原本分支的記錄 A1, B1, C1：

```sh
# 原始狀態

main     A---B---C---D---E
              \         
feature        A1--B1--C1 
```

```sh
# git checkout main
# git merge feature
# 產生新的提交 F 表示合併，並且保留分支結構

main     A---B---C---D---E---F
              \             /
feature        A1---B1----C1 
```

```sh
# git checkout feature
# git rebase main
# 沒有分支結構也沒有合併節點

main     A---B---A1---B1---C1---C'---D'---E'
```

這裡使用[码农高天](https://www.youtube.com/watch?v=uj8hjLyEBmU)的範例，在 feature 分支使用 `git rebase main`。移花接木說的沒錯，把 main 移走接上 feature，這樣的說明完全正確，但我認為更好理解，更實在的[說明](https://www.youtube.com/watch?v=uj8hjLyEBmU)是：

<center>**將「目前分支」移到旁邊，把「目標分支」拿過來，再把移到旁邊的「目前分支」想辦法接上去**</center>
<br/>

那為什麼會不好理解呢，我認為是文章沒有說明清楚**誰接上誰**。使用 git rebase 指令時，假設我在 main 分支，使用 `git rebase feature`，他會做
1. 找到共同的基礎 (B)
2. 把基礎以後的提交 (C, D, E) 移到旁邊
3. 把目標分支拿過來 (A1, B1, C1)
4. 把剛剛移到旁邊的提交 (C, D, E) 接回來[^1]
5. 如果需要，處理合併衝突

[^1]: 網路上講的「重演」只是在說不是複製而是一個一個重新接上，每個都會計算新的 hash 產生新 commit，但是寫的落落長實在很模糊焦點，只要知道他會產生新的提交就好。

指令就是
```sh
git checkout feature
git rebase main
```

就這？對，就這。

### Rebase 兩個分支
還沒用過，參考[這裡](https://myapollo.com.tw/blog/git-tutorial-rebase/#rebase-%e5%9f%ba%e6%9c%ac%e7%94%a8%e6%b3%95)

### 更細微的操作 rebase
`git rebase --onto`: 還沒用過，參考[這裡](https://myapollo.com.tw/blog/git-tutorial-rebase/#rebase-onto)

## 互動式操作 rebase
使用參數 `git rebase -i` 可互動式 rebase，我使用這個的頻率比前面的合併分支高多了，到目前的使用體驗為止，我認為這是 git 最強大的指令，包含移動提交、刪除提交、修改提交內容、修改提交訊息全部都可以做到。他的原理仍舊是基於上述，但是使用時完全不會感覺到分支操作，因為用戶不需要輸入分支，但是他的實際使用仍是移動、放進來、再接上。rebase -i 後常用的選項有五個：
- p, pick 預設，選擇該提交
- r, reword 修改提交訊息
- e, edit 修改提交內容
- s, squash 合併到前一個提交
- f, fixup 合併到前一個提交，不顯示被合併的提交的提交訊息

[下一篇文章](/docs/git/edit-commits)會介紹修改各種 commit 的情況，這邊就不示範每個 rebase 選項，以修改提交訊息為例，使用[範例 repo](https://github.com/PIC16B/git-practice) 操作。

### 修改提交內容
```sh
# 複製範例 repo
git clone https://github.com/PIC16B/git-practice test-repo 
cd test-repo

# 顯示最近三個提交歷史
$ git log -n 3 --oneline                                
193f5fb (HEAD -> main, origin/main, origin/HEAD) Update README.md
a2167d3 typo fix
d108f69 add discard + revert, principles, typos

# 準備修改提交訊息
$ git rebase -i HEAD~3
pick d108f69 add discard + revert, principles, typos
pick a2167d3 typo fix
pick 193f5fb Update README.md

# 跳出編輯視窗
pick d108f69 add discard + revert, principles, typos
pick a2167d3 typo fix
pick 193f5fb Update README.md

# 把 pick 改成 r 後儲存離開，會顯示編輯提交訊息的視窗，依序改成 c1, c2, c3
add discard + revert, principles, typos

Please enter the commit message for your changes. Lines starting
with '#' will be ignored, and an empty message aborts the commit.
...省略

# 檢查修改結果，可以發現 hash 改變
$ git log -n 3 --oneline    
46fdf1b (HEAD -> main) c3
399fa42 c2
7c7d60a c1
```

其他操作大同小異，修改提交順序就把整行交換順序，修改提交內容就改成 e，修改該文件後 add 然後 git rebase --continue，just that simple。