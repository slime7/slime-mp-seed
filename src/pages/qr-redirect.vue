<template>
  <mp-page
    hide-navigation
  >
    <div class="mp-body flex flex-col flex-auto">
      <div class="loader flex center flex-auto">
        <mat-loader v-if="!pageNotFound" />
        <div v-else>
          页面不存在
        </div>
      </div>
    </div>
  </mp-page>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MatLoader from '@/components/MatLoader.vue';
import { jump } from '@/utils';

const pageNotFound = ref(false);
const tabPages = [
  'index',
  'order',
  'goods',
  'profile',
];

const parseQuery = (s) => {
  const qs = s.split(',');
  const query = {};
  qs.forEach((item) => {
    const [key, value] = item.split(':');
    query[key] = value;
  });
  return query;
};
const goToPage = async (pageName, q) => {
  const jumpType = tabPages.includes(pageName) ? 'tab' : 'replace';
  switch (pageName) {
  case 'd':
  case 'detail':
    // 详情页简写
    await jump({
      page: 'goods-detail',
      params: { sid: q },
    }, 'replace');
    break;
  case 'goods':
  case 'goods-list':
    // 产品列表
    await jump({
      page: 'goods',
    }, 'tab');
    break;
  default:
    try {
      await jump(pageName, jumpType);
    } catch (err) {
      pageNotFound.value = true;
    }
    break;
  }
};

onLoad((query) => {
  if (query?.scene) {
    const q = parseQuery(decodeURIComponent(query.scene));
    const pageName = q.page || q.p;
    console.log('扫码进入页面，', q, `pageName:${pageName},q:${q.q}`);
    if (pageName) {
      goToPage(pageName, q.q);
    }
  } else {
    goToPage('index');
  }
});
</script>

<style scoped lang="scss">
.loader {
  padding: 160px 0;
  width: 100%;
}
</style>
