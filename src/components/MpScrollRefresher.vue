<script setup>
import {
  computed,
  ref,
  watch,
} from 'vue';
import MatLoader from './MatLoader.vue';

const props = defineProps({
  disabledPullDownRefresh: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['trigger', 'scroll', 'scrolltolower']);

const refresherThreshold = 64;
const internalRefresherEnabled = ref(true);
const pulledY = ref(0);
const pulling = ref(false);
const willRefresh = ref(false);
const listPullDownStatus = ref(false);
const loadingPercent = computed(() => {
  if (!willRefresh.value) {
    return Math.round((Math.min(pulledY.value, refresherThreshold) * 100) / refresherThreshold);
  }
  return null;
});
const onListPulling = (ev) => {
  pulling.value = true;
  pulledY.value = ev.detail.dy;
  willRefresh.value = pulledY.value > refresherThreshold;
};
const onListPullDown = (ev) => {
  pulling.value = false;
  emit('trigger', ev);
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
  <div
    class="mp-scroll-refresher"
  >
    <scroll-view
      class="scroller"
      enhanced
      :bounces="false"
      :show-scrollbar="false"
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
      <div
        class="scroll-frame"
        :style="{
          transform: `translate(0, ${(internalRefresherEnabled ? pulledY : refresherThreshold) * -1}px)`,
        }"
      >
        <slot />
      </div>

      <div
        class="refresher text-body2 py-2 flex justify-center"
        :style="{
          transform: `translate3d(0, ${Math.max(internalRefresherEnabled ? pulledY : 0, refresherThreshold) * -1}px, 0)`,
        }"
      >
        <div class="loader flex center">
          <mat-loader color="#fff" :progress="loadingPercent" />
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<style scoped lang="scss">
:host,
.mp-scroll-refresher {
  position: relative;
  height: 100%;

  .scroller {
    position: relative;
    height: 100%;

    .scroll-frame {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      will-change: transform;
      transform: translate(0, 0);
    }
  }

  .refresher {
    width: 100%;
    text-align: center;
    will-change: transform;
    transform: translate3d(0, -64px, 0);

    .loader {
      width: 48px;
      height: 48px;
      border-radius: 99px;
      background-color: #0268ff;
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
    }
  }
}
</style>
