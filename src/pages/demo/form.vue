<template>
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
            错误禁用
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-4">
            <mp-checkbox
              :model-value="true"
              error
              disabled
            />
            <mp-checkbox
              :model-value="false"
              error
              disabled
            />
            <mp-checkbox
              :indeterminate="true"
              error
              disabled
            />
          </div>

          <div class="text-sm mt-2">
            label
          </div>

          <div class="mt-2 flex flex-col gap-2">
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

          <div class="text-base font-bold">
            radio
          </div>

          <div class="text-sm mt-2">
            普通
          </div>

          <div class="mt-2">
            <div><radio value="1" /><span>1</span></div>
            <div><radio value="2" /><span>2</span></div>
            <div><radio value="3" /><span>3</span></div>
            <div><radio v-if="!radioReset" value="4" :checked="radioChecked" @click="radioChecked = !radioChecked" /><span>4</span></div>
            <div>
              <mp-checkbox v-model="radioChecked" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </mp-page>
</template>

<script setup>
import {
  reactive,
  ref,
  watch,
} from 'vue';
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MatButton from '@/components/MatButton.vue';
import MpCheckbox from '@/components/MpCheckbox.vue';

const dialog1 = ref(false);
const dialogIcon = ref('');
const dialogTitle = ref('');
const checked = ref(false);
const radioChecked = ref(true);
const radioReset = ref(false);
watch(radioChecked, (v) => {
  if (v) {
    radioReset.value = true;
    setTimeout(() => {
      radioReset.value = false;
    }, 0);
  }
});

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="postcss">
@reference '../../assets/style/app.css';
</style>
