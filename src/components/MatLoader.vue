<template>
  <div
    :class="['mat-loader', className, { spin: !isFixedValue }]"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
    }"
    :data-progress="progress"
    :data-progress-number="+progress"
  >
    <image v-if="isFixedValue" class="fixed-value-circle" :src="fixedCircleSvg" />
    <div
      v-else
      class="mat-spin-layer"
      :style="{
        borderColor: color,
      }"
    >
      <div class="mat-circle-clipper left">
        <div
          class="mat-circle"
          :style="{ borderWidth: `${trueWidth}px` }"
        />
      </div>
      <div class="mat-circle-clipper right">
        <div
          class="mat-circle"
          :style="{ borderWidth: `${trueWidth}px` }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: [Number, String],
    default: 32,
  },
  width: {
    type: [Number, String],
    default: 4,
  },
  className: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  progress: {
    type: [Number, String],
    default: null,
  },
});

const internalProgress = computed(() => {
  if (Number.isNaN(+props.progress) || props.progress === null || props.progress === undefined || props.progress === '') {
    return null;
  }
  return +props.progress;
});
const trueWidth = computed(() => {
  let widthTemp = 4;
  if (props.width) {
    widthTemp = +props.width;
  }
  if (props.width * 2 > +props.size) {
    widthTemp = Math.floor(+props.size / 2);
  }
  return widthTemp;
});
const isFixedValue = computed(() => internalProgress.value !== null);
const fixedCircleSvg = computed(() => {
  if (!isFixedValue.value) {
    return '';
  }
  const styleSvg = 'transform: rotate(-90deg);';
  const styleCircle = `cx: 50%; cy: 50%; r: calc(50% * ${1 - ((4 * 3) / 100)}); stroke-width: calc(${4 * 3} * 1%); stroke-dasharray: 100; fill: rgba(0, 0, 0, 0);`;
  const styleActive = `transition: stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1); stroke: ${props.color};`;
  const svgTemplate = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4800 4800" style="${styleSvg}"><circle class="track" pathLength="100" style="${styleCircle}"></circle><circle class="active-track" pathLength="100" stroke-dashoffset="${100 - internalProgress.value}" style="${styleCircle}${styleActive}"></circle></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgTemplate)}`;
});
</script>

<style scoped lang="scss">
.mat-loader {
  .fixed-value-circle {
    display: block;
    width: 100%;
    height: 100%;
  }

  &.spin {
  position: relative;
  animation: rotate 1.568s linear infinite;
  transform-origin: center center;
}

  .mat-spin-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    animation: unfilled-rotate 5.332s ease infinite both;

    .mat-circle {
      box-sizing: border-box;
      height: 100%;
      border-style: solid;
      border-color: inherit;
      border-bottom-color: transparent !important;
      border-radius: 50%;
      -webkit-animation: none;
      animation: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }

    .mat-circle-clipper {
      display: inline-block;
      position: relative;
      width: 50%;
      height: 100%;
      overflow: hidden;
      border-color: inherit;

      &.left {
        float: left;

        .mat-circle {
          transform: rotate(129deg);
          animation: left-spin 1.333s ease infinite both;
          border-right-color: transparent !important;
        }
      }

      &.right {
        float: right;

        .mat-circle {
          left: -100%;
          transform: rotate(-129deg);
          animation: right-spin 1.333s ease infinite both;
          border-left-color: transparent !important;
        }
      }

      .mat-circle {
        width: 200%;
      }
    }

    .mat-circle-gap {
      position: absolute;
      box-sizing: border-box;
      top: 0;
      left: 45%;
      width: 10%;
      height: 100%;
      overflow: hidden;
      border-color: inherit;

      .mat-circle {
        width: 1000%;
        left: -450%;
      }
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes unfilled-rotate {
  from {
    transform: rotate(0deg);
  }
  12.5% {
    transform: rotate(135deg);
  }
  25% {
    transform: rotate(270deg);
  }
  37.5% {
    transform: rotate(405deg);
  }
  50% {
    transform: rotate(540deg);
  }
  62.5% {
    transform: rotate(675deg)
  }
  75% {
    transform: rotate(810deg)
  }
  87.5% {
    transform: rotate(945deg)
  }
  to {
    transform: rotate(1080deg)
  }
}

@keyframes left-spin {
  from {
    transform: rotate(130deg)
  }
  50% {
    transform: rotate(-5deg)
  }
  to {
    transform: rotate(130deg)
  }
}

@keyframes right-spin {
  from {
    transform: rotate(-130deg)
  }
  50% {
    transform: rotate(5deg)
  }
  to {
    transform: rotate(-130deg)
  }
}
</style>
