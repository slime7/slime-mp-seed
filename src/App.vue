<script setup>
import { watch } from 'vue';
import { onLaunch } from '@dcloudio/uni-app';
import useGlobalStore from '@/store/global';
import { storage } from '@/utils';

const globalStore = useGlobalStore();

watch(() => globalStore.deviceInfo.isDesktop, (isDesktop) => {
  if (isDesktop) {
    // jump('forbidden', 'replace');
  }
});

const getToken = async () => {
  const token = await storage.get('token');
  if (token) {
    globalStore.saveToken(token);
  }
};

onLaunch(() => {
  globalStore.initDeviceInfo();
  getToken();
});
</script>

<style src="./assets/style/tailwind.css" lang="css"></style>
<style lang="scss">
@import './assets/style/app';
@import './assets/style/font-material-symbol.css';
@import './assets/style/font-robot-mono.css';
</style>
