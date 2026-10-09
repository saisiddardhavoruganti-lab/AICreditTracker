import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import 'dotenv/config';
import { defineConfig, type Plugin } from 'vite';
import { handleEstimateTask } from './src/server/estimateHandler';
import { handleGetVault, handlePostVault } from './src/server/vaultHandler';

function apiServerPlugin(): Plugin {
  return {
    name: 'aethercredits-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/vault' && req.method === 'GET') {
          await handleGetVault(req, res);
          return;
        }
        if (req.url === '/api/vault' && req.method === 'POST') {
          await handlePostVault(req, res);
          return;
        }
        if (req.url === '/api/estimate' && req.method === 'POST') {
          await handleEstimateTask(req, res);
          return;
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/vault' && req.method === 'GET') {
          await handleGetVault(req, res);
          return;
        }
        if (req.url === '/api/vault' && req.method === 'POST') {
          await handlePostVault(req, res);
          return;
        }
        if (req.url === '/api/estimate' && req.method === 'POST') {
          await handleEstimateTask(req, res);
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
