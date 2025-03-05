// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const katex = require("rehype-katex");
const math = require("remark-math");
const path = require("path");

const unified = require("unified");
const remarkParse = require("remark-parse");
const stringify = require("rehype-stringify");
const remark2rehype = require("remark-rehype");

import { themes as prismThemes } from 'prism-react-renderer';


/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "ZSL的文檔庫",
  // tagline: "只講重點不廢話",
  url: "https://docs.zsl0621.cc", //process.env.URL,
  baseUrl: "/", //process.env.BASE_URL,
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  organizationName: "ZhenShuo2021", // Usually your GitHub org/user name.
  projectName: "zsl0621@Docs", // Usually your repo name.
  i18n: { defaultLocale: 'zh-TW', locales: ['zh-TW'] },
  markdown: { mermaid: true },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: false,  // 禁用 preset 中的預設 docs
        gtag: {
          trackingID: 'G-QB2VKFSQ0J',
          anonymizeIP: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  plugins: [
    require.resolve("docusaurus-plugin-image-zoom"),
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'default',
        path: 'docs/docs',
        routeBasePath: 'docs',
        sidebarPath: require.resolve('./sidebars.js'),
        remarkPlugins: [math],
        rehypePlugins: [
          [katex, {
            strict: false
          }]
        ],
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        breadcrumbs: true,
        editUrl: "https://github.com/ZhenShuo2021/docs/edit/main",
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'pluginForMemo',
        path: 'docs/memo',
        routeBasePath: 'memo',
        sidebarPath: require.resolve('./sidebars.js'),
        remarkPlugins: [math],
        rehypePlugins: [
          [katex, {
            strict: false
          }]
        ],
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        breadcrumbs: true,
        editUrl: "https://github.com/ZhenShuo2021/docs/edit/main",
      },
    ],
  ],
  themes: ['docusaurus-theme-github-codeblock', '@docusaurus/theme-mermaid'],
  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
    navbar: {
      title: "zsl0621@Docs",
      logo: {
        alt: "Site Logo",
        src: "img/favicon.svg",
      },
      items: [
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'docsSidebar',
          label: "文檔庫",
        },
        {
          type: 'doc',
          position: 'left',
          docsPluginId: 'pluginForMemo',
          docId: 'memo',
          sidebarId: 'memoSidebar',
          label: "備忘錄",
        },
        {
          href: 'https://github.com/ZhenShuo2021',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      copyright: `
      © ${new Date().getFullYear()} ZhenShuo2021 (zsl0621.cc). Built with Docusaurus.<br>
      All rights reserved. 轉載或引用請註明來源。
    `
    // Or a simple CC
    // <a href="https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1" target="_blank" rel="noopener noreferrer">
    // CC BY-NC 4.0</a>  授權條款<br>
    ,
    },
    metadata: [
      { name: 'robots', content: 'max-image-preview:large' },
      { name: 'og:type', content: 'article' },
    ],
    algolia: {
      appId: 'DSU91EEXY7',
      apiKey: 'd6be4daef0ab4a655727096c8a3a6000',
      indexName: 'zsl0621',
      contextualSearch: true,
    },
    zoom: {
      selector: '.markdown :not(em,a) > img',
      config: {
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        }
      }
    },
    prism: {
      additionalLanguages: ["aspnet", "bash", "css", "csharp", "cshtml", "diff", "git", "java", "javascript", "json", "markup-templating", "powershell", "php", "python", "sql", "toml", "typescript"],
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },



    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.module.rules.push({
          test: /\.(webp|png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        });
        return webpackConfig;
      },
    },
  },
  stylesheets: [{
    href: "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css",
    type: "text/css",
    integrity: "sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc",
    crossorigin: "anonymous",
  },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossorigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700;900&display=swap",
  },
  ],
};
