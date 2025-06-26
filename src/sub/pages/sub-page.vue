<template>
  <mp-page
    title="sub-page"
  >
    <div class="mp-body flex flex-col">
      <div>分包页面</div>
    </div>
  </mp-page>
</template>

<script setup>
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="scss"></style>
