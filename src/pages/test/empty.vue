<template>
  <page-meta>
    <navigation-bar
      title=""
    />
  </page-meta>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <mp-page
    title=""
  >
    <div class="mp-body flex flex-col flex-auto">
      <!-- content -->
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

<style scoped lang="postcss"></style>
