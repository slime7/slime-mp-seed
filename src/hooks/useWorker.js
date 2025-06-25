import { onUnmounted, ref } from 'vue';

// Worker 管理器单例
const workerManager = (() => {
  let workerInstance = null;
  const pendingRequests = new Map();
  let idleTimer = null;

  // Worker 配置
  const config = {
    workerPath: 'static/workers/main.js',
    idleTimeout: 120000, // 30秒空闲后关闭
    maxConcurrent: 5, // 最大并发请求数
    requestTimeout: 10000, // 单个请求超时时间
  };

  // 重置空闲计时器
  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (workerInstance && pendingRequests.size === 0) {
        console.log('Closing idle worker');
        workerInstance.terminate();
        workerInstance = null;
      }
    }, config.idleTimeout);
  };

  // 创建新 Worker
  const createNewWorker = () => {
    const worker = uni.createWorker(config.workerPath, {
      useExperimentalWorker: true,
    });

    // 监听 Worker 被系统杀死事件
    worker.onProcessKilled(() => {
      console.warn('Worker was killed by system');

      // 拒绝所有未完成的请求
      // eslint-disable-next-line no-restricted-syntax
      for (const [id, { reject }] of pendingRequests) {
        reject(new Error('Worker was killed by system'));
        pendingRequests.delete(id);
      }

      // 重新创建 Worker
      workerInstance = createNewWorker();
    });

    // 监听 Worker 消息
    worker.onMessage((res) => {
      const { id, result, error } = res;
      const request = pendingRequests.get(id);

      if (request) {
        clearTimeout(request.timeoutId);

        if (error) {
          request.reject(new Error(error));
        } else {
          request.resolve(result);
        }

        pendingRequests.delete(id);

        // 如果没有待处理请求，设置空闲计时器
        if (pendingRequests.size === 0) {
          resetIdleTimer();
        }
      }
    });

    return worker;
  };

  // 调用 Worker 方法
  const callWorker = (method, ...args) => new Promise((resolve, reject) => {
    // 确保 Worker 存在
    if (!workerInstance) {
      workerInstance = createNewWorker();
    }

    // 生成唯一请求 ID
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // 设置请求超时
    const timeoutId = setTimeout(() => {
      pendingRequests.delete(requestId);
      reject(new Error(`Worker request timeout: ${method}`));
    }, config.requestTimeout);

    // 存储请求
    pendingRequests.set(requestId, { resolve, reject, timeoutId });

    // 发送消息给 Worker
    workerInstance.postMessage({
      id: requestId,
      method,
      args,
    });

    // 重置空闲计时器
    clearTimeout(idleTimer);
  });

  // 终止 Worker
  const terminateWorker = () => {
    if (workerInstance) {
      workerInstance.terminate();
      workerInstance = null;

      // 拒绝所有未完成的请求
      // eslint-disable-next-line no-restricted-syntax
      for (const [id, { reject }] of pendingRequests) {
        reject(new Error('Worker terminated by user'));
      }
      pendingRequests.clear();
    }
  };

  return {
    callWorker,
    terminateWorker,
  };
})();

export default function useWorker() {
  const isLoading = ref(false);
  const error = ref(null);

  // 组件卸载时终止 Worker
  onUnmounted(() => {
    workerManager.terminateWorker();
  });

  // 创建 Proxy 封装
  const workerProxy = new Proxy({}, {
    get(target, prop) {
      return (...args) => {
        isLoading.value = true;
        error.value = null;

        return workerManager.callWorker(prop, ...args)
          .then((result) => {
            isLoading.value = false;
            return result;
          })
          .catch((err) => {
            isLoading.value = false;
            error.value = err;
            throw err;
          });
      };
    },
  });

  return {
    worker: workerProxy,
    isLoading,
    error,
  };
}
