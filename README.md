由 [ouch1978.github.io](https://github.com/Ouch1978/ouch1978.github.io) 修改而成，基礎使用方式請見[作者網站](https://ouch1978.github.io/)。

## 使用

Clone 後把所有和個人訊息改成你自己的，在原作者的網站有說設定了哪些東西，例如 git repo name, baseurl, Giscus, algolia...

1. 安裝: yarn install
2. 啟用: yarn start
3. 建立首頁文章列表: yarn start 後使用 yarn new，如果時間沒有正確顯示需要刪除 .docusaurus 資料夾刷新

## 部屬到 Cloudflare Pages 方式

1. 進入設定頁面
   1. 登入 Cloudflare
   2. 點選左側 Workers and Pages
   3. 選擇建立
   4. 選擇 Pages
2. 設定部署網站
   1. 選擇儲存庫
   2. Framework Docusaurus
   3. 組建命令 `yarn build`
   4. 組建輸出目錄 `build`
   5. 環境變數 `YARN_VERSION=1.22.22` 選擇和本地一樣的版本
3. （可選）設定 custom domain，正常設定約兩分鐘內完成部屬

## 插入影片

使用 [react-player](https://github.com/cookpete/react-player) 完成，支援的影片來源和他一樣，或者放在 /static 資料夾中的影片，其 url 不需包含 static。

```md
import ResponsivePlayer from '@site/src/components/ResponsivePlayer';

<ResponsivePlayer url="https://www.youtube.com/watch?v=<VIDEO_ID>" />
<ResponsivePlayer url="https://www.facebook.com/facebook/videos/<VIDEO_ID>/" />
<ResponsivePlayer url="/video/<FILE_NAME>" />
```
