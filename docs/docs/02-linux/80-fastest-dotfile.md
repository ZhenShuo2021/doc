---
title: 一鍵美化 MacOS Terminal | 功能齊全而且快速的 dotfiles | macOS | Linux
description: 一鍵美化 MacOS Terminal | 功能齊全而且快速的 dotfiles | macOS | Linux
sidebar_label: 一鍵美化終端機
tags:
  - 實用工具
  - Performance
  - Font
keywords:
  - 實用工具
  - Performance
  - Font
  - WezTerm
  - Neovim
  - Zinit
  - PowerLevel10k
  - zsh-bench
  - speed
last_update:
  date: 2025-02-14T12:36:00+08:00
  author: zsl0621
first_publish:
  date: 2025-01-02T02:36:00+08:00
---

import ResponsivePlayer from '@site/src/components/ResponsivePlayer';

# Dotfile Built for Speed and Simplicity

現代、快速、方便、功能齊全的 ZSH dotfile，[專案位址](https://github.com/ZhenShuo2021/dotfiles)。

![demo.webp](data/dotfiles-demo.webp "demo")

<ResponsivePlayer url="https://www.youtube.com/watch?v=RVVCEYs4U7A" />

## 為何要選擇這份 Dotfile

1. 是真的快，達到使用插件的速度上限，而且是嚴謹的測試不像網路上的搞笑演員拿 time 指令跑 10 次就說這叫做速度測試
2. 支援一鍵自動安裝
3. 管理方便，比 oh-my-zsh 更方便
4. 極簡風格，不搞花花綠綠的分散注意力
5. 你的套件管理器不會要你買 hoodies，不會一天到晚問你要不要更新
6. 你的終端機已經完整設定，一個字都不用打就已經是人家一整篇文章的設定
7. 你的 zshrc 已經最佳設定，是我過濾百篇文章的結晶
8. 完整註解，你絕對看得懂 zshrc 的每份設定
9. 設定正確，Zinit 正確使用延遲載入，自動補全正確啟用，連 zsh-z 都可以補全
10. 功能齊全，從語法上色、別名、key-binding、Git 插件一應俱全
11. 多項內建指令，如 hnc/c/gpg_test/gpg_reload/find-ext/switch_en ...
12. 不用搞什麼 gnu stow，純 Git 即可運作
13. 所有常見問題都已解決
14. 乾淨的家目錄，能改到 .cache/.config 的系統檔案全部改位置
15. 參考 Github 前 20 大 dotfiles 完成，結合他們全部優點，不用再想東想西現在就是最好的設定

網路上的繁體中文文章一堆設定錯誤，沒有啟用延遲載入、補全設定錯誤，在繁體中文圈甚至能把正確拿來當賣點，如果你照著其他繁體中文文章作高機率有某些功能設定錯誤。

## 速度

快不只是嘴上說說。

載入速度採用全面且嚴謹的 [zsh-bench](https://github.com/romkatv/zsh-bench/) 作為測試指標，同時也提供直觀易懂的 hyperfine 測試結果[^test-method]，不只是表面數據好看，而是使用反應現實狀態的指標得到真實可感知的效能提升。

[^test-method]: 測試執行於 M1 MacBook Pro 8G RAM，zsh-bench 使用預設值，hyperfine 使用 `hyperfine --runs 100 --warmup 3 'zsh -i -c exit 0'` 測試。由於不使用 zsh-defer 優化的 `Manual Install` 實在太慢，所以他沒有載入最耗時的幾個插件：oh-my-zsh 本身（借用他的插件庫，`Manual Install Optimized` 也有載入 oh-my-zsh 以達成公平的測試環境），以及需要載入 oh-my-zsh 的 docker/git 插件。總而言之所有框架的插件都相同只有 `Manual Install` 沒載入 oh-my-zsh 和 git/docker 插件。

測試項目涵蓋五個框架：

- Oh-My-ZSH: 使用 Oh-My-ZSH 加上 zsh-defer 優化
- Manual Install: 手動安裝無優化
- Manual Install Optimized: 手動安裝加上 zsh-defer 優化
- Zinit: 本份 dotfile
- Baseline: 基準線，移除 .zshrc，本機能達到的最快速度

從最廣泛使用的框架到完全空白的設定檔，分別測試了最多人用的框架、純手動安裝、手動安裝極限優化、本份 dotfile 以及作為基準線的空白 zshrc。

![demo.webp](data/dotfiles-benchmark.webp "benchmark")

載入速度大幅領先 Oh-My-ZSH，並且大多數測試項目都能持平 `Manual Install Optimized` 甚至超越，請注意對手都公平的使用 zsh-defer 加速，表示已經非常接近速度上限了。比照基準線看似差距很多，但是根據 zsh-bench 作者的[人類感知閾值測試](https://github.com/romkatv/zsh-bench/?tab=readme-ov-file#how-fast-is-fast)，本份 dotfile 全部測試項目的耗時都能達到距離體感無延遲 10ms 之內的成績。

除了效能也更方便管理。由於採用 Zinit，不需要額外的設定文件來設定插件管理器，也不必像 Manual Install 那樣手動 clone 插件。

> 繪製自己的測試結果：將數據更新在 .github/benchmark.py 後使用 `uv run .github/benchmark.py` 可以直接執行不需建立虛擬環境。

## 特色

所有程式的設定都基於簡單原則完成，外觀設定模仿 vscode 預設主題，一律使用 nerd font (MesloLGS NF) 字體。

- 📂 集中管理：不需要把安裝腳本和設定檔分開管理，一次完成安裝和設定
- 🛠️ 易於調整：.zshrc 乾淨簡潔，讓你不會每次修改頭都很痛
- 🚀 快速啟動：大量使用 zsh-defer 實現懶加載
- 📚 完整註解：保證你看得懂 zshrc 在寫什麼以及為何這樣寫
- 🔄 輕鬆更新：執行 `dotfile-update` 就可輕鬆更新所有插件和系統套件
- 🎨 已配置完成的 Powerlevel10k 主題
- 📦 多個預先配置的插件
  - zsh-syntax-highlighting 語法上色
  - zsh-autosuggestions 指令歷史建議
  - zsh-completions 指令補全
  - colored-man-pages 上色的 man pages
  - extract 自動解壓縮
  - z 快速切換目錄
- 🌐 LANG、LC_ALL 和 Git 都已經設定好繁體中文
- ✅ GPG、homebrew 和 Git 等套件的常見問題都已經解決
- 🎯 正確的設定指令補全
- ⚙️ 完善設定的 gitconfig，大量借鑒 [mathiasbynens](https://github.com/mathiasbynens/dotfiles)
- 🖥️ 現代化終端機
  - 使用現代終端機，分割視窗不再需要 tmux 並且設定好外觀主題和鍵盤映射
  - wezterm: [binwenwu/wezterm-config](https://github.com/binwenwu/wezterm-config/)
  - warp: [warpdotdev/themes](https://github.com/warpdotdev/themes)
- ✏️ 文字編輯
  - neovim: 使用 Lazyvim 設定檔，鍵盤映射 Ctrl+d 為黑洞刪除
  - helix: onedarker 主題，並且整合 ruff lsp
- 🔧 工具
  - gallery-dl: 精心設計的 config.json，只需修改路徑即可使用
  - yt-dlp: 設定檔為最高畫質和音質，開箱即用

## 相容性

以下系統經過測試能正常運作，即使在權限被鎖定甚至連 dpkg 都不能用的 TrueNAS 都能成功啟用

- [x] macOS Sonoma
- [x] Ubuntu 22.04.5 LTS
- [x] TrueNas ElectricEel-24.10.0 (6.6.44-production+truenas)

## 安裝

```sh
git clone --recursive --shallow-submodules https://github.com/ZhenShuo2021/dotfiles ~/.dotfiles
cd ~/.dotfiles
find . -type f -name "*.sh" -exec chmod +x {} \; 
src/bootstrap.sh
```
