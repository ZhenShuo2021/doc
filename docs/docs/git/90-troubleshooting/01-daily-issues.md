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
  date: 2025-02-12T23:19:00+08:00
  author: zsl0621
first_publish:
  date: 2025-02-12T13:35:00+08:00
---

都是簡單的日常問題但是要花一點時間搜尋，所以這篇文章集中列出方便查詢。

---

## 本地問題

#### 正確 rebase

正確使用方式是移動到子分支後再使用 `git rebase main`，或者直接使用 `git rebase main <sub-branch>` 才對，原因請見[使用變基 Rebase 合併分支](../history-manipulation/rebase)。

[為你自己學 Git](https://gitbook.tw/chapters/branch/merge-with-rebase) 和 [Git 版本控制教學 - 用範例學 rebase](https://myapollo.com.tw/blog/git-tutorial-rebase/) 都寫錯了，這最誇張，但凡看過一次文檔都不可能寫成 `git rebase <子分支>`，能錯的這麼離譜=看不懂文檔=沒看。

<br />

#### rebase onto 指定新基底

此用法相對來說比較複雜，但是複雜的原因不是指令本身而是網路上沒有正確的教學，請見[搞懂 Rebase Onto](../advance/rebase-onto)。

筆者沒有說大話嚇唬人，真的所有中文文章的解釋都是錯的，撰文時唯一能找到的正確文章是在搜尋結果第五頁 [Git合并那些事——神奇的Rebase](https://morningspace.github.io/tech/git-merge-stories-6/)，前面四頁的文章不是沒提到 onto 就是講錯，如果不是因為要寫「正確的」教學筆者才沒耐心每篇都點進去看，還要在一堆錯誤裡面找出怎麼用才正確。

<br />

#### blob, tree, tag, commit, refs 是什麼？

refs 只是幫助人類記憶的名稱，只紀錄提交 hash 讓你直接用 refs 等於指定該提交。

其他四個是 Git 的基本構成，請見[關鍵字、符號和基本組成](../preliminaries/keyword)。

<br />

#### HEAD 是什麼

賣課網[又錯了](https://gitbook.tw/chapters/using-git/what-is-head)，HEAD 代表目前檢出 (checkout) 的位置，不只是分支，真的要解釋的話他屬於文檔定義中的 commit-ish，commit-ish 代表所有能最終指向一個 commit 物件的標識符，例如 HEAD, tag, branchname, refs...。

<br />

#### 為何要用 git mv

`git mv` 和一般的 `mv` 差異是可以讓 Git 直接索引檔案，需要這個指令的原因是 Git 會推測你要作什麼，但是操作複雜時他就猜不出來你正在重新命名，`git mv` 就是告訴 Git「我正在重新命名這個檔案」。

有三種情況會用到

1. 操作複雜時，避免 Git 視為兩個不同的檔案，例如大規模變更檔案名稱
2. 在不區分大小寫的檔案系統上更改檔案名稱的大小寫
3. 移動 submodule 時

賣課網寫了[這麼長一篇文章](https://gitbook.tw/chapters/using-git/rename-and-delete-file)整篇都在說用途是讓我們少打一個指令，別搞笑了大哥。

<br />

#### git reset 誤導

reset 實際在做的就是清除提交，最荒謬的是賣課網說[不要被名詞誤導](https://gitbook.tw/chapters/using-git/reset-commit)結果他的說法才是在誤導別人。

他的文章都只介紹表面這我沒意見，本來就簡易介紹課才賣的多，結果偏偏這裡說明這個指令底層實際上在移動 HEAD，講的沒錯但是這樣說反而更讓讀者搞不懂，所以他又補充說明 git reset 比較像 goto，問題就出在這個自創名詞，請問 goto 到過往的提交能 goto 回到原本的提交嗎？不能嘛，那這個解釋不就有漏洞了嗎？reset 實際在做的就是清除提交，搞自創名詞拜託先想清楚能不能被合理解釋。

<br />

#### 移除已經提交的檔案但不刪除

```sh
git rm --cached
```

<br />

#### 清除 reflog 紀錄

```sh
git reflog expire --expire=now --all
```

<br />

#### 清理 .git 垃圾（無用的 commit 紀錄）

修改或是移除 commit 時，原有 commit 不會直接被刪除而是會暫存，這就是為何可以使用 reflog 還原的原因。對於這些紀錄 git 有自動清理機制，但是也可以手動清除：

```sh
git gc --aggressive --prune=now
```

---

## 遠端問題

#### 遠端追蹤分支是什麼？和遠端分支一樣嗎？追蹤分支又是什麼？{#remote-checking-branches}

遠端追蹤分支 (Remote-tracking Branch) 是本地儲存庫用來記錄遠端分支最新狀態的本地參考，其名稱格式為 `<遠端名稱>/<分支名稱>`，例如預設的 `origin/main`。

執行 `git clone` 後，Git 會自動檢出 (checkout) 一個預設的本地分支，並將其設定為追蹤分支（Tracking Branch），該分支會與對應的遠端追蹤分支建立追蹤關係。例如 `git clone` 後預設檢出的 `main` 分支，會追蹤 `origin/main` 這個遠端追蹤分支，而 `origin/main` 也可稱為 `main` 分支的上游分支（Upstream Branch）。

所謂口語上的遠端分支就是在遠端中的本地分支，和遠端追蹤分支是不同的概念

<br />

#### 無法推送

有兩種可能，遠端分支設定錯誤或者遠端提交歷史比本地還要新。

比本地還新的話就使用 `git pull --rebase`，如果設定跑掉就用[設定遠端分支](#設定遠端分支)，如果想要覆蓋就使用[安全的強制推送](#安全的強制推送)。

<br />

#### 設定遠端分支

請見 Git 遠端指令的 [找不到遠端的處理方式](../remote/concept-and-commands#remote-debug) 段落。

> 照著做完後還是無法設定遠端分支

一般來說上面的方式就可以了，但是如果還是不給你設定，例如這個情況：

```sh
git branch -u origin/custom
致命錯誤: 請求的上游分支「origin/custom」不存在
```

請先檢查遠端相關設定確認 origin 和 custom 確實存在

```sh
# 檢查
git remote -vv
git ls-remote --branches

# 更新遠端資訊
git fetch origin

# 更新完成後再重新執行一次 "找不到遠端的處理方式" 的操作
```

如果仍舊失敗就代表 remote 抽風了，使用以下指令重新設定遠端：

```sh
git remote remove origin
git remote add <url>
```

<br />

#### 安全的強制推送

你以為我要講 force-with-lease 嗎，我要說的是 force-if-includes，請見[使用 Force if Includes 安全的強制推送](../advance/dive-into-force-if-includes)，裡面還有解釋 lease 到底在"租"什麼東西。

<br />

#### 清除隱私資料

任意使用哪種方式把目標從提交歷史中移除就可以了，不用擔心 reflog 紀錄，因為 reflog 紀錄壓根就不會被推送到遠端，如果要徹底清除本地紀錄可以使用 filter-repo，內建的 filter-branch 已經不被建議使用。

賣課網[又寫錯了](https://gitbook.tw/chapters/faq/remove-files-from-git)，想想每個人的 reflog 紀錄都不一樣，那怎麼可能被推送？作者書都寫完了結果還是不知道 Git 是「分散式」的「鏡像系統」，有搞清楚分散鏡像系統就不可能說出 reflog 紀錄被推送這句話。

你可能會覺得我很嚴格，可能作者就是剛好沒想到啊，你說的沒錯，那退一步來說，要寫書教別人之前至少要測試正確性吧，看起來是沒有。

<br />

#### 只推送部分提交

```sh
git push <遠端名稱> <指定提交>:<遠端分支名稱>
```

又是賣課網，10 秒能講完的事情他拍了[七分鐘的影片](https://www.youtube.com/watch?v=VShhhq_5sMc)。

<br />

#### 加速 Clone

請見我的文章[使用 Git Sparse Checkout 只下載部分專案以加速 Clone 速度](../advance/reduce-size-with-sparse-checkout)。

其實 [The Will Will Web](https://blog.miniasp.com/post/2022/05/17/Down-size-your-Monorepo-with-Git-Sparse-checkouts) 就寫的很詳細，但是我覺得不夠清楚而且指令有些更新，所以統整更新資訊以及實測結果圖表寫成文章。

## End

本文有很多抱怨因為真的錯的太荒謬，還好有 uBlacklist 可以直接封鎖錯誤來源眼不見為淨，不然還會更不滿。寫圖文並茂的教學還提供所有人免費閱讀我覺得很好，但是真的錯太多了，甚至有些錯誤只要看過文檔就不會犯，也就是說連文檔都沒看過就開始寫教學文章、上網賣課，結果所有讀者都被帶歪，我在做功課時就發現所有錯誤都是前面的人錯後面就跟著全錯。
