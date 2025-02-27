---
title: 修復 NextCloud X-OC-Mtime 錯誤
description: 修復 NextCloud X-OC-Mtime 錯誤
sidebar_label: 修復 NextCloud X-OC-Mtime
tags:
  - NAS
  - NextCloud
  - X-OC-Mtime
keywords:
  - NAS
  - NextCloud
  - X-OC-Mtime
last_update:
  date: 2025-02-27T16:34:00+08:00
  author: zsl0621
first_publish:
  date: 2025-02-27T16:34:00+08:00
---

注意筆者完全不懂 php 所以修復方式是問 AI 的，這個問題的 Github issue 已經好幾年，官方看起來根本沒有要修也沒人說怎麼解決，所以只好直接問 AI，本文完成於 2025/02。

## TL;DR

1. 找到你的 config 目錄位置，假設使用 docker-compose 安裝設定如下，那就是找到 `/home/leo/docker/nextcloud/config`

```yaml
volumes:
  - /home/leo/docker/nextcloud/config:/config
  - /home/leo/docker/nextcloud/data:/data
```

2. 從這個路徑開始找 `www/nextcloud/apps/dav/lib/Connector/Sabre/MtimeSanitizer.php`，也就是整個路徑會變成 `/home/leo/docker/nextcloud/config/www/nextcloud/apps/dav/lib/Connector/Sabre/MtimeSanitizer.php`
3. 應該會看到像這樣的文件

```php reference title="MtimeSanitizer.php"
https://github.com/nextcloud/server/blob/9d4b9440986afddc28dad99c7987f9c31513ae9f/apps/dav/lib/Connector/Sabre/MtimeSanitizer.php
```

4. 改成以下版本

```php
<?php
/**
 * SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 */
namespace OCA\DAV\Connector\Sabre;

class MtimeSanitizer {
        public static function sanitizeMtime($mtimeFromRequest = null): int {
                if ($mtimeFromRequest === null || !is_numeric($mtimeFromRequest) || preg_match('/^\s*0[xX]/', $mtimeFromRequest) || (int)$mtimeFromRequest <= 24 * 60 * 60) {
                        $alternativeTime = self::getAlternativeTime();
                        return $alternativeTime ?? time();
                }
                return (int)$mtimeFromRequest;
        }

        private static function getAlternativeTime(): ?int {
                foreach (['HTTP_X_LAST_MODIFIED', 'HTTP_LAST_MODIFIED', 'HTTP_IF_MODIFIED_SINCE'] as $header) {
                        if (isset($_SERVER[$header])) {
                                $timestamp = is_numeric($_SERVER[$header]) ? (int)$_SERVER[$header] : strtotime($_SERVER[$header]);
                                if ($timestamp !== false) {
                                        return $timestamp;
                                }
                        }
                }
                return null;
        }
}
```

## 說明

根本不懂 php 全問 AI 的，AI 解釋原始程式用途是檢查 X-OC-MTime 這個 header 是否合規：

1. 接收一個從 HTTP 請求中提取的 X-OC-MTime 頭部的字符串值
2. 檢查這個值是否為十六進制格式（如果是，則拒絕）
3. 檢查這個值是否為有效的數字格式
4. 檢查這個值是否大於一天的秒數（24 * 60 * 60 = 86400）
5. 如果所有檢查都通過，則將其轉換為整數並返回

問題是我怎麼上傳都報錯，即使用網頁版上傳也一樣，於是直接放寬檢查條件，叫 AI 改成如果找不到 X-OC-MTime header 則使用其他資訊替代，所以修改後的規則變成

1. `sanitizeMtime` 方法接收一個可選的 `$mtimeFromRequest` 參數，如果不提供則為 null。

2. 驗證條件變為一個綜合條件（使用 OR 邏輯）：
   - 如果 `$mtimeFromRequest` 為 null
   - 或不是數字格式
   - 或是十六進制格式
   - 或值小於等於一天的秒數

3. 當任何驗證失敗時，不再拋出異常，而是：
   - 嘗試通過 `getAlternativeTime()` 方法獲取替代時間
   - 如果替代時間也無法獲取，則使用當前時間 `time()`

4. `getAlternativeTime()` 方法會依次嘗試從以下 HTTP 頭獲取時間：
   - HTTP_X_LAST_MODIFIED
   - HTTP_LAST_MODIFIED
   - HTTP_IF_MODIFIED_SINCE

5. 對於這些頭部值，會檢查是否為數字（直接轉換為整數）或嘗試用 `strtotime()` 解析日期時間字符串。

改完之後上傳檔案就不會再報錯了。

## 同場加映：NextCloud 安裝

網路一堆雜七雜八的安裝方式每一個都有夠難用，最後找到最方便的還得是咕咕鴿，他有兩篇文章，分別是

- 舊的 [【好玩儿的Docker项目】可能是目前全网最完整的Docker搭建Nextcloud教程（包含安全与设置警告报错信息的解决方法）](https://blog.laoda.de/archives/docker-compose-install-nextcloud) 
- 新的 [【好玩儿的Docker项目】Nextcloud All-in-One 全新搭建分享，拒绝繁琐配置，开箱即用！维护简单！](https://blog.laoda.de/archives/docker-compose-install-nextcloud-aio)

由於我只需要一個簡單的雲端硬碟所以選擇舊版安裝方式。

舊版的安裝方式文章又分成新舊兩種 docker-compose.yml，選擇新版（設定兩個 volumes 的那個），這裡要小心他的「安全与设置警告解决方法」所有的路徑都是舊版路徑，以我遇到的「不被信任的域名访问」這個問題來說，最後我找到的 config.php 在這裡

```sh
~/docker/nextcloud/config/www/nextcloud/config/config.php
```

跟原文的路徑完全不同有夠難找，所以這是一個備忘錄以免我自己忘了。

<details>

<summary>備份 docker-compose.yml</summary>

避免哪天他網站掛了所以備份在這裡，完整搭建請看[咕咕鴿的網站](https://blog.laoda.de/archives/docker-compose-install-nextcloud)

```yaml
services:
  nextcloud:
    image: lscr.io/linuxserver/nextcloud:latest
    container_name: nextcloud
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
      - MYSQL_HOST=mysql
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=nextcloud
    volumes:
      - /home/leo/docker/nextcloud/config:/config
      - /home/leo/docker/nextcloud/data:/data
    ports:
      - 4433:443
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    container_name: nextcloud-db
    restart: unless-stopped
    environment:
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=nextcloud
      - MYSQL_ROOT_PASSWORD=nextcloud
    volumes:
      - /root/data/docker_data/nextcloud/db:/var/lib/mysql
```

</details>
