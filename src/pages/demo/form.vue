<template>
  <page-meta>
    <navigation-bar
      title="表单"
    />
  </page-meta>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <mp-page
    title="表单"
  >
    <div class="mp-body flex flex-col flex-auto">
      <div class="flex flex-col gap-y-4 p-4">
        <div>
          <div class="text-base font-bold">
            checkbox
          </div>

          <div class="text-sm mt-2">
            普通
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-4">
            <mp-checkbox
              :model-value="true"
            />
            <mp-checkbox
              :model-value="false"
            />
            <mp-checkbox
              :indeterminate="true"
            />
          </div>

          <div class="text-sm mt-2">
            禁用
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-4">
            <mp-checkbox
              :model-value="true"
              disabled
            />
            <mp-checkbox
              :model-value="false"
              disabled
            />
            <mp-checkbox
              :indeterminate="true"
              disabled
            />
          </div>

          <div class="text-sm mt-2">
            错误
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-4">
            <mp-checkbox
              :model-value="true"
              error
            />
            <mp-checkbox
              :model-value="false"
              error
            />
            <mp-checkbox
              :indeterminate="true"
              error
            />
          </div>

          <div class="text-sm mt-2">
            自定义颜色
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-4">
            <mp-checkbox
              :model-value="true"
              color="#fbbc04"
            />
            <mp-checkbox
              :model-value="false"
              color="#fbbc04"
            />
            <mp-checkbox
              :indeterminate="true"
              color="#fbbc04"
            />
          </div>

          <div class="text-sm mt-2">
            label
          </div>

          <div class="mt-2 flex flex-wrap gap-4">
            <div>
              <mp-checkbox
                v-model="checked"
                :label="`选我：${checked}`"
              />
            </div>
            <div>
              <mp-checkbox
                v-model="checked"
                :label="`选我：${checked}`"
                label-on-start
              />
            </div>
          </div>

          <div class="text-sm mt-2">
            2个 checkbox 使用同一个数组 model
          </div>

          <div class="mt-2 text-sm">
            {{ checkboxArray }}
          </div>
          <div class="flex gap-2">
            <div>
              <mp-checkbox
                v-model="checkboxArray"
                value="apple"
                label="apple"
              />
            </div>
            <div>
              <mp-checkbox
                v-model="checkboxArray"
                value="banana"
                label="banana"
              />
            </div>
          </div>

          <div class="text-base font-bold">
            radio
          </div>

          <div class="text-sm mt-2">
            普通
          </div>

          <div class="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            <mp-radio />

            <mp-radio-group model-value="option 1">
              <mp-radio
                value="option 1"
              />
            </mp-radio-group>

            <mp-radio-group model-value="option 1">
              <mp-radio
                value="option 1"
                error
              />
            </mp-radio-group>

            <mp-radio
              disabled
            />

            <mp-radio-group model-value="option 1">
              <mp-radio
                value="option 1"
                disabled
              />
            </mp-radio-group>

            <mp-radio-group model-value="option 1">
              <mp-radio
                value="option 1"
                color="#fbbc04"
              />
            </mp-radio-group>
          </div>

          <div class="text-sm mt-2">
            绑定值
          </div>

          <div class="mt-2">
            <div class="text-sm">
              model-value: {{ radio }}
            </div>
            <div>
              <mp-radio-group
                v-model="radio"
                label="请选择"
              >
                <mp-radio
                  value="option 1"
                  label="选项 1"
                />
                <mp-radio
                  value="option 2"
                  label="选项 2"
                />
              </mp-radio-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </mp-page>
</template>

<script setup>
import {
  ref,
} from 'vue';
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MpCheckbox from '@/components/MpCheckbox.vue';
import MpRadio from '@/components/MpRadio.vue';
import MpRadioGroup from '@/components/MpRadioGroup.vue';

const checked = ref(false);
const checkboxArray = ref(['banana']);
const radio = ref('');

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="postcss">
@reference '../../assets/style/app.css';
</style>
