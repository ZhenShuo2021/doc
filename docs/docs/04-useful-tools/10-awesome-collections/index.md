---
title: 實用工具選輯
description: 選輯
sidebar_label: 選輯
tags:
  - 實用工具
keywords:
  - 實用工具
last_update:
  date: 2024-12-28T15:36:00+08:00
  author: zsl0621
first_publish:
  date: 2024-12-17T14:22:30+08:00
---

# 工具選輯

把我自己挑選過在同一領域內最好的工具選出來，因為一定會忘記所以存起來

## Python 實用套件

- pathvalidate: 處理檔案路徑的套件
- python-fsutil: 懶人路徑套件，包含將近一百種函式選擇[^fsutil]
- DownloadKit: 封裝 requests 的下載工具，內建自動副檔名偵測，自動重新命名  
設定範例

[^fsutil]: 注意裡面的 get_unique_name 使用 uuid 產生唯一名稱而不是常見的數字排序。

```py
dk = DownloadKit()
dk.set.log.print_nothing()
dk.set.roads(5)
dk.set.retry(5)
dk.set.interval(5)
dk.set.timeout(10)
dk.set.split(True)
dk.set.block_size("1m")
```

- python-fire: 自動生成 CLI 介面
- [HTTP 客戶端套件集合](https://blog.zsl0621.cc/posts/scrappers/)
- [HTML 解析套件套件集合](https://blog.zsl0621.cc/posts/scrappers/)
- [網頁自動化套件集合](https://blog.zsl0621.cc/posts/scrappers/)
- PyVirtualDisplay: 模擬圖形化介面
- setup-xvfb: 設定圖形化介面的 Github Action
- Ruff: 用 Rust 寫的開源 Python linter + formatter
- uv: 用 Rust 寫的開源 Python 虛擬環境+套件+Python 版本管理

## CLI 工具

- yt-dlp: 實用 CLI 影片下載工具
- gallery-dl: 實用 CLI 圖片下載工具

## 瀏覽器擴充功能

### 還我乾淨瀏覽

- uBlock Origin
- uBlacklist

<details>
<summary>uBlacklist 封鎖清單</summary>

備份也當作分享，可以直接匯入（裡面叫做還原）

```json
{
  "blacklist": "*://blog.csdn.net/*\n*://cloud.baidu.com/*\n*://readforbetter.com/*\n*://www.zhihu.com/*\n*://ithelp.ithome.com.tw/*\n*://wenku.csdn.net/*\n*://www.kaixinit.com/*\n*://www.imooc.com/*\n*://cloud.tencent.com/*\n*://www.delftstack.com/*\n*://codelove.tw/*\n*://jujupp.medium.com/*\n*://hugo-for-newbie.kejyun.com/*\n*://sean22492249.medium.com/*\n*://www.cs.pu.edu.tw/*\n\n*://gitbook.tw/*\n*://python.libhunt.com/*\n*://codimd.mcl.math.ncu.edu.tw/*\n*://skyyen999.gitbooks.io/*\n*://python.plainenglish.io/*\n*://python.iswbm.com/*\n*://medium.com/@heidi-coding/*\n*://medium.com/@chenfelix/*\n*://www.readfog.com/*\n*://m.php.cn/*\n*://www.sohu.com/*\n*://segmentfault.com/*\n*://juejin.cn/*\n*://ftp.tku.edu.tw/*\n*://www.rapidseedbox.com/*\n*://medium.com/@tonykuoyj*\n*://2formosa.blogspot.com/*\n\n*://huaweicloud.csdn.net/*\n*://www.threads.net/*\n*://www.businessweekly.com.tw/*\n*://s.csdnimg.cn/*\n@*://shopee.tw/*\n@*://term.ptt.cc/*\n@*://www.ptt.cc/*\n@*://www.cnblogs.com/*\n*://newsn.net/*",
  "blockColor": "default",
  "blockWholeSite": false,
  "dialogTheme": "default",
  "enablePathDepth": false,
  "hideBlockLinks": false,
  "hideControl": false,
  "highlightColors": [
    "#ddeeff"
  ],
  "linkColor": "default",
  "skipBlockDialog": false,
  "subscriptions": [
    {
      "name": "標準內容農場清單 danny0838",
      "url": "https://danny0838.github.io/content-farm-terminator/files/blocklist-ublacklist/content-farms.txt",
      "enabled": true
    },
    {
      "name": "類內容農場清單 danny0838",
      "url": "https://danny0838.github.io/content-farm-terminator/files/blocklist-ublacklist/nearly-content-farms.txt",
      "enabled": true
    },
    {
      "name": "擴充內容農場清單 danny0838",
      "url": "https://danny0838.github.io/content-farm-terminator/files/blocklist-ublacklist/extra-content-farms.txt",
      "enabled": true
    },
    {
      "name": "劣質複製農場清單 danny0838",
      "url": "https://danny0838.github.io/content-farm-terminator/files/blocklist-ublacklist/bad-cloners.txt",
      "enabled": true
    },
    {
      "name": "詐騙網站清單 danny0838",
      "url": "https://danny0838.github.io/content-farm-terminator/files/blocklist-ublacklist/scam-sites.txt",
      "enabled": true
    },
    {
      "name": "假新聞網站清單  danny0838",
      "url": "https://danny0838.github.io/content-farm-terminator/files/blocklist-ublacklist/fake-news.txt",
      "enabled": true
    },
    {
      "name": "eallion",
      "url": "https://git.io/ublacklist",
      "enabled": false
    }
  ],
  "syncAppearance": true,
  "syncBlocklist": true,
  "syncGeneral": true,
  "syncInterval": 15,
  "syncSubscriptions": true,
  "updateInterval": 120,
  "version": "8.9.2"
}
```

</details>

### 影片相關

- YouTube 繁體自動翻譯修正
- Screenshot YouTube
- Better YouTube Shorts
- Allow Right-Click
- Return YouTube Dislike
- YouTube NonStop
- Video Speed Controller

### 工具類型

- Cookie-Editor
- GoFullPage
- Joplin Web Clipper
- Picture-in-Picture Extension (by Google)
- PixivBatchDownloader

### 個人客製化

- Bonjourr · Minimalist Startpage

## 終端機相關

- ~~[helix](https://github.com/helix-editor/helix): 開箱即用的文字編輯器 with onedarker theme~~ [為什麼不用了][^helix]
- [neovim](https://github.com/neovim/neovim): 改善 vim 問題的文字編輯器，請愛用 [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim)[^kickstart] 完成設定
- Warp: 附帶各種功能、支援各種工具的套件
- [wezterm-config](https://github.com/KevinSilvester/wezterm-config): 開箱即用的 WezTerm 客製化，截至 6febb08 設定都很好。zsh 使用者要把 `config/domains.lua` 裡面的 fish 改成 zsh
- font 字體: MesloLGS NF，和 [powerlevel10k](https://github.com/romkatv/powerlevel10k? tab=readme-ov-file#meslo-nerd-font-patched-for-powerlevel10k)相同
- [yazi](https://github.com/sxyazi/yazi): 超快的命令行檔案檢視器，需要用支援[圖形輸出](https://yazi-rs.github.io/docs/image-preview/)的終端才可以顯示圖片，例如 WezTerm
- WinGet/Chocolatey: Windows 的終端機套件管理
- UniGetUI: Windows 上的圖形化套件管理器

[^helix]: 熱門度問題。Github 搜尋 [helix config](https://github.com/search?q=helix+config&type=repositories) 有 500 個 repo，neovim 則是 17k，而且還有 NvChad 這個 25k stars 的 repo 提供 out-of-the-box 的設定，那誰還要慢慢設定 neovim。helix 優點是[比較快](https://www.reddit.com/r/HelixEditor/comments/1azis06/worth_to_switch_from_nvim/)，不過就等未來用到卡了之後再改用 helix。

[^kickstart]: 除了 NvChad 以外其餘很多設定檔在 vscode neovim-package 都會造成亂碼

## 自架 Self-Host{#helix}

- Immich: 完全替代 Google 相簿
- PhotoPrism: 畫廊形式的相簿
- [filebrowser](https://github.com/filebrowser/filebrowser): 簡單易用輕量的個人雲端，包含帳號功能
- Stirling PDF: PDF 全能工具
- Lanraragi: 漫畫伺服器
- Stash: 影片伺服器

## 還沒有分類

- RustDesk: 用 Rust 寫的開源遠端工具
- [Files](https://github.com/files-community/Files): 改善 Windows 內建的檔案瀏覽器
