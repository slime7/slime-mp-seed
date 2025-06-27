<template>
  <mp-page
    title="组件"
  >
    <div class="mp-body flex flex-col flex-auto">
      <div class="flex flex-col gap-y-4 p-4">
        <div>
          <div class="text-base font-bold">
            按钮
          </div>

          <div class="text-sm mt-2">
            normal
          </div>

          <div class="mt-2 flex flex-wrap gap-2">
            <mat-button
              variant="filled"
            >
              filled
            </mat-button>
            <mat-button
              variant="tonal"
            >
              tonal
            </mat-button>
            <mat-button
              variant="elevated"
            >
              elevated
            </mat-button>
            <mat-button
              variant="outlined"
            >
              outlined
            </mat-button>
            <mat-button
              variant="text"
            >
              text
            </mat-button>
          </div>

          <div class="text-sm mt-2">
            toggled
          </div>

          <div class="mt-2 flex flex-wrap gap-2">
            <mat-button
              variant="filled"
              toggled
            >
              filled
            </mat-button>
            <mat-button
              variant="tonal"
              toggled
            >
              tonal
            </mat-button>
            <mat-button
              variant="elevated"
              toggled
            >
              elevated
            </mat-button>
            <mat-button
              variant="outlined"
              toggled
            >
              outlined
            </mat-button>
          </div>
        </div>
      </div>
    </div>
  </mp-page>
</template>

<script setup>
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MatButton from '@/components/MatButton.vue';

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="css"></style>
