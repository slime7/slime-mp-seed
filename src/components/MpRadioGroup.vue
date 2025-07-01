<script setup>
import {
  provide,
  readonly,
  ref,
  toRefs,
  watch,
  watchEffect,
} from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);
const { modelValue } = toRefs(props);

const internalValue = ref('');
provide('radio-group-value', {
  model: readonly(internalValue),
  updateModel: (value) => {
    internalValue.value = value;
  },
});
watchEffect(() => {
  internalValue.value = modelValue.value ?? '';
});
watch(internalValue, (v) => {
  emit('update:modelValue', v);
});
</script>

<template>
  <div class="mp-radio-group">
    <div v-if="label" class="radio-group-label ml-4 py-2 text-sm">
      {{ label }}
    </div>
    <slot />
  </div>
</template>

<style scoped lang="postcss">
@reference '../assets/style/app.css';

.mp-radio-group {
  .radio-group-label {
    color: var(--md-color-on-surface);
  }
}
</style>
