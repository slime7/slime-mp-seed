<script setup>
import { computed, useSlots } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import { jump, pageBack } from '@/utils';

defineProps({
  title: {
    type: String,
    default: '',
  },
  scrolled: {
    type: Boolean,
    default: false,
  },
  statusBarHeight: {
    type: Number,
  },
  titleBarHeight: {
    type: Number,
  },
  isIos: {
    type: Boolean,
    default: false,
  },
  visible: {
    type: Boolean,
    default: true,
  },
});

const hasChildrenContent = computed(() => useSlots().default);

const pages = getCurrentPages();
const currentPage = pages[pages.length - 1];
const tabPages = ['pages/home', 'pages/goods', 'pages/order', 'pages/profile'];

// 返回按钮逻辑
const tabMode = false;
const backBtnVisible = tabMode ? !tabPages.includes(currentPage.route) : currentPage.route !== 'pages/home';
const handlePageBack = () => {
  if (pages.length > 1) {
    pageBack(1);
  } else {
    jump('/pages/home', tabMode ? 'tab' : 'replace');
  }
};

onReady(() => {
});
</script>

<template>
  <div
    v-if="visible"
    class="custom-navigation"
    :class="{
      scrolled,
      ios: isIos,
      visible,
    }"
  >
    <div class="page-status-bar" :style="{ height: `${statusBarHeight}px` }" />

    <div class="page-title" :style="{ height: `${titleBarHeight}px` }">
      <div
        v-if="backBtnVisible"
        class="left-btn"
        :style="{ height: `${titleBarHeight}px`, width: `${titleBarHeight}px` }"
      >
        <button
          class="title-back-btn"
          @click="handlePageBack"
        >
          <text v-if="!isIos" class="material-icons">
            {{ pages.length > 1 ? 'arrow_back' : 'home' }}
          </text>
          <text v-else class="material-icons">
            {{ pages.length > 1 ? 'arrow_back_ios_new' : 'home' }}
          </text>
        </button>
      </div>
      <slot />
      <div v-if="!hasChildrenContent" class="title">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.custom-navigation {
  --mp-nav-bg-color: var(--md-color-surface);
  --mp-nav-bg-color-scrolled: var(--md-color-surface-container);
  --mp-nav-color: var(--md-color-on-surface);
  position: relative;
  width: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: var(--md-color-surface);
  overflow: hidden;
  z-index: 1000;

  .page-title {
    display: flex;
    align-items: center;
    left: 0;
    right: 0;
    padding: 0 16px;
    font-weight: 500;
    color: var(--md-color-on-surface);
    background-color: var(--md-color-surface);
    z-index: 1200;

    .title {
      font-size: 1rem;
      z-index: 1200;
    }
  }

  &.scrolled {
    background-color: var(--md-color-surface-container);

    .page-title {
      background-color: var(--md-color-surface-container);
    }
  }

  .left-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -12px;

    .title-back-btn {
      all: unset;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;

      &::after {
        all: unset;
      }

      .back-icon {
        display: block;
        width: 24px;
        height: 24px;
      }
    }
  }

  &.ios {
    .page-title .title {
      position: absolute;
      left: 50%;
      padding-left: 0;
      transform: translateX(-50%);
    }
  }
}
</style>
