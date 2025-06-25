<script setup>
import { watchEffect } from 'vue';
import { classMerge } from '@/utils';
import MatRipple from '@/components/MatRipple.vue';

const props = defineProps({
  className: {
    type: [String, Array, Object],
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  textColor: {
    type: String,
    default: '',
  },
  text: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  block: {
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
const btnClass = ['mat-button', `mat-button-id-${id}`];
const addClass = (c) => {
  if (!btnClass.includes(c)) {
    btnClass.push(c);
  }
};
const removeClass = (c) => {
  const index = btnClass.indexOf(c);
  if (index > -1) {
    btnClass.splice(index, 1);
  }
};
const setProps = () => {
  switch (props.textColor) {
  case 'black':
    addClass('text--black');
    break;
  case 'white':
    addClass('text--white');
    break;
  default:
    removeClass('text--black');
    removeClass('text--white');
    break;
  }
  if (props.text) {
    addClass('mat-button--text');
  } else {
    removeClass('mat-button--text');
  }
  if (props.outlined) {
    addClass('mat-button--outlined');
  } else {
    removeClass('mat-button--outlined');
  }
  if (props.rounded) {
    addClass('mat-button--rounded');
  } else {
    removeClass('mat-button--rounded');
  }
  if (props.block) {
    addClass('mat-button--block');
  } else {
    removeClass('mat-button--block');
  }
  if (props.icon) {
    addClass('mat-button--icon');
  } else {
    removeClass('mat-button--icon');
  }
  if (props.disabled) {
    addClass('mat-button--disabled');
  } else {
    removeClass('mat-button--disabled');
  }
  if (props.color && [
    'primary',
    'success',
    'warning',
    'error',
  ].indexOf(props.color) > -1) {
    addClass(props.color);
  } else {
    removeClass('primary');
    removeClass('success');
    removeClass('warning');
    removeClass('error');
  }
};
setProps();

watchEffect(() => {
  setProps();
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
</script>

<script>
export default {
  options: {
    virtualHost: true,
  },
};
</script>

<template>
  <button
    :open-type="openType"
    :class="classMerge(btnClass, className)"
    :style="{
      '--mat-btn-height': height,
    }"
    @click="handleClick"
    @getphonenumber="handleGetPhoneNumber"
  >
    <mat-ripple :disabled="disabled" />
    <div class="mat-button--content">
      <slot />
    </div>
  </button>
</template>

<style scoped lang="scss">
.mat-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0 16px;
  min-width: 64px;
  height: var(--mat-btn-height, 36px);
  border-radius: 4px;
  font-size: .875rem;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
  color: rgba(0, 0, 0, .87);
  background-color: #fff;
  zoom: 1;
  white-space: nowrap;
  text-decoration: none;
  text-transform: uppercase;
  touch-action: manipulation;
  user-select: none;
  transition: all .2s cubic-bezier(.4, 0, .2, 1);
  will-change: box-shadow;
  overflow: hidden;

  .mat-button--content {
    font-weight: 500;
  }

  &.text--white:not(.mat-button--text):not(.mat-button--outlined) {
    color: rgba(255, 255, 255, .84);
  }

  &.text--black:not(.mat-button--text):not(.mat-button--outlined) {
    color: rgba(0, 0, 0, .87);
  }

  &::after {
    border: none;
    content: none;
  }

  &.mat-button--block {
    display: flex;
  }

  &.mat-button--rounded {
    border-radius: 999px;
  }

  &.mat-button--text, &.mat-button--outlined {
    color: currentColor;
    background-color: transparent;
    box-shadow: none;
  }

  &.mat-button--outlined {
    border: 1px solid currentColor;
  }

  &.mat-button--text {
    padding-left: 8px;
    padding-right: 8px;
  }

  &.mat-button--icon {
    padding: 0;
    min-width: initial;
    width: 36px;
    border-radius: 999px;
  }

  &.mat-button--disabled {
    opacity: .4;
  }

  &.primary {
    color: rgba(255, 255, 255, .84);
    background-color: #0268ff;

    &.mat-button--text, &.mat-button--outlined {
      color: #0268ff;
      background-color: transparent;
    }

    &.mat-button--outlined {
      border: 1px solid #0268ff;
    }
  }

  &.success {
    color: rgba(255, 255, 255, .84);
    background-color: #4caf50;

    &.mat-button--text, &.mat-button--outlined {
      color: #4caf50;
      background-color: transparent;
    }

    &.mat-button--outlined {
      border: 1px solid #4caf50;
    }
  }

  &.error {
    color: rgba(255, 255, 255, .84);
    background-color: #ff5252;

    &.mat-button--text, &.mat-button--outlined {
      color: #ff5252;
      background-color: transparent;
    }

    &.mat-button--outlined {
      border: 1px solid #ff5252;
    }
  }
}
</style>
