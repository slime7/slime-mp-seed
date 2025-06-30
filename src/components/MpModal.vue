<script setup>
import { ref, toRefs, watchEffect } from 'vue';
import MatButton from './MatButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  /**
   * @type {'basic' | 'confirm' | 'alert'}
   * @default 'basic'
   */
  type: {
    type: String,
    default: 'basic',
  },
  closeOutside: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
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
  icon: {
    type: String,
    default: '',
  },
});
const {
  modelValue,
  closeOutside,
  title,
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
      <div v-if="icon" class="flex center mb-4">
        <div class="dialog-icon flex items-center">
          <div class="material-icons">
            {{ icon }}
          </div>
        </div>
      </div>

      <div
        v-if="title"
        class="header flex mb-4"
        :class="{ 'justify-center': !!icon }"
        @touchmove.stop.prevent="noop"
      >
        <div class="title">
          {{ title }}
        </div>
      </div>

      <slot />

      <div class="modal-actions mt-6 flex gap-x-2 justify-end">
        <div v-if="cancelText" class="">
          <mat-button
            variant="text"
            size="sm"
            :disabled="loading"
            @click="close"
          >
            {{ cancelText }}
          </mat-button>
        </div>

        <block v-if="type !== 'alert'">
          <div class="confirm-slot">
            <slot name="confirm" />
          </div>
          <div class="confirm">
            <mat-button
              :variant="type === 'confirm' ? 'tonal' : 'text'"
              size="sm"
              :disabled="loading"
              @click="confirm"
            >
              {{ confirmText }}
            </mat-button>
          </div>
        </block>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
@reference 'tailwindcss';
@reference '../assets/style/app.css';

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
    background-color: var(--color-md-scrim);
    transition: opacity var(--ease-md-standard) .1s;

    &.open-active {
      opacity: 1;
    }

    &.close-active {
      opacity: 0;
    }
  }

  .dialog {
    @apply text-sm;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0) scale(.6);
    padding: --spacing(6);
    min-width: 280px;
    max-width: min(560px, calc(var(--mp-page-max-width) - 48px));
    min-height: 130px;
    max-height: min(560px, 100% - 48px);
    height: fit-content;
    width: fit-content;
    border-radius: 28px;
    opacity: 0;
    font-weight: 400;
    color: var(--md-color-on-surface-variant);
    background-color: var(--md-color-surface-container-high);
    transition: all var(--ease-md-decelerate) .3s;
    transform-origin: center;
    box-shadow: var(--shadow-md-level-3);

    .dialog-icon {
      color: var(--md-color-secondary);

      .material-icons {
        font-size: 24px;
      }
    }

    .header {
      color: var(--md-color-on-surface);

      .title {
        @apply text-2xl;
        font-weight: bold;
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
      transition-timing-function: var(--ease-md-accelerate);
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
