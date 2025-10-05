import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { inertiaNestJSAdapter } from '@inertianode/nestjs';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        inertiaNestJSAdapter({
          vite: {
            entrypoints: ['client/App.ts'],
          },
        })
      )
      .forRoutes('*');
  }
}
