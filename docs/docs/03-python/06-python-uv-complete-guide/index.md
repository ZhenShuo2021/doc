---
title: UV Python 教學，最佳虛擬環境管理工具
description: UV Python 教學，最佳虛擬環境管理工具
sidebar_label: UV 虛擬環境管理套件教學
tags:
  - Programming
  - Python
  - 虛擬環境
keywords:
  - Programming
  - Python
  - 虛擬環境
last_update:
  date: 2024-12-24T21:53:30+08:00
  author: zsl0621
first_publish:
  date: 2024-11-19T14:22:30+08:00
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# UV 教學，最佳 Python 虛擬環境管理工具

本篇文章介紹 **[uv](https://github.com/astral-sh/uv)** 的日常操作指令，從安裝到發布套件都包含在內，還有抄作業環節，直接複製貼上就能用，適合沒寫過 pyproject.toml 的人快速上手。如果不清楚自己是否該選擇 uv 請看[上一篇文章](/docs/python/virtual-environment-management-comparison)。

## 簡介

以一句話形容 uv，那就是完整且高效的一站式體驗。uv 是 2024/2 才首發的新工具，簡單摘要幾個特點：

1. 由 rust 撰寫，標榜快速，比 Poetry 快十倍以上
2. 使用 PubGrub 演算法[解析套件依賴關係](https://docs.astral.sh/uv/reference/resolver-internals/)
3. **<u>取代 pyenv</u>**：支援 Python 版本管理[^global]
4. **<u>完美取代 pip/pip-tools</u>**：支援 lockfile 鎖定套件版本
5. **<u>完美取代 pipx</u>**：支援全域套件安裝
6. 發展快速，發布不到一年已經有 26k 星星

把特點 2\~4 加起來就是我們的最終目標了，有更好的套件解析演算法，不只支援 lockfile 管理套件，也支援 Python 版本管理，還沒有 pipenv 速度緩慢且更新停滯的問題，是目前虛擬環境管理工具的首選，和原本的首選 Poetry 互相比較，uv 內建的 Python 版本管理非常方便，不再需要 pyenv 多記一套指令；本體雖然不支援建構套件，但是設定完 build-system 使用 `uv build` 和 `uv publish` 一樣可以方便的構建和發布；支援安裝全域套件，完美取代 pipx 管理全域套件；做了 pip 的接口方便用戶輕鬆上手，除此之外還有最重要的 `uv run` 功能提供了[非常優秀的開發便利性](#uv-run)，再加上[超快的安裝和解析速度](https://astral.sh/blog/uv-unified-python-packaging)錦上添花，筆者認為目前虛擬環境管理工具首選就是他了。

為何選擇 uv？我會說：「一個工具完整取代 pyenv/pipx，幾乎包含 Poetry 的所有功能，速度又快」，這麼多優點是我可以一次擁有的嗎，太夢幻了吧。

身為新穎又備受矚目的套件，目前的更新速度非常快，[兩個月就把問題解決了](https://www.loopwerk.io/articles/2024/python-uv-revisited/)。

> 更新：發展不只是快而是超快，才一個禮拜過去他又多了一千個星星，筆者文章都還沒校完稿，放上圖片讓大家看到底有多粗暴，有人直接飛天了

> 再度更新：2024/12/12 星星數成功超越 Poetry，確實能說是最受歡迎的管理套件了

![Star History Chart](https://api.star-history.com/svg?repos=python-poetry/poetry,astral-sh/uv,pypa/pipenv,pypa/hatch,pdm-project/pdm,conda/conda,pyenv/pyenv-virtualenv&type=Date)

<br/>
<br/>

[^global]: 只剩下等效於 `pyenv global` 的設定全局 Python 功能~~還不支援但[已經在規劃中](https://github.com/astral-sh/uv/issues/6265)~~已經放進 [preview 版本](https://github.com/astral-sh/uv/releases/tag/0.5.6)中，加上 `--preview --default` 參數即可使用，目前實測還很早期，連 venv 都不能跑。

## TL;DR

如果沒有要發布套件也沒有複雜的開發管理，只使用日常七騎士就可以使用 uv 完美取代舊有工具，不用看完整篇文章。

使用這七個指令即使不懂 pyproject.toml 也可輕鬆使用 uv，他會變成一個簡單、方便又超快的 venv + pip + pyenv 全能工具。

```sh
# 初始化工作區
uv init --python 3.10

# 新增套件
# 首次執行 uv add 時會自動執行 uv venv 以建立虛擬環境
# uv venv 則會根據工作區設定自動下載 Python
uv add <pkg>

# 移除套件
uv remove <pkg>

# 檢查套件
uv pip list

# 更新指定套件或全部套件
uv sync -P <pkg>
uv sync -U

# 根據 uv.lock 同步虛擬環境的套件
uv sync

# 執行程式
uv run hello.py
```

<details>
<summary>pip 的接口</summary>

uv add/remove 會寫入到 pyproject.toml，如果無論如何也不想使用 pyproject.toml，`uv pip` 提供了對應以往 pip 的接口，但是既然都用 uv 了應該用 add/remove 方式比較好，而且文章列出的所有功能都無法兼容這種方法安裝的套件，所以把這段放到折疊頁面中。

```sh
# 安裝
uv pip install

# 從文件安裝
uv pip install -r requirements.txt

# 移除
uv pip uninstall

# 寫出版本資訊
uv pip freeze > requirements.txt

# 更新全部版本@Unix
uv pip freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 uv pip install -U
```

:::danger
注意：<u>uv pip 不使用 pip，只是呼叫方式類似的 API 接口</u>！
:::

</details>

## 前置作業

### 安裝 uv

https://docs.astral.sh/uv/getting-started/installation/

使用以下指令進行獨立安裝程式，其餘安裝方式請自行閱讀文檔。

```bash
# Unix
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 設定 Python 版本

https://docs.astral.sh/uv/concepts/python-versions/  
https://docs.astral.sh/uv/guides/install-python/  

首先從 Python 版本管理開始說明。

``` sh
# 安裝/移除指定版本
uv python install 3.12
un python uninstall 3.12

# 列出基本版本
uv python list

# 列出所有版本
uv python list --all-versions

# 只列出安裝版本
uv python list --only-installed

# 找到執行檔路徑
uv python find
```

### 初始化專案

https://docs.astral.sh/uv/concepts/projects/init/

設定好 Python 版本後就是初始化專案，使用 `app` 參數設定專案名稱，使用 `build-backend` 參數設定專案的構建後端，也可以不輸入任何參數使用預設值初始化專案[^init]。

```sh
uv init --app test --build-backend hatch --python 3.12
```

[^init]: 其實還有 `--package`/`--lib` 選項可以建立預設專案架構，看是套件還是函式庫，不過會用到的人都有能力獨立閱讀文檔了。另外，如果你的專案需要使用 rust/C/C++ 等外部函式庫，請參照[官方文檔](https://docs.astral.sh/uv/concepts/projects/init/#projects-with-extension-modules)說明。

### 建立虛擬環境

https://docs.astral.sh/uv/pip/environments/

接下來是建立虛擬環境，名稱和 Python 版本都是可選參數非必要。

```sh
uv venv <name> <--python 3.11>
source .venv/bin/activate
```

## 套件管理

套件管理和日常開發、執行腳本、設定 pyproject.toml 都在這個章節中。

### 生產套件管理

https://docs.astral.sh/uv/concepts/projects/dependencies/

此處是有關套件處理相關的常用指令，熟記這些指令之後就可以替換掉 pyenv/poetry/pipx 了。

```sh
# 安裝套件並且設定到 pyproject.toml 中
uv add

# 移除套件並且從 pyproject.toml 的設定中移除
uv remove

# 列出所有已經安裝的套件
uv pip list

# 更新 uv.lock，使用uv add時該檔案不會自動更新
# 此檔案是詳細的套件版本鎖定檔案，用於提供可復現的運行環境
# 加上-U可以允許原有的套件更新
uv lock

# 基於 uv.lock 對目前環境中的套件進行同步，包含開發者套件
uv sync

# 同步但忽略開發者套件
uv sync --no-dev

# 同步虛擬環境，並且在虛擬環境中執行指令
uv run <commands>

# 移除所有套件（只移除環境中的套件不會移除 toml 中的套件）
uv pip freeze > u && uv pip uninstall -r u && rm u

# 升級指定套件或全部升級
uv sync -P <package>
uv sync -U

# 重新驗證套件快取，--fresh 在任何指令下都可使用
uv sync --refresh
```

### 開發套件管理

https://docs.astral.sh/uv/concepts/projects/dependencies/#development-dependencies

設定開發套件，此區域的套件不會被構建和發布，使用 `--dev <pkg>` 新增，還可以用 `--group` 幫開發套件設定套件群組方便管理。比如說我們需要 pytest 進行單元測試，只需要使用 `uv add --dev pytest` 把 pytest 新增到 dev 群組中而不會影響生產套件。下方的範例我們新增了 pytest 作為 dev 群組，以及 ruff 作為 lint 的群組。

```toml
# 把 pytest 套件新增到 dev 群組，等同於 uv add --group dev pytest
uv add --dev pytest

# 再把 ruff 套件新增到 lint 群組
uv add --group lint ruff

# toml 對應的更新
[dependency-groups]
dev = ["pytest"]
lint = ["ruff"]
```

### 可選套件管理

https://docs.astral.sh/uv/concepts/projects/dependencies/#optional-dependencies

幫專案增加可選組件（可選組件：舉例來說，像是 httpx 的 http2 功能是可選，安裝 httpx 時不會主動安裝 http2 功能）。

```toml
# 在命令行中使用這個指令，新增可選套件 matplotlib 到 plot 群組
uv add matplotlib --optional plot

# toml 中的對應的更新
[project.optional-dependencies]
plot = ["matplotlib>=3.6.3"]
```

### 重設環境中所有套件

https://docs.astral.sh/uv/pip/compile/#syncing-an-environment

把套件版本同步到生產版本。

```sh
# 同步txt
uv pip sync requirements.txt

# 同步toml
uv pip sync pyproject.toml

# 或者更乾淨重新安裝，這個指令會刷新快取
uv sync --reinstall --no-dev

# 直接清除快取檔案
uv clean
```

### 使用 uv add 和 uv pip 安裝套件的差異

https://docs.astral.sh/uv/configuration/files/#configuring-the-pip-interface

`uv add` 用於正式專案套件，和 `uv remove` 成對使用，會修改 pyproject.toml；`uv pip` 則是臨時測試，不會寫入 pyproject.toml。

## 日常開發：強大的 uv run 功能{#uv-run}

https://docs.astral.sh/uv/guides/scripts/
https://docs.astral.sh/uv/reference/cli/#uv-run

經過上面的設定我們知道 uv 可以設定開發套件和開發群組，結合這些功能可以讓日常的開發輕鬆許多，這些輕鬆主要體現在 `uv run` 指令之上。有了 `uv run` 之後我們連虛擬環境都不用進入就可以直接執行腳本，但是他真正的特色是支援靈活的版本和依賴切換，例如我們可以

1. 使用 `--with <pkg>` 臨時測試某些套件而不需安裝
2. 使用 `--group` `--only-group` `--all-groups` `--no-group` 設定執行時包括哪些開發群組的套件
3. 使用 `--extra` `--all-extras` `--no-extra` 指定包括哪些可選套件
4. 使用 `--with-requirements` 指定包括 txt 文件的套件執行
5. 使用 `--find-links` 可以直接包括來自 .whl/tar.gz/.zip/URL 的套件
6. 使用 `--python` 允許我們指定使用不同的 Python 版本執行
7. 使用 `--isolated` 在臨時的隔離空間獨立運行
8. 使用 `--no-sync` 可以關閉運行前的同步功能  
9. 使用 `--no-dev` 忽略開發套件運行
10. 使用參數包含網址時會臨時下載並且被視為腳本執行

光看這些選項可能沒什麼感覺，我們稍微討論一下在實際開發中這些選項提供了多大的方便性。想像需要臨時測試一個套件的情境，以前要先 pip install 安裝，然後執行腳本，事後還要從環境中移除，但是現在這三個步驟直接被濃縮成一個 `--with <pkg>` 了，類似的情境也發生在想要搭配可選套件進行測試，現在只要使用 `--extra` 選項就可以自動包含該群組的套件，甚至使用 `--find-links` 連安裝包都可以使用；或者是臨時想要在一個乾淨的環境執行，現在只需要 `--isolated` 就取代掉以前需要三四步指令才能完成的設定；`--python` 選項乍看之下是提供測試不同 Python 版本使用，但是我們可以把他當作 pyenv 來用，使用 `uv run --python 3.12 python -m venv .venv` 叫 3.12 版本的 Python 來建立虛擬環境[^pyenv]，等效於 pyenv-virtualenv 的功能，非常方便。

以往這些指令都要在不同的套件搭配各自的參數完成，現在只需要放在一個列表就可以涵蓋數個不同開發場景的指令組合，提供非常強大的開發便利性，經過一段時間的使用後我認為 `uv run` 這個功能相較於速度這個特色才是他最吸引人的地方。

附帶一提這些參數大多數也都適用於 uv sync 等指令。

[^pyenv]: 使用 `uv venv --python 3.12` 是透過 uv 建立虛擬環境，無法在虛擬環境中使用 `pip`。

### 結合 Jupyter

https://docs.astral.sh/uv/guides/integration/jupyter/

筆者患有 Jupyter 設定障礙，每次設定都覺得異常痛苦所以很少用他，但是 uv 已經整合好了完全沒有這個問題，不用再去網路上看過時的教學除錯，只需要一句 `uv run --with jupyter jupyter lab` 就完成，官方文檔中有更詳細的教學說明。

### 設定預設群組

使用 `uv sync` 和 `uv run` 時預設會同步生產套件和 dev 套件，修改 pyproject.toml 中的 default-groups 則可以設定同步的目標。如果臨時不想包含這些套件可以使用 `--no-group` 參數。

```toml
# 設定 uv sync 同步時除了 dev 也同步 foo 群組
[tool.uv]
default-groups = ["dev", "foo"]
```

## 🔥 pyproject.toml 範例 🔥

既然 uv 的一站式體驗這麼好，那本文也提供一站式體驗，連 `pyproject.toml` 基礎範例都放上來提供參考，複製貼上後只需要使用 `uv sync` 就完成了，超級快。

```toml
# 假如拿到一個使用 uv 設定的專案架構如下
[project]
name = "your-project-name"  # 必填
version = "0.1.0"  # 必填
description = "project description"
authors = [{ name = "your-name", email = "your-email@example.com" }]
maintainers = [{name = "your-name", email = "your-email@example.com"}]
urls.repository = "your-repo-url"
urls.homepage = "your-project-site"
license = {text = "MIT License"}  # 也可以用檔案 license = { file = "LICENSE" }
readme = "README.md"
# 發布到 PyPI 的關鍵字和搜尋分類，可選
keywords = [
    "xxx",
    "xxx-toolkit",
]
classifiers = [
    "Topic :: Multimedia",
    "Development Status :: 4 - Beta",
    "Environment :: Console",
    "Programming Language :: Python",
    "Programming Language :: Python :: 3 :: Only",
    "Programming Language :: Python :: 3.13",
    "Programming Language :: Python :: Implementation",
    "Programming Language :: Python :: Implementation :: CPython",
    "License :: OSI Approved :: MIT License",
]

# 宣告依賴關係
requires-python = ">=3.10"
dependencies = ["beautifulsoup4>=4.12.3", "requests>=2.32.3"]

# 開發群組
[dependency-groups]
dev = [
    "mypy>=1.13.0",
    "ruff>=0.7.1",
    "pre-commit>=4.0.0",
    "pytest>=8.3.3",
    "isort>=5.13.2",
]

# 可選群組
[project.optional-dependencies]
network = [
    "httpx[http2]>=0.27.2",
]

# 如果需要打包套件就使用這些
# [build-system]
# requires = ["hatchling"]
# build-backend = "hatchling.build"

# [tool.hatch.build.targets.wheel]
# packages = ["src/foo"]   # 佔位符

# 幫 cli 套件設定入口點
# https://docs.astral.sh/uv/concepts/projects/config/#entry-points
# [project.scripts]
# hello = "my_package:main_function"
```

假設我們要處理一個新專案，這個專案使用 uv 設定 pyproject.toml，我們只要一行就可以完成 Python 版本下載和設定 + 虛擬環境建立 + 套件安裝：

```sh
# 一行完成下載和設定 Python、建立虛擬環境、安裝套件、建立uv.lock
uv sync

# 檢查
uv pip list

# 甚至可以連安裝都不要，clone 專案下來直接跑也會自動安裝
uv run <任意檔案>
```

但是如果專案使用 Poetry，我們會需要使用 pyenv + Poetry 組合，需要使用如下方所示這麼繁瑣的指令才能完成一樣的任務，而且 Poetry 的 "etry" 有夠難打每次敲快一點就打錯。

```sh
# 下載和設定版本
pyenv install 3.11.5
pyenv local 3.11.5

# 確認 Python 版本
python --version
poetry config virtualenvs.in-project true
poetry env use python3.11.5
# 或者使用 poetry env use $(pyenv which python)

# 安裝套件，啟動虛擬環境並且檢查
poetry install
poetry shell
poetry show
```

## 🔥 Github Workflow 範例 🔥

作業要抄就要抄的徹底，這是包含多作業系統 + 多 Python 版本的 Github Workflow 檔案，用於在 push/pull requests 時自動執行 pytest，實際測試過沒問題，也是複製貼上就能用：

```yaml
name: Test
on: [push, pull_request]
permissions:
  contents: read

env:
  DAY_STATUS: "GOOD"

jobs:
  tests:
    name: Quick Test
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        python-version: ['3.10', '3.13']  # uv 看不懂 3.x 代表最新版所以要手動更新

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      # 或是使用原本的 setup-python，接受 3.x 語法
      # - name: Set up Python
      #   uses: actions/setup-python@v4
      #   with:
      #     python-version: ${{ matrix.python-version }}

      - name: Install uv
        uses: astral-sh/setup-uv@v4
        with:
          enable-cache: true
          cache-dependency-glob: uv.lock
          python-version: ${{ matrix.python-version }}

      - name: Test with python ${{ matrix.python-version }} on ${{ matrix.os }}
        run: uv run --frozen pytest

      - name: Environment variable example
        if: runner.os == 'Linux' || runner.os == 'macOS'
        run: uv run echo Today is a $DAY_STATUS day
```

## 發布套件

### 編譯 requirements.txt

https://docs.astral.sh/uv/concepts/projects/sync/#exporting-the-lockfile  

```sh
uv export --no-emit-project --locked -q -o requirements.txt --no-hashes
```

每次都要手動打太麻煩，使用 pre-commit 一勞永逸，自動檢查和匯出套件解析結果，pre-commit 的使用範例可以參考筆者寫的[文章](/memo/python/first-attempt-python-workflow-automation#pre-commit-configyaml)。

```yaml
# .pre-commit-config.yaml

repos:
  - repo: local
    hooks:
    - id: run-pip-compile
      name: Run pip compile
      # 前三個參數分別是不使用editable，不輸出套件雜湊值，檢查lockfile是否最新，這些參數可以根據需求自行修改
      entry: bash -c 'uv export --no-emit-project --locked --no-hashes -q -o requirements.txt'
      language: system
      # lockfile有變化才執行
      files: ^uv.lock$
```

如果不是複雜工程，只是想要簡單的把目前環境套件匯出可以使用這個命令。除此之外[文檔](https://docs.astral.sh/uv/pip/compile/)也提供各種不同文件的編譯方式，基本上兼容所有想得到的依賴文件。

```sh
uv pip compile pyproject.toml -o requirements.txt
```

### 構建套件

https://docs.astral.sh/uv/reference/cli/#uv-build

```sh
uv build --no-sources
```

### 發布套件，以 test.pypi 為例

需要指定 build 路徑，預設在 dist 資料夾中。使用時輸入的帳號是 `__token__`，密碼則是 pypi 提供的 token，注意此指令還在實驗階段隨時可能變動。

```sh
uv publish --publish-url https://test.pypi.org/legacy/ dist/*
```

### 整合 Github CI

一般來說我們不會每次發布都打 build publish，而是使用自動化流程完成套件發布，下方直接附上 Github Actions 方便抄作業，實測沒問題可以直接複製貼上使用。這個設定不使用已經被建議棄用的 token 方式，而是遵照官方的<u>**最佳實踐**</u>使用[可信任發行者](https://docs.pypi.org/trusted-publishers/creating-a-project-through-oidc/)方式，在每次 tag 名稱是 `vN.N.N.N` 或 `vN.N.N` 時以及發布 release 時才會啟動，並且建議開啟[手動驗證](https://packaging.python.org/en/latest/guides/publishing-package-distribution-releases-using-github-actions-ci-cd-workflows/)。

開啟手動驗證的方式是進入專案首頁後

1. 點擊上方 Code/Issues 那排最右邊的 Settings
2. 點擊左側列表的 Environments
3. 如果成功設定會有一個環境名稱是 `publish_pypi`
4. 勾選 Required reviewers 並且設定人員，最多六名。

```yaml
name: PyPI Publish

on:
  release:
    types: [created]

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
        uses: astral-sh/setup-uv@v4
        with:
          enable-cache: true
          cache-dependency-glob: uv.lock

      - name: Set up Python
        # 不指定子版本會自動使用最新版
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

## 使用 `uv tool` 取代 `pipx`

https://docs.astral.sh/uv/guides/tools/

此功能用於取代 pipx，把提供命令行執行的工具安裝在全局環境，例如我一開始只是想測試 uv 時也是用 pipx 安裝的。uv tool 特別的地方是沒有安裝也可以執行，會把套件安裝在一個臨時的虛擬環境中。

使用範例參考官方文檔

```sh
# 安裝 ruff
uv tool install ruff

# 執行 ruff，uvx 等效於 uv tool run ruff
uvx ruff

# 當套件名稱和命令行名稱不一樣時的指令
# 套件名稱 http，需要透過 httpie xxx 執行
uvx --from httpie http

# 升級
uv tool upgrade

# 指定相依套件版本
uv tool install --with <extra-package> <tool-package>
```

## 結束

本文介紹了從安裝到平常使用，到 pyproject.toml/.pre-commit-config.yaml 抄作業，到發布套件，以及取代 pipx 全部介紹。由於這個工具很新隨時會變動，網路上資訊也少，如果有問題麻煩告知我再修正。

整體下來最心動的就是 `uv run` 的強大功能，以及不需要 pyenv/pipx，也不用記 Poetry 有關 Python 解釋器的指令，這麼多功能全部都濃縮在 uv 一個套件中，加上執行速度快，更新很勤勞（2024/11 看下來每天都有 10 個 commit，嚇死人），社群狀態很健康 (競爭對手 [PDM is a one-man-show, like Hatch](https://chriswarrick.com/blog/2024/01/15/python-packaging-one-year-later/))，一個工具完整取代 pyenv/pipx，幾乎包含 Poetry 的所有功能，速度又快，難怪竄升速度這麼誇張。

筆者一向不喜歡寫這種純指令的文章，理由是網路已經充斥一堆類似文章了沒必要又一篇浪費讀者作者雙方時間，但是本文是全中文圈第一個完整介紹操作的文章所以沒這問題。
