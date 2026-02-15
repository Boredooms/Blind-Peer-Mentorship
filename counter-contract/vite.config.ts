import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        wasm(),
        topLevelAwait()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/frontend'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    define: {
        'process.env': {},
        'global': 'globalThis',
    },
    build: {
        outDir: 'dist/frontend',
        target: 'esnext', // Ensure target supports top-level await
    },
});
