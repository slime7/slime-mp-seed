<template>
  <div
    class="bottom-sheet-frame"
    :class="{ 'bottom-sheet-hidden': !internalValue }"
  >
    <div
      v-if="!hideScrim"
      class="overlay"
      :class="{ 'open-active': openActive, 'close-active': closeActive }"
      @click="outsideClose"
      @touchmove.stop.prevent="noop"
    />

    <div
      class="bottom-sheet"
      :class="[
        { 'open-active': openActive, 'close-active': closeActive },
        dragState,
      ]"
      :style="sheetClass"
    >
      <div
        v-if="!hideDragHandler"
        class="drag-bar h-12 flex center"
        @pointerdown="onStartDrag"
        @pointermove="onDrag"
        @pointerup="onDragEnd"
        @pointercancel="onDragEnd"
        @touchstart="onStartDrag"
        @touchmove="onDrag"
        @touchend="onDragEnd"
        @touchcancel="onDragEnd"
      >
        <div class="drag-handler" />
      </div>

      <div
        v-if="title"
        class="header flex items-center text-2xl mb-4"
        @touchmove.stop.prevent="noop"
      >
        <div class="title flex-auto">
          {{ title }}
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

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  closeOutside: {
    type: Boolean,
    default: true,
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
  hideScrim: {
    type: Boolean,
    default: false,
  },
  hideDragHandler: {
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

const dragState = ref('');
const touchStartY = ref(0);
const dragDownY = ref(0);
const onStartDrag = (ev) => {
  let evDetail = ev;
  if (ev.detail?.clientY) {
    evDetail = ev.detail;
  }
  if (ev.changedTouches?.[0]) {
    [evDetail] = ev.changedTouches;
  }
  dragState.value = 'drag-start';
  touchStartY.value = evDetail.clientY;
};
const onDrag = (ev) => {
  let evDetail = ev;
  if (ev.detail?.clientY) {
    evDetail = ev.detail;
  }
  if (ev.changedTouches?.[0]) {
    [evDetail] = ev.changedTouches;
  }
  if (!dragState.value) {
    return;
  }
  dragState.value = 'drag-active';
  dragDownY.value = Math.max(evDetail.clientY - touchStartY.value, 0);
};
const onDragEnd = (ev) => {
  dragState.value = '';
  if (ev.type !== 'touchcancel' && dragDownY.value > 100) {
    close();
  }
};

const sheetClass = computed(() => {
  const dragStyle = dragState.value === 'drag-active' ? {
    transform: `translate3d(-50%, ${dragDownY.value}px, 0)`,
  } : null;
  if (props.contentStyle) {
    return [
      props.contentStyle,
      dragStyle];
  }
  return dragStyle;
});
</script>

<style scoped lang="postcss">
@reference 'tailwindcss';
@reference '../assets/style/app.css';

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

  .bottom-sheet {
    display: block;
    position: absolute;
    left: 50%;
    bottom: 0;
    top: unset;
    transform: translate3d(-50%, 100%, 0);
    width: 100%;
    max-width: var(--mp-page-max-width);
    max-height: calc(100% - 72px);
    height: initial;
    border-radius: 28px 28px 0 0;
    background-color: var(--md-color-surface-container-low);
    transition: transform var(--ease-md-standard) .3s;

    &.drag-active {
      transition-property: none;
    }

    .drag-handler {
      width: 32px;
      height: 4px;
      border-radius: 2px;
      background-color: var(--md-color-on-surface-variant);
    }

    .header {
      padding: 0 24px;
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
