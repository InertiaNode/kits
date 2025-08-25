import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { inertiaHonoAdapter } from '@inertianode/hono'
import { Inertia } from '@inertianode/core'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()

app.use(inertiaHonoAdapter())

app.use('*', serveStatic({ root: './public' }))

app.get('/', async (c) => {
  return await Inertia.render('Index', {
    title: 'Welcome to InertiaNode Hono'
  }).toResponse(c.req.raw)
})

app.get('/counter', async (c) => {
  return await Inertia.render('Counter', {
    title: 'Counter'
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
    ]
  }).toResponse(c.req.raw)
})


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
