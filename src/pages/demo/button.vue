<template>
  <page-meta>
    <navigation-bar
      title="按钮"
    />
  </page-meta>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <mp-page
    title="按钮"
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
              :toggled="btnState.sharpe === 'rounded'"
              @click="btnState.sharpe = btnState.sharpe === 'rounded' ? 'square' : 'rounded'"
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
              :sharpe="btnState.sharpe"
              :togglable="btnState.togglable"
              :toggled="btnState.toggled"
              :disabled="btnState.disabled"
            >
              filled
            </mat-button>
            <mat-button
              variant="tonal"
              :sharpe="btnState.sharpe"
              :togglable="btnState.togglable"
              :toggled="btnState.toggled"
              :disabled="btnState.disabled"
            >
              tonal
            </mat-button>
            <mat-button
              variant="elevated"
              :sharpe="btnState.sharpe"
              :togglable="btnState.togglable"
              :toggled="btnState.toggled"
              :disabled="btnState.disabled"
            >
              elevated
            </mat-button>
            <mat-button
              variant="outlined"
              :sharpe="btnState.sharpe"
              :togglable="btnState.togglable"
              :toggled="btnState.toggled"
              :disabled="btnState.disabled"
            >
              outlined
            </mat-button>
            <mat-button
              variant="text"
              :sharpe="btnState.sharpe"
              :togglable="btnState.togglable"
              :toggled="btnState.toggled"
              :disabled="btnState.disabled"
            >
              text
            </mat-button>
          </div>

          <div class="mt-2">
            <mat-button
              :variant="currentBtn[0]"
              :color="currentBtn[1]"
              :sharpe="currentBtn[2]"
              size="md"
            >
              按钮
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
              variant="tonal"
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
import {
  reactive,
  ref,
} from 'vue';
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MatButton from '@/components/MatButton.vue';

const btnState = reactive({
  sharpe: 'rounded',
  togglable: false,
  toggled: false,
  disabled: false,
});

const currentBtn = ref(['filled', '', 'rounded']);

const init = () => {
  setInterval(() => {
    const variantMap = [
      'filled',
      'tonal',
      'elevated',
      'outlined',
      'text',
    ];
    const colorMap = [
      '',
      '#fe9a00',
      '#432dd7',
      '#00786f',
      '#e7000b',
    ];
    const sharpeMap = [
      'rounded',
      'square',
    ];
    currentBtn.value = [
      variantMap[Math.round(Math.random() * variantMap.length)],
      colorMap[Math.round(Math.random() * colorMap.length)],
      sharpeMap[Math.round(Math.random() * sharpeMap.length)],
    ];
  }, 1200);
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="postcss">
@reference '../../assets/style/app.css';
</style>
