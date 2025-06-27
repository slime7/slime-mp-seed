<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  className: {
    type: [String, Array, Object],
    default: '',
  },
  color: {
    type: String,
    default: 'primary',
  },
  textColor: {
    type: String,
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
  icon: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: true,
  },
  block: {
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
  height: {
    type: String,
    default: '36px',
  },
});
const emit = defineEmits(['click', 'getphonenumber']);

const id = `${Math.random()}`.substring(2);
const btnHeight = computed(() => ({ '--mat-btn-height': props.height }));
const btnClass = ['mat-button', `mat-button-id-${id}`];
const btnColorClass = computed(() => (props.color && [
  'primary',
  'secondary',
  'tertiary',
  'error',
].indexOf(props.color) > -1 ? props.color : 'custom-color'));
const btnColor = computed(() => (btnColorClass.value !== 'custom-color' ? {} : { '--mat-btn-color': props.color }));
const btnTextColorClass = computed(() => {
  let textColor = '';
  switch (props.textColor) {
  case 'black':
    textColor = 'text--black';
    break;
  case 'white':
    textColor = 'text--white';
    break;
  default:
    break;
  }
  return textColor;
});
const btnVariantClass = computed(() => {
  let variant = '';
  switch (props.variant) {
  case 'text':
    variant = 'mat-button-variant-text';
    break;
  case 'outlined':
    variant = 'mat-button-variant-outlined';
    break;
  case 'elevated':
    variant = 'mat-button-variant-elevated';
    break;
  case 'tonal':
  case 'secondary':
    variant = 'mat-button-variant-tonal';
    break;
  case 'filled':
  default:
    variant = 'mat-button-variant-filled';
    break;
  }
  return variant;
});
const btnRoundedClass = computed(() => (props.rounded ? 'mat-button--rounded' : ''));
const btnBlockClass = computed(() => (props.block ? 'mat-button--block' : ''));
const btnDisabledClass = computed(() => (props.disabled ? 'mat-button--disabled' : ''));
const btnToggledClass = computed(() => (props.toggled ? 'toggled' : ''));
const btnIconClass = computed(() => (props.icon ? 'mat-button--icon' : ''));

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
  }, 150);
};
</script>

<template>
  <button
    :open-type="openType"
    :class="[
      btnClass,
      className,
      btnColorClass,
      btnTextColorClass,
      btnVariantClass,
      btnRoundedClass,
      btnBlockClass,
      btnDisabledClass,
      btnToggledClass,
      btnIconClass,
      { toggled: pressed },
    ]"
    :style="{
      ...btnHeight,
      ...btnColor,
    }"
    @touchstart="handlePressDown"
    @touchend="handlePressUp"
    @click="handleClick"
    @getphonenumber="handleGetPhoneNumber"
  >
    <div class="mat-button--content flex center">
      <slot />
    </div>
  </button>
</template>

<style scoped lang="postcss">
@reference '../assets/style/app.css';

.mat-button {
  --mat-btn-height: 36px;
  --mat-btn-color: var(--color-surface);
  --mat-btn-text-color: var(--color-on-surface);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 16px;
  min-width: 64px;
  width: auto;
  height: var(--mat-btn-height, 36px);
  border-radius: 12px;
  font-size: .875rem;
  zoom: 1;
  white-space: nowrap;
  text-decoration: none;
  touch-action: manipulation;
  user-select: none;
  transition: border-radius .15s ease-in-out, color .15s ease-in-out, background-color .15s ease-in-out;
  overflow: hidden;

  &.mat-button-variant-filled {
    color: var(--color-on-primary);
    background-color: var(--color-primary);

    &.toggled {
      border-radius: 12px;
      color: var(--color-on-primary);
      background-color: var(--color-primary);
    }
  }

  &.mat-button-variant-elevated {
    color: var(--color-primary);
    background-color: var(--color-surface-container-low);
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px rgba(0, 0, 0, .14), 0 1px 5px rgba(0, 0, 0, .12);

    &.toggled {
      border-radius: 12px;
      color: var(--color-on-primary);
      background-color: var(--color-primary);
    }
  }

  &.mat-button-variant-tonal {
    color: var(--color-on-secondary);
    background-color: var(--color-secondary);

    &.toggled {
      border-radius: 12px;
      color: var(--color-on-secondary);
      background-color: var(--color-secondary);
    }
  }

  &.mat-button-variant-outlined {
    background-color: transparent;
    color: var(--color-on-surface);
    border: 1px solid var(--color-outline-variant);

    &.toggled {
      border-radius: 12px;
      color: var(--color-inverse-on-surface);
      background-color: var(--color-inverse-surface);
    }
  }

  &.mat-button-variant-text {
    background-color: transparent;
    color: var(--color-on-surface);
  }

  .mat-button--content {
    font-weight: 500;
  }

  &.text--white:not(.mat-button--text):not(.mat-button--outlined) {
    color: var(--color-surface);
  }

  &.text--black:not(.mat-button--text):not(.mat-button--outlined) {
    color: var(--color-on-surface);
  }

  &::after {
    border: none;
    content: none;
  }

  &.mat-button--block {
    display: flex;
  }

  &.mat-button--rounded {
    border-radius: calc(infinity * 1px);
  }

  &.mat-button--icon {
    padding: 0;
    min-width: initial;
    width: 36px;
    border-radius: calc(infinity * 1px);
  }

  &.mat-button--disabled {
    opacity: .1;
  }

  &.custom-color {
    color: var(--mat-btn-text-color);
    background-color: var(--mat-btn-color);

    &.mat-button--text,
    &.mat-button--outlined {
      color: var(--mat-btn-color);
      background-color: transparent;
    }

    &.mat-button--outlined {
      border: 1px solid var(--mat-btn-color);
    }
  }
}
</style>
