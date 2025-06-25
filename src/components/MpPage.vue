<script setup>
import { computed, ref } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import useGlobalStore from '@/store/global';
import useToastStore from '@/store/toastStore';
import MpCustomNavigation from './MpCustomNavigation.vue';

const props = defineProps({
  hideNavigation: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '中卓',
  },
  scrollTop: [Number, String],
  scrollIntoView: [String],
  paddingGestureBar: {
    type: Boolean,
    default: true,
  },
  backgroundColor: {
    type: String,
    default: '',
  },
  titleBarBackgroundColor: {
    type: String,
    default: '',
  },
  ignorePolicy: {
    type: Boolean,
    default: false,
  },
  preventPageBack: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(['scroll', 'scrolltolower', 'pageBack', 'scrolltoupper']);

const store = useGlobalStore();
const toastStore = useToastStore();
const pageContainerVisible = ref(true);

const deviceInfo = computed(() => store.deviceInfo);
const titleBarShadow = ref(false);
const toastVisible = computed(() => toastStore.visible);
const toastMsg = computed(() => toastStore.msg);

const scroll = (ev) => {
  emits('scroll', ev);
  const top = ev.detail.scrollTop;
  titleBarShadow.value = top >= 5;
};
const scrolltolower = (ev) => {
  emits('scrolltolower', ev);
};
const onReachTop = (ev) => {
  titleBarShadow.value = false;
  emits('scrolltoupper', ev);
};

const afterBackBtn = () => {
  if (props.preventPageBack) {
    emits('pageBack', null);
    pageContainerVisible.value = false;
    setTimeout(() => {
      pageContainerVisible.value = true;
    }, 0);
  }
};

onReady(() => {
});
</script>

<template>
  <div class="mp-page body" :style="{ '--mp-background-color': backgroundColor }">
    <mp-custom-navigation
      :visible="!hideNavigation"
      :title="title"
      :status-bar-height="deviceInfo.statusBarHeight"
      :title-bar-height="deviceInfo.titleBarHeight"
      :is-ios="deviceInfo.isIos"
      :shadow="titleBarShadow"
      :background-color="titleBarBackgroundColor"
    />

    <scroll-view
      class="mp-content flex flex-col"
      enhanced
      :bounces="false"
      enable-flex
      scroll-y
      :upper-threshold="5"
      :style="{
        height: hideNavigation ? '100vh' : `calc(100vh - ${deviceInfo.statusBarHeight + deviceInfo.titleBarHeight}px)`,
      }"
      :scroll-top="scrollTop"
      :scroll-into-view="scrollIntoView"
      enable-passive
      @scroll="scroll"
      @scrolltolower="scrolltolower"
      @scrolltoupper="onReachTop"
    >
      <slot />

      <div
        v-if="paddingGestureBar"
        class="gesture-bar-placeholder shrink-0"
        :style="{
          width: '100%',
          height: `${deviceInfo.gestureBarHeight}px`,
          backgroundColor: 'initial',
        }"
      />
    </scroll-view>

    <div class="floating-frame flex flex-col">
      <div class="flex-grow" />
      <div class="float-btns shrink-0">
        <slot name="float-action-button" />
      </div>
      <div class="toast-parent shrink-0 flex center">
        <div
          v-if="toastVisible"
          class="toast"
          @click="toastStore.close()"
        >
          {{ toastMsg }}
        </div>
      </div>
      <div
        v-if="paddingGestureBar"
        class="gesture-bar-placeholder shrink-0"
        :style="{
          width: '100%',
          height: `${deviceInfo.gestureBarHeight}px`,
          backgroundColor: 'initial',
        }"
      />
    </div>

    <page-container
      :show="preventPageBack && pageContainerVisible"
      :duration="0"
      :overlay="false"
      position="bottom"
      custom-style="width: 10px;"
      @afterleave="afterBackBtn"
    >
      <div />
    </page-container>
  </div>
</template>

<style scoped lang="scss">
.mp-page {
  .mp-content {
    flex-grow: 1;
    overflow-y: auto;
    color: rgba(0, 0, 0, .87);
    background-color: var(--mp-background-color, #f1f1f1);

    &.rounded {
      border-radius: 16px 16px 0 0;
    }
  }

  .floating-frame {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .float-btns {
      margin: 0 auto;
      width: 100%;
      max-width: var(--mp-page-max-width);
    }

    .toast-parent {
      pointer-events: auto;
      z-index: 20;

      .toast {
        margin: 16px 32px;
        padding: 16px 12px;
        width: calc(100vw - 64px);
        max-width: 320px;
        border-radius: 4px;
        line-height: 1.5rem;
        background-color: rgba(0, 0, 0, .87);
        color: #eee;
        box-shadow: rgba(0, 0, 0, .2) 0 5px 5px -3px;
        word-break: break-all;
      }
    }
  }

  .policy-frame {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    font-size: 16px;
    z-index: 2000;

    .policy-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .6);
    }

    .policy-box {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 85%;
      border-radius: 16px;
      background-color: #fff;
      transform: translate(-50%, -50%);

      .policy-title {
        font-weight: bold;
      }

      .policy-link {
        font-size: 14px;
        color: #1a83ff;
      }
    }
  }
}
</style>
