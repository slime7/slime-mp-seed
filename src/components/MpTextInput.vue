<template>
  <label :class="[classMerge('mp-text-input flex items-center', className)]" @click="click">
    <div class="shrink-0 flex items-center" @click="clickPrepend">
      <slot name="prepend" />
    </div>

    <div
      class="flex-grow flex items-center"
      :class="{ disabled, 'input-border': border }"
    >
      <div class="shrink-0 flex items-center" @click="clickPrependInner">
        <slot name="prepend-inner" />
      </div>

      <div
        v-if="['button'].includes(type)"
        class="input flex-grow"
        :class="{ 'is-empty': !internalValue }"
        @confirm="confirm"
        @input="input"
      >
        {{ internalValue === '' ? placeholder : internalValue }}
      </div>
      <input
        v-else
        v-model="internalValue"
        class="input flex-grow"
        :type="type"
        :password="password"
        :placeholder="placeholder"
        :confirmType="confirmType"
        placeholder-style="color: #999999;"
        :disabled="disabled"
        :maxlength="maxLength"
        :adjust-position="true"
        :always-embed="true"
        @confirm="confirm"
        @focus="focus"
        @blur="blur"
        @input="input"
        @keyboardheightchange="keyboard"
      >

      <div class="shrink-0 flex items-center" @click="clickAppendInner">
        <slot name="append-inner" />
      </div>
    </div>

    <div class="shrink-0 flex items-center" @click="clickAppend">
      <slot name="append" />
    </div>
  </label>
</template>

<script>
import { classMerge } from '@/utils';

export default {
  name: 'MpTextInput',

  behaviors: ['wx://form-field'],

  props: {
    modelValue: String,
    placeholder: String,
    type: String,
    password: {
      type: Boolean,
      default: false,
    },
    className: String,
    confirmType: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    maxLength: {
      type: [Number, String],
      default: -1,
    },
    border: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({}),

  computed: {
    internalValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      },
    },
  },

  methods: {
    classMerge,
    confirm(ev) {
      this.$emit('confirm', ev);
    },
    focus(ev) {
      this.$emit('focus', ev);
    },
    blur(ev) {
      this.$emit('blur', ev);
    },
    click(ev) {
      this.$emit('click', ev);
    },
    input(ev) {
      this.$emit('input', ev);
    },
    keyboard(ev) {
      this.$emit('keyboard', ev);
    },
    clickAppend(ev) {
      this.$emit('click:append', ev);
    },
    clickAppendInner(ev) {
      this.$emit('click:append-inner', ev);
    },
    clickPrepend(ev) {
      this.$emit('click:prepend', ev);
    },
    clickPrependInner(ev) {
      this.$emit('click:prepend-inner', ev);
    },
  },
};
</script>

<style lang="scss">
:host {
  flex-grow: 1;
}
</style>

<style scoped lang="scss">
.mp-text-input {
  .input-border {
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid #aaa;

    &.disabled {
      border-color: #e1e1e1;
      background-color: #fafafa;
    }
  }

  .input {
    height: initial;
    font-size: 16px;

    &.is-empty {
      color: #999;
    }
  }

  &.text-right {
    .input {
      text-align: right;
    }
  }
}
</style>
