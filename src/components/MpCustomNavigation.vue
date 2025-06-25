<script setup>
import { computed, ref, useSlots } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import { getContrastYIQ, jump, pageBack } from '@/utils';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  shadow: {
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
  backgroundColor: {
    type: String,
    default: '',
  },
});

const hasChildrenContent = computed(() => useSlots().default);

const pages = getCurrentPages();
const currentPage = pages[pages.length - 1];
const tabPages = ['pages/index', 'pages/goods', 'pages/order', 'pages/profile'];

// 返回按钮逻辑
const backBtnVisible = !tabPages.includes(currentPage.route);
const handlePageBack = () => {
  if (pages.length > 1) {
    pageBack(1);
  } else {
    jump('index', 'tab');
  }
};

const textColor = ref('');
onReady(() => {
  const preferTextColor = props.backgroundColor ? getContrastYIQ(props.backgroundColor) : 'black';
  if (preferTextColor === 'white') {
    textColor.value = 'rgba(255, 255, 255, .84)';
  } else {
    textColor.value = 'rgba(0, 0, 0, .87)';
  }
});
</script>

<script>
export default {
  options: {
    virtualHost: true,
  },
};
</script>

<template>
  <div
    v-if="visible"
    class="custom-navigation"
    :class="{
      shadow,
      ios: isIos,
      visible,
    }"
    :style="{ '--mp-background-color': '#fff' }"
  >
    <div class="page-status-bar" :style="{ height: `${statusBarHeight}px` }" />

    <div class="page-title" :style="{ height: `${titleBarHeight}px` }">
      <div
        v-if="backBtnVisible"
        class="left-btn"
        :style="{ height: `${titleBarHeight}px`, width: `${titleBarHeight}px` }"
      >
        <button class="title-back-btn" :style="`color: ${textColor}`" @click="handlePageBack">
          <text v-if="!isIos" class="material-icons">
            {{ pages.length > 1 ? 'arrow_back' : 'home' }}
          </text>
          <text v-else class="material-icons">
            {{ pages.length > 1 ? 'arrow_back_ios_new' : 'home' }}
          </text>
        </button>
      </div>
      <slot />
      <div v-if="!hasChildrenContent" class="title" :style="`color: ${textColor}`">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.custom-navigation {
  position: relative;
  width: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  background-color: var(--mp-background-color, #fff);
  overflow: hidden;
  z-index: 1000;

  &.shadow {
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12);
  }

  .page-title {
    display: flex;
    align-items: center;
    left: 0;
    right: 0;
    padding: 0 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, .87);
    background-color: var(--mp-background-color, #fff);
    z-index: 1200;

    .title {
      font-size: 1rem;
      z-index: 1200;
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
    background-color: var(--mp-background-color, #fff);

    .page-title .title {
      position: absolute;
      left: 50%;
      padding-left: 0;
      transform: translateX(-50%);
    }
  }
}
</style>
