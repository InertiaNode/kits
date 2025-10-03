import 'dotenv/config.js';
import express from 'express';
import { inertiaExpressAdapter } from '@inertianode/express'
import type { Request as ExpressRequest, Response } from 'express';
import cors from 'cors';

const app = express();

// Add Inertia middleware to enable res.Inertia.render()
app.use(inertiaExpressAdapter());

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get('/', async (req: ExpressRequest, res: Response) => {
    await res.Inertia.render('Index', {
        title: 'Welcome to InertiaNode Express'
    });
});

app.get('/counter', async (req: ExpressRequest, res: Response) => {
    await res.Inertia.render('Counter', {
        title: 'Counter'
    });
});

app.get('/weather-forecast', async (req: ExpressRequest, res: Response) => {
    await res.Inertia.render('Weather', {
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
