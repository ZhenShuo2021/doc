---
title: Python 中的異步操作 - 協程
description:  Python 中的異步操作 - 協程 asyncio，從原理到實際使用一一破解，沒有廢話，沒有錯誤，全是乾貨。
sidebar_label: 異步操作 - 協程
tags:
  - Programming
  - Python
  - multitasking
keywords:
  - Programming
  - Python
  - multitasking
  - async
  - 非同步
  - 異步
last_update:
  date: 2024-11-19T14:23:30+08:00
  author: zsl0621
first_publish:
  date: 2024-11-19T14:23:30+08:00
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Python 中的異步操作 - 協程

本文不敢說寫的多好，但是盡量保持內容正確。

請注意這篇文章介紹的是 Python 協程，不同語言的協程會有微妙差異。

## 異步簡介

協程是一種異步操作，和以往一般程式的同步操作有所不同，所以先介紹什麼是異步。如果下面的對比看完有點不清楚，記得這句話至少理解不會歪掉：

> 一個人在<u>**等待**</u>某項工作（如等待網路回應）時，先<u>**切換**</u>去處理其他工作，線程和進程則是多個人同時工作[^diff]。

光是一句話說明可能不好理解和傳統多線程的差異，這裡我們稍微比較兩者不同。

[^diff]: 註：Python 中的線程被 GIL 鎖住雖然有很多人但是一次只有一人工作。


