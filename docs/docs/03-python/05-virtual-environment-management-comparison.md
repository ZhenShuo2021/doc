---
title: Python 虛擬環境管理和依賴解析套件完整比較
description: Python 虛擬環境管理和依賴解析套件完整比較
sidebar_label: 虛擬環境管理套件比較
tags:
  - Programming
  - Python
  - 虛擬環境
keywords:
  - Programming
  - Python
  - 虛擬環境
last_update:
  date: 2024-12-12T02:51:00+08:00
  author: zsl0621
first_publish:
  date: 2024-11-19T14:22:30+08:00
---


# Python 虛擬環境管理和依賴解析套件比較

> 撰寫於 2024/11

搜尋 Python 虛擬環境管理會查到某幾個特定套件，然後教學文章劈哩啪啦說一堆指令，卻沒有回答我心中的問題：<u>**我該選擇這個套件嗎**</u>？我們都知道新工具的出現就是要解決舊有工具的痛點，然而不知為何中文文章卻沒人寫應該如何選擇虛擬環境管理套件，於是筆者決定自己寫，我不入火海誰入火海。

我們應該要知道的是為何自己應該選擇他，而不是照著指令複製貼上等出問題才知道到底適不適合。

## 虛擬環境

要比較虛擬環境套件，我們首先要知道他的用途，並且說明比較基準。

虛擬環境套件用於隔離多個專案之間的環境，比如說一個需要 urllib==2.31，另一個需要 1.26，就會引發衝突，這是環境隔離用途。除了隔離環境，同一專案當中高層套件對底層套件版本的依賴解析，以及套件對於 Python 版本的依賴都是作為一個虛擬環境管理套件需要被關注的重點，於是本文選擇這三項作為重點比較項目：<u>**「套件依賴解析、Python 版本管理、專案環境隔離」**</u>，其餘效能、IDE 整合等問題不在本文探討範圍中。

## 虛擬環境管理套件

依照發布時間順序排列常見的套件，星星數統計於撰文當下 (2024/11/19)：

