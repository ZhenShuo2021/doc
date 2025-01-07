---
title: tmux 筆記
description: 使用 tmux 能讓你，管理多個任務：將一個終端分割成多個視窗或面板，或者保持會話持久性：即使斷線，會話依然可重連繼續工作。
tags:
  - Linux
  - tmux
keywords:
  - Linux
  - tmux
last_update:
  date: 2024-07-21T07:12:50+08:00
  author: zsl0621
first_publish:
  date: 2024-07-21T07:12:50+08:00
---

# tmux 使用教學
使用 tmux 能讓你
- 管理多個任務：將一個終端分割成多個視窗或面板
- 保持會話持久性：即使斷線，會話依然可重連繼續工作

最有用就是不佔用終端視窗，也不怕斷線。

## 第一次嘗試 tmux
安裝
```shell
sudo apt install tmux   # Linux
brew install tmux       # MacOS
```

最小實現指令
```shell
tmux                    # 進入會話
ctrl+b d                # 離開會話
ctrl+b x                # 刪除會話
ctrl+b [                # 在會話中捲動
tmux a                  # 連接最新的會話
```

tmux 有多種管理模式，會話包含多個視窗，視窗內又可分成多個窗格，彼此獨立運作。

下方狀態欄顯示 [會話名稱] ID:[視窗名稱]*，星號代表當前所在視窗。

指令整理章節整理會話視窗窗格的管理指令。

## 指令整理
tmux 指令都是 `prefix + "操作"`，預設 prefix 是 `ctrl+b`。

### 會話管理
```shell
創建：tmux new -s [會話名稱]
列出：tmux ls
進入：tmux attach -t [會話名稱]
離開：ctrl+b d
重新命名：ctrl+b $
```

### 視窗管理


```shell
創建：ctrl+b c
重新命名：ctrl+b ,
關閉：ctrl+b &
# 切換視窗
上：ctrl+b p
下：ctrl+b n
指定編號：ctrl+b [0-9]
```

### 窗格管理
```shell
創建垂直窗格：ctrl+b %
創建水平窗格：ctrl+b "
關閉窗格：ctrl+b x
移動：ctrl+b [方向鍵]
切換佈局：ctrl+b [空格鍵]
縮放窗格：ctrl+b z
```

### 彩蛋
顯示時鐘
```shell
ctrl+b t
```

## 結語
這麼簡單的東西為甚麼網路教學要寫的這麼長呢。
