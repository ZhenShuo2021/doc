module.exports = [
  [
    "@docusaurus/preset-classic",
    {
      docs: false,
      theme: {
        customCss: require.resolve("../src/css/custom.css"),
      },
    },
  ],
];
