const pages = {
  pages: [
    {
      path: 'pages/home',
      disableScroll: true,
    },
    {
      path: 'pages/qr-redirect',
      disableScroll: true,
    },
    {
      path: 'pages/debug/index',
      disableScroll: true,
    },
  ],
  // 分包
  subPackages: [
    {
      root: 'sub',
      pages: [
        {
          path: 'pages/sub-page',
          disableScroll: true,
        },
      ],
      // entry: 'index.js',
    },
  ],
  globalStyle: {
    backgroundTextStyle: 'light',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'test',
    navigationBarBackgroundColor: '#F8F8F8',
    backgroundColor: '#F8F8F8',
    navigationStyle: 'custom',
    pageOrientation: 'auto',
    handleWebviewPreload: 'auto',
  },
};

if (process.env.NODE_ENV === 'development') {
  pages.pages.push({
    path: 'pages/test/index',
    disableScroll: true,
  });
}

module.exports = pages;
