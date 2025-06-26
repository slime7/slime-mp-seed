// 用于追踪正在运行的耗时任务，以便可以取消它们
const runningTasks = new Map();

// 方法现在接收一个上下文对象 { post, invocationId }
const methods = {
  add({ post }, a, b) {
    const result = a + b;
    post(result, true); // 第二个参数 isFinal = true
  },

  orderCountdown({ post, invocationId }, targetDate, timeout = 200) {
    if (!targetDate) {
      post('error', true);
      return;
    }
    let timer = null;
    let remain = '';
    const targetTime = +new Date(targetDate);
    const digitTwo = (value) => {
      const paddingStr = `00${value}`;
      return paddingStr.substring(paddingStr.length - 2);
    };

    const countFn = () => {
      if (!targetTime) {
        return;
      }
      const left = Math.round((targetTime - +new Date()) / 1000);
      if (left <= 0) {
        clearInterval(timer);
        runningTasks.delete(invocationId);
        post('Countdown finished!', true);
      }
      const result = [
        Math.floor(left / (60 * 60 * 24)),
        Math.floor((left % (60 * 60 * 24)) / (60 * 60)),
        Math.floor((left % (60 * 60)) / 60),
        Math.floor(left % 60),
      ];
      remain = `${digitTwo(result[0])}天${digitTwo(result[1])}小时${digitTwo(result[2])}分钟`;
      post({ remain }, false, 'progress');
    };
    timer = setInterval(countFn, timeout);
    countFn();

    // 存储定时器ID，以便可以取消它
    runningTasks.set(invocationId, timer);
  },

  test: ({ post }, params, extraArg) => worker.request({
    url: 'https://httpbin.org/get',
    data: params,
    success(result) {
      console.log('work request', result, extraArg);
      post(result, true);
    },
  }),

  // [系统方法] 用于取消任务
  'system:cancel'({ invocationId }) {
    console.log(`Worker: Received cancel signal for task ${invocationId}`);
    if (runningTasks.has(invocationId)) {
      clearInterval(runningTasks.get(invocationId));
      runningTasks.delete(invocationId);
    }
  }
};

// 监听主线程发来的消息
worker.onMessage((res) => {
  const { invocationId, method, args = [] } = res;

  if (!methods[method]) {
    worker.postMessage({ invocationId, error: `Method '${method}' not found.`, isFinal: true });
    return;
  }

  // 为 worker 方法创建一个专用的 post 函数，自动绑定 invocationId
  const post = (data, isFinal = false, event = null) => {
    worker.postMessage({ invocationId, data, isFinal, event });
  };

  const context = { post, invocationId };

  try {
    methods[method](context, ...args);
  } catch (e) {
    worker.postMessage({ invocationId, error: e.message, isFinal: true });
  }
});

// 初始化完成通知
console.log('Worker initialized successfully', worker);
