---
title: 無預警斷線（原因排查中）
description: TrueNAS 無預警斷線，ping 主機也失敗
tags:
  - NAS
  - Linux
keywords:
  - Linux
last_update:
  date: 2024-09-19 GMT+8
  author: zsl0621
---

# TrueNAS 無預警斷線（原因排查中）
自組的 NAS 最近啟動時間久了之後會無預警斷線，ping 主機 IP 也無回應，這是初步的記錄，以後確定原因再寫成完整的文章。

## 排查
系統資訊
```sh
CPU: Intel(R) Core(TM) i5-7400 CPU @ 3.00GHz
Mem: 16GiB
TrueNAS Version: Dragonfish-24.04.0
開了一個 4G Ram 的 Ubuntu 虛擬機，裡面只開了六七個 Docker 容器，應該都在待機中
```

## Kernel Messages
使用 dmesg 查看開機資訊，沒什麼有用的資訊，或者下次斷線我要直接把螢幕鍵盤抱去 NAS 旁邊接著，好重好懶。

```sh
admin@leonas[~]$ sudo dmesg | tail
[sudo] password for admin: 
[   70.063211] veth0a3b6e03: entered promiscuous mode
[   70.063297] kube-bridge: port 4(veth0a3b6e03) entered blocking state
[   70.063313] kube-bridge: port 4(veth0a3b6e03) entered forwarding state
[   73.669016] br0: port 2(vnet0) entered forwarding state
[   73.669039] br0: topology change detected, propagating
[ 1172.368039] loop0: detected capacity change from 0 to 2579376
[ 1172.372854] squashfs: version 4.0 (2009/01/31) Phillip Lougher
[ 1172.624623] loop0: detected capacity change from 0 to 2579376
[ 1213.862373] loop0: detected capacity change from 0 to 2579376
[ 1214.057539] loop0: detected capacity change from 0 to 2579376
```

## 系統日誌
查看 /var/log/messages 的系統日誌，這裡的資訊稍微有用一點

```sh {3}
admin@leonas[~]$ sudo vim /var/log/messages
# Purging GPU memory 連續出現後才出現 perf 中斷
Sep 18 18:18:48 leonas kernel: Purging GPU memory, 0 pages freed, 0 pages still pinned, 1 pages left available.
Sep 18 18:33:10 leonas kernel: perf: interrupt took too long (2501 > 2500), lowering kernel.perf_event_max_sample_rate to 79750
Sep 18 22:32:48 leonas kernel: perf: interrupt took too long (3171 > 3126), lowering kernel.perf_event_max_sample_rate to 63000
Sep 19 00:00:01 leonas syslog-ng[2257]: Reliable disk-buffer state loaded; filename='/audit/syslog-ng-00000.rqf', number_of_messages='0'
Sep 19 00:00:01 leonas syslog-ng[2257]: Reliable disk-buffer state loaded; filename='/audit/syslog-ng-00001.rqf', number_of_messages='0'
Sep 19 00:00:01 leonas syslog-ng[2257]: Configuration reload request received, reloading configuration;
Sep 19 00:00:01 leonas syslog-ng[2257]: Configuration reload finished;
# 手動重啟 NAS
Sep 19 02:19:21 leonas syslog-ng[2290]: syslog-ng starting up; version='3.38.'1
```

總結一下日誌內容：

1. Purging GPU memory 連續出現約五十次才出現 perf 中斷
2. 十二點時日誌系統還可正常重載
3. 只能大致鎖定十二點到兩點間不知道發生什麼事

Google 搜尋 Purging GPU memory 的結果只有少的可憐的 20 筆，但主機無顯卡，看到一篇 Proxmox 系統也出現過一樣的問題，所以之後應該先朝向虛擬機 OOM 的方向排查，並且設定 ZFS 記憶體 `zfs_arc_max`。

話說當初 MATLAB Satellite ToolBox 剛出的時候資訊也少的可憐都不知道有沒有破百筆，為啥我老是要解決這種沒人遇過的問題。