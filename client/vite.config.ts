import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import type { UserConfigExport } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const pathToEnv = path.resolve('/', '.env');
  const env = loadEnv(mode, pathToEnv);
  return {
    define: {
      __APP_ENV__: env.APP_ENV
    },
    plugins: [react()],
  };
})

