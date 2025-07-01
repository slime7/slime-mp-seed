<script setup>
import { computed, ref } from 'vue';
import useGlobalStore from '@/store/global';
import useThemeColor from '@/hooks/useThemeColor';

const props = defineProps({
  className: {
    type: [String, Array, Object],
    default: '',
  },
  /**
   * 按钮的变体样式，可选值为 'filled' | 'tonal' | 'secondary' | 'outlined' | 'text' | 'elevated'。
   * @type {'filled' | 'tonal' | 'secondary' | 'outlined' | 'text' | 'elevated'}
   * @default 'filled'
   */
  variant: {
    type: String,
    default: 'filled',
  },
  filledAlt: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: Boolean,
    default: false,
  },
  sharpe: {
    type: String,
    default: 'rounded',
  },
  block: {
    type: Boolean,
    default: false,
  },
  togglable: {
    type: Boolean,
    default: false,
  },
  toggled: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  openType: {
    type: String,
    default: '',
  },
  /**
   * 按钮的变体样式，可选值为 'xs' | 'sm' | 'md' | 'lg' | 'xl'。
   * @type {'xs' | 'sm' | 'md' | 'lg' | 'xl'}
   * @default 'sm'
   */
  size: {
    type: String,
    default: 'sm',
  },
  prependIcon: {
    type: String,
    default: '',
  },
  appendIcon: {
    type: String,
    default: '',
  },
  /** 主题色 */
  color: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['click', 'getphonenumber']);

const store = useGlobalStore();
const id = `${Math.random()}`.substring(2);
const btnClass = ['mat-button', `mat-button-id-${id}`];
const btnVariantClass = computed(() => {
  let variant = '';
  switch (props.variant) {
  case 'text':
    variant = 'mat-button--variant-text';
    break;
  case 'outlined':
    variant = 'mat-button--variant-outlined';
    break;
  case 'elevated':
    variant = 'mat-button--variant-elevated';
    break;
  case 'tonal':
  case 'secondary':
    variant = 'mat-button--variant-tonal';
    break;
  case 'filled':
  default:
    variant = 'mat-button--variant-filled';
    break;
  }
  return variant;
});
const btnSizeClass = computed(() => {
  let sizeClass = 'mat-button--size-';
  switch (props.size) {
  case 'xs':
    sizeClass += 'xs';
    break;
  case 'md':
    sizeClass += 'md';
    break;
  case 'lg':
    sizeClass += 'lg';
    break;
  case 'xl':
    sizeClass += 'xl';
    break;
  case 'sm':
  default:
    sizeClass += 'sm';
    break;
  }
  return sizeClass;
});
const btnSharpeClass = computed(() => `mat-button--sharpe-${props.sharpe}`);
const btnBlockClass = computed(() => (props.block ? 'mat-button--block' : ''));
const btnDisabledClass = computed(() => (props.disabled ? 'mat-button--disabled' : ''));
const btnTogglableClass = computed(() => (props.togglable ? 'mat-button--togglable' : ''));
const btnToggledClass = computed(() => (props.toggled ? 'toggled' : ''));
const btnIconClass = computed(() => (props.icon ? 'mat-button--icon' : ''));

// 自定义颜色
const themeStyles = computed(() => {
  const isDark = store.deviceInfo.theme === 'dark';
  return useThemeColor(props.color, isDark);
});

const handleClick = (ev) => {
  if (props.disabled) {
    return;
  }
  ev.preventDefault();
  emit('click', ev);
};
const handleGetPhoneNumber = (ev) => {
  emit('getphonenumber', ev);
};
const pressed = ref(false);
let pressedTimer = null;
const handlePressDown = async () => {
  if (props.disabled) {
    return;
  }

  clearTimeout(pressedTimer);
  pressed.value = true;
};
const handlePressUp = async () => {
  pressedTimer = setTimeout(() => {
    pressed.value = false;
  }, 0);
};
</script>

<template>
  <button
    :open-type="openType"
    :class="[
      btnClass,
      className,
      btnVariantClass,
      btnSharpeClass,
      btnBlockClass,
      btnDisabledClass,
      btnTogglableClass,
      btnToggledClass,
      btnIconClass,
      btnSizeClass,
      { pressed },
    ]"
    :style="{
      ...themeStyles,
    }"
    @mousedown="handlePressDown"
    @mouseup="handlePressUp"
    @mouseout="handlePressUp"
    @touchstart="handlePressDown"
    @touchend="handlePressUp"
    @click="handleClick"
    @getphonenumber="handleGetPhoneNumber"
  >
    <div class="mat-button--content flex center">
      <div v-if="prependIcon" class="prepend-icon flex items-center">
        <div class="material-icons">
          {{ prependIcon }}
        </div>
      </div>
      <div class="slot-prepend-icon">
        <slot name="prepend-icon" />
      </div>

      <slot />

      <div v-if="appendIcon" class="append-icon flex items-center">
        <div class="material-icons">
          {{ appendIcon }}
        </div>
      </div>
      <div class="slot-append-icon">
        <slot name="append-icon" />
      </div>
    </div>

    <div class="mat-button--state-layer" />
  </button>
</template>

<style scoped lang="postcss">
@reference '../assets/style/app.css';

