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

          <div class="text-sm mt-2 flex flex-wrap gap-2">
            <mat-button
              variant="outlined"
              size="xs"
              togglable
              :toggled="btnState.rounded"
              @click="btnState.rounded = !btnState.rounded"
            >
              圆形
            </mat-button>
            <mat-button
              variant="outlined"
              size="xs"
              togglable
              :toggled="btnState.togglable"
              @click="btnState.togglable = !btnState.togglable"
            >
              可开关
            </mat-button>
            <mat-button
              variant="outlined"
              size="xs"
              togglable
              :toggled="btnState.toggled"
              @click="btnState.toggled = !btnState.toggled"
            >
              开关状态
            </mat-button>
            <mat-button
              variant="outlined"
              size="xs"
              togglable
              :toggled="btnState.disabled"
              @click="btnState.disabled = !btnState.disabled"
            >
              禁用
            </mat-button>
          </div>

          <div class="mt-2 flex flex-wrap gap-2">
            <mat-button
              variant="filled"
              :rounded="btnState.rounded"
              :togglable="btnState.togglable"
              :toggled="btnState.toggled"
              :disabled="btnState.disabled"
            >
              filled
            </mat-button>
            <mat-button
              variant="tonal"
              :rounded="btnState.rounded"
              :togglable="btnState.togglable"
              :toggled="btnState.toggled"
              :disabled="btnState.disabled"
            >
              tonal
            </mat-button>
            <mat-button
              variant="elevated"
              :rounded="btnState.rounded"
              :togglable="btnState.togglable"
              :toggled="btnState.toggled"
              :disabled="btnState.disabled"
            >
              elevated
            </mat-button>
            <mat-button
              variant="outlined"
              :rounded="btnState.rounded"
              :togglable="btnState.togglable"
              :toggled="btnState.toggled"
              :disabled="btnState.disabled"
            >
              outlined
            </mat-button>
            <mat-button
              variant="text"
              :rounded="btnState.rounded"
              :togglable="btnState.togglable"
              :toggled="btnState.toggled"
              :disabled="btnState.disabled"
            >
              text
            </mat-button>
          </div>

          <div class="text-sm mt-2">
            size
          </div>

          <div class="mt-2 flex flex-col items-start gap-2">
            <mat-button
              size="xs"
              variant="outlined"
            >
              Xsmall 超小号
            </mat-button>
            <mat-button
              size="sm"
              variant="outlined"
            >
              Small 小号
            </mat-button>
            <mat-button
              size="md"
              variant="outlined"
            >
              Medium 中号
            </mat-button>
            <mat-button
              size="lg"
              variant="outlined"
            >
              Large 大号
            </mat-button>
            <mat-button
              size="xl"
              variant="outlined"
            >
              Xlarge 超大号
            </mat-button>
          </div>

          <div class="text-sm mt-2">
            icon
          </div>

          <div class="mt-2 flex flex-wrap gap-2">
            <mat-button
              prepend-icon="home"
            >
              home
            </mat-button>
            <mat-button
              size="lg"
              append-icon="close"
            >
              close
            </mat-button>
          </div>
        </div>
      </div>
    </div>
  </mp-page>
</template>

<script setup>
import { reactive } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MatButton from '@/components/MatButton.vue';

const btnState = reactive({
  rounded: true,
  togglable: false,
  toggled: false,
  disabled: false,
});

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="postcss">
@reference '../assets/style/app.css';
</style>
