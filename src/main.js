import { createSSRApp } from 'vue';
import * as Pinia from 'pinia';
import App from './App.vue';
import pinia from './store/index';

// eslint-disable-next-line import/prefer-default-export
export function createApp() {
  const app = createSSRApp(App);
  app.use(pinia);

  return {
    app,
    Pinia,
  };
}
