---
title: 在 Neovim 中設定 OSC52 實現跨 ssh 複製 
description: 在 Neovim 中設定 OSC52 實現跨 ssh 複製
tags:
  - 實用工具
  - Neovim
keywords:
  - 實用工具
  - Neovim
last_update:
  date: 2025-03-01T22:19:00+08:00
  author: zsl0621
first_publish:
  date: 2025-03-01T22:19:00+08:00
---

原本使用 [nvim-osc52](https://github.com/ojroques/nvim-osc52) 插件發現複製貼上的起始位置和預設行為不同，看 repo 才發現 Neovim 10.0 之後內建就可以設定 OSC52 不需要這個插件了。

## 設定

以 LazyVim 為例，進入 `lua/config/options.lua` 中貼上

```lua
-- unnamedplus 使用系統剪貼簿
vim.opt.clipboard:append("unnamedplus")

-- 使用 OSC 52
vim.g.clipboard = {
  name = "OSC 52",
  copy = {
    ["+"] = require("vim.ui.clipboard.osc52").copy("+"),
    ["*"] = require("vim.ui.clipboard.osc52").copy("*"),
  },
  paste = {
    ["+"] = require("vim.ui.clipboard.osc52").paste("+"),
    ["*"] = require("vim.ui.clipboard.osc52").paste("*"),
  },
}
```

設定完成。

可能有刪除速度緩慢的問題，請追蹤[此 issue](https://github.com/neovim/neovim/issues/11804)查看進度，我個人在 TrueNAS 和 Ubuntu Server 上都沒遇到。如果遇到 Windows Terminal 貼上問題請見 [穿透 wsl 和 ssh, 新版本 neovim 跨设备任意复制，copy anywhere!](https://www.sxrhhh.top/blog/2024/06/06/neovim-copy-anywhere/)。

- [feat(clipboard): add OSC 52 clipboard support #25872](https://github.com/neovim/neovim/pull/25872)
- [Neovim: Provider](https://neovim.io/doc/user/provider.html#_clipboard-integration)
