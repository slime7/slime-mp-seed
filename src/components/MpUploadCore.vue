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
  <div @click="selectImage">
    <div class="slot">
      <slot />
    </div>

    <div class="slot-default">
      <image
        class="mp-upload-core"
        src="@/assets/imgs/bg-upload.png"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.mp-upload-core {
  display: block;
  width: 75px;
  height: 75px;
}

.slot-default {
  display: none;
}

.slot:empty + .slot-default {
  display: block;
}
</style>
