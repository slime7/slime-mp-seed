import {
  isRef,
  readonly,
  shallowRef,
  toValue,
} from 'vue';
import { apiError } from '@/utils';

/**
 * @typedef {Object} HttpChainable
 * @property {boolean} loading - 请求加载状态
 * @property {Object} response - 原始响应对象
 * @property {Object} error - 错误对象
 * @property {number|undefined} statusCode - 状态码
 * @property {Object} data - 响应数据
 * @property {Object} headers - 响应头
 * @property {Object} requestConfig - 请求配置
 * @property {Function} execute - 执行请求的方法
 * @property {Function} get - GET 方法
 * @property {Function} post - POST 方法
 * @property {Function} put - PUT 方法
 * @property {Function} patch - PATCH 方法
 * @property {Function} delete - DELETE 方法
 * @property {Function} head - HEAD 方法
 * @property {Function} options - OPTIONS 方法
 * @property {Function} postForm - POST 表单方法
 * @property {Function} json - 设置响应类型为 JSON
 * @property {Function} text - 设置响应类型为文本
 * @property {Function} blob - 设置响应类型为 Blob
 * @property {Function} branch - 设置请求分支
 * @property {Function} then - Promise then 方法
 * @property {Function} catch - Promise catch 方法
 * @property {Function} finally - Promise finally 方法
 */

/**
 * HTTP 请求函数
 * @param {any} url - 请求 URL
 * @param {Object} [requestOptions={}] - Axios 配置
 * @returns {HttpChainable} 可链式调用的 HTTP 请求对象
 */
export default (url, requestOptions = {}) => {
  const internalOptions = {
    method: 'GET',
    dataType: 'json',
    ...requestOptions,
  };
  let requestCounter = 0;
  let currentCounter = 0;

  const loading = shallowRef(false);
  const response = shallowRef(null);
  const responseStatus = shallowRef(undefined);
  const responseError = shallowRef(null);
  const responseData = shallowRef(null);
  const responseHeaders = shallowRef({});
  const requestConfig = shallowRef({});

  let requestTask;
  const createAbortSignal = (task) => {
    console.debug('创建 requestTask', task);
    requestTask = task ?? null;
  };
  const abort = (reason = null) => {
    if (loading.value) {
      console.debug('abort reason', reason);
      requestTask?.abort(reason);
    }
  };

  const http = async () => {
    abort('重新请求接口');
    if (!loading.value) {
      requestCounter += 1;
    }
    currentCounter += 1;
    console.debug(`开始第${currentCounter}次请求`, url);

    console.debug('设置请求加载状态 true');
    loading.value = true;

    response.value = null;
    responseStatus.value = null;
    responseError.value = null;
    responseData.value = null;
    responseHeaders.value = null;
    requestConfig.value = null;

    if (internalOptions.transformRequest && typeof internalOptions.transformRequest === 'function') {
      Object.assign(internalOptions, await internalOptions.transformRequest({
        url: toValue(url),
        data: toValue(internalOptions.data),
        headers: internalOptions.headers,
      }));
    }

    const finalConfig = {
      ...internalOptions,
      headers: {
        ...(internalOptions.headers || {}),
      },
    };
    finalConfig.header = finalConfig.headers;
    const finalUrl = isRef(url) ? url.value : url;
    if (finalUrl) {
      finalConfig.url = finalUrl;
    }
    if (finalConfig.data && Object.keys(finalConfig.data).length) {
      console.debug('请求附加数据', finalConfig.data);
    }

    let responseDataTemp = null;
    return new Promise((resolve, reject) => {
      const finallyFn = (forceFinish = false) => {
        console.debug('请求结束', currentCounter, requestCounter);
        if (forceFinish || currentCounter === requestCounter) {
          console.debug('设置请求加载状态 false');
          loading.value = false;
        }
      };
      if (currentCounter - requestCounter >= 3) {
        abort('重试次数超过限制');
        reject(new Error('重试次数超过限制'));
        return;
      }
      const task = uni.request({
        ...finalConfig,
        success: async (httpResponse) => {
          const { statusCode } = httpResponse;
          responseStatus.value = statusCode;
          response.value = httpResponse;
          responseHeaders.value = httpResponse.header;
          requestConfig.value = finalConfig;
          if (statusCode < 200 || statusCode >= 300) {
            // 模拟 error
            const error = apiError(`请求出错 code： ${statusCode}`, {
              response: httpResponse,
            });
            responseError.value = error;

            console.debug('接口状态码不为2xx，抛出异常', error);
            reject(error);

            finallyFn();
            return;
          }
          responseDataTemp = httpResponse.data;
          if (typeof finalConfig?.transformResponse === 'function') {
            try {
              ({ data: responseDataTemp } = await finalConfig.transformResponse({
                data: httpResponse.data,
                response: httpResponse,
                responseResolve: resolve,
                responseReject: reject,
                execute: http,
              }));

              responseData.value = responseDataTemp;
              finallyFn(true);
              resolve();
            } catch (err) {
              responseError.value = err;
              reject(err);

              finallyFn(true);
            }
          } else {
            responseData.value = responseDataTemp;
            finallyFn(true);
            resolve();
          }
        },
        fail: (err) => {
          console.log('请求失败', err);

          requestConfig.value = finalConfig;
          responseError.value = err;
          reject(new Error(err.errMsg));

          finallyFn(true);
        },
      });
      createAbortSignal(task);
    });
  };

  const returnResultData = {
    loading: readonly(loading),
    response,
    error: responseError,
    statusCode: responseStatus,
    data: responseData,
    headers: responseHeaders,
    requestConfig,
  };
  const returnResult = {
    ...returnResultData,
    abort,
    execute: http,
    /* eslint-disable no-use-before-define */
    // method
    get: httpMethod('GET'),
    post: httpMethod('POST'),
    put: httpMethod('PUT'),
    patch: httpMethod('PATCH'),
    delete: httpMethod('DELETE'),
    head: httpMethod('HEAD'),
    options: httpMethod('OPTIONS'),
    postForm: httpMethod('POST', 'form'),
    // response type
    json: httpResponseType('json'),
    text: httpResponseType('text'),
    buffer: httpResponseType('arraybuffer'),
    // set branch
    branch: workBranch(),
    /* eslint-enable no-use-before-define */
  };

  function httpPromise() {
    return new Promise((resolve, reject) => {
      http().then(() => resolve(returnResultData)).catch(reject);
    });
  }

  function httpMethod(method, type = 'json') {
    return (data) => {
      internalOptions.method = method;
      if (type === 'form') {
        internalOptions.headers = {
          ...(internalOptions.headers || {}),
          'content-type': 'application/x-www-form-urlencoded',
        };
      }
      internalOptions.data = toValue(data);
      return {
        ...returnResult,
        then(onFulfilled, onRejected) {
          return httpPromise().then(onFulfilled, onRejected);
        },
      };
    };
  }

  function httpResponseType(type = 'json') {
    return () => {
      internalOptions.responseType = type;
      return {
        ...returnResult,
        then(onFulfilled, onRejected) {
          return httpPromise().then(onFulfilled, onRejected);
        },
      };
    };
  }

  function workBranch() {
    return (branch) => {
      if (branch) {
        internalOptions.headers = {
          ...(internalOptions.headers || {}),
          branch,
        };
      }

      return {
        ...returnResult,
        then(onFulfilled, onRejected) {
          return httpPromise().then(onFulfilled, onRejected);
        },
      };
    };
  }

  return {
    ...returnResult,
    then(onFulfilled, onRejected) {
      return httpPromise().then(onFulfilled, onRejected);
    },
  };
};