1. [virtualenv](https://github.com/pypa/virtualenv) (2007, 4.8k stars)
2. [venv](https://docs.python.org/3/library/venv.html#module-venv) (2012)
3. [Pyenv](https://github.com/pyenv/pyenv) (2012, 39.4k stars)
4. [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv)(2012, 6.4k stars)
5. [Conda](https://github.com/conda/conda) (2012, 6.5k stars)
6. [Pipenv](https://github.com/pypa/pipenv) (2017, 24.9k stars)
7. [Poetry](https://github.com/python-poetry/poetry) (2018, 31.8k stars)
8. [PDM](https://github.com/pdm-project/pdm) (2019, 8k stars)
9. [Hatch](https://github.com/pypa/hatch) (2022, 6.1k stars)
10. [uv](https://github.com/astral-sh/uv) (2024, 26.7k stars)

:::info 先說結論
迷你專案使用內建的 venv + pip 就夠了，其餘<u>**一律從 Poetry 和 uv 中二選一**</u>，取決於你喜歡更成熟已經經過時間驗證的架構，還是需要稍微自己摸索但是更好的整體使用體驗。
:::

:::tip 直接選最好
筆者個人推薦 uv，懶得看文章可以直接看我寫的 [uv 使用教學](./python-uv-complete-guide)。
:::

## 比較

### venv/virtualenv

venv 是內建於 Python 的管理工具，是基於 virtualenv 的管理工具，差別是 virtualenv 需要額外安裝，他們本質上是相同的，差別只有 venv 不支援 Python2。於是我們知道完全沒有任何理由使用 virtualenv[^1]。

venv 只能用於建立虛擬環境，沒有任何依賴解析管理功能，一般是使用 pip 完成依賴解析管理。

[^1]: virtualenv 唯一的優點只有支援不同 Python 版本的功能，然而他需要結合 Pyenv 才能使用，他本身不能管理 Python 版本。不結合沒優點，結合了有更好套件 pyenv-virtualenv，取交集後等於純 virtualenv 完全沒有優點，還寫一篇 virtualenv 教學不是好心帶彎路嗎，都已經 2024 了網路上誰再教 virtualenv 的筆者建議直接用 uBlacklist 把他[整個網域 ban 了](https://www.eallion.com/ublacklist-subscription-compilation/)。

### Pyenv

專注於 Python 版本管理的套件。

pyenv 專注於管理多個不同 Python 版本以及負責切換版本，不包含任何額外功能，需要和其他管理套件協同工作：他只是拼圖的其中一塊而已，但是把自己的這塊做好。

pyenv 不支援 Windows，需要使用 [pyenv-win](https://github.com/pyenv-win/pyenv-win)。

### pyenv-virtualenv

pyenv 的插件，結合 virtualenv 後變成既有 Python 版本管理又有套件管理功能的完整工具。

從這裡開始才真正進入戰場，涵蓋環境管理、Python 版本管理以及依賴解析管理（還是使用 pip 解析，無優化）。

### Conda

pyenv-vitrualenv 筆者沒有到非常熟悉，但是 Conda 筆者用的可多了，使用體驗可以總結為兩個字：快逃。

Conda 整合 Python 版本管理、虛擬環境管理和套件依賴解析，完美整合自家贊助的 Spyder IDE，安裝完 Spyder 後能直接使用虛擬環境不需任何設定。聽起來很棒，但 Conda 有一個致命問題是套件怎麼裝怎麼崩潰，即使是全新環境也一樣。

Conda 使用自己的套件依賴解析器而不是 pip，所以混用會出問題，你說為甚麼要混用？因為內建的永遠出現衝突問題，就拿筆者最常使用的套件 Tensorflow/Matplotlib/Numba 三個來說，三個都依賴 Numpy，三個都是知名套件，但是三個一起裝就是 boom 爆炸，筆者當時甚至研究出先使用 Conda 安裝 A，再使用 pip 安裝 B，最後再用 Conda 安裝 C 才能成功安裝，任何改變都會出錯。平常最好祈禱自己不要手癢想更新，更新就是套件再重裝一次。

使用體驗爛透了，沒有第二句話，就算 IDE 安裝再快都沒有除錯依賴花得時間還久，程式肥大已經是瑕不掩瑕，處理依賴有得你受[^2]。

[^2]: Conda 庫打包成二進制所以安裝比一般的 pip 快。另外即使使用 miniconda 程式還是一樣肥大，但肥大不是主要問題，問題是他的套件管理爛到不行，筆者用了兩年都沒改善，平常還得祈禱不會用到新套件，否則研究出來的安裝順序又要再摸索一次，不要問我為甚麼知道，我已經對付他兩年了。

### pipenv

顧名思義，是整合了 pip 和虛擬環境管理的工具，目的是簡化依賴管理與環境設置。總共改善了這些問題：

- 引入 Pipfile 和 Pipfile.lock 解析依賴與鎖定
- 開發/生產環境分離
- 使用自行開發的依賴解析器

pipenv 整合環境管理和依賴管理，使用 pipfile 和 pipfile.lock 管理，並且支援 `--dev` 選項隔離開發用套件，如此豐富的功能整合看起來很美好，但是實際上[不美好🚨](https://note.koko.guru/posts/using-poetry-manage-python-package-environments)。本套件筆者並未使用過所以上網做了一下功課，看到此篇文章：[Pipenv: promises a lot, delivers very little](https://chriswarrick.com/blog/2018/07/17/pipenv-promises-a-lot-delivers-very-little/)，整整四千字的心得大罵 pipenv，所以我們大概可以知道該如何選擇，其主要問題包含效能、指令操作繁瑣、僅支持特定的工作流程、不支援跨目錄工作，而且更新停滯。

對於一個 2017 年才發布的套件，在 2018 年就被罵不更新，2020 年該文章作者還繼續追蹤但是情況依舊。查看其 [Github release](https://github.com/pypa/pipenv/releases)，整個 2023 從二月之後就沒更新了，如此緩慢的更新不建議使用。

都快 2025 了如果還有文章推薦 pipenv 建議送上 uBlacklist 伺候。

### uv (formerly rye)

如果要以要一句話形容 uv，那就是完整且高效的一站式體驗，異軍突起的解決了上述所有問題。

uv 是 2024/2 才首發的新工具，簡單摘要幾個特點：

1. 由 rust 撰寫，標榜快速，比 Poetry 快十倍以上
2. 使用 PubGrub 演算法[解析套件依賴關係](https://docs.astral.sh/uv/reference/resolver-internals/)
3. **<u>取代 pyenv</u>**：支援 Python 版本管理[^global]
4. **<u>完美取代 pip/pip-tools</u>**：支援 lockfile 鎖定套件版本
5. **<u>完美取代 pipx</u>**：支援全域套件安裝
6. 發展快速，發布不到一年已經有 26k 星星

把特點 2\~4 加起來就是我們的最終目標了，有更好的套件解析演算法，不只支援 lockfile 管理套件，也支援 Python 版本管理，還沒有 pipenv 速度緩慢且更新停滯的問題，是目前虛擬環境管理工具的首選。

為何選擇 uv？我會給出這個結論：「一個工具完整取代 pyenv/pipx，幾乎包含 poetry 的所有功能，速度又快」，這麼多優點是我可以一次擁有的嗎，太夢幻了吧。

身為新穎又備受矚目的套件，目前的更新速度非常快，[兩個月就把問題解決了](https://www.loopwerk.io/articles/2024/python-uv-revisited/)。

> 更新：發展不只是快而是超快，才一個禮拜過去他又多了一千個星星，筆者文章都還沒校完稿，放上圖片讓大家看到底有多粗暴，有人直接飛天了

> 再度更新：2024/12/12 星星數成功超越 Poetry，確實能說是最受歡迎的管理套件了

![Star History Chart](https://api.star-history.com/svg?repos=python-poetry/poetry,astral-sh/uv,pypa/pipenv,pypa/hatch,pdm-project/pdm,conda/conda,pyenv/pyenv-virtualenv&type=Date)

<br/>
<br/>

[^global]: 只剩下等效於 `pyenv global` 的設定全局 Python 功能~~還不支援但[已經在規劃中](https://github.com/astral-sh/uv/issues/6265)~~已經放進 [preview 版本](https://github.com/astral-sh/uv/releases/tag/0.5.6)中，加上 `--preview --default` 參數即可使用，目前實測還很早期，連 venv 都不能跑。

:::tip 使用心得

和原本的首選 Poetry 互相比較，uv 內建的 Python 版本管理非常方便，不再需要 pyenv 多記一套指令（而且 Poetry 有時候還會找不到 Python 版本），除此之外還支援安裝全局套件以取代 pipx，本體雖然不支援建構套件，但是設定完 build-system 使用 `uv build` 和 `uv publish` 一樣可以方便的構建和發布，還做了和 pip 類似的接口方便以往的用戶輕鬆上手，除此之外還有最重要的 `uv run` 功能提供了非常優秀的開發便利性，再加上[超快的安裝和解析速度](https://astral.sh/blog/uv-unified-python-packaging)錦上添花，筆者認為目前虛擬環境管理工具首選就是他了。

有兩個小缺點，第一是使用 rust 撰寫，所以 Python 開發者不好進行貢獻，第二是太新，連英文都沒有幾篇文章說明如何使用，不過別擔心筆者寫了一個簡易使用較學，從安裝到發布套件一應俱全。
:::

:::tip 開始使用 uv

- 可以參考筆者寫的 [uv 使用教學](./python-uv-complete-guide)。  
- 非常優秀的開發便利性？請見 uv 使用教學的[這個段落](./python-uv-complete-guide/#uv-run)。  

:::

## 打包以及發布工具

從這裡開始我們進入內建了打包和發布工具的工具。

可以閱讀此文章 [An unbiased evaluation of environment management and packaging tools](https://alpopkes.com/posts/python/packaging_tools) 以便快速的可視化了解套件之間差異。需要注意的是該文章總共分為五個象限：虛擬環境管理、套件依賴解析、Python 版本管理、套件打包和套件發布，本文還是只討論前三者，是因為這些打包開發工具通常會包含前三者的功能而且還做的更好，所以也放入討論。

### Poetry

雖然文章開頭說「新工具的出現就是要解決舊有工具的痛點」，但前面好像都沒什麼提到，因為不是缺少功能就是有問題沒得比。Poetry 的出現主要解決了以下問題：

- 使用高度成熟的依賴解析器解決依賴解析問題
- 內建套件發布工具解決套件發布流程複雜問題

並且有以下特點：

- 支援 pyproject.toml
- 支援 poetry.lock 鎖定套件版本
- 內建虛擬環境管理
- 和 uv 並列開發社群最活躍的套件

Poetry 最大的優勢是支援 pyproject.toml，可以設定從開發到發布的所有項目，使用自行開發的依賴解析器，支援 poetry.lock 完成依賴鎖定管理，背景使用 pip 讓兼容過往工具，看起來很美好，而且真的很美好。對比 pipenv 有更快的套件下載和更簡易的指令操作，以及更好的開發環境（整合各種開發工具的設定）；對比 uv 則原生支援套件打包發布。使用體驗上，用戶人數足夠多，相關資訊比 PDM/hatch 更充足，cli 提示做得很不錯，以往筆者用過的工具都需要不斷切換視窗搜尋指令，使用 Poetry 可以明顯感受到頻率降低很多，唯一美中不足的是不包含 Python 版本管理，需要結合 pyenv 使用。

> 網路上會說 Poetry 不支援 PEP 621，其實已計畫將於 [2.0 版本](https://github.com/orgs/python-poetry/discussions/5833)開始支援。

Poetry 的使用指令可以觀看這兩篇文章：簡短的 [\[note\] Python Poetry](https://pjchender.dev/python/note-python-poetry/) 和更豐富的 [Pyenv + Poetry 相關指令](https://hackmd.io/@OpenAIDocuments/ByIK7hTEa)，新手用戶不用管太多只要會 `poetry init` + `poetry add` 就可以了。

:::tip 和 uv 比較
hatch 由於其自身的特殊性（沒有 lock 檔案，沒有內建虛擬環境管理，主要用於跨平台而不是虛擬環境管理和依賴解析）所以沒得比較，對比 uv 在功能上則更為相似。

在這個部落格中寫了四篇關於 uv 的[文章](https://www.loopwerk.io/articles/tag/uv/)，我們可以看到 uv 的發展之快以及齊全的功能。該作者原本使用 poetry，四篇文章一路從 uv 還不夠好寫到全面遷移 uv，並且在他自己的 dotfiles 裡面[把 pyenv 和 poetry 都移除了](https://github.com/search?q=repo%3Akevinrenskers%2Fdotfiles+uv&type=commits)，可見 uv 有多強大。

兩者的選擇和開頭說的一樣，需要更成熟穩定且經過多數用戶驗證的工具，選擇 Poetry，想擁有一站式的良好使用體驗選擇 uv，只是 uv 仍然在早期階段有些細節還需要優化。
:::

### PDM/hatch

由於是開發管理工具所以不只關注環境管理本身，而是更加注重對於 PEP 的支援，但筆者沒這麼厲害所以不知道確切的影響是什麼，以下大致整理一下網路資訊。

- hatch: 專注在開發的工具
  1. 旨在建立跨平台間能具有相同環境和操作的套件（例如解決 Windows 不支援 Pyenv）
  2. 不支援 lock 鎖定套件版本（[未來會支援](https://github.com/pypa/hatch/issues/749)）
  3. 允許一個專案使用多個環境
  4. 優秀的[開發版本管理](https://myapollo.com.tw/post/python-hatch/)

- PDM: [基於 PEP 582 而生的套件](https://pdm-project.org/zh-cn/latest/usage/pep582/)
  1. PEP 582 用於免虛擬環境進行 Python 管理，然而此提案最終被拒絕
  2. 遵循 PEP 實踐，並且包含套件依賴管理
  3. 不支援 Python 版本管理，速度[比 poetry 慢](https://astral.sh/blog/uv)，社群比 poetry 小[^pdm]
  4. 找了老半天好像找不到什麼優點

[^pdm]: [PDM is a one-man-show, like Hatch.](https://chriswarrick.com/blog/2024/01/15/python-packaging-one-year-later/)

### 其他

[virtualenvwrapper](https://github.com/python-virtualenvwrapper/virtualenvwrapper) 則是基於 virtualenv 的工具，把所有環境整合在同一目錄，並且提供更多額外功能，本質上還是 virtualenv，[pyenv-virtualenvwrapper](https://github.com/pyenv/pyenv-virtualenvwrapper) 同理，但是兩者都沒更新了，不列入討論。

## 總結

Poetry/uv 最好，基於 80/20 法則，八成的人都應該使用他。

兩者選擇取決於你喜歡更成熟的架構還是需要稍微自己摸索但是更好的整體使用體驗。hatch 很好，但是著重於打包和版本管理，套件依賴問題需要其他工具幫忙，如果專案夠複雜可以選擇，但是需要用到的人不會來看這篇文章。Conda 如果沒有糟糕的套件依賴解析會是一個好工具，如果你的是科學開發專案並且剛好沒有依賴問題可以選擇 Conda，然後別忘了祈禱自己不要遇到依賴解析問題。pipenv 打入監獄，uBlacklist 伺候。

總結來說

1. 迷你專案使用內建的 venv + pip
2. 其餘一律使用 Poetry/uv
3. 科學開發而且膽子很大可以嘗試 Conda
4. 需要用到 hatch 的人不會看這篇文章。

本文解決了現有網路文章缺少的選擇分析，透過完整說明功能和套件現況，讀者可以清楚知道自己應該選擇哪個虛擬環境管理套件。

## 參考文章

- [Python Packaging, One Year Later: A Look Back at 2023 in Python Packaging](https://chriswarrick.com/blog/2024/01/15/python-packaging-one-year-later/)
- [Pipenv: promises a lot, delivers very little](https://chriswarrick.com/blog/2018/07/17/pipenv-promises-a-lot-delivers-very-little/)
- [An unbiased evaluation of environment management and packaging tools](https://alpopkes.com/posts/python/packaging_tools)
- [Poetry versus uv](https://www.loopwerk.io/articles/2024/python-poetry-vs-uv/)
- [Comparing the best Python project managers](https://medium.com/@digitalpower/comparing-the-best-python-project-managers-46061072bc3f)
- [Hatch or uv for a new project?](https://www.reddit.com/r/Python/comments/1gaz3tm/hatch_or_uv_for_a_new_project/)

一些資料來源

- [套件發布日期](https://www.warp.dev/blog/prose-about-poetry)
- [pyenv 發布日期](https://github.com/pyenv/pyenv/blob/6393a4dfce90615792751c6567c07a118a961ff9/CHANGELOG.md?plain=1#L1366)
- [pipenv 發布日期](https://chriswarrick.com/blog/2018/07/17/pipenv-promises-a-lot-delivers-very-little/)
- [conda 發布日期](https://docs.anaconda.com/anaconda/release-notes/#anaconda-0-8-0-jul-17-2012)

## 後話

其實看星星數就知道該怎麼選了，工程師又不是笨蛋，好用的星星數量自然多。pipenv 在 2017 橫空出世試圖解決一次三個問題，看似是明日之星但是在隔一年就迅速殞落。隨之而來的是 Poetry/PDM/hatch，從現在回頭看 PDM 其基於 PEP 582 的優勢隨著該提案被拒絕已經不復存在，速度又[比 Poetry 還慢](https://astral.sh/blog/uv)，社群又小，已經無明顯優勢。hatch 網路上的中文文章可以說是幾乎為零，需要用他的估計都是大型專案。這樣回頭看就很合理了，通用工具套件 pyenv 星星最多，最全面的套件 Poetry 第二高，pipenv 在 pyenv 發布五年後登高一呼騙完讚馬上倒地，全面又高效的 uv 不到一年馬上登上第三名寶座，已經逼宮 Poetry。

撰文整理時發現套件數量越寫越多，正好看到這篇文章：[How to improve Python packaging, or why fourteen tools are at least twelve too many](https://chriswarrick.com/blog/2023/01/15/how-to-improve-python-packaging/)，平常看到可能無感，寫的時候心理偷笑了一下，因為真的越寫越多寫不完。裡面還大罵 PyPA，因為這麼多套件都是 PyPA 相關的，不整合四散的套件，而且功能最豐富的 Poetry/PDM 反而都不是由 PyPA 維護的，最後的結尾是 `Furthermore, I consider that the PyPA must be destroyed`。

本文針對虛擬環境管理套件之間應該如何選擇進行介紹，網路上一堆文章只會說明指令操作，同樣的文章已經存在，再多十篇也沒有意義。其實有點像是做研究，一堆人都做過了，那做這個幹嘛？還是你的效能（文筆）特別好？都沒有的話重複寫文章只是浪費自己和讀者的時間而已。

這篇文章寫給研究所時的自己，筆者研究訊號處理，整間實驗室只會算數學沒人會套件管理，當初沒多想學長用 Conda 就跟著用 Conda 了，不知道有這麼多替代品。
