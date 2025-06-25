import useToastStore from '@/store/toastStore';
import { ossUrl, uploadedUrl } from './api-env-constance';

/**
 * @description 模块内全局变量
 * @property {NodeJS.Timeout|null} countdownTimer - 倒计时计时器
 * @property {UniApp.GetSettingSuccessResult['authSetting']|undefined} authSetting - 微信小程序授权设置
 * @property {boolean} loadingDownloadFile - 是否正在下载文件
 */
const g = {
  authSetting: undefined,
  loadingDownloadFile: false,
};

let toastStore = null;
/**
 * 显示一个 Toast 提示
 * @param {string} msg - 要显示的提示信息
 */
export const toast = (msg) => {
  if (!toastStore) {
    toastStore = useToastStore();
  }
  toastStore.show({ msg });
};

/**
 * @description 封装 uni-app 的本地存储 API
 */
export const storage = {
  /**
   * 异步获取本地缓存中指定 key 的内容
   * @param {string} key - 本地缓存中的指定的 key
   * @param {any} [defaultValue=null] - 获取失败时的默认返回值
   * @returns {Promise<any>} Promise 对象，成功时返回获取到的值，失败时返回默认值
   */
  get: (key, defaultValue = null) =>
    // eslint-disable-next-line no-async-promise-executor, implicit-arrow-linebreak
    new Promise(async (resolve, reject) => {
      try {
        const { data: localValue } = await uni.getStorage({
          key,
        });
        if (!localValue) {
          resolve(defaultValue);
        }
        if (!Number.isNaN(+localValue)) {
          resolve(+localValue);
        }
        if (/^"\*"$/.test(localValue)) {
          resolve(localValue.substr(1, localValue.length - 2));
        }
        try {
          resolve(JSON.parse(localValue));
        } catch (err) {
          resolve(defaultValue);
        }
      } catch (err) {
        if (err.errMsg) {
          resolve(defaultValue);
        } else {
          reject(err);
        }
      }
    }),
  /**
   * 将数据异步存储在本地缓存中指定的 key 中
   * @param {string} key - 本地缓存中的指定的 key
   * @param {any} value - 需要存储的内容
   * @returns {Promise<boolean>} Promise 对象，成功时返回 true，失败时返回 false 或被 reject
   */
  set: (key, value) => {
    let storageValue;
    if (typeof value === 'string') {
      storageValue = `"${value}"`;
    } else if (typeof value === 'object') {
      storageValue = JSON.stringify(value);
    } else if (typeof value === 'number') {
      storageValue = value.toString();
    }
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        if (storageValue) {
          await uni.setStorage({
            key,
            data: storageValue,
          });
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        reject(err);
      }
    });
  },
  /**
   * 从本地缓存中异步移除指定 key
   * @param {string} key - 本地缓存中的指定的 key
   * @returns {Promise<UniApp.GeneralCallbackResult>}
   */
  remove: (key) => uni.removeStorage({ key }),
  /**
   * 异步清理本地数据缓存
   * @returns {void}
   */
  clear: () => uni.clearStorage(),
  /**
   * 异步获取当前 storage 的相关信息
   * @returns {Promise<UniApp.GetStorageSuccess>}
   */
  info: () => uni.getStorageInfo(),
};

/**
 * 合并 class 名称，类似于 classnames 库
 * @param {...(string|Object|Array<string>)} classes - 要合并的 class
 * @returns {string} 合并后的 class 字符串
 */
export const classMerge = (...classes) => {
  const resultClass = [];
  classes.forEach((inputClasses = '') => {
    const classNameType = typeof inputClasses;
    if (classNameType === 'string') {
      resultClass.push(inputClasses.trim().split(' '));
    } else if (classNameType === 'number') {
      resultClass.push(classNameType.toString());
    } else if (Array.isArray(inputClasses)) {
      if (inputClasses.length) {
        const innerResult = classMerge(...inputClasses);
        if (innerResult.length) {
          resultClass.push(innerResult);
        }
      }
    } else if (classNameType === 'object') {
      Object.keys(inputClasses).forEach((key) => {
        if (inputClasses[key]) {
          resultClass.push(key);
        }
      });
    }
  });
  return Array.from(new Set(resultClass)).join(' ');
};

