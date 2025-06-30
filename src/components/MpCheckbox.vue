<script setup>
import {
  ref,
  toRefs,
  watchEffect,
} from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  labelOnStart: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue', 'change']);
const {
  modelValue,
  indeterminate,
} = toRefs(props);

const internalValue = ref(false);
const internalIndeterminate = ref(false);
watchEffect(() => {
  internalValue.value = modelValue.value;
  internalIndeterminate.value = indeterminate.value;
});

const onChange = (ev) => {
  const isChecked = ev.detail.value.includes('on');
  if (isChecked) {
    internalIndeterminate.value = false;
  }
  internalValue.value = isChecked;
  emit('update:modelValue', isChecked);
  emit('change', ev);
};
</script>
<script>
export default {
  behaviors: ['wx://form-field-group'],
};
</script>

<template>
  <label class="mp-checkbox-label inline-flex items-center">
    <div v-if="label && labelOnStart" class="label-text">{{ label }}</div>

    <div
      class="mp-checkbox"
      :class="{
        unselected: !internalValue && !internalIndeterminate,
        selected: internalValue || internalIndeterminate,
        disabled,
        error,
      }"
    >
      <checkbox-group class="checkbox-group" @change="onChange">
        <checkbox
          :disabled="disabled"
          class="checkbox"
          value="on"
          :checked="modelValue"
        />
      </checkbox-group>

      <div class="checkbox-outline" />
      <div class="bg-checkbox checkbox-transition" />
      <div class="icon checkbox-transition">
        <div class="material-icons">
          {{ !internalValue && internalIndeterminate ? 'remove' : 'check' }}
        </div>
      </div>
    </div>

    <div v-if="label && !labelOnStart" class="label-text">{{ label }}</div>
  </label>
</template>

<style scoped lang="postcss">
@reference '../assets/style/app.css';

:host {
  position: relative;
  display: inline-flex;
  vertical-align: top;
}

.mp-checkbox-label {
  .label-text {
    @apply text-sm;
  }
}

.mp-checkbox {
  position: relative;
  display: flex;
  margin: max(0px, (48px - 18px) / 2);
  width: 18px;
  height: 18px;
  place-items: center;
  place-content: center;

  .checkbox-group {
    position: absolute;
    height: 48px;
    margin: 0;
    opacity: 0;
    outline: none;
    width: 48px;
    z-index: 1;
    cursor: inherit;
    appearance: none;

    .checkbox {
      width: 100%;
      height: 100%;
    }
  }

  .checkbox-outline {
    position: absolute;
    border-radius: 2px;
    border-color: var(--md-color-on-surface-variant);
    border-style: solid;
    border-width: 2px;
    inset: 0;
  }

  .checkbox-transition {
    opacity: 0;
    transform: scale(.6);
    transition-property: transform, opacity;
    transition-timing-function: var(--ease-md-accelerate), linear;
    transition-duration: 150ms, 50ms;
  }

  .bg-checkbox {
    inset: 0;
    position: absolute;
    background-color: var(--md-color-primary);
  }

  .icon {
    inset: 0;
    position: absolute;

    .material-icons {
      --md-icons-opsz: 'opsz' 18;
      font-size: 18px;
      color: var(--md-color-on-primary);
    }
  }

  &.selected {
    .checkbox-outline {
      border-radius: 0;
      border-color: var(--md-color-primary);
    }

    .checkbox-transition {
      opacity: 1;
      transform: scale(1);
      transition: transform, opacity var(--ease-md-decelerate), linear 350ms, 50ms;
    }
  }

  &.error {
    .checkbox-outline {
      border-color: var(--md-color-error);
    }

    &.selected {
      .bg-checkbox {
        background-color: var(--md-color-error);
      }
    }
  }

  &.disabled {
    .checkbox-outline {
      border-color: var(--md-color-on-surface);
      opacity: .38;
    }

    &.selected {
      .checkbox-outline {
        border-width: 0;
      }

      .bg-checkbox {
        background-color: var(--md-color-on-surface);
        opacity: .38;
      }

      .icon .material-icons {
        color: var(--md-color-surface);
      }
    }
  }
}
</style>
