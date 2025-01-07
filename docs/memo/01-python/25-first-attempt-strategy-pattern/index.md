---
title: 初嘗策略模式
description: 第一次撰寫策略模式的紀錄
tags:
  - Programming
  - Python
keywords:
  - Programming
  - Python
last_update:
  date: 2024-11-03T18:08:33+08:00
  author: zsl0621
first_publish:
  date: 2024-11-03T18:08:33+08:00
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 初嘗策略模式

> 紀錄寫爬蟲程式遇到的策略模式問題

原本只是想寫個簡單寫個爬蟲，想說順便學著使用各種程式碼品質工具，例如 ruff linter （語法檢查）和 mypy static typing （靜態型別檢查），然後為了解決型別檢查問題衍生出更多問題，就有了這篇文章。

## 策略模式：我的理解

說明：<u>**透過封裝實現多種不同實作，以單一個變數作為入口點，再看你想怎麼調用這個入口**</u>。

使用情境：程式有某段邏輯需要<u>**根據不同情況**</u>選擇<u>**不同的處理方式**</u>。

優點：方便隨時增加或變動實作，方便管理不同實作。

永遠記得說明和使用情境，網路上的文章廢話太多模糊了焦點。

## 問題描述
一開始很簡單的實現，這個 class，在 `scrape_link` 中基於 `is_album_list` 決定要調用 `_process_album_list_links` 還是 `_process_album_image_links`，每次調用會把該輸入的 URL 翻頁翻到底並擷取每頁結果：如果在相簿列表，獲取所有相簿網址才開始爬取相簿，`scrape_link` 回傳網址列表 `list[str]`；否則回傳圖片網址和檔名列表 `list[tuple[str, str]]`。會這樣寫的原因是該網站只有兩種類型頁面，相簿列表和相簿本身，使用相同翻頁方式，所以覺得沒必要分成兩個 class method 來寫。

```py
class LinkScraper:
    """Scrape logic."""

    def __init__(self, web_bot, dry_run: bool, download_service, logger: logging.Logger):
        # ...初始化

    def scrape_link(
        self, 
        url: str, 
        start_page: int, 
        is_album_list: bool,
        # 注意這裡可能有兩種輸出型別！！！
        # highlight-next-line
    ) -> list[str] | list[tuple[str, str]]:
        page_result: list[str] | list[tuple[str, str]] = []

        while True:
            
            # 根據 is_album_list 選擇調用哪種方法
            if is_album_list:
                self._process_album_list_links(page_links, page_result, page)
            else:
                self._process_album_image_links(page_links, page_result, alt_ctr, tree, page)

        return page_result

    def _process_album_list_links(
        self,
        page_links: list[str],
        # highlight-next-line
        page_result: list[str],     # 注意這裡和下面不同！！！
        page: int,
    ):
        """Process and collect album URLs from list page."""
        page_result.extend([BASE_URL + album_link for album_link in page_links])
        self.logger.info("Found %d images on page %d", len(page_links), page)

    def _process_album_image_links(
        self,
        page_links: list[str],
        # highlight-next-line
        page_result: list[tuple[str, str]],     # 注意這裡和上面不同！！！
        alt_ctr: int,
        tree: html.HtmlElement,
        page: int,
    ):
        """Handle image links extraction and queueing for download."""
        alts: list[str] = tree.xpath(XPATH_ALTS)

        if len(alts) < len(page_links):
            missing_alts = [str(i + alt_ctr) for i in range(len(page_links) - len(alts))]
            alts.extend(missing_alts)
            alt_ctr += len(missing_alts)

        page_result.extend(zip(page_links, alts))

        # Download file
        if not self.dry_run:
            album_name = self.extract_album_name(alts)
            image_links = list(zip(page_links, alts))
            self.download_service.add_download_task(album_name, image_links)
        self.logger.info("Found %d images on page %d", len(page_links), page)

    @staticmethod
    def extract_album_name(alts: list[str]) -> str:
        # ...Find the first non-digits element
```

但是使用 mypy 檢查時抱怨 incompatible type，因為我設定兩種不同輸出型別，兩者都會因為不符合對方而報錯。除此之外，後續處理返回的變數也一樣會被 mypy 抱怨。

```sh
error: Argument 2 to "_process_album_list_links" of "LinkScraper" has incompatible type "list[str] | list[tuple[str, str]]"; expected "list[str]"  [arg-type]
error: Argument 2 to "_process_album_image_links" of "LinkScraper" has incompatible type "list[str] | list[tuple[str, str]]"; expected "list[tuple[str, str]]"  [arg-type]
```