- 控制方式差異  
對比多線程，協程是<u>**完全不同概念，無法類比**</u>，協程由「程式本身」管理，是一種允許在單一線程內實現異步執行的程式「物件」，後兩者是由作業系統管理的「執行單元」，由「作業系統」[控制](https://discuss.python.org/t/python-context-switching-how-is-it-done/8635)。

- 多工方式的差異  
  1. 協程是一個人快速切換工作讓用戶以為是多工，多線程/多進程使用多人同時進行工作。  
  2. 協程使用協作式多工（cooperative multitasking），由程式碼<u>**主動**</u>讓出控制權，而<u>**不需要作業系統的上下文切換**</u>，因此開銷更小。反之，多進程和多線程是搶佔式多工 (preemptive multitasking)，他們切換是不情不願，是被作業系統強制踢出換人工作。

- 更具體說明  
協程透過 <u>**事件迴圈 (event loop)**</u> 調度。當程式執行到 await 語句（<u>等待某項工作</u>）時，事件迴圈會切換（<u>切換去處理其他工作</u>）到下一個可執行的任務，藉此利用等待時間執行其他任務，因此特別適合 I/O bound 的任務，例如網路請求、檔案操作等任務。

這樣我們就很清楚了解，使用事件迴圈調度多個任務，程式碼必須在需要等待的地方使用 await 關鍵字主動讓出控制權，以此完成協作式多工。


<br/>

:::danger 常見錯誤[^note]
「協程可以被視為一個輕量級的線程」這句話引喻失義，是非常危險且具誤導性的錯誤概念！

協程僅是 Python 的一種物件，透過事件迴圈管理，和實體的線程以及進程不同。前者透過程式自行管理運行在 user space，後者需要 system call 透過作業系統建立，完全是不同東西，多工協作模式也不同，怎麼可以「被視為」呢？

如果試圖用一句話概括協程，我們可以說是「單一執行緒內執行多個任務的輕量級並發方式，通過非阻塞方式切換來提高效率」，但絕對不是線程。
:::

[^note]: 此處專指 Python，Golang 的協程確實是輕量級線程。線程的定義是操作系統中最小的執行單位，每個線程有自己的 stack、register 和 program counter，而筆者定義能不能算是線程的一種是依據該異步操作是否透過事件迴圈調度，如果透過事件迴圈就**絕對不是輕量級線程**。因為事件迴圈調度的協程並非真正的並行執行，而是靠協作式切換模擬並行，[不具備獨立的 stack 和 register](https://stackoverflow.com/questions/70339355/are-python-coroutines-stackless-or-stackful)。

- 文章閱讀：[異步技術：徹底理解Async、Await與Event Loop](https://medium.com/@ackerley19/%E7%95%B0%E6%AD%A5%E6%8A%80%E8%A1%93-%E5%BE%B9%E5%BA%95%E7%90%86%E8%A7%A3async-await%E8%88%87event-loop-3943a4ec9814)，少數同時能說明清楚並且真的正確的文章。

## Python 異步程式的組成和架構

> 通常筆者會從高階使用開始介紹，最後才是低階組成，然而異步的特殊性讓其需要從低階開始介紹，如果從高階用法開始介紹會造成「可以動但不知道做了什麼」的問題。

### 組成

經由上述介紹我們可以知道協程不是一個活的線程或進程，是「程」這個翻譯帶來誤解。一個 Python 非同步程式需要以下幾個元件組成：

1. 事件迴圈 (Event-loop)：非同步的關鍵核心，負責協調不同任務。事件迴圈不斷檢查是否有新任務並管理它們的進入與退出。
2. 任務 (Task)：事件迴圈中工作執行的單位，運行協程的載體，負責追蹤協程的執行狀態、例外處理[^fut]。
3. 協程 (Coroutine)：使用 `async def` 定義的函式，以及所有可以暫停與恢復執行的物件。
4. await 關鍵字：執行到此行會自動讓出控制權，用來等待一個 [awaitable 物件](https://docs.python.org/3/glossary.html#term-awaitable)[^awaitable]完成。

[^fut]: 還有不常用到的五：未來物件 (Future)，代表未完成的計算結果，可被設定為完成或取消。實際上 Task 繼承自 Future。
[^awaitable]: awaitable 物件定義: 協程或是任何具有 `__await__` 方法的物件。

<details>
<summary>協程</summary>

由於協程的特殊性和常有文章誤導將協程比喻為線程，這裡我們需要特別解釋協程。

定義：可以在運行中暫停和恢復執行的函式。

:::tip 文檔定義
Coroutines are a more generalized form of subroutines. Subroutines are entered at one point and exited at another point. Coroutines can be entered, exited, and resumed at many different points. They can be implemented with the async def statement. See also PEP 492.
:::

如果看舊版文章會發現使用 `yield` 的生成器函式、使用 `@types.coroutine` 裝飾器的函式都屬於協程，知道在定義上他們屬於協程就好，現在沒有必要使用這些方法。

協程分為兩種：協程函式和程物件，當我們使用 `async def` 定義一個函式，他是協程函式；當我們實例化這個函式，他無法被直接執行，而是返回一個<u>**協程物件**</u>。

</details>

### 架構

把這些元件組合起來就是：由 await 定義每個協程應該要在哪裡主動交還控制權，把協程包裝成任務後交由事件迴圈負責管理各個任務的執行和退出。

現在我們知道總共有四項元件，這裡根據這些元件寫出一個完全按照原理實現的範例：

```py
import asyncio

# 建立協程函式
async def my_coroutine():
    print("開始")
    await asyncio.sleep(1)
    print("結束")

# 建立協程物件
coroutine_obj = my_coroutine()

# 建立事件迴圈
loop = asyncio.new_event_loop()

# 指定使用此事件迴圈
asyncio.set_event_loop(loop)

# 將協程物件包裝成 Task，並且註冊到事件迴圈
task = loop.create_task(coroutine_obj)

# 執行事件迴圈直到任務（task）完成
loop.run_until_complete(task)

# 關閉事件迴圈，釋放資源
loop.close()
```

雖然看起來很麻煩，但是實際使用時我們不會這樣手動慢慢建立，使用高階函式完成可以把從「建立協程物件」到「關閉事件迴圈」六個步驟簡化成以下輕鬆完成：

```py
asyncio.run(my_coroutine())
```

## 使用方式
本章節給出幾種基本使用方式，asyncio.sleep 代表每次 IO 任務中的等待，等待時就會切換到下一個任務執行。

### 基本語法 asyncio.run

如果我們觀察 `asyncio.run` 的原始碼，可以看到完整實現確實和基本範例相同（筆者有刪除錯誤處理），但是透過手動建立可以清楚知道協程的完整運作，知道事件迴圈負責控制任務，協程物件才是真正被註冊事件迴圈中的物件，註冊後輸出 task 執行協程，最後關閉事件迴圈。

```py
def run(main, *, debug=None):
    """Execute the coroutine and return the result.

    This function runs the passed coroutine, taking care of
    managing the asyncio event loop and finalizing asynchronous
    generators.

    This function cannot be called when another asyncio event loop is
    running in the same thread.

    If debug is True, the event loop will be run in debug mode.

    This function always creates a new event loop and closes it at the end.
    It should be used as a main entry point for asyncio programs, and should
    ideally only be called once.
    """
    loop = events.new_event_loop()
    try:
        events.set_event_loop(loop)
        if debug is not None:
            loop.set_debug(debug)

        # 注意使用run_until_complete時如果參數是coroutine object
        # 將會被隱式的被轉換為asyncio.Task運作，筆者範例使用顯式轉換成asyncio.Task
        return loop.run_until_complete(main)
    finally:
        try:
            _cancel_all_tasks(loop)
            loop.run_until_complete(loop.shutdown_asyncgens())
            loop.run_until_complete(loop.shutdown_default_executor())
        finally:
            events.set_event_loop(None)
            loop.close()
```

### 非阻塞示範 asyncio.gather
上面的程式只是執行了一個協程函式，完全沒有顯示出協程的優勢，這裡我們建立三個協程物件，註冊到事件迴圈中執行。

在這裡我們不能使用三次 `asyncio.run(my_coroutine())`，因為 `asyncio.run` 每次執行會建立一個事件迴圈執行裡面的任務，所以如果使用三次會變成三個事件迴圈，沒有起到任務交換的作用。

```py
import asyncio
import time

async def my_coroutine():
    print("開始")
    await asyncio.sleep(1)
    print("結束")

loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

# 註冊三個協程並創建任務
task = loop.create_task(my_coroutine())
task = loop.create_task(my_coroutine())
task = loop.create_task(my_coroutine())

t = time.time()
loop.run_until_complete(task)
print(f"processing time: {(time.time() - t):.2f}")

loop.close()

# processing time: 1.00
```

這樣還是很麻煩，好在其實有高階 API `asyncio.gather`。在此範例中，我們使用 tasks 儲存協程物件，並且把他交給 asyncio.gather，世界瞬間光明

```py
import asyncio
import time

async def my_coroutine():
    print("開始")
    await asyncio.sleep(1)
    print("結束")

async def main():
    coro_list = [my_coroutine(1) for _ in range(20)]   # 建立包含20個協程物件的列表
    await asyncio.gather(*coro_list)   # 使用解包運算符把列表內容取出，傳給asyncio.gather

t = time.time()
asyncio.run(main())
print(f"processing time: {(time.time() - t):.2f}")

# processing time: 1.00
```

### 最大同時並行數量範例
一堆 1 滿無聊的對吧，這裡使用 Semaphore 鎖住最大任務數量，並且輸入變動的睡眠（I/O等待）時間，由此範例說明執行時間，以輸入時間 [1, 2, 3, 2, 3] 為例

1. 時間 0 沒有任務結束，提交三個任務，任務中最長等待時間 3 秒
2. 時間 1 任務一結束，提交任務四，任務中最長等待時間 2 秒
3. 時間 2 任務二結束，提交任務五，任務中最長等待時間 3 秒

所以時間 5 時所有任務結束，程式耗時 5 秒。

```py
import asyncio
import time

async def my_coroutine(task_id, sleep_time):
    print(f"Task {task_id} 開始，睡眠 {sleep_time} 秒")
    await asyncio.sleep(sleep_time)
    print(f"Task {task_id} 結束")

async def main():
    task_data = [(i+1, sleep_time) for i, sleep_time in enumerate([1, 2, 3, 2, 3])]

    # 控制同時執行的最大數量
    sem = asyncio.Semaphore(3)

    async def sem_coroutine(task_id, sleep_time):
        async with sem:
            await my_coroutine(task_id, sleep_time)

    tasks = [sem_coroutine(task_id, sleep_time) for task_id, sleep_time in task_data]
    await asyncio.gather(*tasks)


t = time.time()
asyncio.run(main())
print(f"processing time: {(time.time() - t):.2f}")

# Task 1 開始，睡眠 1 秒
# Task 2 開始，睡眠 2 秒
# Task 3 開始，睡眠 3 秒
# Task 1 結束
# Task 4 開始，睡眠 2 秒
# Task 2 結束
# Task 5 開始，睡眠 3 秒
# Task 3 結束
# Task 4 結束
# Task 5 結束
# processing time: 5.00
```

### Future 範例
比較少用到 Future，這裡放上最小範例，和 ThreadPoolExecutor 的 future 一樣道理，先註冊任務，再使用 `as_complete` 獲取結果。

```py
import asyncio

async def main():
    future = asyncio.Future()
    future.set_result("未來")

    print("未來還沒來")
    result = await future
    print(result)

asyncio.run(main())

# 輸出結果：先執行下面的還沒來，才印出未來

# 未來還沒來
# 未來
```

## 相關語法和函式
本章節列出常用的語法和函式。學習協程的障礙在於不清楚有哪些物件以及不知如何正確執行，前面的文章已經說明相關物件，接下來列出相關函式讓你快速知道如何調用，有個基礎印象不用找文檔找到懷疑人生。

### 高階 API 函式

- asyncio.run(): 最簡單且最常見的用法，會自動創建事件迴圈、運行指定的協程並關閉事件迴圈。
- asyncio.gather(): 運行多個協程並返回結果，如果 `gather()` 本身被取消，那麼所有尚未完成的 awaitable 也會被取消。
- asyncio.wait(): 同 gather，但是輸出 `done, pending` tuple 用於更精細的控制事件，支援 `return_when` 參數，例如 `asyncio.FIRST_COMPLETED` 設定第一個結果就立刻返回。
- asyncio.wait_for(): 同 gather，但是可以設定 timeout。
- asyncio.as_completed(): 任一任務完成馬上回傳，前面的方式除了 wait 都會等到所有任務完成才回傳。
- asyncio.shield(): 同 run，保護 Task 不被 `Task.cancel()` 取消。

### Event-Loop 函式
第一次看可跳過，[官方文檔建議直接使用高階 API](https://docs.python.org/3/library/asyncio-eventloop.html)。event-loop 函式主要有以下幾種：

- loop.create_task(): 在指定事件迴圈中創建並啟動一個新的任務，此指令使用頻率最高。
- asyncio.new_event_loop(): 建立新的事件迴圈，用於需要自定義事件迴圈的情境。
- asyncio.get_event_loop(): 獲取目前執行的事件迴圈，在 3.12 版之後被棄用。
- asyncio.get_running_loop(): 得到運行中事件迴圈。
- asyncio.set_event_loop(): 將 loop 設置為當前 OS 執行緒的當前事件迴圈，用於多執行緒多迴圈環境中取得目前迴圈。

以下列出手動控制事件迴圈的幾種基本運行控制

- loop.run_until_complete(): 運行到完成
- loop.run_forever(): 運行到輸入協程包含 `loop.stop()`
- loop.stop()
- loop.close()


### 線程處理函式
這些函式都不是異步，而是放進獨立線程執行，用於函式阻塞又無法修改成異步（例如 import 別人的套件）時。

- asyncio.to_thread()
- loop.run_in_executor(): [同上](https://stackoverflow.com/questions/65316863/is-asyncio-to-thread-method-different-to-threadpoolexecutor)，但是可指定線程。

### 文檔位置

- [Event Loop](https://docs.python.org/3/library/asyncio-eventloop.html)
- [Coroutines and Tasks](https://docs.python.org/3/library/asyncio-task.html) 重要，大部分都在這
- [Futures](https://docs.python.org/3/library/asyncio-future.html)

## 取代內建 Asyncio

使用更好套件產生事件迴圈，免的程式都寫了才發現要改來不及。

每個想取代 asyncio 的套件都會先說他的效能多爛，筆者沒親自測試過，但是放上找到的一些套件：

- [uvloop](https://github.com/MagicStack/uvloop) 套件聲稱可以將執行速度提升 2-4x
- [gevent](https://github.com/gevent/gevent) 
- [Winloop](https://github.com/Vizonex/Winloop) uvloop 在萬惡 Windows 上效能很差
- [trio](https://github.com/python-trio/trio) 看起來很有想法的套件
- [Python Asyncio Alternatives](https://superfastpython.com/asyncio-alternatives/)



## 闢謠
1. [关于Asyncio，别再使用run_until_complete了原创](https://blog.csdn.net/xjian32123/article/details/131520922)

搜尋 `asyncio.run() vs loop.run_until_complete()` 時的結果第一項，當我們需要使用 loop 控制時用後者，沒特別情事當然用前者，標題黨亂下標。

2. [python3中async使用run_in_executor构建异步task及functools传参](http://yanue.netwww.yanue.net/post-170.html)

完全用錯，run_in_executor 是建立執行緒，該程式實際上建立三個線程，每個線程有一個事件迴圈，每個事件迴圈只有一個任務。

3. 協程可以被視為一個輕量級的線程，這太誇張，竟然有好幾篇文章這樣寫。

## 延伸閱讀

補充不太冷的冷知識，讓大家知道為何每種語言的協程不太一樣：協程的英文 Coroutine 全名是 [cooperative routine](https://functional.works-hub.com/learn/coroutines-in-kotlin-f293e)，只要可以在運行中暫停和恢復執行函式全都算協程，所以每種語言實現方式各有不同，至於 Golang 的 goroutine 為何跟此概念完全無關我就不知道了。

- [《asyncio 系列》2. 詳解asyncio 的協程、任務、future，以及事件循環 ](https://www.cnblogs.com/traditional/p/17363960.html)
- [【python】asyncio的理解与入门，搞不明白协程？看这个视频就够了。](https://www.youtube.com/watch?v=brYsDi-JajI)，由微軟工程師介紹協程
- [【python】await机制详解。再来个硬核内容，把并行和依赖背后的原理全给你讲明白](https://www.youtube.com/watch?v=K0BjgYZbgfE)，由微軟工程師介紹協程
- [Using asyncio.Queue for producer-consumer flow](https://stackoverflow.com/questions/52582685/using-asyncio-queue-for-producer-consumer-flow) 在異步中使用生產者-消費者模型

## 結尾
承認自己是 0.2 桶水響叮噹，但網路上的文章可以說是 0.1 桶就開始響了。

查協程會看到一張圖，多個方塊代表任務，協程從水平連接變成折線連接，這張圖爛到連路上隨便一個大學生來做都不如，放了還沒有任何說明，我不相信初學者看得懂，橫軸縱軸都沒標誰知道你在講什麼？圖本身就不放上來了指名道姓怕被扁。

還有更荒謬的，把 multi-processing 標示成多處理器，當初看到直接關網頁，撰文找資料時才發現應該是 typo，還好不是真的這麼荒謬。有的還會講故事說明，一句話「需要等待時主動切換任務」不就結束了，偏偏要寫一個故事，讀完也沒有更深刻體悟，第一次學習看到這故事越看越混亂。

本來就知道網路上問題文章很多，結果搜尋 async 的時候是多到爆，於是有了這篇文章，如果大家寫的都沒錯那根本沒必要再寫一篇啊。
