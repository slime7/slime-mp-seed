import useHttp from '@/hooks/useHttp';
import { computed } from 'vue';
import { apiUrl, ossSignUrl } from '@/utils/api-env-constance';
import useGlobalStore from '@/store/global';
import { apiError, wait } from './index';

const branchString = uni.getStorageSync('api-branch');
const branch = branchString ? branchString.substr(1, branchString.length - 2) : '';
const store = useGlobalStore();
const token = computed(() => store.token);
const isRefreshing = computed(() => store.isRefreshingToken);

const wrapResponseFn = async ({
  data,
  response,
  responseResolve,
  responseReject,
  execute,
}, transformResponse) => {
  if (data && (data.code < 200 || data.code >= 300)) {
    const error = apiError(`接口出错： ${data.msg}`, {
      response,
    });
    if (data.code === 402) {
      // 刷新 token
      console.debug('开始刷新 token');
      try {
        await store.getToken();
        console.debug('完成刷新 token，重新请求接口');
        execute()
          .then(responseResolve)
          .catch(responseReject);
        return { data: data.data };
      } catch (err) {
        console.debug('获取 token 出错');

        execute()
          .then(responseResolve)
          .catch(responseReject);
        return { data: data.data };
      }
    }

    console.debug('接口响应 code 不为2xx，抛出异常', error);
    responseReject(error);
    // eslint-disable-next-line consistent-return
    return Promise.reject(error);
  }
  console.debug('接口响应 code 为200');
  let result = { data: data.data };
  if (typeof transformResponse === 'function') {
    result = transformResponse({
      data: data.data,
      response,
      responseResolve,
      responseReject,
      execute,
    });
  }
  // eslint-disable-next-line consistent-return
  return Promise.resolve(result);
};

const request = (url, config = {}) => useHttp(url, {
  ...config,
  transformRequest: async ({ headers }) => {
    while (isRefreshing.value) {
      console.debug('其他接口正在刷新 token，等待 0.5 秒');
      // eslint-disable-next-line no-await-in-loop
      await wait(500);
    }
    const combinedHeaders = { ...headers };
    if (branch) {
      combinedHeaders.branch = branch;
    }
    if (token.value) {
      combinedHeaders.Authorization = `Bearer ${token.value}`;
    }
    return {
      headers: {
        ...headers,
        ...combinedHeaders,
      },
    };
  },
  transformResponse: async (payload) => {
    try {
      return await wrapResponseFn(payload, config?.transformResponse);
    } catch (err) {
      payload.responseReject(err);
      return null;
    }
  },
}).branch(branch);

export const commonApi = {
};

export const uploadApi = (file, module = '', position = '') =>
  // eslint-disable-next-line no-async-promise-executor, implicit-arrow-linebreak
  new Promise(async (resolve, reject) => {
    let ossResult;
    try {
      const response = await request(`${ossSignUrl}`).post({
        fileName: file.name,
        module,
        fileSize: file.size,
        position,
      });
      ossResult = response.data.value;
    } catch (err) {
      reject(err);
      return;
    }
    if (!ossResult) {
      reject(new Error('oss请求失败'));
      return;
    }
    uni.uploadFile({
      url: `https://${ossResult.host}`,
      filePath: file.path,
      name: 'file',
      formData: {
        key: ossResult.key,
        name: file.name,
        policy: ossResult.policy,
        OSSAccessKeyId: ossResult.accessid,
        success_action_status: '200',
        callback: ossResult.callback,
        signature: ossResult.signature,
      },
      success(ossResponse) {
        console.debug('ossResponse', ossResponse);
        const { statusCode } = ossResponse;
        let { data } = ossResponse;
        if (typeof data === 'string') {
          // eslint-disable-next-line no-param-reassign
          data = JSON.parse(data);
        }
        if (statusCode !== 200 || data.Status !== 'OK') {
          reject(new Error('文件上传失败'));
          return;
        }
        resolve(data);
      },
      fail() {
        reject(new Error('文件上传失败'));
      },
    });
  });
