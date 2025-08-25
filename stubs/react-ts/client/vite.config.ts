import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [
        tailwindcss(),
        laravel({
            input: ["client/App.tsx"],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname),
        },
    },
})
