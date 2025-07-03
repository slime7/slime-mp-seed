<template>
  <page-meta>
    <navigation-bar
      title="加载"
    />
  </page-meta>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <mp-page
    title="加载"
  >
    <div class="mp-body flex flex-col flex-auto">
      <div class="flex flex-col gap-y-4 p-4">
        <div>
          <div class="text-base font-bold">
            加载
          </div>

          <div class="text-sm mt-2">
            default
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-4">
            <mat-loader />
            <mat-loader
              progress="65"
            />
          </div>

          <div class="text-sm mt-2">
            width
          </div>

          <div class="text-sm mt-2 flex flex-wrap gap-4">
            <mat-loader
              width="4"
            />
            <mat-loader
              width="8"
            />
            <mat-loader
              width="12"
            />
          </div>

          <div class="text-sm mt-2">
            color
          </div>

          <div class="text-sm mt-2 flex flex-wrap gap-4">
            <mat-loader
              color="#fe9a00"
            />
            <mat-loader
              color="#432dd7"
            />
            <mat-loader
              color="#00786f"
              progress="36"
            />
            <mat-loader
              color="#e7000b"
              :progress="75"
            />
          </div>
        </div>
      </div>
    </div>
  </mp-page>
</template>

<script setup>
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MatLoader from '@/components/MatLoader.vue';

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="postcss">
@reference '../../assets/style/app.css';
</style>
