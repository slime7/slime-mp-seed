<script setup>
import {
  computed,
  inject,
  ref,
  watch,
} from 'vue';
import useGlobalStore from '@/store/global';
import useThemeColor from '@/hooks/useThemeColor';

const props = defineProps({
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
  value: {
    type: String,
    default: 'on',
  },
  /** 主题色 */
  color: {
    type: String,
    default: '',
  },
});

const store = useGlobalStore();
const { model: groupModel = () => '', updateModel } = inject('radio-group-value', {
  mode: ref(''),
  updateModel: () => {},
});
const internalValue = ref(false);
const radioReset = ref(false);
watch(internalValue, (v) => {
  if (!v) {
    radioReset.value = true;
    setTimeout(() => {
      radioReset.value = false;
    }, 0);
  }
});
watch(groupModel, (v) => {
  internalValue.value = v === props.value;
}, { immediate: true });

const themeStyles = computed(() => {
  const isDark = store.deviceInfo.theme === 'dark';
  return useThemeColor(props.color, isDark);
});

const onChange = () => {
  internalValue.value = true;
  updateModel(props.value);
};
</script>

<template>
  <label
    class="mp-radio-label flex items-center"
    :style="{
      ...themeStyles,
    }"
  >
    <div
      class="mp-radio"
      :class="{
        checked: internalValue,
        disabled,
        error,
      }"
    >
      <radio-group class="radio-group" @change="onChange">
        <radio
          class="radio"
          v-if="!radioReset"
          :disabled="disabled"
          :value="value"
          :checked="internalValue"
        />
      </radio-group>

      <div class="icon">
        <div class="material-icons">
          {{ internalValue ? 'radio_button_checked' : 'radio_button_unchecked' }}
        </div>
      </div>
    </div>

    <div v-if="label" class="label-text -m-2">{{ label }}</div>
  </label>
</template>

<style scoped lang="postcss">
@reference 'tailwindcss';
@reference '../assets/style/app.css';

:host {
  position: relative;
  display: flex;
  vertical-align: top;
}

.mp-radio-label {
  .label-text {
    @apply text-sm;
  }
}

.mp-radio {
  position: relative;
  display: flex;
  margin: max(0px, (48px - 20px) / 2);
  width: 20px;
  height: 20px;
  place-items: center;
  place-content: center;

  .radio-group {
    position: absolute;
    height: 48px;
    margin: 0;
    opacity: 0;
    outline: none;
    width: 48px;
    z-index: 1;
    cursor: inherit;
    appearance: none;

    .radio {
      width: 100%;
      height: 100%;
    }
  }

  .icon {
    inset: 0;
    position: absolute;

    .material-icons {
      --md-icons-opsz: 'opsz' 20;
      font-size: 20px;
      color: var(--md-color-on-surface-variant);
      transition: color var(--ease-md-standard) .15s;
    }
  }

  &.checked {
    .material-icons {
      color: var(--md-color-primary);
    }
  }

  &.error {
    .material-icons {
      color: var(--md-color-error);
    }
  }

  &.disabled {
    .material-icons {
      color: var(--md-color-on-surface);
      opacity: .38;
    }
  }
}
</style>
