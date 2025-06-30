<template>
  <div
    class="bottom-sheet-frame"
    :class="{ 'bottom-sheet-hidden': !internalValue }"
  >
    <div
      class="overlay"
      :class="{ 'open-active': openActive, 'close-active': closeActive }"
      @click="outsideClose"
      @touchmove.stop.prevent="noop"
    />

    <div
      class="content"
      :class="[classMerge(contentClass, { 'open-active': openActive, 'close-active': closeActive })]"
      :style="contentStyle"
    >
      <div
        v-if="!hideTitleBar"
        class="header flex items-center"
        @touchmove.stop.prevent="noop"
      >
        <div class="title flex-auto">
          {{ title }}
        </div>

        <div class="close-action-area flex center" @click="close">
          <div class="close flex center">
            <text class="material-icons">
              close
            </text>
          </div>
        </div>
      </div>

      <slot />

      <div
        v-if="paddingGestureBar"
        class="gesture-bar-placeholder shrink-0"
        :style="{
          width: '100%',
          height: `${gestureBarHeight}px`,
          backgroundColor: 'initial',
        }"
        @touchmove.stop.prevent="noop"
      />
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  toRefs,
  watchEffect,
} from 'vue';
import useGlobalStore from '@/store/global';
import { classMerge } from '@/utils';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  closeOutside: {
    type: Boolean,
    default: true,
  },
  contentClass: {
    type: String,
    default: '',
  },
  contentStyle: {
    type: [String, Object],
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  paddingGestureBar: {
    type: Boolean,
    default: true,
  },
  hideTitleBar: {
    type: Boolean,
    default: false,
  },
});
const {
  modelValue,
  closeOutside,
} = toRefs(props);
const emit = defineEmits(['update:modelValue']);
const store = useGlobalStore();

const openActive = ref(false);
const closeActive = ref(false);
const internalValue = ref(false);
watchEffect(() => {
  if (modelValue.value) {
    internalValue.value = true;
    closeActive.value = false;
    openActive.value = false;
    setTimeout(() => {
      openActive.value = true;
    }, 10);
  } else {
    openActive.value = false;
    closeActive.value = true;
    setTimeout(() => {
      internalValue.value = false;
      closeActive.value = false;
    }, 100);
  }
});
const gestureBarHeight = computed(() => store.deviceInfo.gestureBarHeight);

const noop = () => {};
const close = () => {
  if (closeActive.value) {
    return;
  }
  emit('update:modelValue', false);
};
const outsideClose = () => {
  if (closeOutside.value) {
    close();
  }
};

</script>

<style scoped lang="scss">
.bottom-sheet-frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;

  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    background-color: var(--color-md-scrim);
    transition: opacity var(--ease-md-accelerate) .1s;

    &.open-active {
      opacity: 1;
    }

    &.close-active {
      opacity: 0;
    }
  }

  .content {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate3d(-50%, 100%, 0);
    width: 100%;
    max-width: var(--mp-page-max-width);
    max-height: calc(100% - 120px);
    border-radius: 28px 28px 0 0;
    background-color: var(--md-color-surface-container-low);
    transition: transform var(--ease-md-standard) .3s;

    .header {
      padding: 0 20px;
      font-size: 18px;
      font-weight: bold;

      .title {
        padding-left: 48px;
        text-align: center;
      }
    }

    &.open-active {
      transform: translate3d(-50%, 0, 0);
    }

    &.close-active {
      transform: translate3d(-50%, 100%, 0);
      transition-duration: .1s;
    }
  }

  .close-action-area {
    margin-right: -12px;
    width: 48px;
    height: 48px;
  }

  .close {
    width: 24px;
    height: 24px;

    .material-icons {
      font-size: 24px;
    }
  }

  &.bottom-sheet-hidden {
    pointer-events: none;
  }
}
</style>
