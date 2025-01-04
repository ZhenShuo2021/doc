---
title: Homebrew (Linuxbrew) 介紹和名詞解析
description: Homebrew (Linuxbrew) 介紹和名詞解析
sidebar_label: Homebrew 介紹和名詞解析
tags:
  - Linux
keywords:
  - Linux
last_update:
  date: 2025-01-04T18:40:30+08:00
  author: zsl0621
first_publish:
  date: 2025-01-04T18:40:30+08:00
---

除了各發行版自己管理的套件管理以外，還有 homebrew 這個套件管理器可用，在 linux 上稱作 linuxbrew。

## Linuxbrew 簡而言之

最愛先說結論了，個人電腦用可以，追求穩定的伺服器完全沒必要用這個。

- 優點
  1. 更新比 apt 等官方來源即時很多，例如 Hugo/Neovim 等等
  2. 不需要 sudo，套件安裝在一個新的 user 資料夾中 (linuxbrew)
  3. 支援多種發行版、Windows WSL、macOS 原生支援
  4. 可以把好用的 macOS dotfiles 抄過來，只要修改一下即可使用
- 缺點
  1. 顯而易見的是不可能比發行版自帶的套件管理穩定
  2. 可能會遇到一些奇怪的 bug

> 到底該怎麼選？給我最終答案好不好

Linux 是自由的世界，對你來說哪個方法 work 就用哪個方法，我自己的結論是下次重設我的 server 時會用 linuxbrew 踩坑看看，有雷再更新。我首先會嘗試在不支援的套件使用 homebrew 而不是自己編譯。

你可能覺得我在亂講，那給出我的資料來源

- https://www.reddit.com/r/linux/comments/1d2l633/how_is_homebrew_on_linux_at_the_moment_in_terms/
- https://www.reddit.com/r/debian/comments/m8xmzt/homebrew_vs_apt/
- https://www.youtube.com/watch?v=QsYEvnV-P34

## 名詞解析

[官方文檔](https://docs.brew.sh/Manpage)英文有看沒有懂，這裡翻譯一下

1. **formula**: CLI 套件或函式庫。
2. **cask**: macOS 原生軟體包，主要是 GUI 套件。

其他就簡單了，只是路徑

1. **prefix**: Homebrew 的安裝路徑，例如 `/usr/local`。
2. **keg**: 某個 formula 特定版本的安裝目錄，例如 `/usr/local/Cellar/foo/0.1`。
3. **rack**: 包含一個或多個版本化 keg 的目錄，例如 `/usr/local/Cellar/foo`。
4. **keg-only**: formula 為 keg-only 時，不會將其符號連結至 Homebrew 的 prefix 路徑，通常是為了避免與系統內置版本或其他工具衝突。
5. **opt prefix**: 指向某個 keg 的活動版本的符號連結，例如 `/usr/local/opt/foo`。
6. **Cellar**: 包含所有 rack 的主目錄，例如 `/usr/local/Cellar`。
7. **Caskroom**: 包含所有 cask 的主目錄，例如 `/usr/local/Caskroom`。
8. **external command**: 定義在 Homebrew 官方倉庫之外的 `brew` 子命令。
9. **tap**: 包含 formula、cask 或 external command 的目錄（通常也是 Git 倉庫）。
10. **bottle**: 預先構建的 keg，直接安裝到 Cellar 的 rack 中，而不是從源代碼構建。

## 沒用知識

### 名稱由來

為啥名字是家裡釀造 (homebrew)？他們真的很會想名字，是希望套件管理和在家裡釀酒一樣簡單。問題是這些專有名詞我就不愛了，例如 Cask/Cellar 都要看文檔才懂。

### 資料收集

Homebrew 是開源非營利組織只能可憐的用斗內維持運作，改善演算法也不像大公司一樣有各種手段取得資料，需要自己蒐集數據。雖然是匿名的，但如果你無論如何都不想被蒐集可以使用 `brew analytics off`。

### 北七演算法

這段來自維基百科，確實面試是在考什麼鬼演算法，誰整天在翻轉 binary tree???

> Homebrew的作者Max Howell曾應聘過Google的職位，面試失敗之後在[Twitter上發帖](https://x.com/mxcl/status/608682016205344768)
>
> > Google: 90% of our engineers use the software you wrote (Homebrew), but you can't invert a binary tree on a whiteboard so f*** off.（Google：我們90%的工程師都在用你的軟體（Homebrew），但是你不會在白板上翻轉二元樹，所以滾出去。）
