---
title: Github Actions 自動化 CI/CD
description: Github Actions 自動化 CI/CD
sidebar_label: Actions
tags:
  - Git
  - Github
  - Programming
keywords:
  - Git
  - Github
  - Programming
last_update:
  date: 2025-01-11T19:39:30+08:00
  author: zsl0621
first_publish:
  date: 2024-12-26T18:43:30+08:00
---

# Github Actions 自動化 CI/CD

網路上似乎沒有文章能簡潔的把 Github Actions 講清楚，所以把自己摸索的結果寫成文章。

Github Actions 是用於自動化操作的 CI/CD 平台，可以在上面自動執行單元測試、構建發布套件、執行 cron 任務等等，額度請參考[文檔](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions#included-storage-and-minutes)，簡單使用基本上用不完。

## 組成

這是一個基本的 Workflow 模版：

```yaml
name: workflow名稱，顯示於 repo 的 `Action` 標籤

on:  
  <label>:  # <-- 如 issues/push/tag/release
    types:  
      - edited
  workflow_dispatch:  # <-- 可以手動執行
    inputs:
      perform_deploy:
        description: "是否執行部署"
        required: false
        default: "false"

jobs:
  <my_first_job>:  # <-- 這是 job_id
    name: <job名稱>
    runs-on: <執行環境>
    environment: <環境名稱>
    strategy:
      matrix: <測試組合>
      fail-fast: <布林值>
      max-parallel: <數量>

    # 設定執行的步驟，uses 代表使用現成 actions，run 是 shell 指令
    steps:
      - name: <step名稱>
        uses: <action名稱>@<版本>
        env: <環境變數>
        with: <參數>

      - name: 執行 Shell 指令範例
        env: <環境變數>
        run: |  # <-- 使用管道符號分隔多個指令
          echo "Runs on OS: ${{ runner.os }}"
          echo "Runs with workflow_dispatch inputs: ${{ inputs.perform_deploy }}"
```

:::tip "重要文檔位置"

- [查看所有的 Workflow 語法](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)
- [觸發方式列表](https://docs.github.com/zh/actions/writing-workflows/choosing-when-your-workflow-runs/triggering-a-workflow)
  - [條件觸發](https://docs.github.com/zh/actions/writing-workflows/choosing-when-your-workflow-runs/using-conditions-to-control-job-execution)
  - 條件觸發可以搭配[上下文](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/accessing-contextual-information-about-workflow-runs#about-contexts)使用

:::

<details>

<summary>組成</summary>

https://docs.github.com/en/actions/about-github-actions/understanding-github-actions

Github Actions 由以下幾個項目組成：

1. Workflow: 放在 .github/workflows 裡面的 yaml 檔案，定義自動化流程，多個 workflow 為平行執行。
2. Events: 設定觸發條件。
3. Jobs: 設定具體任務，多個任務間平行執行。
4. Actions: 可重用的應用程式，例如設定 npm/Python 等等。
5. Runners: 設定跑在哪種平台上。

然而這五項不知道也沒差，這些東西沒人在乎。

</details>

## 常見參數

此段落列出每個 key 的常見參數，並且提供文檔位置。

- [on](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows): 設定觸發條件
  - push: 監聽推送，支援 `branches`、`tags`、`paths`、`paths-ignore`。
  - pull_request: 監聽 PR，支援 `branches`、`paths`、`paths-ignore`。
  - schedule: 定時執行。
  - workflow_dispatch: 手動執行，可設定[輸入選項](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#providing-inputs)。
  - repository_dispatch: 接收 Github 外部的 Webhook 事件。

:::tip 作為子 Workflow
除了使用 [Artifact](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/storing-and-sharing-data-from-a-workflow#about-workflow-artifacts) 功能把整個 Workflow 上傳到雲端以外，也可以使用 `workflow_call` 以支援[從其他 Workflow 呼叫](https://hackmd.io/@aVZgoIfKQLG3d1ETPYgBMw/rkU9tUdrA#Reusable-Workflows)。
:::

- [runs-on](https://docs.github.com/en/actions/using-github-hosted-runners/using-github-hosted-runners/about-github-hosted-runners#standard-github-hosted-runners-for-public-repositories) 設定在哪些平台上執行
- [environment](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/using-environments-for-deployment) 設定現在執行的環境，只能設定於 jobs 層級。使用此設定後必須在 settings/environment 建立對應環境名稱
- [strategy](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow) 主要用於設定矩陣組合
  - matrix: 定義測試組合，如 `{os: [ubuntu, windows], node: [14, 16]}`。  
  - fail-fast: bool，使用 `false` 可避免失敗就馬上退出的問題。
  - max-parallel: int，限制同時執行數量。

- [steps](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions#jobsjob_idsteps) 設定一連串的任務列表
  - `uses`: 呼叫 Action，如 `actions/checkout@v4`。  
  - `run`: 執行命令，如 `npm install`。  
  - `with`: 傳遞參數，格式 `{ key: value }`。  
  - `env`: 設定環境變數，格式 `{ ENV_NAME: value }`。  
  - `if`: 條件執行，如 `${{ success() }}`。  
  - `timeout-minutes`: 設定步驟超時時間（分鐘）。  
  - `continue-on-error`: 布林值，失敗時是否繼續。  
  - `working-directory`: 指定步驟執行目錄。

## 踩坑紀錄

因為官方文檔實在太長了應該沒多少人有耐心看完，所以這邊紀錄我自己踩過的坑讓讀者能快速解決問題。

### 自訂任務

如果想要進行某項直覺很常見的任務例如設定 Python/Docker，千萬不要自己寫而是找現成的 Actions 使用，如果找不到有八成可能是 Github 根本不支援。以安裝 chrome 為例，應該使用 [setup-chrome](https://github.com/browser-actions/setup-chrome) 而不是自己寫 curl 會遇到很多奇怪問題，而且使用現成 actions 會有很多附加功能可選。

使用最新版只需要指定大版本（例如 `actions/checkout@v4`）不需特別指定子版本號。

### 執行命令行

這不算坑而是寫到腦抽，如果使用 `${{ matrix.os }}` 設定多個作業系統，執行命令行記得使用 Windows 自己的指令，建議使用 powershell 可使用更現代的語法。

```yaml
    - name: Run command line
      if: runner.os == 'Windows'
      shell: pwsh
      run: |
        Invoke-WebRequest -Uri "https://itefix.net/download/free/cwrsync_6.3.1_x64_free.zip" -OutFile "rsync.zip"
        Expand-Archive -Path "rsync.zip" -DestinationPath "rsync"
        echo "${{ github.workspace }}\rsync\bin" | Out-File -FilePath $env:GITHUB_PATH -Encoding utf8 -Append
```

### 系統環境變數

這裡指的環境變數是作業系統的環境變數而不是 Github 的。

以 Windows 為例，上面執行 Invoke-WebRequest 其實會因為網路問題造成偶發失敗，簡單的解決方法是把整個 cwrsync 丟到 repo 中，並且把執行檔加入環境變數中

```powershell
echo "${{ github.workspace }}\.github\workflows\rsync\bin" | Out-File -FilePath $env:GITHUB_PATH -Encoding utf8 -Append
```

厚工一點可以弄成 [Artifact](https://docs.github.com/zh/actions/writing-workflows/choosing-what-your-workflow-does/storing-and-sharing-data-from-a-workflow)。

### Github 環境變數

需要保存敏感資料例如帳號密碼時可以使用 `Actions secrets and variables` 設定環境變數，兩者的差異是儲存時會不會加密。secrets 本身分為三種，優先順序是 Environment > Repository > Organization，第一次嘗試可以用 repository secrets，environment secrets 會限制使用範圍，需要在 workflow 中指定 environment 名稱才能存取該 secrets。

圖案教學請見[文檔](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions#creating-secrets-for-a-repository)，大致位置是在 repo 中的 Settings > 左側欄位 Secrets and variables > Actions。在 workflow 存取環境變數的語法是

```yaml
name: Access Environment Variables and Secrets

on:
  push:
    branches:
      - main

# 也可以把 env 放在這裡，作用範圍變成整個 workflow 而不是特定 step

jobs:
  access-env-and-secrets:
    # Optional: 如果使用 environment 必須在 settings 設定環境相同的環境名稱 production 才能調用
    # environment: "production"
    runs-on: ubuntu-latest
    steps:
      - name: Access Environment Variable
        env:
          # 存取 Repository variables/Secrets
          MY_ENV_VAR: ${{ vars.MY_ENV_VAR }}
          MY_SECRET: ${{ secrets.MY_SECRET }}
        run: |
          echo "MY_ENV_VAR: $MY_ENV_VAR"
          echo "MY_SECRET: $MY_SECRET"

      # 也可以設定環境變數
      - name: Set Environment Variable
        env:
          NEW_ENV_VAR: HelloWorld
        run: echo "Environment Variable: $NEW_ENV_VAR"
```

環境變數有[命名規範](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#naming-conventions-for-configuration-variables)和[使用限制](https://docs.github.com/zh/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#limits-for-configuration-variables)，主要是禁止太大的檔案還有以 `GITHUB_` 作為前綴的環境變數名稱。如果變數太長或是有奇怪編碼可以先壓縮、轉 base64 再上傳。

### 檢查檔案是否有變化

此方法用於檢查是否進行下一步，例如自動 commit。網路上有一些舊語法我找半天也找不到出處，研究結果是這兩種方式最好：

1. 使用現成 Actions [Has Changes](https://github.com/marketplace/actions/has-changes)
2. 使用 git 判斷，語法為

```sh
if [[ -n "$(git status --porcelain)" ]]; then
  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"
  git add .
  git ls-files | grep -i 'cookie' | xargs git reset  # 排除 cookie (不知為何 .gitignore 沒用)
  git commit -m "automated update blacklist" --no-verify
  git push
else
  echo "No changes to commit"
fi
```

--porcelain 是用於自動化流程的參數，使用 $(...) 取出變數後交由 -n 判斷是否有文字輸出再把結果丟給 if-else。

### 上下文

用於取得一個 action 的執行階段，例如取得字串確認前一步驟的執行結果。

詳見[官網](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/accessing-contextual-information-about-workflow-runs#matrix-context)，文檔很長。

### 輔助工具

1. 如果使用 vscode 建議安裝[官方插件](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions)輔助撰寫 Workflow，很方便。
2. [nektos/act](https://github.com/nektos/act) 可以在本地執行 Actions，用於在本地先偵錯 Workflow 語法設定/節省 Actions 使用流量。需要先安裝並且開啟 Docker，他不會自己打開需要手動啟動 Docker 應用程式。act [安裝方式](https://nektosact.com/installation/index.html)如下

```sh
# Windows 使用 winget/choco
winget install nektos.act
choco install act-cli

# Macos
brew install act
```

## 實際範例

第一次看保證不會設定，那不如照範例複製貼上對吧。

### 多系統自動執行 unittest

該腳本使用 rsync，所以設定包含安裝 rsync。

```yaml
name: Python Test
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-2019, windows-latest, macos-latest]
        python-version: ['3.10', '3.x']
    runs-on: ${{ matrix.os }}

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: ${{ matrix.python-version }}

    - name: Install dependencies (Linux/Mac)
      run: |
        python -m pip install --upgrade pip
        if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
      shell: bash

    - name: Install rsync (Windows)
      if: runner.os == 'Windows'
      shell: pwsh
      run: |
        echo "${{ github.workspace }}\.github\workflows\rsync\bin" | Out-File -FilePath $env:GITHUB_PATH -Encoding utf8 -Append

    - name: Install dependencies (Windows)
      if: runner.os == 'Windows'
      shell: pwsh
      run: |
        python -m pip install --upgrade pip
        if (Test-Path requirements.txt) { python -m pip install -r requirements.txt }

    - name: Run unit tests
      run: |
        python -m unittest discover -s tests -p "*.py"
```

### Docker 上執行 unittest

```yaml
name: Docker Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  docker-test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Build Docker image
      uses: docker/build-push-action@v6
      with:
        context: .
        push: false
        load: true
        tags: p5d:test

    - name: Create test directories
      run: |
        mkdir -p test_local_folder
        mkdir -p test_remote_folder

    - name: Run Docker container and execute tests
      run: |
        docker run --rm \
          -v ${{ github.workspace }}/test_local_folder:/mnt/local_folder \
          -v ${{ github.workspace }}/test_remote_folder:/mnt/remote_folder \
          --entrypoint python p5d:test -m unittest discover -s tests -p "*.py"

    - name: Clean up
      run: |
        rm -rf test_local_folder
        rm -rf test_remote_folder
```

### 發布到 PyPI

這個範例使用 uv 完成，你可以自行換成 Python + pip。

```yaml
name: PyPI Publish

on:
  push:
    tags:
      - 'v*.*.*.*'
      - 'v*.*.*'

jobs:
  publish:
    name: Build and Publish to PyPI
    environment: publish_pypi
    runs-on: ubuntu-latest

    permissions:
      id-token: write
      contents: read

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v5
        with:
          enable-cache: true
          cache-dependency-glob: uv.lock

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.x'

      - name: Build package
        run: uv build

      - name: Publish to PyPI
        uses: pypa/gh-action-pypi-publish@release/v1
        # for test.pypi
        # with:
        #   repository-url: https://test.pypi.org/legacy/
```

### 自動執行 cron 任務和提交

```yaml
name: update-blacklist

on:
  schedule:
    - cron: '0 0 * * 0'
  workflow_dispatch:

jobs:
  update-blacklist:
    runs-on: ubuntu-latest
    environment: update-blacklist
    permissions:
      contents: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v5
        with:
          enable-cache: true
          cache-dependency-glob: uv.lock
          python-version: 3.13

      - name: Run Python script
        env:
          COOKIES_BASE64: ${{ secrets.COOKIES_BASE64 }}
          BAHA_USERNAME: ${{ secrets.BAHA_USERNAME }}
        run: uv run -m baha_blacklist.actions

      - name: Commit and push changes
        run: |
          if [[ -n "$(git status --porcelain)" ]]; then
            git config user.name "github-actions[bot]"
            git config user.email "github-actions[bot]@users.noreply.github.com"
            git add .
            git ls-files | grep -i 'cookie' | xargs git reset  # 排除 cookie (不知為何 .gitignore 沒用)
            git commit -m "automated update blacklist" --no-verify
            git push
          else
            echo "No changes to commit"
          fi
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 使用 Hugo 建立 Github Pages

```yaml
name: GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-deploy:
    runs-on: ubuntu-20.04
    concurrency:
      group: ${{ github.workflow }}-${{ github.ref }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: true
          fetch-depth: 0

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: "0.139.3"
          extended: true

      - name: Build
        run: hugo --gc --minify

      - name: Setup Node LTS
        uses: actions/setup-node@v4
        with:
          node-version: 20.x

      - name: Install npm dependencies
        run: |
          npm install shiki @shikijs/rehype rehype-cli

      - name: Run rehype-cli
        run: |
          npx rehype-cli public -o --silent || true

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        if: ${{ github.ref == 'refs/heads/main' }}
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_branch: gh-pages
          publish_dir: ./public
          commit_message: ${{ github.event.head_commit.message }}
```
