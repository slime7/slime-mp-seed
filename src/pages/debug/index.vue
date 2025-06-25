<template>
  <mp-page
    title="debug"
  >
    <div class="mp-body flex flex-col">
      <div>
        <div class="mt-4">
          设置
        </div>

        <button class="mt-2" @click="toggleApiEnv">
          切换环境(当前{{ apiEnv }})
        </button>

        <div class="mt-2">
          <input
            :value="apiBranch"
            class="api-branch-input flex-grow"
            placeholder="填写分支名"
            @input="setApiBranch"
          >
        </div>

        <div class="mt-2">
          <text>当前接口url: {{ apiUrl }}</text>
        </div>

        <div class="mt-2">
          <text>当前oss url: {{ ossUrl }}</text>
        </div>

        <div class="mt-2">
          <text>小程序版本号: {{ pkgConfig.version }}</text>
        </div>
      </div>

      <div class="mt-4">
        <button @click="restartApp">
          重启小程序生效
        </button>
      </div>

      <div class="mt-4">
        用户信息
      </div>

      <div class="mt-2">
        <rich-text :nodes="`<pre>${JSON.stringify(userInfo, null, 2)}</pre>`" />
      </div>

      <div class="mt-2">
        <button @click="removeToken">
          删除 token（可能引起接口异常）
        </button>
      </div>
    </div>
  </mp-page>
</template>

<script setup>
import { computed, ref } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import {
  debounce,
  storage,
  toast,
} from '@/utils';
import { apiUrl, ossUrl } from '@/utils/apiEnvConstance';
import useGlobalStore from '@/store/global';
import pkgConfig from '@/../package.json';

const store = useGlobalStore();
const userInfo = computed(() => store.userInfo);

// 切换接口环境
const apiEnvKey = 'api-env';
const apiEnv = ref('com');
const apiBranchKey = 'api-branch';
const apiBranch = ref('');
const toggleApiEnv = async () => {
  if (apiEnv.value === 'com') {
    apiEnv.value = 'work';
  } else {
    apiEnv.value = 'com';
  }
  await storage.set(apiEnvKey, apiEnv.value);
};
const setApiBranch = debounce((ev) => {
  apiBranch.value = ev.detail.value;
  storage.set(apiBranchKey, apiBranch.value);
}, 1200);

const restartApp = () => {
  try {
    uni.restartMiniProgram({
      path: '/pages/index',
    });
  } catch (err) {
    toast('请打开右上角菜单手动重启小程序');
  }
};

const removeToken = () => {
  store.saveToken(null);
};

const init = async () => {
  apiEnv.value = await storage.get(apiEnvKey, 'com');
  apiBranch.value = await storage.get(apiBranchKey, '');
};
onReady(() => {
  init();
});
</script>

<style scoped lang="scss">
.api-branch-input {
  display: block;
  padding: 4px;
  border: 1px solid #ccc;
  box-sizing: content-box;
}
</style>
