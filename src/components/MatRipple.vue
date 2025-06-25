<script setup>
import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
} from 'vue';
import { classMerge, wait } from '@/utils';

const instance = getCurrentInstance();
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const id = `${Math.random()}`.substring(2);
const animateFn = computed(() => instance.proxy.$scope.animate);
const clearAnimateFn = computed(() => instance.proxy.$scope.clearAnimation);
const state = ref('inactive');
const pressed = ref(false);
const hostWidth = ref(0);
const hostHeight = ref(0);
const parentRect = reactive({
  width: 0,
  height: 0,
  top: 0,
  left: 0,
});
const rippleSize = ref('');
const rippleScale = ref('');
const initialSize = ref(0);
const animateEndTimer = ref(null);

const getEleQuery = (selector) => new Promise((resolve) => {
  const queryInfo = uni.createSelectorQuery().in(instance.proxy);
  queryInfo.select(selector).boundingClientRect();
  queryInfo.selectViewport().scrollOffset();
  queryInfo.exec((data) => {
    resolve(data);
  });
});
const getParentRect = async () => {
  const result = await getEleQuery(`.mat-ripple.mat-ripple-id-${id}`);
  const [button] = result;
  if (!button) {
    console.log(result);
    return;
  }

  parentRect.width = parseInt(button.width, 10);
  parentRect.height = parseInt(button.height, 10);
  parentRect.top = button.top;
  parentRect.left = button.left;
};
const determineRippleSize = async () => {
  await getParentRect();
  const { width, height } = parentRect;
  const maxDim = Math.max(height, width);
  const softEdgeSize = Math.max(0.35 * maxDim, 75);

  const size = Math.floor(maxDim * 0.2);
  const hypotenuse = Math.sqrt(width ** 2 + height ** 2);
  const maxRadius = hypotenuse + 10;

  hostWidth.value = width;
  hostHeight.value = height;
  initialSize.value = size;
  rippleSize.value = `${size}px`;
  rippleScale.value = `${(maxRadius + softEdgeSize) / size}`;
};
const startPressAnimation = async (ev = null) => {
  pressed.value = true;
  clearAnimateFn.value(`.mat-ripple.mat-ripple-id-${id} .ripple-item`);
  clearTimeout(animateEndTimer.value);
  await determineRippleSize();
  const {
    left,
    top,
    width,
    height,
  } = parentRect;
  const startPoint = {
    x: (ev ? parseInt(ev.touches[0].clientX, 10) - left : width / 2),
    y: (ev ? parseInt(ev.touches[0].clientY, 10) - top : height / 2),
  };
  startPoint.x -= (initialSize.value / 2);
  startPoint.y -= (initialSize.value / 2);
  const endPoint = {
    x: (width - initialSize.value) / 2,
    y: (height - initialSize.value) / 2,
  };
  animateFn.value(`.mat-ripple.mat-ripple-id-${id} .ripple-item`, [
    {
      ease: 'cubic-bezier(.2, 0, 0, 1)',
      top: 0,
      left: 0,
      width: rippleSize.value,
      height: rippleSize.value,
      translate: [startPoint.x, startPoint.y],
      scaleX: 1,
      scaleY: 1,
    },
    {
      ease: 'cubic-bezier(.2, 0, 0, 1)',
      top: 0,
      left: 0,
      width: rippleSize.value,
      height: rippleSize.value,
      translate: [endPoint.x, endPoint.y],
      scaleX: rippleScale.value,
      scaleY: rippleScale.value,
    },
  ], 450);
};
const endPressAnimation = () => {
  state.value = 'inactive';
  pressed.value = false;
};
let rippleStartEvent = null;
const handlePressDown = async (ev) => {
  if (props.disabled) {
    return;
  }

  rippleStartEvent = ev;
  state.value = 'hold-delay';
  await wait(150);

  if (state.value !== 'hold-delay') {
    return;
  }
  state.value = 'holding';
  startPressAnimation(ev);
};
const handlePressUp = () => {
  if (props.disabled) {
    return;
  }

  if (state.value === 'hold-delay') {
    startPressAnimation(rippleStartEvent);
    animateEndTimer.value = setTimeout(endPressAnimation, 450);
    state.value = 'inactive';
    return;
  }
  if (state.value === 'holding') {
    animateEndTimer.value = setTimeout(endPressAnimation, 105);
  }
};

onMounted(() => {
});
</script>

<template>
  <div
    class="mat-ripple"
    :class="classMerge(`mat-ripple-id-${id}`, { pressed })"
    @touchstart="handlePressDown"
    @touchend="handlePressUp"
  >
    <div class="ripple-item" />
  </div>
</template>

<style lang="scss">
:host {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: inherit;
  inset: 0;
  overflow: hidden;
  display: flex;
  margin: auto;
  width: 100%;
  height: 100%;
}

.mat-ripple {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: inherit;
  inset: 0;
  overflow: hidden;
  display: flex;
  margin: auto;
  width: 100%;
  height: 100%;
  --pressed-color: currentColor;

  .ripple-item {
    opacity: 0;
    position: absolute;
    background: radial-gradient(closest-side, var(--pressed-color) max(100% - 70px, 65%), transparent 100%);
    transform-origin: center center;
    transition: opacity 375ms linear;
    pointer-events: none;
  }

  &.pressed {
    .ripple-item {
      opacity: .12;
      transition-duration: 105ms;
    }
  }
}
</style>
