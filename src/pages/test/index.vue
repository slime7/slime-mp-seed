<template>
  <mp-page
    title="test"
    @touchstart="wxsTest.onWxsScroll"
  >
    <div class="mp-body flex flex-col pt-2 px-4">
      <div class="mt-2">
        page container 测试
      </div>
      <div class="mt-2">
        <mat-button
          class="btn-1"
          @click="modalVisible = true"
        >
          打开 page container
        </mat-button>
      </div>

      <div class="mt-4 flex center gap-x-2">
        <mat-loader />
        <mat-loader :progress="loadingProgress" />
      </div>

      <div class="mt-2">
        <input v-model="loadingProgress">
      </div>

      <div class="scroll-area mt-4">
        <mp-scroll-refresher
          :disabled-pull-down-refresh="refresherLoading"
          @trigger="onRefresherTrigger"
        >
          <div class="scroll-refresher">
            content content content content content content content content content content content content content content content content content content
          </div>
        </mp-scroll-refresher>
      </div>

      <div class="mt-2 flex flex-wrap gap-2">
        <mat-button
          color="primary"
          rounded
          @click="packagedRequest"
        >
          测试 http success
        </mat-button>

        <mat-button
          color="primary"
          rounded
          @click="packagedRequestError"
        >
          测试 http error
        </mat-button>

        <mat-button
          color="primary"
          rounded
          @click="autoGetTokenRequest"
        >
          测试自动获取 token
        </mat-button>

        <mat-button
          color="primary"
          rounded
          :disabled="loading"
          @click="makeRequest"
        >
          {{ loading ? 'loading' : '测试 http 加载' }}
        </mat-button>

        <mat-button
          color="primary"
          rounded
          :disabled="!loading"
          @click="abort"
        >
          测试 http 中断
        </mat-button>
      </div>

      <div class="mt-2">
        <pre>{{ responseData }}</pre>
      </div>

      <div class="mt-2">
        <div>获取手机号</div>
        <mat-button
          color="primary"
          rounded
          open-type="getPhoneNumber"
          @getphonenumber="onGetPhone"
        >
          获取手机号
        </mat-button>
      </div>

      <div class="mt-2">
        <div class="text-clip">
          <div>文字背景色剪切</div>
        </div>
      </div>

      <div class="mt-2">
        <textarea
          v-model="test"
          placeholder="123123"
        />
      </div>

      <div class="mt-2">
        <div class="ripple-parent" @click="wxsTest.testClick">
          <mat-ripple />
        </div>
      </div>

      <div class="mt-2 px-4">
        <div class="flex">
          <mat-button class="extra-class" @click="clicked">
            按钮
          </mat-button>
          <mat-button
            color="primary"
            rounded
          >
            按钮
          </mat-button>
          <mat-button
            class-name="class-1"
            outlined
          >
            按钮
          </mat-button>
        </div>
      </div>

      <div class="mt-2">
        <div>
          <text class="material-icons">
            arrow_back
          </text>
          <text class="material-icons">
            arrow_back_ios_new
          </text>
          <text class="material-icons filled-0 w-700">
            cancel
          </text>
          <text class="material-icons filled-0">
            cancel
          </text>
          <text class="material-icons filled">
            cancel
          </text>
        </div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
        <div>1231213</div>
      </div>
    </div>

    <mp-bottom-sheet v-model="modalVisible">
      <div>测试 page container 组件</div>
    </mp-bottom-sheet>
  </mp-page>
</template>

<script setup>
/* eslint-disable import/no-import-module-exports */
import { ref, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MpBottomSheet from '@/components/MpBottomSheet.vue';
import MatButton from '@/components/MatButton.vue';
import MatRipple from '@/components/MatRipple.vue';
import MpScrollRefresher from '@/components/MpScrollRefresher.vue';
import MatLoader from '@/components/MatLoader.vue';
import useHttp from '@/hooks/useHttp';
import useWorker from '@/hooks/useWorker';
import { wait } from '@/utils';

const {
  worker,
  isLoading: loadingWorker,
  error: errorWorker,
} = useWorker();
watch(errorWorker, (err) => {
  console.log(err);
});
watch(loadingWorker, (loading) => {
  console.log('loading', loading);
});
const modalVisible = ref(false);
const test = ref('123');

const clicked = () => {
  console.log('clicked');
};

const {
  execute,
  abort,
  data: responseData,
  loading,
} = useHttp('https://httpbin.org/delay/3').get();
const makeRequest = async () => {
  try {
    await execute();
  } catch (err) {
  }
};
const packagedRequest = async () => {
  const { data } = await useHttp('https://httpbin.org/post').post({ foo: 'bar' });
  console.log(data.value);
};
const packagedRequestError = async () => {
  try {
    await useHttp('https://httpbin.org/status/500').get();
  } catch (err) {
    console.log(err);
  }
};
const autoGetTokenRequest = async () => {
};

const onGetPhone = (ev) => {
  console.log(ev);
};

const refresherLoading = ref(false);
const onRefresherTrigger = (ev) => {
  console.log(ev);
  refresherLoading.value = true;
  setTimeout(() => {
    refresherLoading.value = false;
  }, 3000);
};

const loadingProgress = ref(90);

onLoad(() => {
  setTimeout(async () => {
    console.log('发送到work');
    const result = await worker.test({ foo: 'bar' }, 'ping');
    console.log('worker result', result);
  }, 2000);
});
</script>

<script module="wxsTest" lang="wxs">
/* eslint-disable */
var testClick = function () {
  console.log('wxs 事件');
};
var onWxsScroll = function (ev) {
  // console.log(JSON.stringify(ev));
};

module.exports = {
  testClick: testClick,
  onWxsScroll: onWxsScroll
};
/* eslint-enable */
</script>

<style lang="scss">
.class-1 {
  width: 120px;
  color: #1a83ff;
}

.text-clip {
  font-weight: 500;
  font-size: 24px;
  background-image: linear-gradient(100deg, #ececf0 8%, #ddd 18%, #ececf0 33%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-size: 750px 100%;
  animation: loading-shine 1.4s ease infinite;
}

.chart-parent {
  width: 100%;
  height: 300px;
}

.ripple-parent {
  position: relative;
  display: block;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  border: 2px solid #ccc;
}

.scroll-area {
  height: 480px;
}

@keyframes loading-shine {
  0% {
    background-position: -375px 0
  }

  100% {
    background-position: 375px 0
  }
}
</style>
