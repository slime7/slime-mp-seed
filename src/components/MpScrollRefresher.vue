<script setup>
import {
  computed,
  ref,
  watch,
} from 'vue';
import MatLoader from './MatLoader.vue';
import useGlobalStore from '../store/global';

const props = defineProps({
  disabledPullDownRefresh: {
    type: Boolean,
    default: false,
  },
  paddingGestureBar: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['pull-down', 'scroll', 'scrolltolower']);

const store = useGlobalStore();
const gestureBarHeight = computed(() => store.deviceInfo.gestureBarHeight);
const refresherThreshold = 64;
const internalRefresherEnabled = ref(true);
const pulledY = ref(0);
const pulling = ref(false);
const willRefresh = ref(false);
const refreshing = ref(false);
const listPullDownStatus = ref(false);
const loadingPercent = computed(() => {
  if (!refreshing.value) {
    return Math.round((Math.min(pulledY.value, refresherThreshold) * 100) / refresherThreshold);
  }
  return null;
});
const onListPulling = (ev) => {
  pulling.value = true;
  refreshing.value = false;
  pulledY.value = ev.detail.dy;
  willRefresh.value = !willRefresh.value ? pulledY.value > refresherThreshold : true;
};
const onListPullDown = (ev) => {
  pulling.value = false;
  refreshing.value = true;
  emit('pull-down', ev);
};
const onRefreshAbort = (resetY = true) => {
  if (resetY) {
    pulledY.value = 0;
  }
  willRefresh.value = false;
  listPullDownStatus.value = true;
  setTimeout(() => {
    listPullDownStatus.value = false;
  }, 1);
};
let timer = null;
watch(() => props.disabledPullDownRefresh, (disabled) => {
  setTimeout(() => {
    internalRefresherEnabled.value = !disabled;
    if (!disabled) {
      clearTimeout(timer);
      onRefreshAbort();
      timer = setTimeout(() => {
        // 防止关闭加载失败
        onRefreshAbort();
      }, 300);
    }
  }, 0);
});

const onScroll = (ev) => {
  emit('scroll', ev);
};
const onScrolltolower = (ev) => {
  emit('scrolltolower', ev);
};
</script>

<template>
  <scroll-view
    class="mp-scroll-refresher"
    enhanced
    :bounces="false"
    :show-scrollbar="true"
    scroll-y
    lower-threshold="10"
    enable-passive
    :refresher-enabled="internalRefresherEnabled"
    :refresher-triggered="listPullDownStatus"
    :refresher-threshold="refresherThreshold"
    refresher-default-style="none"
    @refresherpulling="onListPulling"
    @refresherrefresh="onListPullDown"
    @refresherabort="onRefreshAbort()"
    @scroll="onScroll"
    @scrolltolower="onScrolltolower"
  >
    <div slot="refresher" class="w-full">
      <div class="loader flex center gap-x-4">
        <mat-loader :progress="loadingPercent" />

        <div v-if="refreshing" class="text-sm min-w-[6em]">
          刷新中
        </div>
        <div v-else-if="!willRefresh" class="text-sm">
          下拉刷新内容
        </div>
        <div v-else class="text-sm">
          松开刷新内容
        </div>
      </div>
    </div>
    <div
      class="scroll-frame min-h-full flex flex-col"
    >
      <slot />

      <div
        v-if="paddingGestureBar"
        class="gesture-bar-placeholder shrink-0"
        :style="{
          width: '100%',
          height: `${gestureBarHeight}px`,
          backgroundColor: 'initial',
        }"
      />
    </div>
  </scroll-view>
</template>

<style scoped lang="postcss">
@reference '../assets/style/app.css';

:host,
.mp-scroll-refresher {
  position: relative;
  height: 100%;
}
</style>
