<script setup>
import { computed, ref } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import useGlobalStore from '@/store/global';
import useToastStore from '@/store/toastStore';
import MpCustomNavigation from './MpCustomNavigation.vue';

defineProps({
  hideNavigation: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'test',
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
});

const emits = defineEmits(['scroll', 'scrolltolower', 'pageBack', 'scrolltoupper']);

const store = useGlobalStore();
const toastStore = useToastStore();
const pageContainerVisible = ref(true);
const preventPageBack = computed(() => store.preventNativeBack);

const deviceInfo = computed(() => store.deviceInfo);
const theme = computed(() => store.deviceInfo.theme);
const titleBarScrolled = ref(false);
const toastVisible = computed(() => toastStore.visible);
const toastMsg = computed(() => toastStore.msg);

const scroll = (ev) => {
  emits('scroll', ev);
  const top = ev.detail.scrollTop;
  titleBarScrolled.value = top >= 5;
};
const scrolltolower = (ev) => {
  emits('scrolltolower', ev);
};
const onReachTop = (ev) => {
  titleBarScrolled.value = false;
  emits('scrolltoupper', ev);
};

const afterBackBtn = () => {
  if (preventPageBack.value) {
    emits('pageBack', null);
    pageContainerVisible.value = false;
    setTimeout(() => {
      pageContainerVisible.value = true;
    }, 0);
  }
};

onReady(() => {
  uni.setNavigationBarColor({
    frontColor: theme.value === 'dark' ? '#ffffff' : '#000000',
    backgroundColor: theme.value === 'dark' ? '#000000' : '#ffffff',
  });
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
      :scrolled="titleBarScrolled"
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
      <div
        class="flex flex-col"
        :style="{
          height: hideNavigation ? '100vh' : `calc(100vh - ${deviceInfo.statusBarHeight + deviceInfo.titleBarHeight}px)`,
        }"
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
      </div>
    </scroll-view>

    <div class="floating-frame flex flex-col">
      <div class="flex-auto" />

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

<style scoped lang="postcss">
@reference 'tailwindcss';
@reference '../assets/style/app.css';

.mp-page {
  .mp-content {
    --mp-background-color: var(--md-color-surface);
    flex-grow: 1;
    overflow-y: auto;
    color: var(--md-color-on-surface);
    background-color: var(--mp-background-color);
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
        @apply text-sm flex items-center;
        margin: 16px 32px;
        padding: 0 16px;
        width: calc(100vw - 64px);
        max-width: 320px;
        height: 48px;
        border-radius: 4px;
        background-color: var(--md-color-inverse-surface);
        color: var(--md-color-inverse-on-surface);
        box-shadow: var(--shadow-md-level-3);
        word-break: break-all;
      }
    }
  }
}
</style>
