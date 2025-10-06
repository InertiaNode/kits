import { Controller, Get } from '@nestjs/common';
import { InertiaDecorator, type Inertia } from '@inertianode/nestjs';

@Controller()
export class AppController {
  @Get()
  async getIndex(@InertiaDecorator() inertia: Inertia) {
    await inertia('Index', {
      title: 'Welcome to InertiaNode NestJS'
    });
  }

  @Get('counter')
  async getCounter(@InertiaDecorator() inertia: Inertia) {
    await inertia('Counter', {
      title: 'Counter'
    });
  }

  @Get('weather-forecast')
  async getWeatherForecast(@InertiaDecorator() inertia: Inertia) {
    await inertia('Weather', {
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
