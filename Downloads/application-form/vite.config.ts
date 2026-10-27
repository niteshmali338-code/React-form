import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { createApplicationHandler } from './server.js';

const applicationApi = {
  name: 'application-api',
  configureServer(viteServer: any) {
    const apiHandler = createApplicationHandler();
    viteServer.middlewares.use((request: any, response: any, next: any) => {
      if (request.url?.split('?')[0] !== '/api/applications') {
        next();
        return;
      }

      apiHandler(request, response);
    });
    viteServer.httpServer?.once('close', apiHandler.close);
  },
};

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), applicationApi],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