/**
 * 页面跳转
 * @param {string|{page: string, params: Object}} route - 路由信息。可以是页面名称字符串，或包含 page 和 params 的对象
 * @param {'navigate'|'redirect'|'replace'|'reload'|'tab'} [type='navigate'] - 跳转类型
 * @returns {Promise<void>}
 */
export const jump = async (route, type) => {
  const page = typeof route === 'string' ? route : route.page;
  const params = typeof route === 'string' ? null : route.params;
  let url = `/pages/${page}`;
  if (params) {
    url += `?${Object.keys(params).map((paramName) => `${paramName}=${params[paramName]}`).join('&')}`;
  }
  switch (type) {
  case 'redirect':
  case 'replace':
    await uni.redirectTo({ url });
    break;
  case 'reload':
    await uni.reLaunch({ url });
    break;
  case 'tab':
    await uni.switchTab({ url });
    break;
  case 'navigate':
  default:
    await uni.navigateTo({ url });
    break;
  }
};

/**
 * 返回上一页
 * @param {number} [delta=1] - 返回的页面数
 * @returns {Promise<void>}
 */
export const pageBack = async (delta = 1) => {
  await uni.navigateBack({ delta });
};

/**
 * 节流函数
 * @param {Function} fn - 需要节流的函数
 * @param {number} wait - 延迟时间 (毫秒)
 * @returns {Function} 节流后的函数
 */
export function throttle(fn, wait) {
  let t;
  let l = +new Date();
  // eslint-disable-next-line func-names
  return function (...args) {
    const c = +new Date();
    clearTimeout(t);

    if (c - l >= wait) {
      fn.apply(this, args);
      l = c;
    } else {
      t = setTimeout(() => fn.apply(this, args), wait);
    }
  };
}

/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {number} wait - 延迟时间 (毫秒)
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, wait) {
  let t;
  // eslint-disable-next-line func-names
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * 解析接口返回的图片 URL，拼接成可访问的完整地址
 * @param {string} url - 图片相对路径或完整路径
 * @returns {string} 完整的图片 URL
 */
export const parseImageUrl = (url) => {
  if (/^(https?|wxfile):\/\//i.test(url)) {
    return url;
  }
  return `${uploadedUrl}/${url}`;
};

/**
 * 获取手动上传到 OSS 的静态图片 URL
 * @param {string} img - 图片文件名
 * @returns {string} 完整的图片 URL
 */
export const ossImage = (img) => `${ossUrl}/static/trade-hub-mp/${img}`;

/**
 * 显示授权确认弹窗
 * @param {string} desc - 权限描述
 * @returns {Promise<boolean>} 用户是否点击了确认
 */
export const showAuthConfirm = async (desc) => {
  const { confirm } = await uni.showModal({
    title: '授权提示',
    content: `${desc} 权限之前被您拒绝了，要打开设置重新授权吗？`,
  });
  if (confirm) {
    await uni.openSetting();
    g.authSetting = null;
  }
  return Promise.resolve(confirm);
};

/**
 * 调用需要授权的 API，如果未授权则引导用户授权
 * @param {string} apiName - uni-app 的 API 名称，如 'chooseLocation'
 * @param {Object} [options] - API 的参数
 * @returns {Promise<any>} API 的调用结果
 */
export const callOrAuth = async (apiName, options) => {
  const getSetting = async () => {
    const { authSetting } = await uni.getSetting();
    console.log('调用了 getSetting()，结果是', authSetting);
    g.authSetting = authSetting;
  };
  const scopes = {
    chooseLocation: {
      name: 'userLocation',
      desc: '位置信息',
    },
    getLocation: {
      name: 'userLocation',
      desc: '位置信息',
    },
    chooseAddress: {
      name: 'address',
      desc: '收货地址',
    },
    chooseImage: {
      name: 'album',
      desc: '读取相册',
    },
  };
  const scope = scopes[apiName];
  const scopeName = `scope.${scope.name}`;
  if (!g.authSetting) {
    await getSetting();
  }
  console.log(scopeName, g.authSetting);
  if (
    typeof g.authSetting[scopeName] !== 'undefined'
    && !g.authSetting[scopeName]
  ) {
    // 之前未给权限
    await showAuthConfirm(scope.desc);
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const result = await uni[apiName](options);
      resolve(result);
    } catch (err) {
      if (/auth deny$/.test(err.errMsg)) {
        // toast('没有授权无法使用此功能');
      }
      reject(err);
    } finally {
      if (g.authSetting && typeof g.authSetting[scopeName] === 'undefined') {
        // g.authSetting[scopeName] = false;
        await getSetting();
      }
    }
  });
};

