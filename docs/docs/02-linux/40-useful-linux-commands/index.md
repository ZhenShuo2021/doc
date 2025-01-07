---
title: 常用 Linux 指令
description: 常用的 Linux 指令小抄
tags:
  - Linux
  - Docker
  - Cheatsheet
keywords:
  - Linux
last_update:
  date: 2024-05-30T00:00:00+08:00
  author: zsl0621
first_publish:
  date: 2024-05-30T00:00:00+08:00
---

# 常用 Linux 指令
常用的 Linux 指令小抄

## 文件移動
```sh
mv source/ dest/        # 搬移整個資料夾
cp -rfp source/ dest/   # 複製並保留文件屬性
# r: 包含子目錄
# f: 強制複製
# p: 保留原始文件屬性
cp source/* dest        # 只搬資料夾內檔案
```

## 縮寫指令✨
如果要把 `hugo new content` 縮寫成 `hnc`
```sh
echo "alias hnc='hugo new content'" >> ~/.bashrc
source ~/.bashrc
```
macOS 則是改為 zshrc。

## 設定系統可執行文件搜尋路徑
假設要把下載的可執行文件加到系統路徑中

```sh
export PATH="$PATH:/directory/to/bin/path"
```


## 檢視硬碟容量
```sh
du /home -h | sort -nr | tail
df -h
sudo ncdu -x /path                 # ncdu 好用「非常多」
```

## 檢視記憶體佔用
列出前十大記憶體使用
```sh
ps aux --sort=-%mem | head -n 10
```

## 開機自動執行
這裡用docker-compose示範，五步驟分別是建立.service檔、reload .service、啟用、開始、查看狀態。參考資料[^1]。

```sh
sudo nano /etc/systemd/system/stirling-pdf.service
# 建立完成再執行以下指令
sudo systemctl daemon-reload
sudo systemctl enable stirling-pdf.service
sudo systemctl start stirling-pdf.service
sudo systemctl status stirling-pdf.service
```

其中.service指令為：
```toml
[Unit]
Description=Docker Compose app
Requires=docker.service
After=docker.service

[Service]
Type=simple
Restart=always
RestartSec=3
StartLimitInterval=1200
StartLimitBurst=10
TimeoutStartSec=1200
WorkingDirectory=/home/yourname/yourapp
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down

[Install]
WantedBy=multi-user.target
```

開機自動化也可以使用以下方式：
```sh
# nano /etc/rc.local
mount /path/mount
exit 0
```
設定開機自動掛載smb。


## SMB 掛載

在 `etc/fstab` 最下方新增：
```
# 格式
<IP>/<遠端資料夾> <掛載本地資料夾> cifs credentials=<證書路徑>,_netdev,x-systemd.automount,file_mode=0777,dir_mode=0777 0 0
# 範例
//192.168.50.98/immich/external-lib /home/leo/photo cifs credentials=/home/leo/.cifs,_netdev 0 0
# _netdev: 強制系統辨識成網路硬碟
# x-systemd.automount: 自動掛載
# file_mode/dir_mode: 文件權限
# 0 0: dump備份和fsck檢查
```
逗號後面可選但[兩個零](https://rain.tips/2024/02/06/%E5%AF%A6%E6%88%B0%E6%95%99%E5%AD%B8%EF%BC%9A%E5%AF%A6%E7%8F%BEubuntu%E7%92%B0%E5%A2%83%E4%B8%AD%E9%AB%98%E6%95%88%E7%9A%84%E7%A1%AC%E7%A2%9F%E5%85%B1%E4%BA%AB/)還是要保留。證書格式為：
```
username=遠端SMB帳戶
password=密碼
```

## SSH 金鑰登入

```shell
# 生成密鑰，接著會要你輸入密碼，如果不需要可以直接enter
ssh-keygen -t ed25519 -f ~/.ssh/{file_name}

# 修改設定檔，貼上以下區塊
vim ~/.ssh/config
# =================
Host {alias name}
  HostName {server IP}
  User {user name}
  IdentityFile ~/.ssh/{file_name}
# =================

# 上傳公鑰到伺服器
ssh-copy-id {user name}@{server IP}

# 連線
ssh {alias name}
```

- -t: algorithm
- -f: file


## 列出系統時間
```shell
date
timedatectl
hwclock
cal -H
uptime
who -b
```