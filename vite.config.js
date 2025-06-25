import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import uni from '@dcloudio/vite-plugin-uni';
import tailwindcss from '@tailwindcss/postcss';
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite';
import pagesDetail from './src/pages';

function parsePagesJson() {
  fs.writeFileSync('./src/pages.json', JSON.stringify(pagesDetail, null, 2), {
    flag: 'w',
  });
}
parsePagesJson();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    UnifiedViteWeappTailwindcssPlugin({
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
