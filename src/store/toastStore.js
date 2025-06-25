import { defineStore } from 'pinia';

const useToastStore = defineStore('toastStore', {
  state: () => ({
    msg: '',
    visible: false,
    timeout: 6000,
    timer: null,
  }),
  actions: {
    show({ msg, timeout = 3000 }) {
      if (this.visible) {
        clearTimeout(this.timer);
        this.visible = false;
      }
      const timer = setTimeout(() => {
        this.visible = false;
      }, this.timeout);
      this.$patch((state) => {
        state.msg = msg;
        state.timeout = timeout;
        state.visible = true;
        state.timer = timer;
      });
    },
    close() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.visible) {
        this.timer = setTimeout(() => {
          this.$patch((state) => {
            state.visible = false;
          });
        }, 500);
      }
    },
  },
});

export default useToastStore;
