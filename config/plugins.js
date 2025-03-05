import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

module.exports = [
  require.resolve("docusaurus-plugin-image-zoom"),
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'default',
      path: 'docs/docs',
      routeBasePath: 'docs',
      sidebarPath: require.resolve('../sidebars.js'),
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: false }]],
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
      sidebarPath: require.resolve('../sidebars.js'),
      showLastUpdateAuthor: true,
      showLastUpdateTime: true,
      breadcrumbs: true,
      editUrl: "https://github.com/ZhenShuo2021/docs/edit/main",
    },
  ],
  [
    '@docusaurus/plugin-google-gtag',
    {
      trackingID: 'G-QB2VKFSQ0J',
      anonymizeIP: true,
    },
  ],
];
