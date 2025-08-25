

import { Hono } from 'hono'
import { inertiaHonoAdapter } from '@inertianode/hono'
import { Inertia } from '@inertianode/core'

const app = new Hono()

app.use(inertiaHonoAdapter())

app.get('/', async (c) => {
    return await Inertia.render('Index', {
        title: 'Welcome to InertiaNode Hono on Cloudflare Pages',
    }).toResponse(c.req.raw)
})

app.get('/counter', async (c) => {
    return await Inertia.render('Counter', {
        title: Inertia.lazy(() => 'Counter'),
        count: Inertia.merge(0)
    }).toResponse(c.req.raw)
})

type WeatherForecast = {
    date: string;
    temperatureF: number;
    temperatureC: number;
    summary: string;
}

app.get('/weather-forecast', async (c) => {
    return await Inertia.render('Weather', {
        title: 'Weather Forecast',
        forecasts: [
            { date: '2025-01-01', temperatureF: 32, temperatureC: 0, summary: 'Freezing' },
            { date: '2025-01-02', temperatureF: 32, temperatureC: 0, summary: 'Bracing' },
            { date: '2025-01-03', temperatureF: 32, temperatureC: 0, summary: 'Chilly' },
            { date: '2025-01-04', temperatureF: 32, temperatureC: 0, summary: 'Cool' },
            { date: '2025-01-05', temperatureF: 32, temperatureC: 0, summary: 'Mild' },
        ],
    }).toResponse(c.req.raw)
})

export default app;