.mat-button {
  --mat-btn-height: --spacing(10);
  --mat-btn-padding: --spacing(4);
  --mat-btn-radius: calc(var(--mat-btn-height) / 2);
  --mat-btn-radius-square: --spacing(3);
  --mat-btn-radius-pressed: --spacing(2);
  --mat-btn-icon-spacing: --spacing(2);
  --mat-btn-icon-size: --spacing(5);
  --mat-btn-border-size: 1px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 var(--mat-btn-padding);
  width: initial;
  height: var(--mat-btn-height);
  border-radius: var(--mat-btn-radius-square);
  font-size: .875rem;
  zoom: 1;
  white-space: nowrap;
  text-decoration: none;
  touch-action: manipulation;
  user-select: none;
  transition: all .2s var(--ease-md-decelerate);
  overflow: hidden;

  .mat-button--state-layer {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: inherit;
    inset: 0;
    overflow: hidden;
    display: flex;
    margin: auto;
    width: 100%;
    height: 100%;
    background-color: transparent;
    opacity: 0;
    pointer-events: none;
  }

  &.mat-button--sharpe-rounded {
    border-radius: var(--mat-btn-radius);
  }

  &.mat-button--sharpe-square {
    border-radius: var(--mat-btn-radius-square);
  }

  &.mat-button--size-xs {
    --mat-btn-height: --spacing(8);
    --mat-btn-padding: --spacing(3);
    --mat-btn-icon-spacing: --spacing(1);
    --mat-btn-icon-size: --spacing(5);
  }

  &.mat-button--size-md {
    --mat-btn-height: --spacing(14);
    --mat-btn-padding: --spacing(6);
    --mat-btn-radius-square: --spacing(4);
    --mat-btn-radius-pressed: --spacing(3);
    --mat-btn-icon-size: --spacing(6);
    font-size: 1rem;
  }

  &.mat-button--size-lg {
    --mat-btn-height: --spacing(14);
    --mat-btn-padding: --spacing(6);
    --mat-btn-radius-square: --spacing(7);
    --mat-btn-radius-pressed: --spacing(4);
    --mat-btn-icon-spacing: --spacing(3);
    --mat-btn-icon-size: --spacing(8);
    --mat-btn-border-size: 2px;
    font-size: 1.5rem;
  }

  &.mat-button--size-xl {
    --mat-btn-height: --spacing(34);
    --mat-btn-padding: --spacing(16);
    --mat-btn-radius-square: --spacing(7);
    --mat-btn-radius-pressed: --spacing(4);
    --mat-btn-icon-spacing: --spacing(4);
    --mat-btn-icon-size: --spacing(10);
    --mat-btn-border-size: 3px;
    font-size: 2rem;
  }

  &.mat-button--variant-filled {
    color: var(--md-color-on-primary);
    background-color: var(--md-color-primary);

    &.mat-button--togglable {
      color: var(--md-color-on-surface-variant);
      background-color: var(--md-color-surface-container);

      &.toggled {
        color: var(--md-color-on-primary);
        background-color: var(--md-color-primary);
        border-radius: var(--mat-btn-radius-square);
      }

      &.pressed {
        border-radius: var(--mat-btn-radius-pressed);
      }
    }
  }

  &.mat-button--variant-elevated {
    color: var(--md-color-primary);
    background-color: var(--md-color-surface-container-low);
    box-shadow: var(--shadow-md-level-1);

    &.mat-button--togglable {
      &.toggled {
        color: var(--md-color-on-primary);
        background-color: var(--md-color-primary);
        border-radius: var(--mat-btn-radius-square);
      }

      &.pressed {
        border-radius: var(--mat-btn-radius-pressed);
      }

      &.mat-button--disabled {
        box-shadow: none;
      }
    }
  }

  &.mat-button--variant-tonal {
    color: var(--md-color-on-secondary-container);
    background-color: var(--md-color-secondary-container);

    &.mat-button--togglable {
      &.toggled {
        color: var(--md-color-on-secondary);
        background-color: var(--md-color-secondary);
        border-radius: var(--mat-btn-radius-square);
      }

      &.pressed {
        border-radius: var(--mat-btn-radius-pressed);
      }
    }

    &.pressed {
      color: var(--md-color-on-tertiary);
      background-color: var(--md-color-tertiary);
    }
  }

  &.mat-button--variant-outlined {
    color: var(--md-color-on-surface-variant);
    background-color: transparent;
    border: var(--mat-btn-border-size) solid var(--md-color-outline-variant);

    &.mat-button--disabled {
      border-color: var(--md-color-outline-variant);
    }

    &.mat-button--togglable {
      color: var(--md-color-on-surface-variant);
      border-color: var(--md-color-outline-variant);

      &.toggled {
        color: var(--md-color-inverse-on-surface);
        background-color: var(--md-color-inverse-surface);
        border-color: var(--md-color-inverse-surface);
        border-radius: var(--mat-btn-radius-square);

        &.mat-button--disabled {
          border-color: transparent;
        }
      }

      &.pressed {
        border-radius: var(--mat-btn-radius-pressed);
      }
    }
  }

  &.mat-button--variant-text {
    background-color: transparent;
    color: var(--md-color-primary);
  }

  &.pressed {
    border-radius: var(--mat-btn-radius-pressed);

    .mat-button--state-layer {
      background-color: currentColor;
      opacity: .1;
    }
  }

  &.mat-button--disabled {
    color: var(--md-color-on-surface) !important;
    background-color: transparent !important;
    opacity: .38;

    .mat-button--state-layer {
      background-color: var(--md-color-on-surface) !important;
      opacity: .32;
    }
  }

  .mat-button--content {
    font-weight: 500;
  }

  &::after {
    border: none;
    content: none;
  }

  &.mat-button--block {
    display: flex;
  }

  .slot-prepend-icon,
  .prepend-icon {
    margin-right: var(--mat-btn-icon-spacing);

    &:empty {
      margin-right: 0;
    }
  }

  .slot-append-icon,
  .append-icon {
    margin-left: var(--mat-btn-icon-spacing);

    &:empty {
      margin-left: 0;
    }
  }

  .prepend-icon,
  .append-icon {
    .material-icons {
      font-size: var(--mat-btn-icon-size);
    }
  }
}
</style>
