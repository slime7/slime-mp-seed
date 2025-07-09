import useHttp from '@/hooks/useHttp';
import { computed } from 'vue';
import { apiUrl, ossSignUrl, uploadedUrl } from '@/utils/api-env-constance';
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
  if (response.statusCode < 200 || response.statusCode >= 300) {
    if (response.statusCode === 401) {
      // 刷新 token
      console.debug('开始刷新 token');
      try {
        await store.getToken();
        console.debug('完成刷新 token，重新请求接口');
        execute()
          .then(responseResolve)
          .catch(responseReject);
        return { data };
      } catch (err) {
        console.debug('获取 token 出错');

        execute()
          .then(responseResolve)
          .catch(responseReject);
        return { data };
      }
    } else {
      const error = apiError(`请求出错 code： ${response.statusCode}`, {
        response,
      });

      responseReject(error);
      // eslint-disable-next-line consistent-return
      return Promise.reject(error);
    }
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
    console.log('token', token.value);
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
  needToken: () => request(`${apiUrl}/bearer`).get(),
};

export const uploadApi = (file, module = '', position = '') =>
  // eslint-disable-next-line no-async-promise-executor, implicit-arrow-linebreak
  new Promise(async (resolve, reject) => {
    let ossResult;
    try {
      const response = await request(`${ossSignUrl}/anything`).post({
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
      // url: `https://${ossResult.host}`,
      url: `${uploadedUrl}/delay/5`,
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
        if (statusCode !== 200) {
          reject(new Error('文件上传失败'));
          return;
        }
        // resolve(data);
        resolve({
          filename: 'image/jpeg', // 模拟一下返回值
        });
      },
      fail() {
        reject(new Error('文件上传失败'));
      },
    });
  });
