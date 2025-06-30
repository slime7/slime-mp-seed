<template>
  <mp-page
    title="示例"
  >
    <div class="mp-body flex flex-col flex-auto">
      <div class="flex flex-col gap-y-4 p-4">
        <div>
          <mat-button
            variant="tonal"
            size="lg"
            block
            @click="jump('pages/demo/button')"
          >
            按钮(button)
          </mat-button>
        </div>

        <div>
          <mat-button
            variant="tonal"
            size="lg"
            block
            @click="jump('pages/demo/dialog')"
          >
            对话框(dialog)
          </mat-button>
        </div>

        <div>
          <mat-button
            variant="tonal"
            size="lg"
            block
            @click="jump('pages/demo/form')"
          >
            表单组件
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
import { jump } from '@/utils';

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="postcss"></style>
