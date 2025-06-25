<script setup>
import MatLoader from './MatLoader.vue';
import { parseImageUrl, toast } from '../utils';

const props = defineProps({
  uri: {
    type: [String, null],
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showRemoveBtn: {
    type: Boolean,
    default: true,
  },
  showPreviewBtn: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits([
  'click:upload-error',
  'click:remove-file',
  'click:show-image-fullscreen',
]);

const showUploadError = (err) => {
  emit('click:upload-error', {
    uri: props.uri,
    err,
  });
  toast(err);
};
const removeFile = () => {
  emit('click:remove-file', props.uri);
};
const showImageFullscreen = () => {
  emit('click:show-image-fullscreen', props.uri);
  console.log('预览图片', parseImageUrl(props.uri));
  uni.previewImage({
    urls: [
      parseImageUrl(props.uri),
    ],
  });
};
</script>

<template>
  <div class="preview-cover">
    <div v-if="error" class="error flex center">
      <div class="material-icons" @click="showUploadError(error)">
        error
      </div>
    </div>

    <div v-if="uri && !loading && !disabled && showRemoveBtn" class="remove-btn flex flex-col center">
      <div class="material-icons" @click="removeFile">
        close
      </div>
    </div>

    <div
      v-if="uri && !loading && showPreviewBtn"
      class="full-screen-btn flex center"
      @click="showImageFullscreen"
    >
      <div class="material-icons">
        zoom_in
      </div>
    </div>

    <div v-if="loading" class="loader flex center">
      <mat-loader />
    </div>
  </div>
</template>

<style scoped lang="scss">
:host {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.preview-cover {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  .loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .3);
  }

  .error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #ed1b23;
    background-color: rgba(255, 255, 255, .3);

    .material-icons {
      font-size: 32px;
    }
  }

  .remove-btn {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    width: 32px;
    height: 24px;
    border-bottom-left-radius: 8px;
    border-top-right-radius: 5px;
    background-color: rgba(0, 0, 0, .87);

    .material-icons {
      width: 100%;
      color: #fff;
      text-align: center;
    }
  }

  .full-screen-btn {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    color: #e60012;

    .material-icons {
      font-size: 30px;
    }
  }
}
</style>
