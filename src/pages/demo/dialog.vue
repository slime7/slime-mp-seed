<template>
  <page-meta>
    <navigation-bar
      title="弹出层"
    />
  </page-meta>
  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <mp-page
    title="弹出层"
  >
    <div class="mp-body flex flex-col flex-auto">
      <div class="flex flex-col gap-y-4 p-4">
        <div>
          <div class="text-base font-bold">
            弹出层
          </div>

          <div class="text-sm mt-2">
            对话框
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-2">
            <mp-checkbox
              v-model="showDialogIcon"
              label="显示图标"
            />
            <mp-checkbox
              v-model="showDialogTitle"
              label="显示标题"
            />
          </div>

          <div class="text-sm mt-2 flex flex-wrap gap-2">
            <mat-button
              @click="dialog1 = true"
            >
              打开
            </mat-button>
          </div>

          <div class="text-sm mt-2">
            toast
          </div>

          <div class="text-sm mt-2 flex flex-wrap gap-2">
            <mat-button
              @click="toast('这是 toast')"
            >
              打开
            </mat-button>
          </div>

          <div class="text-sm mt-2">
            底部弹窗
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-2">
            <mp-checkbox
              v-model="showBottomSheetDragHandler"
              label="显示滑动块"
            />
            <mp-checkbox
              v-model="showBottomSheetTitle"
              label="显示标题"
            />
          </div>

          <div class="text-sm mt-2 flex flex-wrap gap-2">
            <mat-button
              @click="bottomSheetVisible = true"
            >
              打开
            </mat-button>
          </div>
        </div>
      </div>

      <mp-modal
        v-model="dialog1"
        :title="showDialogTitle ? 'dialog 对话框' : ''"
        :icon="showDialogIcon ? 'home' : ''"
        type="confirm"
      >
        <div>确认操作？</div>
      </mp-modal>

      <mp-bottom-sheet
        v-model="bottomSheetVisible"
        :title="showBottomSheetTitle ? '标题' : ''"
        :hide-drag-handler="!showBottomSheetDragHandler"
      >
        <div>底部弹窗</div>
        <div>底部弹窗</div>
        <div>底部弹窗</div>
      </mp-bottom-sheet>
    </div>
  </mp-page>
</template>

<script setup>
import {
  ref,
} from 'vue';
import { onReady } from '@dcloudio/uni-app';
import MpPage from '@/components/MpPage.vue';
import MatButton from '@/components/MatButton.vue';
import MpModal from '@/components/MpModal.vue';
import MpCheckbox from '@/components/MpCheckbox.vue';
import MpBottomSheet from '@/components/MpBottomSheet.vue';
import { toast } from '@/utils';

const dialog1 = ref(false);
const showDialogIcon = ref(false);
const showDialogTitle = ref(false);

const showBottomSheetTitle = ref(true);
const showBottomSheetDragHandler = ref(true);
const bottomSheetVisible = ref(false);

const init = () => {
};
onReady(() => {
  setTimeout(init, 0);
});
</script>

<style scoped lang="postcss">
@reference '../../assets/style/app.css';
</style>
