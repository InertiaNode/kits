import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue';
import laravel from "laravel-vite-plugin";
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [
        tailwindcss(),
        laravel({
            input: ["App.ts"],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname),
        },
    },
    build: {
        emptyOutDir: true,
    },
});
