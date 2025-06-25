<script setup>
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

const html = `<pre style="max-height: 480px; font-family: 'Roboto Mono', monospace; overflow: auto;">${props.json ? JSON.stringify(props.text, null, 2) : props.text}</pre>`;
</script>

<template>
  <rich-text :nodes="html" />
</template>
