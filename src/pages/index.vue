<template>
  <mp-page
    title="home"
  >
    <div class="mp-body flex flex-col">
      <!-- content -->
    </div>
  </mp-page>
</template>

<script setup>
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import { globalShareMenu } from '@/utils';

const init = () => {
  globalShareMenu();
};
onReady(() => {
  init();
});
</script>

<style scoped lang="scss"></style>
