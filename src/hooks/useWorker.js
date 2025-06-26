import { onUnmounted } from 'vue';

const workerManager = (() => {
  let workerInstance = null;
  // Map<invocationId, { promiseControl: { resolve, reject }, listeners: Map<eventName, Set<callback>> }>
  const activeInvocations = new Map();

  const config = {
    workerPath: 'static/workers/main.js',
    idleTimeout: 120000,
  };

  const resetIdleTimer = () => {
    clearTimeout(workerManager.idleTimer);
    workerManager.idleTimer = setTimeout(() => {
      if (workerInstance && activeInvocations.size === 0) {
        console.log('Closing idle worker.');
        workerInstance.terminate();
        workerInstance = null;
      }
    }, config.idleTimeout);
  };

  const createNewWorker = () => {
    const worker = uni.createWorker(config.workerPath, { useExperimentalWorker: true });

    worker.onProcessKilled(() => {
      console.warn('Worker was killed by system');
      activeInvocations.forEach(({ promiseControl }, id) => {
        promiseControl.reject(new Error('Worker was killed by system'));
      });
      activeInvocations.clear();
      workerInstance = createNewWorker(); // Recreate
    });

    worker.onMessage((res) => {
      const {
        invocationId, event, data, error, isFinal,
      } = res;
      const invocation = activeInvocations.get(invocationId);
      if (!invocation) return;

      // 处理错误
      if (error) {
        invocation.promiseControl.reject(new Error(error));
        activeInvocations.delete(invocationId);
        if (activeInvocations.size === 0) resetIdleTimer();
        return;
      }

      // 处理持续的事件消息
      if (event && invocation.listeners.has(event)) {
        invocation.listeners.get(event).forEach((cb) => cb(data));
      }

      // 如果是最终消息，则 resolve promise 并清理
      if (isFinal) {
        invocation.promiseControl.resolve(data);
        activeInvocations.delete(invocationId);
        if (activeInvocations.size === 0) resetIdleTimer();
      }
    });

    return worker;
  };

  const ensureWorker = () => {
    if (!workerInstance) {
      workerInstance = createNewWorker();
    }
    clearTimeout(workerManager.idleTimer);
  };

  /**
   * @typedef {object} WorkerTaskHandle
   * @property {function(onFulfilled?: Function, onRejected?: Function): Promise<any>} then - Promise 的 then 方法。
   * @property {function(onRejected?: Function): Promise<any>} catch - Promise 的 catch 方法。
   * @property {function(onFinally?: Function): Promise<any>} finally - Promise 的 finally 方法。
   * @property {function(eventName: string, callback: Function): Function} on - 监听 worker 任务的进度事件，返回一个取消监听的函数。
   * @property {function(reason?: string): void} cancel - 取消正在进行的 worker 任务。
   */

  /**
   * 调用 worker 中的方法。
   * @param {string} method - 要调用的 worker 方法名称。
   * @param {...any} args - 传递给 worker 方法的参数。
   * @returns {WorkerTaskHandle} 一个包含 Promise 和事件监听/取消方法的对象。
   */
  const callWorker = (method, ...args) => {
    ensureWorker();
    const invocationId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    let promiseControl = {};
    const promise = new Promise((resolve, reject) => {
      promiseControl = { resolve, reject };
    });

    const invocation = {
      promiseControl,
      listeners: new Map(),
    };
    activeInvocations.set(invocationId, invocation);

    workerInstance.postMessage({ invocationId, method, args });

    return {
      then: promise.then.bind(promise),
      catch: promise.catch.bind(promise),
      finally: promise.finally.bind(promise),

      on(eventName, callback) {
        if (!invocation.listeners.has(eventName)) {
          invocation.listeners.set(eventName, new Set());
        }
        invocation.listeners.get(eventName).add(callback);
        // 返回一个取消函数
        return () => {
          invocation.listeners.get(eventName)?.delete(callback);
        };
      },

      cancel(reason = 'Task cancelled by user.') {
        if (activeInvocations.has(invocationId)) {
          workerInstance.postMessage({ invocationId, method: 'system:cancel' });
          invocation.promiseControl.reject(new Error(reason));
          activeInvocations.delete(invocationId);
          if (activeInvocations.size === 0) resetIdleTimer();
        }
      },
    };
  };

  return { callWorker };
})();

export default function useWorker() {
  const activeTasks = new Set();

  onUnmounted(() => {
    activeTasks.forEach((task) => task.cancel('Component unmounted.'));
    activeTasks.clear();
  });

  const workerProxy = new Proxy({}, {
    /**
     * 获取 worker 方法的代理。
     * @template T
     * @param {object} target - Proxy 目标对象。
     * @param {string} prop - 属性名称（即 worker 方法名称）。
     * @returns {(...args: any[]) => WorkerTaskHandle} 一个调用 worker 方法并返回 WorkerTaskHandle 的函数。
     */
    get(target, prop) {
      return (...args) => {
        // [关键] 调用改造后的 callWorker
        const task = workerManager.callWorker(prop, ...args);
        // 追踪由该组件实例创建的任务
        activeTasks.add(task);
        // 当任务完成或失败时，从追踪集合中移除
        task.finally(() => {
          activeTasks.delete(task);
        });
        return task;
      };
    },
  });

  return {
    worker: workerProxy,
  };
}
