<template>
  <page-meta>
    <navigation-bar
      title="其他功能"
    />
  </page-meta>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <mp-page
    title="其他功能"
  >
    <div class="mp-body flex flex-col flex-auto max-h-full">
      <div class="p-4">
        <div class="text-base font-bold">
          代码块
        </div>

        <div class="mt-2">
          普通
        </div>

        <div class="code mt-2">
          <mp-pre
            text="<mp-pre
  text=&quot;...&quot;
/>"
          />
        </div>

        <div class="mt-2">
          可序列化的
        </div>

        <div class="code mt-2">
          <mp-pre
            :text="preObject"
            json
          />
        </div>

        <div class="text-base font-bold mt-4">
          http 请求
        </div>

        <div class="mt-2">
          <div class="flex items-center gap-x-2">
            <div class="input flex-auto">
              <input
                v-model="requestUrl"
                class="block"
              >
            </div>

            <div class="shrink-0">
              <mat-button
                @click="makeRequest"
              >
                发送请求
              </mat-button>
            </div>
          </div>
        </div>
        <div class="code mt-2 max-h-80">
          <mp-pre
            :text="requestResult"
            json
          />
        </div>

        <div class="text-base font-bold mt-4">
          图片上传组件及状态展示覆盖层组件
        </div>

        <div class="mt-2 flex flex-wrap gap-x-2">
          <div
            v-for="imagePath in Object.keys(images)"
            :key="imagePath"
            class="relative w-18 h-18 rounded-sm overflow-hidden"
          >
            <mp-preview-cover
              :loading="images[imagePath].loading"
              :uri="images[imagePath].uri"
              @click:remove-file="removeImage"
            />
            <image class="block w-full h-full" :src="parseImageUrl(images[imagePath].tempFilePath)" />
          </div>
          <mp-upload-core
            max-count="5"
            @progress="onFileUpload"
          />
        </div>
      </div>
    </div>
  </mp-page>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MpPre from '@/components/MpPre.vue';
import MatButton from '@/components/MatButton.vue';
import MpUploadCore from '@/components/MpUploadCore.vue';
import MpPreviewCover from '@/components/MpPreviewCover.vue';
import useHttp from '@/hooks/useHttp';
import { parseImageUrl } from '@/utils';

const preObject = {
  foo: 'bar',
};

const requestUrl = ref('https://httpbin.org/get');
const {
  data: requestData,
  loading: requestLoading,
  error: requestError,
  execute: makeRequest,
} = useHttp(requestUrl);
const requestResult = computed(() => reactive({
  loading: requestLoading,
  data: requestData,
  error: requestError,
}));

// 上传
const images = ref({});
const removeImage = (uri) => {
  console.log('remove image clicked', uri);
};
const onFileUpload = (file) => {
  console.log(file);
  images.value[file.tempFilePath] = file;
};

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="postcss">
@reference '../../assets/style/app.css';

.code {
  padding: --spacing(4);
  border-radius: --spacing(4.5);
  border: 1px solid var(--md-color-outline-variant);
  overflow: auto;
}

.input {
  padding: --spacing(2) --spacing(4);
  border-radius: --spacing(4);
  border: 1px solid var(--md-color-outline-variant);
}
</style>
