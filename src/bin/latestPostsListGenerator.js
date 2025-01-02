const glob = require("glob");
const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");
const moment = require("moment");

const blogPath = "./.docusaurus/docusaurus-plugin-content-blog/default";
const blogFilesPattern = "site-blog-*.json";
const latestBlogPostList = "./src/components/LatestPosts/latest-blog-posts.json";

const docsPath = "./.docusaurus/docusaurus-plugin-content-docs/default";
const docFilesPattern = "site-docs-*.json";
const latestDocsList = "./src/components/LatestPosts/latest-docs.json";

const memoPath = "./.docusaurus/docusaurus-plugin-content-docs/memo";
const memoFilesPattern = "site-docs-*.json";

const totalArticles = 10

generateLatestPostList(blogPath, blogFilesPattern, latestBlogPostList);

// 合併 docs 和 memo 的最新文章
generateLatestCombinedList(
  [
    { path: docsPath, pattern: docFilesPattern },
    { path: memoPath, pattern: memoFilesPattern }
  ],
  latestDocsList
);

function generateLatestCombinedList(sources, outputPath) {
  let allItems = {};

  sources.forEach(source => {
    if (fs.existsSync(source.path)) {
      const files = glob.sync(path.join(source.path, source.pattern));
      
      files.forEach(file => {
        try {
          const rawdata = fs.readFileSync(file);
          const item = JSON.parse(rawdata);

          if (item != null && item.draft != true) {
            const date = item.date || item.lastUpdatedAt;
            if (!date) return;

            const yearMonth = moment(date).format("YYYY 年 MM 月");
            const day = moment(date).format("DD");

            allItems[date] = {
              title: item.title,
              permalink: item.permalink,
              description: item.description,
              tags: item.tags,
              date: date,
              yearMonth: yearMonth,
              day: day
            };
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      });
    }
  });

  const allIds = Object.keys(allItems);
  const latestIds = allIds.sort().reverse().slice(0, totalArticles);
  const latestItems = latestIds.map((v) => allItems[v]);

  generateLatestFile(latestItems, outputPath);
}

function generateLatestPostList(folderPath, filesPattern, outputPath) {
  let allItems = {};

  if (!fs.existsSync(folderPath)) {
    console.log(`Path ${folderPath} does not exist, skipping...`);
    return;
  }

  const files = glob.sync(path.join(folderPath, filesPattern));

  files.forEach(file => {
    try {
      const rawdata = fs.readFileSync(file);
      const item = JSON.parse(rawdata);

      if (item != null && item.draft != true) {
        const date = item.date || item.lastUpdatedAt;
        if (!date) return;

        const yearMonth = moment(date).format("YYYY 年 MM 月");
        const day = moment(date).format("DD");

        allItems[date] = {
          title: item.title,
          permalink: item.permalink,
          description: item.description,
          tags: item.tags,
          date: date,
          yearMonth: yearMonth,
          day: day
        };
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  });

  const allIds = Object.keys(allItems);
  const latestIds = allIds.sort().reverse().slice(0, totalArticles);
  const latestItems = latestIds.map((v) => allItems[v]);

  generateLatestFile(latestItems, outputPath);
}

function generateLatestFile(allPosts, filePath) {
  // 確保目標目錄存在
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(allPosts, null, 2));
}