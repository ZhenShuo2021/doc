import { themes as prismThemes } from 'prism-react-renderer';

module.exports = {
  tableOfContents: {
    minHeadingLevel: 2,
    maxHeadingLevel: 5,
  },
  prism: {
    additionalLanguages: ["aspnet", "bash", "css", "csharp", "cshtml", "diff", "git", "java", "javascript", "json", "markup-templating", "powershell", "php", "python", "sql", "toml", "typescript"],
    theme: prismThemes.github,
    darkTheme: prismThemes.vsDark,
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
      // {
      //   type: 'dropdown',
      //   label: 'Quick Links',
      //   position: 'left',
      //   items: [
      //     {
      //       label: '終端機實測',
      //       to: '/docs/useful-tools/cross-platform-terminal-comparison',
      //     },
      //     {
      //       label: '部落格',
      //       href: 'https://www.zsl0621.cc/',
      //     },
      //   ],
      // },
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
  docs: {
    sidebar: {
      hideable: true,
    },
  },
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
  metadata: [
    { name: 'robots', content: 'max-image-preview:large' },
    { name: 'og:type', content: 'article' },
  ],
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.(webp|png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      });
      return webpackConfig;
    },
  },
};