/**
 * API 错误处理辅助函数，为 Error 对象附加额外信息
 * @param {string|Error} error - 错误信息或 Error 对象
 * @param {Object} [appendData={}] - 需要附加到 Error 对象上的数据
 * @returns {Error} 附加了数据的 Error 对象
 */
export const apiError = (error, appendData = {}) => {
  /* eslint-disable no-param-reassign */
  if (typeof error === 'string') {
    error = new Error(error);
  }
  Object.keys(appendData).forEach((dataKey) => {
    error[dataKey] = appendData[dataKey];
  });
  /* eslint-enable no-param-reassign */
  return error;
};

/**
 * 网络请求失败的统一处理函数，会弹出 Toast 提示
 * @param {Error|null} [err=null] - 错误对象，通常是 useHttp 返回的 error
 */
export const netFail = (err = null) => {
  if (err && err.response) {
    const { response } = err;
    const { data } = response;
    if (data && data.msg) {
      if (data.msg === '校验失败') {
        const msg = Object.keys(data.data).map((key) => data.data[key]).join('\n');
        toast(msg);
      } else {
        toast(data.msg);
      }
    } else if (data.message) {
      toast(data.message);
    } else {
      toast('服务器错误');
    }
  } else if (err && !err.response && err.message) {
    if (/request:fail abort/.test(err.message)) {
      return;
    }
    if (err.message !== 'Network Error') {
      toast(err.message);
    } else {
      toast('无法连接网络');
    }
  } else {
    toast('无法连接网络');
  }
};

/**
 * 长按时震动并显示 Toast
 * @param {string} text - 要在 Toast 中显示的文本
 */
export const longPressDetail = (text) => {
  if (!text) {
    return;
  }
  uni.vibrateShort({
    type: 'medium',
  });
  toast(text);
};

/**
 * 异步等待指定时间
 * @param {number} ms - 等待的毫秒数
 * @returns {Promise<void>}
 */