想到的解決方式有這幾個

1. 使用 isinstance 檢查，但是如果中間跨函式 mypy 一樣會抱怨，而且 list 包 tuple 要每項檢查很繁瑣。
2. 使用增加一個新的 method 分流，想了十秒發現根本沒用，現在不就是同樣意思。
3. page_result 改成 list[Any] 掩耳盜鈴。

同時也想到，如果該網站擴充新的頁面類型，以上方法基本只剩掩耳盜鈴法有用，現在的 scrape_link 結構也會造成維護困難，於是需要更好的解決方式。

## 解決方式
決定使用策略模式解決，策略模式就只是把「需要根據情況選擇的方法」封裝在獨立類別或函式中，再看你使用哪種方式選擇，使用組合而非繼承，這裡使用簡單的字典鍵值選擇。


<Tabs>
  <TabItem value="LinkScraper" label="策略模式">
 
```py

class LinkScraper:
    # Defines the mapping from string to scraping method.
    SCRAPE_TYPE: ClassVar[dict[str, str]] = {
        "ALBUM_LIST": "album_list",
        "ALBUM_IMAGE": "album_image",
    }

    def __init__(self):
        # 在這裡初始化所有策略
        self.strategies: dict[str, ScrapingStrategy] = {
            self.SCRAPE_TYPE["ALBUM_LIST"]: AlbumListStrategy(config),
            self.SCRAPE_TYPE["ALBUM_IMAGE"]: AlbumImageStrategy(config),
        }


    def _scrape_link(
        self,
        url: str,
        start_page: int,
        scraping_type: str,
        **kwargs,
    )
        # 根據字串選擇使用哪種策略
        strategy = self.strategies[scraping_type]
        while True:
            # ...省略

            # 原版程式碼
            # if is_album_list:
            #     self._process_album_list_links(page_links, page_result, page)
            # else:
            #     self._process_album_image_links(page_links, page_result, alt_ctr, tree, page)

            # 新版程式碼
            strategy.process_page_links(page_links, page_result, tree, page)

```



  </TabItem>

  <TabItem value="AlbumListStrategy" label="策略們">
  
```py

class AlbumListStrategy(ScrapingStrategy[AlbumLink]):
    """Strategy for scraping album list pages."""

    def get_xpath(self) -> str:
        return XPATH_ALBUM_LIST

    def process_page_links(
        self,
        page_links: list[str],
        page_result: list[AlbumLink],
        tree: html.HtmlElement,
        page: int,
        **kwargs,
    ) -> None:
        page_result.extend([BASE_URL + album_link for album_link in page_links])
        self.logger.info("Found %d albums on page %d", len(page_links), page)


class AlbumImageStrategy(ScrapingStrategy[ImageLink]):
    """Strategy for scraping album image pages."""

    def __init__(self, runtime_config: RuntimeConfig, base_config: Config, web_bot):
        super().__init__(runtime_config, base_config, web_bot)
        self.dry_run = runtime_config.dry_run
        self.alt_counter = 0

    def get_xpath(self) -> str:
        return XPATH_ALBUM

    def process_page_links(
        self,
        page_links: list[str],
        page_result: list[ImageLink],
        tree: html.HtmlElement,
        page: int,
        **kwargs,
    ) -> None:
        alts: list[str] = tree.xpath(XPATH_ALTS)

        # Handle missing alt texts
        if len(alts) < len(page_links):
            missing_alts = [str(i + alt_ctr) for i in range(len(page_links) - len(alts))]
            alts.extend(missing_alts)
            alt_ctr += len(missing_alts)

        page_result.extend(zip(page_links, alts))

        # Download file
        if not self.dry_run:
            album_name = self.extract_album_name(alts)
            image_links = list(zip(page_links, alts))
            self.download_service.add_download_task(album_name, image_links)  # add task to queue
        self.logger.info("Found %d images on page %d", len(page_links), page)

    @staticmethod
    def _extract_album_name(alts: list[str]) -> str:
        album_name = next((alt for alt in alts if not alt.isdigit()), None)
        if album_name:
            album_name = re.sub(r"\s*\d*$", "", album_name).strip()
        if not album_name:
            album_name = BASE_URL.rstrip("/").split("/")[-1]
        return album_name

```

  </TabItem>

