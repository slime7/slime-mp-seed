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

const onThemeChangeHandler = () => {
  uni.onThemeChange(({ theme }) => {
    uni.setNavigationBarColor({
      frontColor: theme === 'dark' ? '#ffffff' : '#000000',
      backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
    });
  });
};

onLaunch(() => {
  globalStore.initDeviceInfo();
  getToken();
  onThemeChangeHandler();
});
</script>

<style lang="css">
@import './assets/style/app.css';
@import './assets/style/font-material-symbol.css';
@import './assets/style/font-robot-mono.css';
</style>