export const wait = async (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

export const getUuiD = (randomLength = 5) => Number(Math.random().toString()
  .substring(2, 2 + randomLength) + +Date.now()).toString(36);

/**
 * 根据十六进制颜色值计算出对比度较高的文本颜色（黑色或白色）
 * @param {string} hexColor - 十六进制颜色字符串，如 '#RRGGBB'
 * @returns {'black'|'white'} 返回 'black' 或 'white'
 */
export const getContrastYIQ = (hexColor) => {
  const colorR = parseInt(hexColor.replace('#', '').substring(0, 2), 16);
  const colorG = parseInt(hexColor.replace('#', '').substring(2, 4), 16);
  const colorB = parseInt(hexColor.replace('#', '').substring(4, 6), 16);
  const yiq = (colorR * 299 + colorG * 587 + colorB * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
};

export const globalShareMenu = () => {
  uni.showShareMenu({
    menus: ['shareAppMessage'],
  });
};

/**
 * 表单数据校验
 * @param {Object} formData - 要校验的表单数据
 * @param {Object<string, Array<(value: any) => boolean|string>>} rule - 校验规则。键为表单字段名，值为一个函数数组，每个函数返回 true 或错误信息字符串
 * @param {boolean} [stringMsg=true] - 是否将错误信息合并为单个字符串数组
 * @returns {Array<string>|Array<{name: string, msg: string}>} 错误信息数组
 */
export const formDataValid = (formData, rule, stringMsg = true) => {
  /**
   * rule: { formName: [ function (v) { return !!v || 'error' } ] }
   */
  const formErrorMessages = [];
  Object.keys(rule).forEach((formKey) => {
    let formValue = formData[formKey];
    if (formKey.indexOf('.') > -1) {
      const splitKey = formKey.split('.');
      let tmpVal = formData;
      splitKey.forEach((key) => {
        if (typeof tmpVal !== 'undefined') {
          tmpVal = tmpVal[key];
        } else {
          tmpVal = undefined;
        }
      });
      formValue = tmpVal;
    }
    if (rule[formKey].length) {
      rule[formKey].forEach((ruleFn) => {
        const result = ruleFn(formValue);
        if (typeof result === 'string') {
          formErrorMessages.push(stringMsg ? result : { name: formKey, msg: result });
        }
      });
    }
  });

  return formErrorMessages;
};

/**
 * 生成 ECharts 图表的基础配置项
 * @param {{x: Array<string|number>, y: Array<Array<string|number>>, name: Array<string>}} chartData - 图表数据
 * @returns {Object} ECharts 的 option 配置对象
 */
export const chartBaseOption = (chartData) => ({
  grid: {
    top: '5%',
    left: '3%',
    bottom: 0,
    right: '5%',
    containLabel: true,
  },
  tooltip: {
    show: true,
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: chartData.x,
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#f2f2f2'],
        width: 1,
        type: 'solid',
      },
    },
    axisLine: {
      onZero: true,
    },
    axisLabel: {
      showMinLabel: true,
      alignMinLabel: 'left',
      showMaxLabel: true,
      alignMaxLabel: 'right',
      rotate: 0,
    },
    axisTick: {
      show: false,
      interval: 'auto',
      inside: false,
      length: 5,
      lineStyle: {
        color: '#333',
        width: 1,
      },
    },
  },
  yAxis: {
    type: 'value',
    min(value) {
      return value.min * 0.95;
    },
    max(value) {
      return value.max * 1.05;
    },
    scale: true,
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#f2f2f2'],
        width: 1,
        type: 'solid',
      },
    },
    axisLabel: {
      formatter(value) {
        return Math.round(value);
      },
    },
  },
  series: [
    {
      name: chartData?.name?.[0] || '',
      data: chartData.y[0],
      type: 'line',
      smooth: 0.8,
      showSymbol: false,
      symbolSize: 14,
      itemStyle: {
        normal: {
          color: '#ff4429',
          lineStyle: {
            width: '2',
            color: '#ff4429',
          },
        },
      },
      areaStyle: {
        color: '#e60012',
        opacity: '0.12',
      },
    },
  ],
});

/**
 * 下载并打开文件
 * @param {string} uri - 文件的相对路径
 * @param {string} [filename=''] - 文件名，如果为空则从 uri 中提取
 * @returns {Promise<void>}
 */
export const saveFile = async (uri, filename = '') => {
  if (g.loadingDownloadFile) {
    toast('有文件正在下载');
    return;
  }

  g.loadingDownloadFile = true;
  let filenameFinal = filename;
  if (!filename) {
    filenameFinal = uri.split('/').at(-1);
  }
  const affix = filenameFinal.split('.').at(-1);
  if (!['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'png', 'jpg', 'bmp', 'jpeg'].includes(affix)) {
    uni.showModal({
      content: '该文件无法预览',
      confirmColor: '#1f73f6',
      showCancel: false,
    });
    g.loadingDownloadFile = false;
    return;
  }
  uni.downloadFile({
    url: `${uploadedUrl}/${uri}`,
    success(result) {
      g.loadingDownloadFile = false;
      const file = result.filePath || result.tempFilePath;
      wx.openDocument({
        filePath: file,
        showMenu: true,
        fileType: affix,
      });
    },
    fail() {
      g.loadingDownloadFile = false;
      toast('下载失败');
    },
  });
};
