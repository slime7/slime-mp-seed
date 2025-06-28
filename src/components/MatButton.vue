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
});
const emit = defineEmits(['click', 'getphonenumber']);

const id = `${Math.random()}`.substring(2);
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
const btnRoundedClass = computed(() => (props.rounded ? 'mat-button--rounded' : ''));
const btnBlockClass = computed(() => (props.block ? 'mat-button--block' : ''));
const btnDisabledClass = computed(() => (props.disabled ? 'mat-button--disabled' : ''));
const btnTogglableClass = computed(() => (props.togglable ? 'mat-button--togglable' : ''));
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
  }, 200);
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
      btnTogglableClass,
      btnToggledClass,
      btnIconClass,
      btnSizeClass,
      { pressed },
    ]"
    :style="{
      ...btnColor,
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
  --mat-btn-color: var(--color-surface);
  --mat-btn-text-color: var(--color-on-surface);
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
  transition: all .2s cubic-bezier(.2, 0, 0, 1);
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
    pointer-events: none;
  }

  &.mat-button--rounded {
    border-radius: var(--mat-btn-radius);
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

  &.mat-button-variant-filled {
    color: var(--color-on-primary);
    background-color: var(--color-primary);

    &.mat-button--disabled {
      color: --alpha(var(--color-on-surface) / .38);
      background-color: --alpha(var(--color-on-surface) / .1);
    }

    &.mat-button--togglable {
      color: var(--color-on-surface);
      background-color: var(--color-surface-container);

      &.toggled {
        color: var(--color-on-primary);
        background-color: var(--color-primary);
        border-radius: var(--mat-btn-radius-square);
      }

      &.pressed {
        border-radius: var(--mat-btn-radius-pressed);
      }

      &.mat-button--disabled {
        color: --alpha(var(--color-on-surface) / .38);
        background-color: --alpha(var(--color-on-surface) / .1);
      }
    }
  }

  &.mat-button-variant-elevated {
    color: var(--color-primary);
    background-color: var(--color-surface-container-low);
    box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px rgba(0, 0, 0, .14), 0 1px 5px rgba(0, 0, 0, .12);

    &.mat-button--disabled {
      color: --alpha(var(--color-on-surface) / .38);
      background-color: --alpha(var(--color-on-surface) / .1);
      box-shadow: none;
    }

    &.mat-button--togglable {
      color: var(--color-primary);
      background-color: var(--color-surface-container-low);

      &.toggled {
        color: var(--color-on-primary);
        background-color: var(--color-primary);
        border-radius: var(--mat-btn-radius-square);
      }

      &.pressed {
        border-radius: var(--mat-btn-radius-pressed);
      }

      &.mat-button--disabled {
        color: --alpha(var(--color-on-surface) / .38);
        background-color: --alpha(var(--color-on-surface) / .1);
        box-shadow: none;
      }
    }
  }

  &.mat-button-variant-tonal {
    color: var(--color-on-secondary-container);
    background-color: var(--color-secondary-container);

    &.mat-button--disabled {
      color: --alpha(var(--color-on-surface) / .38);
      background-color: --alpha(var(--color-on-surface) / .1);
    }

    &.mat-button--togglable {
      color: var(--color-on-secondary-container);
      background-color: var(--color-secondary-container);

      &.toggled {
        color: var(--color-on-secondary);
        background-color: var(--color-secondary);
        border-radius: var(--mat-btn-radius-square);
      }

      &.pressed {
        border-radius: var(--mat-btn-radius-pressed);
      }

      &.mat-button--disabled {
        color: --alpha(var(--color-on-surface) / .38);
        background-color: --alpha(var(--color-on-surface) / .1);
      }
    }
  }

  &.mat-button-variant-outlined {
    color: var(--color-on-surface);
    background-color: transparent;
    border: var(--mat-btn-border-size) solid var(--color-outline-variant);

    &.mat-button--disabled {
      color: --alpha(var(--color-on-surface) / .38);
      background-color: --alpha(var(--color-on-surface) / .1);
      border-color: var(--color-outline-variant);
    }

    &.mat-button--togglable {
      color: var(--color-on-surface);
      border-color: var(--color-outline-variant);

      &.toggled {
        color: var(--color-inverse-on-surface);
        background-color: var(--color-inverse-surface);
        border-color: var(--color-inverse-surface);
        border-radius: var(--mat-btn-radius-square);
      }

      &.pressed {
        border-radius: var(--mat-btn-radius-pressed);
      }

      &.mat-button--disabled {
        color: --alpha(var(--color-on-surface) / .38);
        background-color: --alpha(var(--color-on-surface) / .1);
        border-color: --alpha(var(--color-on-surface) / .1);
      }
    }
  }

  &.mat-button-variant-text {
    background-color: transparent;
    color: var(--color-primary);
  }

  &.pressed {
    border-radius: var(--mat-btn-radius-pressed);

    .mat-button--state-layer {
      background-color: currentColor;
      opacity: .1;
    }
  }

  &.mat-button--disabled {
    color: --alpha(var(--color-on-surface) / .38);
    background-color: --alpha(var(--color-on-surface) / .1);
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

  &.mat-button--icon {
    padding: 0;
    min-width: initial;
    width: 36px;
    border-radius: calc(infinity * 1px);
  }

  &.custom-color {
    color: var(--mat-btn-text-color);
    background-color: var(--mat-btn-color);

    &.mat-button-variant-text,
    &.mat-button-variant-outlined {
      color: var(--mat-btn-color);
      background-color: transparent;
    }

    &.mat-button-variant-outlined {
      border: var(--mat-btn-border-size) solid var(--mat-btn-color);
    }
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

@media (prefers-color-scheme: dark) {
  .mat-button {
    --mat-btn-color: var(--color-dark-surface);
    --mat-btn-text-color: var(--color-dark-on-surface);

    &.mat-button-variant-filled {
      color: var(--color-dark-on-primary);
      background-color: var(--color-dark-primary);

      &.mat-button--disabled {
        color: --alpha(var(--color-dark-on-surface) / .38);
        background-color: --alpha(var(--color-dark-on-surface) / .1);
      }

      &.mat-button--togglable {
        color: var(--color-dark-on-surface);
        background-color: var(--color-dark-surface-container);

        &.toggled {
          color: var(--color-dark-on-primary);
          background-color: var(--color-dark-primary);
        }

        &.mat-button--disabled {
          color: --alpha(var(--color-dark-on-surface) / .38);
          background-color: --alpha(var(--color-dark-on-surface) / .1);
        }
      }
    }

    &.mat-button-variant-elevated {
      color: var(--color-dark-primary);
      background-color: var(--color-dark-surface-container-low);

      &.mat-button--disabled {
        color: --alpha(var(--color-dark-on-surface) / .38);
        background-color: --alpha(var(--color-dark-on-surface) / .1);
      }

      &.mat-button--togglable {
        color: var(--color-dark-primary);
        background-color: var(--color-dark-surface-container-low);

        &.toggled {
          color: var(--color-dark-on-primary);
          background-color: var(--color-dark-primary);
        }

        &.mat-button--disabled {
          color: --alpha(var(--color-dark-on-surface) / .38);
          background-color: --alpha(var(--color-dark-on-surface) / .1);
        }
      }
    }

    &.mat-button-variant-tonal {
      color: var(--color-dark-on-secondary-container);
      background-color: var(--color-dark-secondary-container);

      &.mat-button--disabled {
        color: --alpha(var(--color-dark-on-surface) / .38);
        background-color: --alpha(var(--color-dark-on-surface) / .1);
      }

      &.mat-button--togglable {
        color: var(--color-dark-on-secondary-container);
        background-color: var(--color-dark-secondary-container);

        &.toggled {
          color: var(--color-dark-on-secondary);
          background-color: var(--color-dark-secondary);
        }

        &.mat-button--disabled {
          color: --alpha(var(--color-dark-on-surface) / .38);
          background-color: --alpha(var(--color-dark-on-surface) / .1);
        }
      }
    }

    &.mat-button-variant-outlined {
      color: var(--color-dark-on-surface);
      border-color: var(--color-dark-outline-variant);

      &.mat-button--disabled {
        color: --alpha(var(--color-dark-on-surface) / .38);
        background-color: --alpha(var(--color-dark-on-surface) / .1);
        border-color: var(--color-dark-outline-variant);
      }

      &.mat-button--togglable {
        color: var(--color-dark-on-surface);
        border-color: var(--color-dark-outline-variant);

        &.toggled {
          color: var(--color-dark-inverse-on-surface);
          background-color: var(--color-dark-inverse-surface);
          border-color: var(--color-dark-inverse-surface);
        }

        &.mat-button--disabled {
          color: --alpha(var(--color-dark-on-surface) / .38);
          background-color: --alpha(var(--color-dark-on-surface) / .1);
          border-color: --alpha(var(--color-dark-on-surface) / .1);
        }
      }
    }

    &.mat-button-variant-text {
      color: var(--color-dark-primary);
    }

    &.mat-button--disabled {
      color: --alpha(var(--color-dark-on-surface) / .38);
      background-color: --alpha(var(--color-dark-on-surface) / .1);
    }
  }
}
</style>
