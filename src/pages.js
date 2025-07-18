const pages = {
  pages: [
    {
      path: 'pages/home',
      disableScroll: true,
    },
    {
      path: 'pages/demo/index',
      disableScroll: true,
    },
    {
      path: 'pages/demo/button',
      disableScroll: true,
    },
    {
      path: 'pages/demo/dialog',
      disableScroll: true,
    },
    {
      path: 'pages/demo/form',
      disableScroll: true,
    },
    {
      path: 'pages/demo/loader',
      disableScroll: true,
    },
    {
      path: 'pages/demo/scroll-area',
      disableScroll: true,
    },
    {
      path: 'pages/demo/misc',
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
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#F8F8F8',
    backgroundColor: '#F8F8F8',
    navigationStyle: 'custom',
    pageOrientation: 'auto',
    handleWebviewPreload: 'auto',
    rpxCalcMaxDeviceWidth: Infinity, // 关闭烦人的 h5 自动设置根字体尺寸，大尺寸就配展示更多内容而不是更大内容
  },
};

if (process.env.NODE_ENV === 'development' || process.env.UNI_PLATFORM === 'h5') {
  pages.pages.push({
    path: 'pages/test/index',
    disableScroll: true,
  });
}

module.exports = pages;
