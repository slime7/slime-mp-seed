<template>
  <mp-page
    title="home"
  >
    <div class="mp-body flex flex-col flex-auto">
      <div class="p-4 flex flex-col gap-y-4">
        <div class="flex justify-center">
          <mat-button
            @click="jump('/pages/demo/index')"
          >
            使用示例
          </mat-button>
        </div>

        <div class="flex justify-center">
          <mat-button
            @click="jump('/pages/debug/index')"
          >
            debug 页面
          </mat-button>
        </div>

        <div class="flex justify-center">
          <mat-button
            @click="uni.navigateTo({ url: '/pages/test/index' })"
          >
            测试页面
          </mat-button>
        </div>

        <div class="flex justify-center">
          <mat-button
            @click="uni.navigateTo({ url: '/sub/pages/sub-page' })"
          >
            分包页面
          </mat-button>
        </div>
      </div>
    </div>
  </mp-page>
</template>

<script setup>
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MatButton from '@/components/MatButton.vue';
import { jump } from '../utils';

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="scss"></style>
