module.exports = {
  docsSidebar: [
    {
      type: 'autogenerated',
      dirName: 'docs',
    },
  ],

  memoSidebar: [
    {
      type: 'autogenerated',
      dirName: 'memo/00-about',
    },
    {
      type: 'category',
      label: 'Python',
      collapsed: false,
      items: [
        'memo/python/traversal-dir/index',
        'memo/python/regex/index',
        'memo/python/useful-builtin-function/index',
        'memo/python/how-to-write-clean-code/index',
        {
          type: 'link',
          label: '別寫優雅程式',
          href: 'https://www.zsl0621.cc/posts/python-refactoring-journey/',
        },
        'memo/python/first-attempt-strategy-pattern/index',
        'memo/python/first-attempt-python-workflow-automation/index',
        'memo/python/pynacl-usage/index',
        'memo/python/pyreverse-usage/index',
        'memo/python/PEP-history/index',
      ],
    },
  ],
};