</Tabs>


新版程式碼在每次呼叫 `_scrape_link` 時都根據輸入字串選擇要使用的解析方式，省略了 if-else 條件判斷，也減輕 `LinkScraper` 負擔，把工作侷限程式碼的上下文接口，調用策略，每個策略各自處理該如何解析 html 檔案，可以輕易新增或移除策略。除此之外策略模式的好處還有如果遇到複雜的頁面，需要更多子函式來處理，也不用把分散的 function 全部都匯集到一個 function 中，可以都在各自的 xxxStratedy 類別自行管理。

> 註：純粹的策略模式不包含實例化部分，這個範例包含實例化，實作時區分這些不是很重要，但是既然寫成文章就要清楚說明。

<br />

---

<br />

雖然策略模式到這邊就結束了，但是最開始的 mypy 型別檢查的問題好像還沒解決欸？沒錯各位被我紅鯡魚了，策略模式和解決後續調用輸出結果的 incompatible type 沒有關係。解決型別檢查問題的很簡單，只要把 type hint 改成 Literal 就解決了。方法很簡單，但是我花了很久才找到這個方法，然後 Literal 挺酷的，第一次遇到打字串會有 IDE 自動補齊功能。

```py
ScrapeStrategy = Literal["album_list", "album_image"]


class ScrapeHandler:
    """Handles all scraper behaviors."""

    # Defines the mapping from url part to scrape method.
    SCRAPE_TYPE: ClassVar[dict[str, ScrapeStrategy]] = {
        "album": "album_image",
        "actor": "album_list",
    }

    def __init__(self, runtime_config: RuntimeConfig, base_config: Config, web_bot):
        self.web_bot = web_bot
        self.logger = runtime_config.logger
        self.runtime_config = runtime_config
        self.strategies: dict[ScrapeStrategy, BaseScraper] = {
            "album_list": AlbumScraper(runtime_config, base_config, web_bot),
            "album_image": ImageScraper(runtime_config, base_config, web_bot),
        }

    def _scrape_link(
        self,
        url: str,
        start_page: int,
        scrape_type: ScrapeType,
        **kwargs,
    ) -> list[str] | list[tuple[str, str]]:

```


<details>
<summary>原版的超醜解法</summary>

細心的讀者可能已經發現 `_scrape_link` 變成私有函數，這邊使用幾個緩衝 method 解決型別的問題，暫時只能想到這個很醜的方式，未來如果找到更好方式再更新。

```py
def buffer_album_list(
    self,
    url: str,
    start_page: int,
    **kwargs
    ) -> list[str]:
    """Entry and buffer method for album list scraping."""
    return self._scrape_link(url, start_page, self.SCRAPE_TYPE["ALBUM_LIST"], **kwargs)

def buffer_album_images(
    self, 
    url: str, 
    start_page: int,
    **kwargs
    ) -> list[tuple[str, str]]:
    """Entry and buffer method for Album images scraping."""
    return self._scrape_link(url, start_page, self.SCRAPE_TYPE["ALBUM_IMAGE"], **kwargs)
```
</details>


## 心得感想

沒想到會用到策略模式，除此之外還學了 typing 工具，例如 ClassVar, Generic, TypeAlias, TypeVar。其中還發現了模板方法模式、外觀模式，感覺滿硬要的，正常人寫程式自動就會變成這些模式，沒必要去死記這些，就像以前電磁學第一大題都是名詞解釋，考完根本沒有理解核心，不過電磁學是因為太難需要送分就是了。另外，平衡 spaghetti code 和 ravioli code，以及程式優化的時機也是個學問，太早優化後面要改更痛苦，太晚優化中間開發很卡。

## 後話

寫的當下就覺得有點 over-design 了，現在想想確實如此，一開始直接寫 type-hint 是 list 就好，把 type-hint 寫的這麼詳細反而浪費了 Python 方便的特性，尤其是在這麼小的項目上，不過這本來就是一個練習專案，當作練習剛剛好囉。

> 後話之二：文章寫完隔幾天刷到這個影片：[策略模式？代码的自然演化，仅此而已…](https://www.youtube.com/watch?v=cXa-wSJ21f0)，這麼頻繁看到策略模式，難道這就是我的[天使模式](https://www.youtube.com/watch?v=roXoOGpr6o4)嗎？好了不鬧，他光是標題就說的很好，這只是自然演化，不必死記硬背，死背只是讓自己變成考試超人而已。
