<template>
  <page-meta>
    <navigation-bar
      title="滚动区域"
    />
  </page-meta>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <mp-page
    title="滚动区域"
    :padding-gesture-bar="false"
  >
    <div class="mp-body flex flex-col flex-auto max-h-full">
      <div class="header h-12 shrink-0 area-bg">
        header
      </div>

      <div class="flex-auto min-h-0">
        <mp-scroll-refresher
          :disabled-pull-down-refresh="listPullDownStatus"
          @pull-down="onPullDown"
        >
          <div class="p-4 flex-auto">
            <div>
              <mp-checkbox
                v-model="fillContent"
                label="填充内容"
              />
            </div>
            <div>下拉刷新，h5 疑似有bug</div>
            <div v-if="fillContent" class="mt-2 flex flex-col gap-y-2">
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
              <div>滚动内容</div>
            </div>
          </div>
        </mp-scroll-refresher>
      </div>
    </div>
  </mp-page>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MpScrollRefresher from '@/components/MpScrollRefresher.vue';
import MpCheckbox from '@/components/MpCheckbox.vue';

const fillContent = ref(false);

const listPullDownStatus = ref(false);
const onPullDown = () => {
  setTimeout(async () => {
    listPullDownStatus.value = true;
    await nextTick();
    listPullDownStatus.value = false;
  }, 1200);
};

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="postcss">
@reference '../../assets/style/app.css';

.mp-body {
  .header {
    --test-area-bg-color: var(--md-color-tertiary-container);
  }
}
</style>
