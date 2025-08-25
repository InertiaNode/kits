import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
    plugins: [
        tailwindcss(),
        laravel({
            input: ["src/App.ts"],
            ssr: "src/ssr.ts",
            refresh: true,
        }),
        svelte(),
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
