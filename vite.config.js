/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs-extra';
import path from 'path';
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite';
import tailwindcss from '@tailwindcss/postcss';
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
  base: '/slime-mp-seed/',
  plugins: [
    uni(),
    UnifiedViteWeappTailwindcssPlugin({
      disabled: process.env.UNI_PLATFORM === 'h5',
      tailwindcss: {
        // 显示声明用的是 tailwindcss v4
        version: 4,
        v4: {
          cssEntries: [
            'src/assets/style/tailwind.css',
          ],
        },
      },
    }),
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
