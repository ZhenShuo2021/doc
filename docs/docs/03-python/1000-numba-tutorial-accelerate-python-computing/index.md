---
title: Numba 教學：加速 Python 科學計算
description: 最快、最正確、最完整的 Numba 教學：使用 Numba 加速 Python 科學計算。坑筆者都踩過了只要照做可以得到最好性能，不會漏掉任何優化可能；除此之外本文第一不廢話，第二上手極快，第三介紹如何除錯和優化，第四補充進階使用方式，第五給出「精選有用的延伸閱讀」，不是給沒用文章，第六也是最重要，筆者可以很自信的說本文是中文圈最詳細教學。
sidebar_label: Numba 教學
tags:
  - Programming
  - Python
  - Numba
  - Performance
  - 教學
keywords:
  - Programming
  - Python
  - Numba
  - Numpy
  - 教學
  - Speed-Up
  - Accelerate
  - Performance
last_update:
  date: 2024-10-18T00:00:00+08:00
  author: zsl0621
first_publish:
  date: 2024-10-18T00:00:00+08:00
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Numba 教學：加速 Python 科學計算

> 你能找到最好的中文教學！

鑑於繁體中文資源匱乏，最近剛好又重新看了一下文檔，於是整理資訊分享給大家。本篇的目標讀者是沒學過計算機組織的初階用戶到中階用戶都可以讀，筆者能非常肯定的說這篇文章絕對是你能找到最好的教學。

- **為甚麼選擇此教學**  
    >最快、最正確、最完整   
    
    各種坑筆者都踩過了，只要照教學做就可以得到最好性能，不會漏掉**任何**優化可能；除此之外本文第一不廢話，第二上手快速，第三介紹如何除錯和優化，第四補充進階使用方式，第五給出精選的延伸閱讀。


- **如何閱讀本文**  
    本文根據官方文檔重新編排，邏輯由常用到少用，使用方式簡單到複雜。  

    文章看似很長，但是可以分為以下幾種方式閱讀：初學者只需看<u>基礎使用</u>即可掌握絕大多數使用情境；還要更快再看<u>自動平行化與競爭危害</u>以及<u>其他裝飾器</u>；如果你急到不行，看完<u>一分鐘學會 Numba</u> 後直接看<u>小結</u>。


:::info 寫在前面

