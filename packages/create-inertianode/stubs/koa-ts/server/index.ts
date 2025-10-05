import 'dotenv/config.js';
import Koa from 'koa';
import Router from '@koa/router';
import { koaBody } from 'koa-body';
import serve from 'koa-static';
import cors from '@koa/cors';
import { inertiaKoaAdapter } from '@inertianode/koa';

const app = new Koa();
const router = new Router();

// Add Inertia middleware to enable ctx.Inertia.render()
app.use(inertiaKoaAdapter({
    vite: {
        entrypoints: ['client/App.ts'],
    }
}));


app.use(cors());
app.use(koaBody());
app.use(serve('public'));

const PORT = process.env.PORT || 3000;

router.get('/', async (ctx) => {
    await ctx.Inertia.render('Index', {
        title: 'Welcome to InertiaNode Koa'
    });
});

router.get('/counter', async (ctx) => {
    await ctx.Inertia.render('Counter', {
        title: 'Counter'
    });
});

router.get('/weather-forecast', async (ctx) => {
    await ctx.Inertia.render('Weather', {
        title: 'Weather Forecast',
        forecasts: [
            { date: '2025-01-01', temperatureF: 32, temperatureC: 0, summary: 'Freezing' },
            { date: '2025-01-02', temperatureF: 32, temperatureC: 0, summary: 'Bracing' },
            { date: '2025-01-03', temperatureF: 32, temperatureC: 0, summary: 'Chilly' },
            { date: '2025-01-04', temperatureF: 32, temperatureC: 0, summary: 'Cool' },
            { date: '2025-01-05', temperatureF: 32, temperatureC: 0, summary: 'Mild' },
        ]
    });
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
