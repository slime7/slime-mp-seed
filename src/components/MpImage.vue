<template>
  <div
    class="mp-image flex center"
  >
    <image
      :src="src"
      v-if="src"
      :mode="mode"
      :style="{ width: internalWidth, height: internalHeight }"
    />
    <mat-loader color="#2674f7" v-else />
  </div>
</template>

<script>
import MatLoader from '@/components/MatLoader.vue';

export default {
  name: 'MpImage',

  components: {
    MatLoader,
  },

  props: {
    src: {
      type: String,
      default: '',
    },
    width: {
      type: [Number, String],
      default: undefined,
    },
    height: {
      type: [Number, String],
      default: undefined,
    },
    mode: {
      type: String,
      default: 'aspectFit',
    },
  },

  computed: {
    internalWidth() {
      return typeof this.width === 'number' ? `${this.width}px` : this.width;
    },
    internalHeight() {
      return typeof this.height === 'number' ? `${this.height}px` : this.height;
    },
    style() {
      const result = {};
      if (this.width !== null) {
        if (typeof this.width === 'number') {
          result.width = `${this.width}px`;
        } else {
          result.width = this.width;
        }
      }
      if (this.height !== null) {
        if (typeof this.height === 'number') {
          result.height = `${this.height}px`;
        } else {
          result.height = this.height;
        }
      }
      return result;
    },
  },
};
</script>

<style scoped lang="scss">
.mp-image {
  image {
    display: block;
  }
}
</style>