**[舊版文檔](https://numba.pydata.org/numba-doc/dev/index.html)內容缺失！**，查看文檔時注意左上角版本號是否為 Stable，偏偏舊版文檔 Google 搜尋在前面，一不小心就點進去了。

:::

## Numba 簡介與比較
Numba 是一個針對 Python 數值和科學計算，使用 LLVM 函式庫優化效能的即時編譯器 (JIT compiler)，能顯著提升 Python 執行速度。

Python 速度慢的原因是身為動態語言，運行時需要額外開銷來進行類型檢查，轉譯成字節碼在虛擬機上執行[^python1]又多了一層開銷，還有 GIL 的限制進一步影響效能[^python2]，於是 Numba 就針對這些問題來解決，以下是它的優化機制：

- 靜態類型推斷：Numba 在編譯時分析程式碼推斷變數類型，避免型別檢查影響效能。
- 即時編譯：將函式編譯[^interpret]成針對當前 CPU 架構優化的機器碼，並且以 LLVM 優化效能。
- 向量化與平行化：透過 LLVM 使用 SIMD 進行向量化運算，並支援多核平行計算和 CUDA 運算。

[^python1]: [[延伸閱讀](https://medium.com/citycoddee/python%E9%80%B2%E9%9A%8E%E6%8A%80%E5%B7%A7-5-python-%E5%88%B0%E5%BA%95%E6%80%8E%E9%BA%BC%E8%A2%AB%E5%9F%B7%E8%A1%8C-%E7%9B%B4%E8%AD%AF-%E7%B7%A8%E8%AD%AF-%E5%AD%97%E7%AF%80%E7%A2%BC-%E8%99%9B%E6%93%AC%E6%A9%9F%E7%9C%8B%E4%B8%8D%E6%87%82-553182101653)] Python 底層執行方式  
  Python 和 C/C++ 編譯成機器碼後執行不同，需要先直譯 (interprete) 成字節碼 (.pyc)，再經由虛擬機作為介面執行每個字節碼的機器碼，再加上動態語言需要的型別檢查導致速度緩慢。
[^python2]: [延伸閱讀] 全域直譯器鎖 GIL  
  用來限制同一時間內只能有一個執行緒執行 Python 字節碼的機制。Python 內建資料結構如字典等並非線程安全，所以需要 GIL 確保了多執行緒程式的安全性，避免競爭危害，然而也導致了多執行緒程式在工作中的效能低落。

[^interpret]: 實際上 Numba 在首次執行時分析會 Python 的字節碼，並進行 JIT 編譯以了解函式的結構，再使用 LLVM 優化，最後轉換成經過 LLVM 最佳化的機器碼。與原生 Python 相比有以下優化：不使用 Python 字節碼/沒有 Python 內建型別檢查/沒有 Python 虛擬機開銷/多了 LLVM 最佳化的機器碼。首次執行前的分析就是 Numba 需要熱機的原因，官方文檔對 Numba 架構有[詳細說明](https://numba.readthedocs.io/en/stable/developer/architecture.html)，除此之外，很多 Numpy 函式 Numba 也使用[自己的實現](https://numba.discourse.group/t/how-can-i-make-this-function-jit-compatible/2631/2)。

Numba 適用於大量包含迴圈的 Numpy 數值運算，但不適合如 pandas 的 I/O 操作。除了 Numba 以外還有其他加速套件，那我們是否該選擇 Numba 呢？這裡列出常見的競爭選項，有 Cython、pybind11、Pythran 和 CuPy，我們從特點討論到性能，最後做出結論。

- **特點**
    - Numba：只支援 Numpy，並且有些方法不支援，如 [FFT](https://numba.discourse.group/t/rocket-fft-a-numba-extension-supporting-numpy-fft-and-scipy-fft/1657) 和[稀疏矩陣](https://numba-scipy.readthedocs.io/en/latest/reference/sparse.html)。
    - Pythran：和 Numba 相似，Numba 是即時編譯，Pythran 則是提前編譯。
    - Cython：需要學會他的獨特語法，該語法只能用在 Cython 是其最大缺點。
    - pybind11：就是寫 C++。
    - CuPy：為了 Numpy + Scipy 而生的 CUDA 計算套件。

- **效能**   
    從 [Python 加速符文](https://stephlin.github.io/posts/Python/Python-speedup.html) 這篇文章中我們可以看到效能[^1]相差不大，除此之外，你能確定文章作者真的知道如何正確該套件嗎[^2]？因此，我們應該考量套件的限制和可維護性，而非單純追求效能極限，否則直接用 C 寫就可以了。

- **結論**  
    經過這些討論我們可以總結成以下
    - Numba：**簡單高效**，適合不熟悉程式優化技巧的用戶。缺點是因為太方便所以運作起來像是黑盒子，有時會感到不安心。
    - Pythran：搜尋結果只有一萬筆資料，不要折磨自己。
    - Cython：麻煩又不見得比較快。最大也是唯一的優點是支援更多 Python 語法，以及對程式行為有更多控制。
    - pybind11：適合極限性能要求，對程式行為有完全掌控的用戶。
    - CuPy：使用 CUDA，針對大量平行計算場景的最佳選擇。

[^1]: 這裡解釋有關效能測試的問題。因為 Numba 支援 LLVM 所以他甚至可以[比普通的 C++ 還快](https://stackoverflow.com/questions/70297011/why-is-numba-so-fast)，所以當效能測試的程式碼碰巧對 LLVM 友善時速度就會變快，反之亦然。也就是說單一項的效能測試無法作為代表只能參考，尤其是當函式越簡單，Numba 越好優化，該效能測試的代表性就越低。

[^2]: 甚至連 geeksforgeeks 的文章 [Numba vs. Cython: A Technical Comparison](https://www.geeksforgeeks.org/numba-vs-cython-a-technical-comparison/) 都犯了一個最基本的錯誤：把 Numba 初次編譯的時間也算進去，該作者甚至都不覺得 Numba 比 Python 還久很奇怪，這麼大一個組織都錯了，我們還能期望網路上的文章多正確嗎？另外幫大家跑了他的程式，在 colab 上實際運行時間運行執行 1000 次取平均，兩者都是 `1.58ms`，因為他的程式碼簡單到即使 Numba 是自動優化的，也可以編譯出和 Cython 一樣速度的機器碼，除了證實前一個註腳，也說明該文章毫無參考價值。

## 安裝
安裝 Numba 以及相關的加速套件，包括 SVML (short vector math library) 向量化套件和 tbb/openmp 多線程套件，安裝後不需設定，Numba 會自行調用。

```sh
# conda
conda install numba
conda install intel-cmplr-lib-rt
conda install tbb
conda install anaconda::intel-openmp

# pip
pip install numba
pip install intel-cmplr-lib-rt
pip install tbb
pip install intel-openmp
```

安裝完成後重新啟動終端，使用 `numba -s | grep SVML` 檢查 SVML 是否成功被 Numba 偵測到，如果沒有，Linux 用戶可以用 `sudo ldconfig` 刷新 lib 連結。

## 基礎使用
說是基礎使用，但是已經包含七成的使用情境。

### 一分鐘學會 Numba

比官方的五分鐘教學又快五倍，夠狠吧。這個範例測試對陣列開根號後加總的速度，比較有沒有使用 Numba 和使用陣列/迴圈這四種方法的執行時間。

```py
import numpy as np
import time
from numba import jit, prange


# Numba Loop
@jit(nopython=True, fastmath=True, parallel=True, nogil=True)
def numba_loop(arr):
    bias = 2
    total = 0.0
    for x in prange(len(arr)):   # Numba likes loops
        total += np.sqrt(x)      # Numba likes numpy
    return bias + total          # Numba likes broadcasting


# Python Loop，沒有使用裝飾器
def python_loop(arr):
    bias = 2
    total = 0.0
    for x in arr:
        total += np.sqrt(x)
    return bias + total


# Numba Vector
@jit(nopython=True, fastmath=True, parallel=True, nogil=True)
def numba_arr(arr):
    bias = 2
    return bias + np.sum(np.sqrt(arr))


# Python Vector，沒有使用裝飾器
def python_arr(arr):
    bias = 2
    return bias + np.sum(np.sqrt(arr))


n_runs = 1000
n = 10000000
arr = np.arange(n)

# 第一次運行的初始化，第二次以後才是單純的執行時間
result_python_arr = python_arr(arr)
result_numba_arr = numba_arr(arr)
result_numba = numba_loop(arr)

start = time.time()
result_python = python_loop(arr)
end = time.time()
print(f"Python迴圈版本執行時間: {end - start} 秒")

start = time.time()
result_python_arr = python_arr(arr)
end = time.time()
print(f"Python陣列版本執行時間: {end - start} 秒")

start = time.time()
for _ in range(n_runs):
    result_numba = numba_loop(arr)
end = time.time()
print(f"Numba迴圈版本執行時間: {(end - start)/n_runs} 秒")

start = time.time()
for _ in range(n_runs):
    result_numba_arr = numba_arr(arr)
end = time.time()
print(f"Numba陣列版本執行時間: {(end - start)/n_runs} 秒")

print("Are the outputs equal?", np.isclose(result_numba, result_python))
print("Are the outputs equal?", np.isclose(result_numba_arr, result_python_arr))

# Python迴圈版本執行時間: 9.418870210647583 秒
# Python陣列版本執行時間: 0.021904706954956055 秒
# Numba迴圈版本執行時間: 0.0013016948699951171 秒
# Numba陣列版本執行時間: 0.0024524447917938235 秒
# Are the outputs equal? True
# Are the outputs equal? True
```

可以看到使用方式很簡單，僅需在想要優化的函式前加上 `@jit` 裝飾器，接著在要平行化處理的地方顯式的改為 `prange` 就完成了。裝飾器的選項有以下幾個[^compile]：

| 參數      | 說明                                                      |
|----------|-----------------------------------------------------------|
| nopython | 是否嚴格忽略 Python C API <br/>此參數是整篇文章中影響速度最大的因素，使用 @njit 等價於啟用此參數              |
| fastmath | 是否放寬 IEEE 754 的精度限制以獲得額外性能                     |
| parallel | 是否使用迴圈平行運算                                         |
| cache    | 是否將編譯結果寫入快取，避免每次呼叫 Python 程式時都需要編譯      |
| nogil    | 是否關閉全局鎖，關閉後允許在多線程中同時執行多個函式實例           |

[^compile]: 這是最常使用的五個參數，除此之外還有官方文檔沒有的隱藏選項，故意把參數名稱打錯後會顯示，裡面比較好用的是 `inline='Always'` 和 `looplift`。

效能方面，在這個測試中我們可以看到使用 Numba 後速度可以提升約兩倍，也發現一個有趣的事實：「迴圈版本比陣列版本更快」，這引導我們到第一個重點 **Numba likes loops**，另外兩個是 **Numpy** 和 **matrix broadcasting**。

<br/>
<br/>

:::info 提醒

1. 這些選項的效能差異依照函式而有所不同。
2. Numba 每次編譯後全域變數會變為常數，在程式中修改該變數不會被函式察覺。

:::


:::danger 競爭危害

**對於暫時不想處理競爭危害的用戶，請先不要使用 `parallel` 和 `nogil` 選項。**
1. 開啟 parallel/nogil 選項時必須小心[競爭危害](https://zh.wikipedia.org/zh-tw/%E7%AB%B6%E7%88%AD%E5%8D%B1%E5%AE%B3) (race condition)。  
簡單解釋競爭危害，兩個線程一起處理一個運算 `x += 1`，兩個一起取值，結果分別寫回 x 的值都是 `x+1` 導致最終結果是 `x+1` 而不是預期的 `x+2`。
2. 雖然上面的範例顯示結果一致，但還是一定要 **避免任何可能的多線程問題！**

:::

<br/>

### 進一步優化效能
基礎使用章節已經涵蓋[官方文檔](https://numba.readthedocs.io/en/stable/user/performance-tips.html#intel-svml)中的所有效能優化技巧，這裡補充進階的優化方式。

1. 使用 Numba 反而變慢
    - 別忘了扣掉首次執行需要消耗的編譯時間。
    - 檢查 I/O 瓶頸，不要放任何需要 I/O 的程式碼在函式中。
    - 總計算量太小。
    - 宣告後就不要修改矩陣維度或型別。
    - 語法越簡單越好，不要使用任何各種包裝，因為你不知道 Numba 是否支援。
    - 記憶體問題 [The wrong way to speed up your code with numba](https://pythonspeed.com/articles/slow-numba/)。
    - 分支預測問題 [Understanding CPUs can help speed up Numba and NumPy code](https://pythonspeed.com/articles/speeding-up-numba/)

2. 使用 `@vectorize` 或 `@guvectorize` 向量化  
    中文教學幾乎沒人提到向量化到底在做什麼。向量化裝飾器除了使函式支援 ufunc 以外還可以**大幅提升效能**，詳細說明請見[下方](/docs/python/numba-tutorial-accelerate-python-computing#vectorize)。

3. 使用[第三方套件](https://github.com/pythonspeed/profila)進行效能分析。
  
### fastmath
筆者在這裡簡單的討論一下 fastmath 選項。

雖然 fastmath 在文檔中只說他放寬了 IEEE 754 的精度限制，沒有說到的是他和 SVML 掛勾，但筆者以此 [Github issue](https://github.com/numba/numba/issues/5562#issuecomment-614034210) 進行測試，如果顯示機器碼 `movabsq $__svml_atan24` 代表安裝成功，此時我們將 fastmath 關閉後發現向量化失敗，偵錯訊息顯示 `LV: Found FP op with unsafe algebra.`。

為甚麼敢說本篇是最正確的教學，對於其他文章我就問一句話， **效能測試時有裝 SVML 嗎？** 這甚至都不用改程式就可以帶來極大幅度的效能提升，但是筆者從來沒看過任何文章提到過。

### 如何除錯
Numba 官方文檔有如何除錯的教學，使用 `@jit(debug=True)`，詳情請見 [Troubleshooting and tips](https://numba.readthedocs.io/en/stable/user/troubleshoot.html)。

另外一個是筆者的土砲方法，當年在寫 Numba 在出現錯誤時 Numba 的報錯資訊不明確，那時的土砲方法是「找到錯誤行數的方式是二分法直接刪程式碼到 Numba 不報錯」

錯誤通常來自於使用 Numba 不支援的函式，除錯請先看函式是否支援以免當冤大頭，再來就是檢查變數型別錯誤，例如誤用不支援相加的不同的變數型別。

- [Supported Python features](https://numba.readthedocs.io/en/stable/reference/pysupported.html)
- [Supported NumPy features](https://numba.readthedocs.io/en/stable/reference/numpysupported.html)


### 小結
1. Numba likes loops 在心裡默念十次
2. Numba likes NumPy functions
3. Numba likes NumPy broadcasting
4. 記憶體、I/O 操作、分支預測是三大效能下降主因
7. 所有優化方式都是 case-specific，不能說哪些項目效能一定很好，一切取決於被編譯的程式碼如何設計，如果程式依照以上設計還是很慢，試試看開關選項，或者嘗試向量化裝飾器。
8. ***還是 Numba likes loops***

讀到這裡你已經學會基礎，但是包含大部分場景的使用方式。如果有競爭危害的知識再開啟自動平行化功能，否則請務必關閉以免跑很快但全錯。接下來建議先跳到 [See Also](/docs/python/numba-tutorial-accelerate-python-computing#see-also) 看延伸閱讀，裡面包含各種速度優化方式。

---

## 自動平行化與競爭危害
本章節對官方文檔 [Automatic parallelization with @jit](https://numba.readthedocs.io/en/stable/user/parallel.html#) 進行翻譯和重新編排，如果不熟悉競爭危害建議**避免啟用 parallel 和 nogil 功能**。

### 自動平行化

> 設定 Numba 自動平行化的官方文檔，由於內容已經很精練，知識也很重要，所以翻譯完貼在這裡。  

在 `jit()` 函式中設置 `parallel` 選項，可以啟用 Numba 的轉換過程，嘗試自動平行化函式（或部分函式）以執行其他優化。目前此功能僅適用於CPU。

一些在用戶定義的函式中執行的操作（例如對陣列加上純量）已知具有平行語意。用戶的程式碼可能包含很多這種操作，雖然每個操作都可以單獨平行化，但這種方法通常會因為快取行為不佳而導致性能下降。相反地，通過自動平行化，Numba 會嘗試識別用戶程式碼中的這類操作並將相鄰的操作合併到一起，形成一個或多個自動平行執行的 kernels。這個過程是完全自動的，無需修改用戶程式碼，這與 Numba 的 `vectorize()` 或 `guvectorize()` 機制形成對比，後者需要手動創建並行 kernels。


- [**支援的運算符**](https://numba.readthedocs.io/en/stable/user/parallel.html#supported-operations)  
此處列出所有帶有平行化語意的運算符，Numba 會試圖平行化這些運算。

- **顯式的標明平行化的迴圈**  
使用平行化時，需使用 `prange` 取代 `range` 顯式的標明被平行化的迴圈，對於巢狀的 `prange` ，Numba 只會平行化最外層的迴圈。在裝飾器中設定 `parallel=False` 會導致 `prange` 回退為一般的 `range`。

:::warning 文檔翻譯問題

[中文文檔中的 reduction 翻譯錯誤](https://apachecn.github.io/numba-doc-zh/#/docs/21)，這裡分為兩種情況，一是平行化處理的術語 parallel reduction[^reduction2]，指的是「將各個執行緒的變數寫回主執行緒」，二是減少，代表該函式降低輸入維度，全部翻譯成減少顯然語意錯誤。

<!-- [^reduction1]: [平行程式設計的簡單範例](https://datasciocean.tech/others/parallel-programming-example/) -->
[^reduction2]: [Avoid Race Condition in Numba](https://stackoverflow.com/questions/61372937/avoid-race-condition-in-numba)：此文章詢問關於多線程競爭該如何解決，並且使用 `config.NUMBA_NUM_THREADS` 顯式進行線程 reduction。
:::

### 競爭危害
整理官方文檔中展示競爭危害的簡易範例、解決方式和正確使用方式。

<!-- 顯示出競爭危害的存在，請不要錯誤的推斷為 scalar 運算可以避免而 vector 運算不行，**任何時候我們都應該避免競爭危害的可能**。那我們就不能寫 for 迴圈了嗎？其實有其他方法，例如這下面的解決方式和正確使用範例。 -->

<!-- <details>
<summary>競爭危害範例</summary> -->

<Tabs>
  <TabItem value="1" label="發生競爭危害的範例">

```py
import numpy as np
from numba import njit, prange


@njit(parallel=True)
def prange_wrong_result_numba(x):
    n = x.shape[0]
    y = np.zeros(4)
    for i in prange(n):
        # 一般的矩陣相加，會造成競爭危害
        y[:] += x[i]
    return y


@njit(parallel=True)
def prange_wrong_result_mod_numba(x):
    n = x.shape[0]
    y = np.zeros(4)
    for i in prange(n):
        # 優化後的矩陣相加，嘗試利用不同的 i 取餘數避免競爭危害，仍舊失敗
        y[i % 4] += x[i]
    return y


# 沒有加上裝飾器的版本
def prange_wrong_result_python(x):
    n = x.shape[0]
    y = np.zeros(4)
    for i in range(n):
        y[:] += x[i]
    return y


# 沒有加上裝飾器的版本
def prange_wrong_result_mod_python(x):
    n = x.shape[0]
    y = np.zeros(4)
    for i in range(n):
        y[i % 4] += x[i]
    return y


x = np.random.randint(-100, 100, size=10000000)

result_numba = prange_wrong_result_numba(x)
result_python = prange_wrong_result_python(x)
print("Are the outputs equal?", np.allclose(result_numba, result_python))

result_numba_mod = prange_wrong_result_mod_numba(x)
result_python_mod = prange_wrong_result_mod_python(x)
print("Are the outputs equal?", np.allclose(result_numba_mod, result_python_mod))

# 輸出

# Are the outputs equal? False
# Are the outputs equal? False
```
</TabItem>

  <TabItem value="2" label="解決方式">

```py
import numpy as np
from numba import njit, prange


@njit(parallel=True)
def prange_ok_result_whole_arr(x):
    n = x.shape[0]
    y = np.zeros(4)
    for i in prange(n):
        # "whereas performing a whole array reduction is fine" 節錄自官方文檔
        y += x[i]
    return y


@njit(parallel=True)
def prange_ok_result_outer_slice(x):
    n = x.shape[0]
    y = np.zeros(4)
    z = y[:]
    for i in prange(n):
        # "as is creating a slice reference outside of the parallel reduction loop" 節錄自官方文檔
        z += x[i]
    return y


# 沒有加上裝飾器的版本
def prange_ok_result_whole_arr_python(x):
    n = x.shape[0]
    y = np.zeros(4)
    for i in prange(n):
        y += x[i]
    return y


# 沒有加上裝飾器的版本
def prange_ok_result_outer_slice_python(x):
    n = x.shape[0]
    y = np.zeros(4)
    z = y[:]
    for i in prange(n):
        z += x[i]
    return y


x = np.random.randint(-100, 100, size=(1000000, 4))

result_numba_whole_arr = prange_ok_result_whole_arr(x)
result_python_whole_arr = prange_ok_result_whole_arr_python(x)
print("Are the outputs equal?", np.allclose(result_numba_whole_arr, result_python_whole_arr))

result_numba_outer_slice = prange_ok_result_outer_slice(x)
result_python_outer_slice = prange_ok_result_outer_slice_python(x)
print("Are the outputs equal?", np.allclose(result_numba_outer_slice, result_python_outer_slice))

# 輸出

# Are the outputs equal? True
# Are the outputs equal? True
```

</TabItem>


  <TabItem value="3" label="正確使用範例">

```py
import numpy as np
from numba import njit, prange


@njit(parallel=True)
def prange_test(A):
    s = 0
    # Without "parallel=True" in the jit-decorator
    # the prange statement is equivalent to range
    for i in prange(A.shape[0]):
        s += A[i]
    return s

@njit(parallel=True)
def two_d_array_reduction_prod(n):
    shp = (13, 17)
    result1 = 2 * np.ones(shp, np.int_)
    tmp = 2 * np.ones_like(result1)

    for i in prange(n):
        result1 *= tmp

    return result1


n = 10000000
A = np.random.randint(-100, 100, size=n)
result_numba_test = prange_test(A)
result_python_test = sum(A)
print("Are the outputs equal?", np.allclose(result_numba_test, result_python_test))

result_numba_prod = two_d_array_reduction_prod(n)
result_python_prod = np.power(2, n) * np.ones((13, 17), dtype=np.int_)
print("Are the outputs equal?", np.allclose(result_numba_prod, result_python_prod))


# 輸出

# Are the outputs equal? True
# Are the outputs equal? True
```

</TabItem>


</Tabs>

<!-- </details> -->

:::info 迴圈出口

`prange` 不支援多個出口的迴圈，例如迴圈中間包含 `assert`。

:::

:::warning 迴圈引導變數的隱性轉型

關閉平行化時，迴圈變數（induction variable）與 Python 預設行為一致，使用有號整數。然而如果開啟平行化且範圍可被識別為嚴格正數，則會被自動轉型為 `uint64`，而 `uint64` 和其他變數計算時**有機會不小心的返回一個浮點數**。

:::



### 平行化的優化技巧

節錄官方文檔中介紹如何撰寫迴圈才可使 Numba 加速最大化的技巧。

1. **迴圈融合 (Loop Fusion)：** 將相同迴圈邊界的迴圈合併成一個大迴圈，提高資料局部性進而提升效能。
2. **迴圈序列化 (Loop Serialization)：** Numba 不支援巢狀平行化，當多個 `prange` 迴圈嵌套時只有最外層的 `prange` 迴圈會被平行化，內層的 `prange` 迴圈會被視為普通的 `range` 執行。
3. **提出不變的程式碼 (Loop Invariant Code Motion)：** 將不影響迴圈結果的語句移到迴圈外。
4. **分配外提 (Allocation Hoisting)**：範例是拆分 `np.zeros` 成 `np.empty` 和 `temp[:] = 0` 避免重複初始化分配。

進一步優化：使用診斷功能，請見 [Diagnostics your parallel optimization](https://numba.readthedocs.io/en/stable/user/parallel.html#diagnostics)。

### nogil 的作用

對於 nogil 沒概念的用戶，這個段落根據解釋 Numba nogil 選項到底做了什麼事。   

> 此段落根據 [Why doesn't the following code need a python interpreter?](https://stackoverflow.com/questions/70433667/why-doesnt-the-following-code-need-a-python-interpreter) 改寫。

- 原理  
原理是 Numba 優化時除了將 Python 程式碼優化成機器碼以外，還會建立一個 Python 對象的包裝函式，使 Python 能夠調用這些機器碼。但是包裝函式仍舊在 CPython 層面，受到 GIL 制約，於是加上這行提前關閉 GIL，計算完成再把鎖鎖上。

- 實際  
實際上，程式碼加上這行後並使用 threadpool 才會真正實現平行處理，否則即使有多個 thread 還是順序執行。

- 和 parallel 的差異  
parallel 將迴圈平行化處理，而 nogil 是一次執行多個函式實例。


## 進階使用

```sh
# 這是用來阻止你繼續讀的 placeholder！
 _   _                       _             
| \ | |  _   _   _ __ ___   | |__     __ _ 
|  \| | | | | | | '_ ` _ \  | '_ \   / _` |
| |\  | | |_| | | | | | | | | |_) | | (_| |
|_| \_|  \__,_| |_| |_| |_| |_.__/   \__,_|

```
除非你是進階用戶，否則 **你不應該看進階使用章節！** 看了反而模糊焦點，應該先掌握基礎使用，因為基礎使用已涵蓋七成以上的使用情境。

只有 [使用字典傳遞參數](/docs/python/numba-tutorial-accelerate-python-computing#numbatypeddict) 和 [向量化裝飾器](/docs/python/numba-tutorial-accelerate-python-computing#vectorize) 可以先偷看。

### 使用 CUDA 加速運算
[官方文檔](https://numba.readthedocs.io/en/stable/cuda/overview.html)

優化 CUDA 相較於針對 CPU 優化只要加上裝飾器來說更為複雜，因為需要對 CUDA 特別寫函式，導致程式只能在 GPU 上跑，所以筆者目前還沒寫過，不過基本注意事項一樣是注意 IO、工作量太小的不適合 CUDA。

<!-- 那比較什麼函式適合 CPU 而不是 CUDA 呢？

1. **順序處理而不是平行處理**，影像處理以外的演算法大概都是這類
2. 記憶體超過顯卡記憶體上限
3. 大量分支處理 (if-else)
4. 顯卡雙精度浮點運算效能差，深度學習和遊戲都吃單精度，但是科學計算需要雙精度，而我們又只能買到遊戲卡
5. 需要只支援 CPU 的 library

如果你需要使用 CUDA，這裡也有好用的指南連結：

- [28000x speedup with numba.CUDA](https://curiouscoding.nl/posts/numba-cuda-speedup/)：使用 CUDA 加速並且有完整的對比。  
- [用 numba 學 CUDA! 從入門到精通 (上)](https://medium.com/@spacetime0311/%E7%94%A8-numba-%E5%AD%B8-cuda-%E5%BE%9E%E5%85%A5%E9%96%80%E5%88%B0%E7%B2%BE%E9%80%9A-%E4%B8%8A-ede7b381f6c7)
- [用 numba 學 CUDA! 從入門到精通 (下)](https://medium.com/@spacetime0311/%E7%94%A8-numba-%E5%AD%B8-cuda-%E5%BE%9E%E5%85%A5%E9%96%80%E5%88%B0%E7%B2%BE%E9%80%9A-%E4%B8%8B-770c11bffd37) -->

經過一些研究後，筆者認為不該用 Numba 調用 CUDA，工欲善其事，既然程式碼沒有便攜性，那還不如直接用專門優化 CUDA 的套件。根據[此篇 reddit 的討論](https://www.reddit.com/r/Python/comments/xausj8/options_for_gpu_accelerated_python_experiments/)可以看到 CuPy 是一個不錯的選擇，是專門調用 CUDA 的套件。研究途中也發現一個新穎的套件 [Taichi](https://github.com/taichi-dev/taichi) 也可以調用 CUDA，稍微看過文檔後其特色大概在專攻<u>物理粒子計算</u>以及支援自動微分，官方也有[測試效能的文章](https://docs.taichi-lang.org/blog/taichi-compared-to-cub-cupy-numba)，根據該文章的測試結果，我們沒什麼理由使用 Numba 調用 CUDA。

### 使用字典傳遞參數
[官方文檔](https://numba.readthedocs.io/en/stable/reference/pysupported.html#typed-dict)

在數值模擬中，我們一定會遇到參數量超多的問題，Numba 其實支援[用字典傳遞參數](https://stackoverflow.com/questions/55078628/using-dictionaries-with-numba-njit-function)。


### Signature

[官方文檔 + 可用的 signature 列表](https://numba.readthedocs.io/en/stable/reference/types.html#numbers)  

顯式的告訴 Numba 輸出輸入型別，某些功能強制要求標示，語法是 `list[輸出1(輸入1A, 輸入1B), 輸出2(輸入2A, 輸入2B)]`。`float64[:]` 表示一維陣列，`float64[:,:]` 表示二維陣列。


<details>
<summary>簡單的 Numba signature 範例</summary>

```py
import numpy as np
import numba as nb


# 使用顯式 signature
@nb.jit("float64[:](float64[:], float64[:])", nopython=True)
def add_and_sqrt(x, y):
    result = np.empty_like(x)
    for i in range(len(x)):
        result[i] = np.sqrt(x[i] + y[i])
    return result


# 不使用顯式 signature
@nb.jit(nopython=True)
def add_and_sqrt_no_sig(x, y):
    result = np.empty_like(x)
    for i in range(len(x)):
        result[i] = np.sqrt(x[i] + y[i])
    return result


if __name__ == "__main__":
    x = np.random.random(100000)
    y = np.random.random(100000)

    _ = add_and_sqrt(x, y)
    _ = add_and_sqrt_no_sig(x, y)

    result_with_sig = add_and_sqrt(x, y)
    result_without_sig = add_and_sqrt_no_sig(x, y)
    print(f"結果是否相同: {np.allclose(result_with_sig, result_without_sig)}")

# 結果是否相同: True
```

</details>

<details>
<summary>複雜的 Numba signature 範例</summary>

此範例演示一個函式包含多個輸出輸入，也支援多種輸出輸入維度。

```py
from numba import njit, float64, types
import numpy as np


@njit(
    [
        types.Tuple((float64, float64))(float64, float64),
        types.Tuple((float64[:], float64[:]))(float64[:], float64[:]),
    ]
)
def cosd(angle1, angle2):
    result1 = np.cos(np.radians(angle1))
    result2 = np.cos(np.radians(angle2))
    return result1, result2


# Test with single values
angle1 = 45.0
angle2 = 90.0
result1, result2 = cosd(angle1, angle2)
print(f"Results for single values: {result1}, {result2}")

# Test with arrays
angles1 = np.array([0.0, 45.0, 90.0])
angles2 = np.array([30.0, 60.0, 90.0])
results1, results2 = cosd(angles1, angles2)
print(f"Results for arrays:\n{results1}\n{results2}")
```

</details>


### 其他裝飾器
常見裝飾器有

- vectorize
- guvectorize
- jitclass
- stencil

#### vectorize
[官方文檔](https://numba.readthedocs.io/en/stable/user/vectorize.html#the-vectorize-decorator)

vectorize 裝飾器語法限制輸入輸出和所有運算都只能是純量不能是向量，允許把純量操作向量化，並且可以把函式當作 [Numpy ufunc](http://docs.scipy.org/doc/numpy/reference/ufuncs.html) 使用。官方文檔花了很大的篇幅在描述該方法可以簡單的建立 Numpy ufunc 函式，因為[傳統方法](https://numpy.org/devdocs/user/c-info.ufunc-tutorial.html)需要寫 C 語言。對於效能，文檔很帥氣的輕描淡寫了一句話：

> Numba will generate the surrounding loop (or kernel) allowing efficient iteration over the actual inputs.

官網對如何優化 jit 專門寫了一篇文章，對於 vectorize 的效能僅僅就只寫了這麼一句話，看起來此裝飾器重點好像不是擺在效能上，然而[此文章](https://medium.com/@mflova/making-python-extremely-fast-with-numba-advanced-deep-dive-2-3-f809b43f8300)中的 vectorize 速度比起 jit 又快了 20 倍！根據他的解釋，vectorize 會告訴額外訊息給 LLVM，於是 LLVM 就可以藉此使用 CPU 的向量運算指令集 SIMD。

下方是基礎語法範例，效能測試我們放到下面強化版的 `guvectorize`：
```py
# Edit from: https://github.com/numba/numba/blob/main/numba/tests/doc_examples/test_examples.py
# test_vectorize_multiple_signatures
from numba import vectorize
import numpy as np

# 格式是 list[輸出1(輸入1A, 輸入1B), 輸出2(輸入2A, 輸入2B)]
@vectorize(["int32(int32, int32)",
            "int64(int64, int64)",
            "float32(float32, float32)",
            "float64(float64, float64)"])
def f(x, y):
    return x + y   # 定義時，函式內只能進行純量運算

a = np.arange(6)
result = f(a, a)   # 使用時，允許輸入向量
# result == array([ 0,  2,  4,  6,  8, 10])

correct = np.array([0, 2, 4, 6, 8, 10])
np.testing.assert_array_equal(result, correct)

a = np.linspace(0, 1, 6)
result = f(a, a)
# Now, result == array([0. , 0.4, 0.8, 1.2, 1.6, 2. ])

correct = np.array([0., 0.4, 0.8, 1.2, 1.6, 2. ])
np.testing.assert_allclose(result, correct)

a = np.arange(12).reshape(3, 4)
# a == array([[ 0,  1,  2,  3],
#             [ 4,  5,  6,  7],
#             [ 8,  9, 10, 11]])

result1 = f.reduce(a, axis=0)
print(result1)
# result1 == array([12, 15, 18, 21])

result2 = f.reduce(a, axis=1)
print(result2)
# result2 == array([ 6, 22, 38])

result3 = f.accumulate(a)
print(result3)
# result3 == array([[ 0,  1,  2,  3],
#                   [ 4,  6,  8, 10],
#                   [12, 15, 18, 21]])

result4 = f.accumulate(a, axis=1)
print(result4)
```

#### guvectorize
[官方文檔](https://numba.readthedocs.io/en/stable/user/vectorize.html#the-guvectorize-decorator)

generalized universal vectorizer，強化版的 vectorize，允許輸入是任意數量的 ufunc 元素，接受任意形狀輸入輸出的元素。黑魔法又來了，這裡官方仍舊沒有描述效能，然而[這篇文章](https://medium.com/@mflova/making-python-extremely-fast-with-numba-advanced-deep-dive-3-3-695440b62030)中測試 `guvectorize` 竟然又更快，比 `vectorize` 還快了六倍。

附上語法範例和效能測試

<Tabs>

  <TabItem value="1" label="語法示範">

    ```py
    # 以矩陣相乘示範 guvectorize 的語法
    from numba import guvectorize, prange
    import numpy as np
    import time


    # 簽章格式：在 list 中設定輸入選項，依序填寫 "輸入1, 輸入2, 輸出"。此範例可接受四種類型的輸入
    # 輸出輸入維度：只需定義維度 (m,n),(n,p)->(m,p)，也可以空白表示未指定，函式中不可寫 return
    # 函式輸入：最後一項輸入是應該要被回傳的計算結果，guvectorize 不 return 而是直接將結果寫入輸入矩陣
    @guvectorize(
        [
            "float64[:,:], float64[:,:], float64[:,:]",
            "float32[:,:], float32[:,:], float32[:,:]",
            "int64[:,:], int64[:,:], int64[:,:]",
            "int32[:,:], int32[:,:], int32[:,:]",
        ],
        "(m,n),(n,p)->(m,p)",
    )
    def matrix_multiply(A, B, C):
        m, n = A.shape
        n, p = B.shape
        for i in range(m):
            for j in range(p):
                C[i, j] = 0
                for k in range(n):
                    C[i, j] += A[i, k] * B[k, j]


    # guvectorize with prange
    # 測試 nopython, parallel
    @guvectorize(
        [
            "float64[:,:], float64[:,:], float64[:,:]",
            "float64[:,:], float64[:,:], float64[:,:]",
            "int32[:,:], int32[:,:], int32[:,:]",
            "int64[:,:], int64[:,:], int64[:,:]",
        ],
        "(m,n),(n,p)->(m,p)",
        nopython=True,
        target="parallel",
    )
    def matrix_multiply_prange(A, B, C):
        m, n = A.shape
        n, p = B.shape
        for i in prange(m):
            for j in range(p):
                C[i, j] = 0
                for k in range(n):
                    C[i, j] += A[i, k] * B[k, j]


    def run_benchmark():
        n_runs = 1
        N = 100
        A = np.random.rand(N, N).astype(np.float64)
        B = np.random.rand(N, N).astype(np.float64)
        res_python = A @ B

        start = time.time()
        for _ in range(n_runs):
            C = np.empty((N, N), dtype=np.float64)
            matrix_multiply(A, B, C)
            print("Are the results the same?", np.allclose(C, res_python))
        end = time.time()
        print("Without prange: Total time for {} runs: {:.4f} seconds".format(n_runs, end - start))

        start = time.time()
        for _ in range(n_runs):
            C_prange = np.empty((N, N), dtype=np.float64)
            matrix_multiply_prange(A, B, C_prange)
            print("Are the results the same?", np.allclose(C_prange, res_python))
        end = time.time()
        print("With prange: Total time for {} runs: {:.4f} seconds".format(n_runs, end - start))

    run_benchmark()

    # Are the results the same? True
    # Without prange: Total time for 1 runs: 0.0012 seconds
    # Are the results the same? True
    # With prange: Total time for 1 runs: 0.0012 seconds
    ```

</TabItem>

<TabItem value="2" label="測試矩陣相乘">

程式碼來自於 [Dask + Numba for Efficient In-Memory Model Scoring](https://medium.com/capital-one-tech/dask-numba-for-efficient-in-memory-model-scoring-dfc9b68ba6ce)。

    ```py
    # 測試矩陣相乘的效能
    import numpy as np
    import time
    from numba import njit, guvectorize, prange

    n = 250000
    x = np.random.poisson(lam=5, size=n)
    y, z = np.random.normal(size=(n, 2)).T
    overlay = False
    n_runs = 100
    res = np.zeros((n, 15))


    # 原始Python版本
    def python_func(x, y, z, overlay=False):
        out = np.zeros((x.shape[0], 15))
        adj = 1.5 if overlay else 1.0
        for t in range(15):
            out[:, t] = t * x**2 + y - 2 * z - 2 * t
        return adj * out


    # @njit 優化版本
    @njit
    def jitted_func(x, y, z, overlay=False):
        out = np.zeros((x.shape[0], 15))
        adj = 1.5 if overlay else 1.0
        for t in range(15):
            out[:, t] = t * x**2 + y - 2 * z - 2 * t
        return adj * out


    # @njit + signature 優化版本
    @njit("float64[:,:](int64[:], float64[:], float64[:], boolean)")
    def jitted_func_with_signature(x, y, z, overlay=False):
        out = np.zeros((x.shape[0], 15))
        adj = 1.5 if overlay else 1.0
        for t in range(15):
            out[:, t] = t * x**2 + y - 2 * z - 2 * t
        return adj * out


    # @guvectorize 優化版本
    @guvectorize(
        "i8, f8, f8, b1, f8[:], f8[:]",
        "(), (), (), (), (specifySameDimension) -> (specifySameDimension)",
    )
    def fast_predict_over_time(x, y, z, overlay, _, out):
        adj = 1.5 if overlay else 1.0
        for t in range(len(out)):
            out[t] = adj * (t * x**2 + y - 2 * z - 2 * t)


    # 初始化編譯
    res_python = python_func(x, y, z, overlay)
    res_jitted = jitted_func(x, y, z, overlay)
    res_jitted_signature = jitted_func_with_signature(x, y, z, overlay)
    res_fast_pred = fast_predict_over_time(x, y, z, overlay, res)

    # 1. 測試原始Python版本
    start_time = time.time()
    for _ in range(n_runs):
        _ = python_func(x, y, z, overlay)
    end_time = time.time()
    print(f"Time: {(end_time - start_time) / n_runs:.6f} seconds, pure Python")

    # 2. 測試 @njit 優化版本
    start_time = time.time()
    for _ in range(n_runs):
        _ = jitted_func(x, y, z, overlay)
    end_time = time.time()
    print(f"Time: {(end_time - start_time) / n_runs:.6f} seconds, pure @njit")

    # 3. 測試 @njit + signature 優化版本
    start_time = time.time()
    for _ in range(n_runs):
        _ = jitted_func_with_signature(x, y, z, overlay)
    end_time = time.time()
    print(f"Time: {(end_time - start_time) / n_runs:.6f} seconds, @njit with signature")

    # 4. 測試 @guvectorize 優化版本
    start_time = time.time()
    for _ in range(n_runs):
        _ = fast_predict_over_time(x, y, z, overlay, res)
    end_time = time.time()
    print(f"Time: {(end_time - start_time) / n_runs:.6f} seconds, @guvectorize")

    print("Are the results the same?", np.allclose(res_python, res_fast_pred))
    print("Are the results the same?", np.allclose(res_python, res_jitted_signature))

    # Time: 0.039077 seconds, pure Python
    # Time: 0.027496 seconds, pure @njit
    # Time: 0.027633 seconds, @njit with signature
    # Time: 0.005587 seconds, @guvectorize
    # Are the results the same? True
    # Are the results the same? True
    ```
</TabItem>

<TabItem value="3" label="測試邏輯迴歸">

這是[官方文檔的範例](https://numba.readthedocs.io/en/stable/user/parallel.html#examples)，文檔目的是說明使用 `guvectorize` 會把簡單的程式碼展開到很複雜，此範例中 `guvectorize` 比 `njit` 慢。

    ```py
    # 測試邏輯回歸的效能
    import time
    import numpy as np
    from numba import guvectorize, njit, prange


    # Python
    def logistic_regression_py(Y, X, w, iterations):
        for i in range(iterations):
            w -= np.dot(((1.0 / (1.0 + np.exp(-Y * np.dot(X, w))) - 1.0) * Y), X)
        return w


    # njit
    @njit(parallel=True)
    def logistic_regression_njit(Y, X, w, iterations):
        for _ in prange(iterations):
            w -= np.dot(((1.0 / (1.0 + np.exp(-Y * np.dot(X, w))) - 1.0) * Y), X)
        return w


    # guvectorize
    @guvectorize(
        ["void(float64[:], float64[:,:], float64[:], int64, float64[:])"],
        "(n),(n,m),(m),()->(m)",
        nopython=True,
        target="parallel",
    )
    def logistic_regression_guvec(Y, X, w, iterations, result):
        for i in prange(iterations):
            temp = np.zeros_like(w)
            for j in range(X.shape[0]):
                dot_product = np.dot(X[j].copy(), w.copy())
                sigmoid = 1.0 / (1.0 + np.exp(-Y[j] * dot_product))
                temp += (sigmoid - 1.0) * Y[j] * X[j]
            w -= temp / X.shape[0]


    np.random.seed(0)
    Y = np.abs(np.random.randn(4000))
    X = np.abs(np.random.randn(4000, 10))
    w = np.abs(np.random.randn(10))
    iterations = 100
    n_runs = 10

    w_guvec = np.zeros_like(w)
    logistic_regression_njit(Y, X, w.copy(), iterations)
    logistic_regression_guvec(Y, X, w.copy(), iterations, w_guvec)

    start_py = time.time()
    for _ in range(n_runs):
        w_py = logistic_regression_py(Y, X, w.copy(), iterations)
    end_py = time.time()
    print(f"Time: {(end_py - start_py) / n_runs:.6f} seconds, pure Python")

    start_njit = time.time()
    for _ in range(n_runs):
        w_njit = logistic_regression_njit(Y, X, w.copy(), iterations)
    end_njit = time.time()
    print(f"Time: {(end_njit - start_njit) / n_runs:.6f} seconds, @njit+parallel")

    start_guvec = time.time()
    for _ in range(n_runs):
        logistic_regression_guvec(Y, X, w.copy(), iterations, w_guvec)
    end_guvec = time.time()
    print(f"Time: {(end_guvec - start_guvec) / n_runs:.6f} seconds, guvectorize")

    # Time: 0.027217 seconds, pure Python
    # Time: 0.017704 seconds, @njit+parallel
    # Time: 0.100319 seconds, guvectorize
    ```

</TabItem>

<TabItem value="4" label="測試計算弧長">

本範例來自於 [Python 加速符文：高效能平行科學計算](https://stephlin.github.io/posts/Python/Python-speedup.html)，該文章沒有使用 `guvectorize` 就下結論了，這裡幫他補上後可以發現效能又快了將近**一個數量級**，優化後的效能甚至可能超過 pybind11。

    ```py
    # 測試計算弧長的效能
    import time
    import numpy as np
    from numba import guvectorize, njit, prange


    # Python 版本
    def arc_length_py(points: np.ndarray) -> float:
        piecewice_length = np.linalg.norm(np.diff(points, axis=0), axis=1)
        return np.sum(piecewice_length)


    # njit 版本
    @njit(parallel=True)
    def arc_length_njit1(points: np.ndarray) -> float:
        length = 0

        for i in prange(points.shape[0] - 1):
            piecewice_length = np.sqrt(np.sum((points[i + 1] - points[i]) ** 2))
            length += piecewice_length

        return length


    # guvectorize 版本
    @guvectorize(["void(float64[:,:], float64[:])"], "(n,m)->()", nopython=True, target='parallel')
    def arc_length_guvec(points: np.ndarray, result: np.ndarray):
        length = 0

        for i in range(points.shape[0] - 1):
            piecewice_length = 0
            for j in range(points.shape[1]):
                piecewice_length += (points[i + 1, j] - points[i, j]) ** 2
            length += np.sqrt(piecewice_length)

        result[0] = length


    # 初始化
    n_runs = 100
    n_points = 10_000_000
    points = np.random.rand(n_points, 2)
    res = np.zeros(1)
    _ = arc_length_guvec(points, res)
    _ = arc_length_njit1(points)

    start_py = time.time()
    w_py = arc_length_py(points)
    end_py = time.time()
    print(f"Time: {(end_py - start_py):.6f} seconds, pure Python")

    start_njit = time.time()
    for _ in range(n_runs):
        w_njit = arc_length_njit1(points)
    end_njit = time.time()
    print(f"Time: {(end_njit - start_njit) / n_runs:.6f} seconds, njit")

    start_guvec = time.time()
    for _ in range(n_runs):
        w_guvec = arc_length_guvec(points, res)
    end_guvec = time.time()
    print(f"Time: {(end_guvec - start_guvec) / n_runs:.6f} seconds, guvectorize")

    isclose_njit = np.allclose(w_py, w_njit)
    isclose_guvec = np.allclose(w_py, res[0])
    print("Are the results the same? njit:", isclose_njit, "guvec:", isclose_guvec)

    # Time: 0.326715 seconds, pure Python
    # Time: 0.138515 seconds, njit
    # Time: 0.017213 seconds, guvectorize
    # Are the results the same? njit: True guvec: True
    ```

</TabItem>

</Tabs>

<br/>
:::tip 參數

guvectorize 和 vectorize 的 parallel 語法是 `target="option"`，選項有 cpu, parallel 和 cuda 三種。

如果測試數據太小 parallel 和 cuda 性能反而會下降，因為才剛搬東西到記憶體就結束了。官方給出的建議是使用 parallel 數據至少大於 1KB，至於 cuda 那肯定要再大更多。

:::

#### jitclass
[官方文檔](https://numba.readthedocs.io/en/stable/user/jitclass.html)  

把 class 中所有 methods 都用 Numba 優化，還在實驗版本。

個人認為這種方法不太好用，因為需要明確指定 class 中所有成員的資料類型。不如直接在外面寫好 Numba 裝飾的函式，然後在 class 中定義方法來調用會更簡單，附上[有使用到 jitclass 的教學](https://curiouscoding.nl/posts/numba-cuda-speedup/)。

#### stencil
[官方文檔](https://numba.readthedocs.io/en/stable/user/stencil.html)

用於固定模式（stencil kernel）的運算以簡化程式碼，例如對上下左右取平均，可以寫成如下方形式，可讀性高，專有名詞似乎叫做 stencil computing。

```py
import time
import numpy as np
from numba import stencil, njit

@stencil
def kernel1(a):
    # a 代表套用核心的輸入陣列
    return 0.25 * (a[0, 1] + a[1, 0] + a[0, -1] + a[-1, 0])

@njit
def kernel1_jit(a):
    return kernel1(a)

def kernel1_python(a):
    result = np.zeros_like(a)
    for i in range(1, a.shape[0] - 1):
        for j in range(1, a.shape[1] - 1):
            result[i, j] = 0.25 * (a[i, j + 1] + a[i + 1, j] + a[i, j - 1] + a[i - 1, j])
    return result

@njit
def kernel1_python_jit(a):
    result = np.zeros_like(a)
    for i in range(1, a.shape[0] - 1):
        for j in range(1, a.shape[1] - 1):
            result[i, j] = 0.25 * (a[i, j + 1] + a[i + 1, j] + a[i, j - 1] + a[i - 1, j])
    return result


n_runs = 100
input_array = np.random.rand(5000, 5000)

# 第一次運行的初始化，第二次以後才是單純的執行時間
output_array_stencil = kernel1_jit(input_array)
output_array_python = kernel1_python_jit(input_array)

start = time.time()
for _ in range(n_runs):
    kernel1_jit(input_array)
end = time.time()
print(f"stencil: {(end - start)/n_runs} 秒")

start = time.time()
for _ in range(n_runs):
    kernel1_python_jit(input_array)
end = time.time()
print(f"pure jit: {(end - start)/n_runs} 秒")

# Compare the results
print("Are the outputs equal?", np.array_equal(output_array_stencil, output_array_python))

# 輸出

# stencil: 0.03909627914428711 秒
# pure jit: 0.038599507808685304 秒
# Are the outputs equal? True
```

#### overload
[官方文檔](https://numba.pydata.org/numba-doc/dev/extending/overloading-guide.html)

除了手刻不支援的函式以外，Numba 提供了一個高階方式讓你替代不支援的函式，官方範例是使用 `@overload(scipy.linalg.norm)` 替代 `scipy.linalg.norm`，範例中使用手刻的 `_oneD_norm_2` 實現範數的實作。

這個裝飾器像他的名字一樣用於重載整個函式，用於修改原本的函式內容，是很高階的使用方式，除非必要不建議使用，會大幅增加程式維護難度。

### 線程設定

[官方文檔](https://numba.readthedocs.io/en/stable/user/threading-layer.html)

Numba 可以設定 threading layer 使用哪種方式管理，有以下四種選項：
- `default` provides no specific safety guarantee and is the default.
- `safe` is both fork and thread safe, this requires the tbb package (Intel TBB libraries) to be installed.
- `forksafe` provides a fork safe library.
- `threadsafe` provides a thread safe library.
<br/>

```py
# 設定只使用兩個線程執行，此指令等效於 NUMBA_NUM_THREADS=2
# 官方文檔說明：在某些情形下應該設定為較低的值，以便 numba 可以與更高層級的平行性一起使用（但是文檔沒有說是哪些情形）
set_num_threads(2)
sen: %s" % threading_layer())
```



### 提前編譯
[官方文檔](https://numba.readthedocs.io/en/stable/user/pycc.html)

Numba 主要是使用即時編譯，但也支援像 C 語言一樣提前編譯打包後執行。

- 優點
    - 執行時不需 Numba 套件。
    - 沒有編譯時間開銷。  
- 缺點
    - 不支援 ufunc。
    - 必須明確指定函式簽名 (signatures)。
    - 導出的函式不會檢查傳遞的參數類型，調用者需提供正確的類型。
    - AOT 編譯生成針對 CPU 架構系列的通用程式碼（如 "x86-64"），而 JIT 編譯則生成針對特定 CPU 型號的優化程式碼。

### jit_module
[官方文檔](https://numba.readthedocs.io/en/stable/user/jit-module.html)

開發者用，讓整個模組的函式都自動被 jit 裝飾。除了官方文檔，這裡節錄 Github 原始碼中的註解：

> Note that ``jit_module`` should only be called at the end of the module to be jitted. In addition, only functions which are defined in the module ``jit_module`` is called from are considered for automatic jit-wrapping.


## 結合分佈式計算
常見的分佈式工具有 Ray 和 Dask，比如說我們可以結合 Dask + Numba 打一套組合拳，例如

- [資料層級的平行化處理](https://blog.dask.org/2019/04/09/numba-stencil)，也包含 stencil 範例。
- [減少記憶體使用量](https://medium.com/capital-one-tech/dask-numba-for-efficient-in-memory-model-scoring-dfc9b68ba6ce)。

## 常見問題
1. 我要學會寫平行運算？  
不用，網路上在亂教，numba 會自動處理平行運算，官方文檔也表示其內建的自動平行化功能效能比手寫還好，下一篇文章我們會討論各種設定的效能。

2. [可不可以把函式當參數給 numba 優化？](https://numba.readthedocs.io/en/stable/user/faq.html#can-i-pass-a-function-as-an-argument-to-a-jitted-function)  
可以，但是會造成額外 call stack 開銷，請考慮工廠模式。

3. 提前編譯執行效率會變高嗎？  
不會。根據文檔，提前編譯會生成最泛用的函式而不是最符合當前 CPU/GPU 的函式。

4. Numba JIT 和 Python JIT 一樣嗎？  
根據 [PEP 744](https://peps.python.org/pep-0744/) CPython JIT 使用 micro-ops 和 copy-and-patch 技術，並且使用運行時的分析資訊進行優化，而 Numba 是基於 LLVM 編譯器優化數值運算的 JIT 編譯器，筆者在文檔或者 Numba Github repo 中也完全搜不到有關熱點分析的關鍵字，都是 JIT，實際上略有不同。

5. Numba 可能會產生和 Numpy 不一樣的結果  
根據[浮點陷阱](https://numba.readthedocs.io/en/stable/reference/fpsemantics.html)，我們應該避免對同一矩陣重複使用 Numba 運算以免計算誤差被放大。


## See Also
這裡放筆者覺得有用的文章。

- [官方使用範例](https://numba.readthedocs.io/en/stable/user/examples.html)
- 🔥🔥🔥 **非常優質的連續三篇系列文章，你最好把這裡全部看過！**  
[Making Python extremely fast with Numba: Advanced Deep Dive (1/3)](https://medium.com/@mflova/making-python-extremely-fast-with-numba-advanced-deep-dive-1-3-4d303edeede4)  
[Making Python extremely fast with Numba: Advanced Deep Dive (2/3)](https://medium.com/@mflova/making-python-extremely-fast-with-numba-advanced-deep-dive-2-3-f809b43f8300)  
[Making Python extremely fast with Numba: Advanced Deep Dive (3/3)](https://medium.com/@mflova/making-python-extremely-fast-with-numba-advanced-deep-dive-3-3-695440b62030)  
- 🔥 對 Numba 程式碼進行效能分析。  
[Profiling your Numba code](https://pythonspeed.com/articles/numba-profiling/)
- 🔥 陣列運算降低 Numba 速度的範例。  
[The wrong way to speed up your code with numba](https://pythonspeed.com/articles/slow-numba/)  
- 🔥 分支預測如何降低程式碼速度，以強迫寫入解決。  
[Understanding CPUs can help speed up Numba and NumPy code](https://pythonspeed.com/articles/speeding-up-numba/)
- 影像處理演算法的優化：從基礎實現開始  
[Speeding up your code when multiple cores aren’t an option](https://pythonspeed.com/articles/optimizing-dithering/)
- 為每個線程建立 local storage 以提升效能  
[Tips for optimising parallel numba code](https://chryswoods.com/accelerating_python/numba_bonus.html)
- 🔥 CUDA 加速並且有完整的對比，值得一看。  
[28000x speedup with Numba.CUDA](https://curiouscoding.nl/posts/numba-cuda-speedup/)   
- 非常長的 CUDA 教學文章。  
[用 Numba 學 CUDA! 從入門到精通 (上)](https://medium.com/@spacetime0311/%E7%94%A8-numba-%E5%AD%B8-cuda-%E5%BE%9E%E5%85%A5%E9%96%80%E5%88%B0%E7%B2%BE%E9%80%9A-%E4%B8%8A-ede7b381f6c7) 
- 非常長的 CUDA 教學文章。  
[用 Numba 學 CUDA! 從入門到精通 (下)](https://medium.com/@spacetime0311/%E7%94%A8-numba-%E5%AD%B8-cuda-%E5%BE%9E%E5%85%A5%E9%96%80%E5%88%B0%E7%B2%BE%E9%80%9A-%E4%B8%8B-770c11bffd37)
- 使用 Dask + Numba 的簡單範例，其中包括 guvectoize 的使用。  
[Dask + Numba for Efficient In-Memory Model Scoring](https://medium.com/capital-one-tech/dask-numba-for-efficient-in-memory-model-scoring-dfc9b68ba6ce) 
- 使用 Numba CUDA 功能加上 Dask 分散式加速運算並解決顯卡記憶體不足的問題。  
[Accelerated Portfolio Construction with Numba and Dask in Python](https://developer.nvidia.com/blog/accelerated-portfolio-construction-with-numba-and-dask-in-python/)
- 需要有計算機組織的知識才能讀懂得性能優化指南  
[How to Write Fast Numerical Code](https://people.inf.ethz.ch/markusp/teaching/263-2300-ETH-spring14/slides/06-locality-caches.pdf)

- 非官方[中文文檔](https://github.com/apachecn/numba-doc-zh) 只更新到 0.44，按需觀看，舊版缺乏使用警告可能導致意想不到的錯誤。


## 附錄
- AOT  
  Compilation of a function in a separate step before running the program code, producing an on-disk binary object which can be distributed independently. This is the traditional kind of compilation known in languages such as C, C++ or Fortran.

- Python bytecode （字節碼）  
  The original form in which Python functions are executed. Python bytecode describes a stack-machine executing abstract (untyped) operations using operands from both the function stack and the execution environment (e.g. global variables).

- JIT  
  Compilation of a function at execution time, as opposed to ahead-of-time compilation.

- ufunc  
  A NumPy universal function. numba can create new compiled ufuncs with the @vectorize decorator.

- jitted
  經過 JIT 編譯後的程式碼稱做 jitted。

- [延伸嘴砲] 甚至可以找到這樣的一篇論文：Dask & Numba: Simple libraries for optimizing scientific python code，恕我直言，這比熊文案還水。

- 參考資料  
  雖然本文自己說面向中階用戶，但是在 Anaconda 爸爸的投影片裡面我們才在最初階而已 (p13)
  [Accelerated Computing in Python (with Numba)](https://indico.cern.ch/event/824917/contributions/3571661/attachments/1934964/3206289/2019_10_DANCE_Numba.pdf)

## 結語
長達一萬字的教學結束了，Markdown 總字數超過三萬，應該來個一鍵三連吧。

目標讀者其實就是在說通訊系，也就是當年的自己。

開頭的最快、最正確和最完整，其實是自己看網路文章一直以來的不舒服感，完整的太詳細（跟讀文檔沒兩樣），快且正確的文章又不完整，好像永遠沒辦法兼顧。於是本文和我寫的其他教學文章一樣，主要照顧初學者，讓初學者可以快速上手，讀起來又完整，而且內容還正確，當讀者不需要使用平行化時可以在十分鐘之內搞定 Numba，需要平行化或 vectorize 等高級使用技巧時也對網路上許多錯誤做出勘誤和實測結果，感謝能讀完的各位。

>內容基於 Numba 文檔，作者：Anaconda, Inc.，授權：BSD 2-Clause。
>
>- GitHub: https://github.com/numba/numba
>- 文檔: https://numba.readthedocs.io/