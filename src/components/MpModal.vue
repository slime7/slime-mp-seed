<script setup>
import { ref, toRefs, watchEffect } from 'vue';
import MatButton from './MatButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  closeOutside: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  hideTitleBar: {
    type: Boolean,
    default: false,
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  confirmText: {
    type: String,
    default: '确认',
  },
  hiddenAfterClose: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const {
  modelValue,
  closeOutside,
  title,
  hideTitleBar,
  cancelText,
  confirmText,
  hiddenAfterClose,
} = toRefs(props);
const emit = defineEmits(['update:modelValue', 'click:cancel', 'click:confirm']);

const internalValue = ref(false);
const openActive = ref(false);
const closeActive = ref(false);
watchEffect(() => {
  if (modelValue.value) {
    internalValue.value = true;
    openActive.value = false;
    closeActive.value = false;
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

const noop = () => {
};
const close = () => {
  if (closeActive.value || props.loading) {
    return;
  }
  if (hiddenAfterClose.value) {
    emit('update:modelValue', false);
  }
  emit('click:cancel');
};
const outsideClose = () => {
  if (closeOutside.value) {
    close();
  }
};
const confirm = (ev) => {
  if (closeActive.value) {
    return;
  }
  emit('click:confirm', ev);
};
</script>

<template>
  <div
    class="modal-frame"
    :class="{ 'modal-hidden': !internalValue }"
  >
    <div
      class="overlay"
      :class="{
        'open-active': openActive,
        'close-active': closeActive,
      }"
      @click="outsideClose"
      @touchmove.stop.prevent="noop"
    />

    <div
      class="dialog"
      :class="{
        'open-active': openActive,
        'close-active': closeActive,
      }"
    >
      <div
        v-if="!hideTitleBar"
        class="header flex items-center mb-3"
        @touchmove.stop.prevent="noop"
      >
        <div class="title flex-auto">
          {{ title }}
        </div>
      </div>

      <slot />

      <div class="modal-actions mt-5 flex gap-x-4 justify-center">
        <div v-if="cancelText" class="flex-auto">
          <mat-button
            rounded
            outlined
            block
            height="48px"
            :disabled="loading"
            @click="close"
          >
            {{ cancelText }}
          </mat-button>
        </div>

        <div class="confirm-slot flex-auto">
          <slot name="confirm" />
        </div>
        <div class="confirm flex-auto">
          <mat-button
            color="primary"
            rounded
            block
            height="48px"
            :disabled="loading"
            @click="confirm"
          >
            {{ confirmText }}
          </mat-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-frame {
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
    background-color: rgba(0, 0, 0, .6);
    transition: opacity ease .1s;

    &.open-active {
      opacity: 1;
    }

    &.close-active {
      opacity: 0;
    }
  }

  .dialog {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0) scale(.6);
    padding: 20px 32px 32px;
    width: calc(100vw - 70px);
    max-width: calc(var(--mp-page-max-width) - 70px);
    border-radius: 12px;
    opacity: 0;
    background-color: #fff;
    transition: all ease .3s;
    transform-origin: center;

    .header {
      padding: 0 20px;
      font-size: 18px;
      font-weight: bold;

      .title {
        text-align: center;
      }
    }

    &.open-active {
      opacity: 1;
      transform: translate3d(-50%, -50%, 0) scale(1);
    }

    &.close-active {
      opacity: 0;
      transform: translate3d(-50%, -50%, 0) scale(.8);
      transition-duration: .1s;
    }

    .modal-actions {
      .confirm-slot {
        & + .confirm {
          display: none;
        }

        &:empty {
          display: none;

          & + .confirm {
            display: block;
          }
        }
      }
    }
  }

  &.modal-hidden {
    pointer-events: none;
  }
}
</style>
