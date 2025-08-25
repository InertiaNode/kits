import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'

import pages from '@hono/vite-cloudflare-pages'
import { getPlatformProxy } from 'wrangler'

export default defineConfig(async () => {
    const isDev = process.env.NODE_ENV === 'development';
    let devServerPlugin;
    if (isDev) {
        const { env, dispose } = await getPlatformProxy();
        devServerPlugin = devServer({
            entry: 'server/index.ts',
            adapter: {
                env,
                onServerClose: dispose
            },
        });
    }

    return {
        plugins: [
            pages({
                entry: ['server/index.ts'],
            }),
            devServerPlugin,
        ],
        resolve: {
            alias: {
                "@": "/server",
            },
        },
        server: {
            port: 3000,
            cors: true,
        },
    }
})
