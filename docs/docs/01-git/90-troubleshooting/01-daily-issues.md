---
title: Git 各種日常問題集合
sidebar_label: 各種日常問題
description: 介紹 Git 常見的本地和遠端問題，包含清除reflog記錄、正確使用rebase、git mv、以及如何加速clone等進階技巧。還解釋了常見錯誤誤導，並提供正確的 Git 操作方法。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2025-02-12T13:35:00+08:00
  author: zsl0621
first_publish:
  date: 2025-02-12T13:35:00+08:00
---

都是簡單的日常問題但是要花一點時間搜尋，所以這篇文章集中列出方便查詢。

本文會有很多抱怨因為真的太荒謬，筆者已經很克制了，還好有 uBlacklist 可以直接封鎖網域眼不見為淨不然還會更不滿。

---

## 本地問題

#### 正確 rebase

應該在子分支使用 `git rebase main` 或者直接使用 `git rebase main <sub-branch>` 才對，原因請見[使用變基 Rebase 合併分支](../history-manipulation/rebase)。

這最誇張，連[為你自己學 Git](https://gitbook.tw/chapters/branch/merge-with-rebase)和 [Git 版本控制教學 - 用範例學 rebase](https://myapollo.com.tw/blog/git-tutorial-rebase/) 都寫錯，但凡看過一次文檔都不可能 rebase 子分支，錯的這麼離譜=看不懂文檔=沒看。

#### rebase onto 指定新基底

此用法相對來說比較複雜，但是複雜的原因不是指令本身而是網路上沒有正確的教學，請見[搞懂 Rebase Onto](../advance/rebase-onto)。

筆者沒有說大話嚇唬人，真的所有中文文章的解釋都是錯的，撰文時唯一能找到的正確文章是在搜尋結果第五頁 [介绍Rebase的基本概念，各种玩法，以及什么时候用到它](https://morningspace.github.io/tech/git-merge-stories-6/)，前面四頁的文章都沒講到或是錯的，如果不是因為要寫「正確的」教學我才沒耐心每篇都點進去看，還要在一堆錯誤裡面找出怎麼用才正確。

#### blob, tree, tag, commit, refs 是什麼？

refs 只是幫助人類記憶的名稱，只紀錄提交 hash 讓你直接用 refs 等於指定該提交。

其他四個是 Git 的基本構成，請見[關鍵字、符號和基本組成](../preliminaries/keyword)。

#### HEAD 是什麼

賣課網[又錯了](https://gitbook.tw/chapters/using-git/what-is-head)，HEAD 代表目前檢出 (checkout) 的位置，不只是分支，真的要解釋的話他屬於文檔定義中的 commit-ish，commit-ish 代表所有能最終指向一個 commit 物件的標識符，例如 HEAD, tag, branchname, refs...。

#### 為何要用 git mv

`git mv` 和一般的 `mv` 差異是他會讓 Git 直接索引檔案，真正需要用這個指令的原因是 Git 是推測你要作什麼，當操作複雜他就猜不出來你只是重命名，而 `git mv` 就告訴 Git「我正在重新命名這個檔案」。

有三種情況會用到

1. 操作複雜時，避免 Git 視為兩個不同的檔案，例如大規模變更名稱
2. 在不區分大小寫的檔案系統上更改檔案名稱的大小寫
3. 移動 submodule 時

賣課網寫了[這麼長一篇文章](https://gitbook.tw/chapters/using-git/rename-and-delete-file)整篇都在說用途是讓我們少打一個指令？別搞笑了大哥。

#### git reset 誤導

reset 實際在做的就是清除提交，最荒謬的是賣課網說[不要被名詞誤導](https://gitbook.tw/chapters/using-git/reset-commit)結果他的說法才是在誤導別人。

他所有文章都只介紹表面這我沒意見，結果偏偏這裡從底層說明這個指令在移動 HEAD，講的沒錯但是這樣說反而更讓讀者搞不懂，所以他又補充說明 git reset 比較像 goto，問題就出在這個自創名詞，請問 goto 到過往的提交能 goto 回到原本的提交嗎？不能嘛，那這個解釋不就有漏洞了嗎？reset 實際在做的就是清除提交，搞自創名詞拜託先想清楚能不能被合理解釋。

#### 移除已經提交的檔案但不刪除

```sh
git rm --cached
```

#### 清除 reflog 紀錄

```sh
git reflog expire --expire=now --all
```

#### 清理 .git 垃圾（無用的 commit 紀錄）

修改或是移除 commit 時，原有 commit 不會直接被刪除而是會暫存，這就是為何可以使用 reflog 還原的原因。對於這些紀錄 git 有自動清理機制，但是也可以手動清除：

```sh
git gc --aggressive --prune=now
```

---

## 遠端問題

#### 安全的強制推送

你以為我要講 force-with-lease 嗎，我要說的是 force-if-includes，請見[使用 Force if Includes 安全的強制推送](../remote/force-if-includes-safely-push)，裡面還有解釋 lease 到底在"租"什麼東西。

#### 清除隱私資料

任意使用哪種方式把該次提交從提交歷史中移除就可以了，完全不需擔心 reflog 因為他不會被推送到遠端，如果要徹底清除本地紀錄可以使用 filter-repo，內建的 filter-branch 已經不被建議使用。

想想每個人的 reflog 紀錄都不一樣，那怎麼可能被推送？賣課網[又寫錯了](https://gitbook.tw/chapters/faq/remove-files-from-git)，作者書都寫完了結果還是不知道 Git 是「分散式」的「鏡像系統」，有搞清楚分散鏡像系統就不可能說出 reflog 紀錄被推送這句話。

你可能會覺得我很嚴格，可能作者就是剛好沒想到啊，你說的沒錯，那退一步來說，要寫書教別人之前至少要測試正確性吧，看起來是沒有。

#### 只推送部分提交

```sh
git push <遠端名稱> <指定提交>:<遠端分支名稱>
```

又是賣課網，10 秒能講完的事情他拍了[七分鐘的影片](https://www.youtube.com/watch?v=VShhhq_5sMc)。

#### 加速 clone

請見我的文章[使用 Git Sparse Checkout 只下載部分專案以加速 Clone 速度](../advance/reduce-size)。

其實 [The Will Will Web](https://blog.miniasp.com/post/2022/05/17/Down-size-your-Monorepo-with-Git-Sparse-checkouts) 就寫的很詳細，但是我覺得不夠清楚而且指令有些更新，所以統整更新資訊以及實測結果圖表寫成文章。
