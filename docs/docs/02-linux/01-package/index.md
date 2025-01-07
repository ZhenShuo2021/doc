---
title: Ubuntu 中套件管理工具的差異
description: 介紹 Ubuntu 中套件管理工具 apt apt-get dpkg snap flatpak 差異
tags:
  - NAS
  - Linux
  - Ubuntu
keywords:
  - Linux
  - Ubuntu
last_update:
  date: 2024-09-23T00:00:00+08:00
  author: zsl0621
first_publish:
  date: 2024-09-23T00:00:00+08:00
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ubuntu 中套件管理工具的差異

:::danger
基礎問題問 GPT 最快，會大量使用 GPT 整理的文字，但是有經過整理和檢驗。
:::

## 套件管理工具
有套件就有套件管理工具，幫助你安裝套件，解決套件之間的依賴問題，常見的有三種：apt (2014), apt-get (1998) 和 dpkg (1994)。

### 問 GPT: 說明這三個包管理工具分別想解決前人的哪些問題
> 說明這三個包管理工具分別想解決前人的哪些問題，因為一定是有問題才要推出新工具

- dpkg：解決早期 Linux 系統缺乏統一的軟件包管理機制
- apt-get：解決 dpkg 不處理套件依賴關係
- apt：高層工具，解決 apt-get 仍然不夠直觀，提供更友好的使用體驗

可以很清楚的知道平常沒事用 apt，有特殊需求只想安裝單一個套件用 dpkg，那些介紹 .deb 的除了開發人員我不相信你們一年會用到 .deb 幾次。

