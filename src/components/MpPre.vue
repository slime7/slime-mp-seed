<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: [String, Object, Array],
    default: '',
  },
  json: {
    type: Boolean,
    default: false,
  },
});

const nodes = computed(() => {
  const content = typeof props.text !== 'string' && props.json ? JSON.stringify(props.text, null, 2) : props.text;
  return [
    {
      name: 'pre',
      attrs: {
        style: 'max-height: 480px; font-family: "Roboto Mono", monospace;',
      },
      children: [
        {
          type: 'text',
          text: content,
        },
      ],
    },
  ];
});
</script>

<template>
  <rich-text :nodes="nodes" />
</template>
