import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get()
  async getIndex(@Req() req: Request, @Res() res: Response) {
    await res.Inertia('Index', {
      title: 'Welcome to InertiaNode NestJS'
    });
  }

  @Get('counter')
  async getCounter(@Req() req: Request, @Res() res: Response) {
    await res.Inertia('Counter', {
      title: 'Counter'
    });
  }

  @Get('weather-forecast')
  async getWeatherForecast(@Req() req: Request, @Res() res: Response) {
    await res.Inertia('Weather', {
      title: 'Weather Forecast',
      forecasts: [
        { date: '2025-01-01', temperatureF: 32, temperatureC: 0, summary: 'Freezing' },
        { date: '2025-01-02', temperatureF: 32, temperatureC: 0, summary: 'Bracing' },
        { date: '2025-01-03', temperatureF: 32, temperatureC: 0, summary: 'Chilly' },
        { date: '2025-01-04', temperatureF: 32, temperatureC: 0, summary: 'Cool' },
        { date: '2025-01-05', temperatureF: 32, temperatureC: 0, summary: 'Mild' },
      ]
    });
  }
}
