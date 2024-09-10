---
title: 遠端儲存庫設定
author: zsl0621
description: 最快速上手 Git 的文章沒有之一。
tags:
  - Git
  - Programming
keywords:
  - Git
  - Programming
last_update:
  date: 2024-09-10T06:07:33+08:00
  author: zsl0621
---

# Git 遠端儲存庫設定

介紹 Git 如何上傳到遠端儲存庫，常用的有 Github 和 Gitlab，這裡以 Github 為例。

## 設定 SSH

Github 已不支援帳號密碼登入，只能用 SSH 認證。  
1. [產生ssh金鑰](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)，官網教學寫的非常詳細。
2. (選用) 隱藏信箱Setting>Email勾選 "Block command line pushes that expose my email"，如要隱藏信箱，請到 `https://api.github.com/users/你的github名稱` 查看下面需要的 ID。
3. 設定名稱及信箱，如不需隱藏信箱則直接打自己的信箱
```sh
git config --global user.name "NAME"
git config --global user.email "{ID}+{username}@users.noreply.github.com"
```
4. 上傳 `git push -u origin main`
5. (選用) 新建的 git 連接既有的 github repo
```sh
git remote add origin git@github.com:your-username/your-repo.git
ssh -T git@github.com
git remote set-url origin git@github.com:ZhenShuo2021/ZhenShuo2021.github.io.git
```

## 設定 GPG 簽名
(選用) 請直接看 [利用 GPG 簽署 git commit](https://blog.puckwang.com/posts/2019/sign_git_commit_with_gpg/) 的教學。  
如果要隱藏信箱在 GPG 設定時需使用剛剛設定的 noreply 信箱。  
如果已經有 GPG key，可以用以下指令刪除：
```sh
git config --global --unset-all user.signingkey
```
