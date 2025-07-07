<script setup>
import { toast } from '@/utils';
import { uploadApi } from '@/utils/api';
import useGlobalStore from '@/store/global';

const props = defineProps({
  ossModule: {
    type: String,
    default: 'corp',
  },
  ossPosition: {
    type: String,
    default: 'license',
  },
  maxCount: {
    type: [Number, String],
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 默认从媒体文件选择，也可以设置其他值，使微信从聊天记录选择非媒体文件 */
  fileSource: {
    type: String,
    default: 'media',
  },
});
const emits = defineEmits(['input', 'progress']);

const store = useGlobalStore();
const fileMap = new Map();
const selectImage = async () => {
  if (props.disabled) {
    toast('文件上传已达上限');
    return;
  }
  let imageResult;
  if (props.fileSource === 'media') {
    imageResult = await uni.chooseMedia({
      count: Math.min(+props.maxCount, 20),
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      mediaType: ['image'],
    });
    console.debug('选中相册文件', imageResult);
  } else {
    if (store.deviceInfo.isDesktop) {
      toast('由于平台接口缺失，桌面端暂时无法选择文件');
    }
    imageResult = await uni.chooseMessageFile({
      count: Math.min(+props.maxCount, 20),
      type: 'file',
      extension: [
        'jpg',
        'jpeg',
        'png',
        'xls',
        'xlsx',
        'doc',
        'docx',
        'pdf',
      ],
    });
    imageResult.tempFiles = imageResult.tempFiles.map((item) => ({
      ...item,
      tempFilePath: item.path,
    }));
    console.debug('选中聊天记录文件', imageResult);
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const file of imageResult.tempFiles) {
    const affix = file.tempFilePath.split('.').at(-1);
    const fileObj = {
      ...file,
      type: affix,
      affix,
      loading: false,
      err: '',
      uri: '',
    };
    fileMap.set(file.tempFilePath, fileObj);
  }
  emits('input', Array.from(fileMap.values()));
  fileMap.forEach((file, mapKey) => {
    const fileCopy = JSON.parse(JSON.stringify(file));
    fileCopy.loading = true;
    fileMap.set(mapKey, fileCopy);
    emits('progress', fileCopy);
    uploadApi({
      path: file.tempFilePath,
      name: `✨.${file.affix}`,
      size: file.size,
    }, props.ossModule, props.ossPosition)
      .then((result) => {
        fileMap.set(mapKey, {
          ...fileMap.get(mapKey),
          uri: decodeURIComponent(result.filename),
        });
      })
      .catch((err) => {
        console.log('文件上传到 oss 出错', err);
        fileMap.set(mapKey, {
          ...fileMap.get(mapKey),
          err: err.message,
        });
      })
      .finally(() => {
        fileMap.set(mapKey, {
          ...fileMap.get(mapKey),
          loading: false,
        });
        emits('progress', JSON.parse(JSON.stringify(fileMap.get(mapKey))));
        console.log('progress', fileMap.get(mapKey));
        fileMap.delete(mapKey);
        console.log('uploaded, remain size:', fileMap.size, fileMap.values());
      });
  });
};
</script>

<template>
  <div class="mp-upload-core" @click="selectImage">
    <div class="slot">
      <slot />
    </div>

    <div class="slot-default flex center">
      <div class="material-icons">
        add
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
@reference '../assets/style/app.css';

.mp-upload-core,
:host {
  position: relative;
  display: block;
  width: 72px;
  height: 72px;
}

.slot-default {
  display: none;
  width: 100%;
  height: 100%;
  border-radius: --spacing(6);
  background-color: var(--md-color-tertiary-container);

  .material-icons {
    --md-icons-opsz: 'opsz' 48;
    --md-icons-weight: 'wght' 700;
    font-size: 48px;
    color: var(--md-color-on-tertiary);
  }
}

.slot:empty + .slot-default {
  display: flex;
}
</style>
