import { defineStore } from 'pinia';
import { apiError, storage } from '@/utils';
import weappJwtDecode from '@/utils/weapp-jwt';
import { apiUrl } from '@/utils/api-env-constance';
import useHttp from '@/hooks/useHttp';

const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    buildType: 'dev', // dev: 开发环境，读取 work 接口， prod: 正式环境，读取 com 接口
    token: null,
    userInfo: null,
    isRefreshingToken: false,
    deviceInfo: {
      systemInfo: null,
      screenHeight: 0,
      statusBarHeight: 20,
      titleBarHeight: 40,
      gestureBarHeight: 0,
      isDesktop: false,
      isIos: false,
      isH5: false,
      isAndroid: false,
      masterMode: false,
      theme: 'light',
      windowWidth: 375,
      deviceId: '',
      pixelRatio: 1,
    },
    preventNativeBack: false,
    pageShareData: {
      order: {
        refreshList: false,
      },
    },
  }),

  actions: {
    setToken(token) {
      this.token = token;
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    setDeviceInfo(payload) {
      this.deviceInfo = {
        ...this.deviceInfo,
        ...payload,
      };
    },
    setDarkMode(theme) {
      this.deviceInfo.theme = theme;
    },
    setPreventNativeBack(isPrevent) {
      this.preventNativeBack = isPrevent;
    },
    async initDeviceInfo() {
      let isH5 = false;
      const deviceInfo = uni.getDeviceInfo();
      const windowInfo = uni.getWindowInfo();
      const appBaseInfo = uni.getAppBaseInfo();
      let systemSetting;
      try {
        systemSetting = uni.getSystemSetting();
      } catch (err) {
        isH5 = true;
        console.log('h5 端似乎沒有 getSystemSetting');
      }
      console.log('deviceInfo', deviceInfo);
      console.log('windowInfo', windowInfo);
      console.log('systemSetting', systemSetting);
      console.log('appBaseInfo', appBaseInfo);

      const system = deviceInfo.system.toLowerCase();
      const isDesktop = system.indexOf('window') + system.indexOf('macos') > -2;
      const isIos = system.indexOf('ios') > -1;
      const isAndroid = system.indexOf('android') > -1;
      const statusBarHeight = isDesktop ? 20 : windowInfo.statusBarHeight;
      let titleBarHeight = (!isDesktop ? windowInfo.screenTop : 48) - statusBarHeight;
      if (!isIos) {
        titleBarHeight = 48;
      }
      if (isIos) {
        titleBarHeight = windowInfo.screenHeight < 400 && (systemSetting && systemSetting.deviceOrientation === 'landscape') ? 32 : 40;
      }
      const gestureBarHeight = windowInfo.safeAreaInsets.bottom;

      this.setDeviceInfo({
        statusBarHeight,
        titleBarHeight,
        gestureBarHeight,
        isDesktop,
        isAndroid,
        isIos,
        isH5,
        theme: appBaseInfo.theme || 'light',
        windowWidth: windowInfo.windowWidth,
        screenHeight: windowInfo.screenHeight,
        deviceId: deviceInfo.deviceId,
        pixelRatio: windowInfo.pixelRatio,
      });
    },
    saveToken(token) {
      if (!token) {
        this.setToken(null);
        storage.remove('token');
        this.setUserInfo(null);
        return;
      }
      try {
        // const userInfo = weappJwtDecode(token);
        this.setToken(token);
        storage.set('token', token);
        // this.setUserInfo(userInfo);
        // console.log('userInfo', userInfo);
      } catch (err) {
        console.log(err);
      }
    },
    getToken() {
      if (this.isRefreshingToken) {
        return Promise.resolve();
      }
      const { saveToken } = this;
      this.isRefreshingToken = true;
      const self = this;
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const code = 'wechat-login-code-mock';
        try {
          const { data, statusCode, response } = await useHttp(`${apiUrl}/anything`).post({
            code,
            token: 'token', // mock
          });
          console.log('response', data.value);
          if (+statusCode.value !== 200) {
            self.isRefreshingToken = false;
            reject(apiError('服务器出错了', response.value));
            return;
          }
          console.log('getTokenResult', data.value.data);
          const mockData = JSON.parse(data.value.data);
          saveToken(mockData.token);
          self.isRefreshingToken = false;
          resolve(mockData.token);
        } catch (err) {
          self.isRefreshingToken = false;
          reject(apiError(err.errMsg, err));
        }
      });
    },
  },
});

export default useGlobalStore;
