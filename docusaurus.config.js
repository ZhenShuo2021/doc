const presets = require('./config/presets');
const plugins = require('./config/plugins');
const themeConfig = require('./config/themeConfig');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "ZSL的文檔庫",
  // tagline: "",
  url: "https://docs.zsl0621.cc",
  baseUrl: "/",
  organizationName: "ZhenShuo2021", // Usually your GitHub org/user name.
  projectName: "zsl0621@Docs", // Usually your repo name.
  themes: ['docusaurus-theme-github-codeblock', '@docusaurus/theme-mermaid'],
  markdown: { mermaid: true },
  i18n: { defaultLocale: 'zh-TW', locales: ['zh-TW'] },

  stylesheets: [
  {
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

  // Basically, you don't need to change anything here
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  trailingSlash: false,
  presets,
  plugins,
  themeConfig,
};