補充：三者底層都使用 dpkg。  
補充：無論 apt 還是 apt-get 安裝或移除套件，它們都會更新這個共享的 dpkg 套件數據庫，在 [/var/lib/dpkg/status](https://www.debian.org/doc/manuals/debian-reference/ch02.en.html#_the_dpkg_command) 管理所有套件。  

### 問 GPT: 什麼時候需要使用apt-get而不是apt
> 日常使用應該是apt最方便，那什麼時候需要使用apt-get而不是apt？

1. 腳本和自動化：apt-get 更穩定，適合在腳本或自動化環境中使用。因為 apt-get 的輸出格式在長期內保持一致，不會發生大的變化，這使得它更適合寫在系統管理腳本中。
2. 高精細控制：apt 沒有 apt-get 的全部指令，需要細部調整時需用 apt-get，例如 [build-dep](https://www.cnblogs.com/tongongV/p/10927648.html)。
3. 不穩定或實驗性系統：使用不穩定或實驗性系統時，apt-get 可能更可靠，因為它的設計更加保守，命令更穩定，適合處理更加複雜的包管理。

### 基本指令

<Tabs>
  <TabItem value="apt" label="apt">
 
  ```bash
  sudo apt install package      # 安裝
  sudo apt remove package       # 移除
  sudo apt update               # 更新軟件源
  sudo apt upgrade              # 升級已安裝的包
  sudo apt autoremove           # 移除不再需要的包
  sudo apt full-upgrade         # 完整升級系統
  ```

  </TabItem>

  <TabItem value="apt-get" label="apt-get">
  
  ```bash
  sudo apt-get install package  # 安裝
  sudo apt-get remove package   # 移除
  sudo apt-get update           # 更新軟件源
  sudo apt-get upgrade          # 升級已安裝的包
  sudo apt-get autoremove       # 移除不再需要的包
  sudo apt-get dist-upgrade     # 完整升級系統
  sudo apt-get source package   # 下載軟件包的源碼，apt沒有這個指令
  ```

  </TabItem>

  <TabItem value="dpkg" label="dpkg">
  
  ```bash
  sudo dpkg -i package.deb      # 安裝
  sudo dpkg -r package          # 移除
  sudo dpkg -l                  # 列出已安裝的包
  sudo dpkg -P package          # 完全移除包和配置檔案
  sudo dpkg --configure -a      # 重新配置安裝中斷的包
  ```

  </TabItem>
</Tabs>

## 沙盒套件管理工具
簡單來說就是打包一系列的套件讓他在獨立的空間運作不受其他依賴干擾，包含 Snap 和 Flatpak。你可以把他想像成 Docker，或者是一個軟體用的虛擬機。

相關文章：

- [【心得】Linux 出專欄啦（11）：談flatpak 等安裝格式原理，ivonblog 完全抄襲（上）](https://forum.gamer.com.tw/C.php?bsn=60030&snA=630254)
- [Ubuntu Linux用Snap安裝軟體的優缺點](https://ivonblog.com/posts/linux-snap-pros-and-cons/)
- [Linux系統用Flatpak安裝軟體的優缺點](https://ivonblog.com/posts/linux-flatpak-pros-and-cons/)

題外話，`sudo apt install firefox` [這個笑話](https://www.reddit.com/r/linuxsucks/comments/1fh07ly/sudo_apt_install_firefox/)的由來是 Ubuntu [強制 firefox 變成 Snap 套件](https://askubuntu.com/questions/1399383/how-to-install-firefox-as-a-traditional-deb-package-without-snap-in-ubuntu-22)，然後一堆人在臭 Ubuntu。

## 延伸：curl？
用於從命令行進行網絡請求，初期你可以把他視作一個簡單的從網路下載單一檔案的工具。

使用方法：`curl -o <filename.txt> https://example.com/file.txt`， filename.txt 可寫可不寫，
- -o：下載並重新命名
- -O：下載檔案並使用原始名稱
- -I：顯示 HTTP 回應，用於網站測試

## 延伸：其他常見的 Linux 套件管理工具介紹
補充其他 Linux 發行版的套件管理工具，雖然 Ubuntu 用不到，但掃過一眼以後，未來再查 Linux 文章就不會對一堆陌生文字感到害怕。

<details>
  <summary>問 GPT: 幫我寫補充，介紹其他linux套件管理工具</summary>

在學習了 apt、apt-get 和 dpkg 的差異之後，了解其他 Linux 套件管理工具也非常有幫助，因為不同的 Linux 發行版使用不同的包管理系統。這一部分旨在幫助新手用戶理解這些工具存在的原因以及它們的使用情境。

1. RPM（Red Hat Package Manager）
   - 發行版：常見於 Red Hat、CentOS、Fedora 等發行版。
   - 包格式：使用 `.rpm` 格式。
   - 作用：類似於 dpkg，但專門用於 Red Hat 系列的 Linux 發行版。RPM 用來安裝、卸載和查詢軟件包，但不會自動解決依賴問題。
   - 命令示例：
     ```bash
     sudo rpm -i package.rpm   # 安裝
     sudo rpm -e package       # 移除
     sudo rpm -q package       # 查詢安裝的包
     ```
   - 解決的問題：早期缺乏標準化的方式來管理軟件包，RPM 提供了一個標準的包格式，方便發行版之間的軟件分發。

2. YUM（Yellowdog Updater, Modified）
   - 發行版：Red Hat、CentOS、Fedora。
   - 包格式：與 RPM 配合使用，處理 `.rpm` 包。
   - 作用：YUM 是 RPM 的高層管理工具，解決了 RPM 不處理依賴的問題。YUM 會自動處理包的安裝和依賴問題。
   - 命令示例：
     ```bash
     sudo yum install package   # 安裝
     sudo yum remove package    # 移除
     sudo yum update            # 更新系統
     ```
   - 解決的問題：RPM 無法自動處理依賴，YUM 引入了自動依賴管理，讓用戶更輕鬆地管理系統中的軟件。

3. DNF（Dandified YUM）
   - 發行版：Fedora、Red Hat、CentOS（較新版本）。
   - 包格式：繼續使用 `.rpm` 格式。
   - 作用：DNF 是 YUM 的下一代版本，旨在解決 YUM 在處理大量軟件包時的性能問題。它更快、更高效，並且解決了 YUM 的一些依賴問題。
   - 命令示例：
     ```bash
     sudo dnf install package   # 安裝
     sudo dnf remove package    # 移除
     sudo dnf update            # 更新系統
     ```
   - 解決的問題：YUM 在大型系統中運行效率低下，DNF 改進了性能，並提升了系統的穩定性。

4. Pacman（Package Manager）
   - 發行版：Arch Linux 及其衍生版（如 Manjaro）。
   - 包格式：使用 `.pkg.tar.xz` 格式。
   - 作用：Pacman 是 Arch Linux 的包管理工具，專為輕量且靈活的設計而生。它簡化了包管理操作，並能自動解決依賴問題。
   - 命令示例：
     ```bash
     sudo pacman -S package     # 安裝
     sudo pacman -R package     # 移除
     sudo pacman -Syu           # 同時更新軟件和系統
     ```
   - 解決的問題：在 Arch Linux 的極簡設計下，Pacman 提供了一個統一的包管理工具，讓用戶可以輕鬆管理系統中的所有包。

5. Zypper
   - 發行版：openSUSE 和 SUSE Linux Enterprise。
   - 包格式：使用 `.rpm` 格式。
   - 作用：Zypper 是 SUSE 系列發行版的包管理工具，它支持自動依賴管理，並且具備與 YUM 類似的功能，但更專注於 SUSE 的軟件包生態。
   - 命令示例：
     ```bash
     sudo zypper install package   # 安裝
     sudo zypper remove package    # 移除
     sudo zypper update            # 更新系統
     ```
   - 解決的問題：Zypper 旨在提供一個高效且穩定的包管理系統，專門針對 SUSE 的需求進行優化，特別是在企業環境中。


6. 小結

每個 Linux 發行版都有自己特有的包管理工具，這些工具是為了解決 Linux 生態中不同需求而設計的：
- **RPM** 和 **DPKG** 是最底層的包管理工具，主要負責處理本地安裝包。
- **YUM**、**DNF** 和 **APT** 則是高層次的包管理工具，解決了自動依賴管理的問題。
- **Pacman** 提供了一個簡單、快速的管理方式，特別適合 Arch Linux。
- **Snap** 和 **Flatpak** 則是沙盒化的包管理工具，解決了跨發行版的兼容問題，適合需要應用隔離的情境。

理解這些工具的作用和存在的原因，能幫助新手更好地選擇適合自己發行版和需求的包管理工具。
</details>