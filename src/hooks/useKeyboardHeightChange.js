import { ref } from 'vue';

const useKeyboardHeightChange = (setScrollTop) => {
  let isKeyboardOpen = false;
  let scrollTopTemp = 0;
  const keyboardPlaceholderHeight = ref(0);

  // setScrollTop(0);
  const onScroll = (ev) => {
    scrollTopTemp = ev.detail.scrollTop;
  };
  const onKeyboardChange = (ev) => {
    const { height } = ev.detail;
    const inputOffsetTop = ev.target.offsetTop;
    const isOpen = height > 100;
    if (isKeyboardOpen === isOpen) {
      // 状态未变化
      if (isOpen) {
        // 仅更新高度
        console.log('输入法高度变化', height);
        keyboardPlaceholderHeight.value = height;
      }
      return;
    }
    isKeyboardOpen = isOpen;
    if (isOpen) {
      console.log('输入法打开', `输入法高度 ${height},当前页面滚动 ${scrollTopTemp},输入框位置 ${inputOffsetTop}`);
      keyboardPlaceholderHeight.value = height;
      let targetTop = scrollTopTemp;
      if (scrollTopTemp + 20 > inputOffsetTop) {
        targetTop = inputOffsetTop - 20;
        console.log(`滚动高度调整到 ${targetTop}`);
        setScrollTop(Math.max(targetTop, 0));
      } else {
        setScrollTop(scrollTopTemp);
      }
    } else {
      console.log('输入法关闭', `输入法高度 ${height},当前页面滚动 ${scrollTopTemp},输入框位置 ${inputOffsetTop}`);
      keyboardPlaceholderHeight.value = 0;
    }
  };

  return {
    keyboardPlaceholderHeight,
    onScroll,
    onKeyboardChange,
  };
};

export default useKeyboardHeightChange;
