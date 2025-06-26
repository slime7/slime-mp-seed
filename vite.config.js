/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs-extra';
import path from 'path';
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite';
import tailwindcss from 'tailwindcss';
/* eslint-enable import/no-extraneous-dependencies */
import pagesDetail from './src/pages';

function parsePagesJson() {
  fs.writeFileSync('./src/pages.json', JSON.stringify(pagesDetail, null, 2), {
    flag: 'w',
  });
}
parsePagesJson();
const copySubMain = () => ({
  enforce: 'post',
  async writeBundle() {
    await fs.copy(
      path.resolve(__dirname, 'src/sub/index.js'),
      path.join(
        __dirname,
        'dist/build/mp-weixin/sub/index.js',
      ),
    );
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    UnifiedViteWeappTailwindcssPlugin({}),
    copySubMain(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
      ],
    },
  },
});
