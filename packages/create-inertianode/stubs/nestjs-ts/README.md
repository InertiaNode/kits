# NestJS + Inertia.js Starter Kit

This is a starter kit for building modern web applications with NestJS and Inertia.js.

## Features

- 🚀 **NestJS** - A progressive Node.js framework for building efficient and scalable server-side applications
- ⚡ **Inertia.js** - Build single-page apps without the complexity
- 🎨 **React/Vue/Svelte** - Choose your favorite frontend framework
- 📦 **TypeScript** - Full type safety across the stack
- 🔥 **Hot Module Replacement** - Fast development with Vite
- 🎯 **Decorators** - Use `@Inert()` for clean controller code

## Getting Started

### Development

Run the development server:

```bash
npm run dev
```

This will start:
- NestJS server on port 3000 (with hot reload)
- Vite dev server for the client

### Production

Build for production:

```bash
npm run build:server
npm run build:client
```

Start the production server:

```bash
npm start
```

## Project Structure

```
.
├── src/
│   ├── main.ts           # NestJS entry point
│   ├── app.module.ts     # Root module with Inertia middleware
│   └── app.controller.ts # Example controller with Inertia
├── client/               # Frontend code (React/Vue/Svelte)
├── public/               # Static assets
└── dist/                 # Compiled output
```

## Usage

### Basic Controller

Using the decorator (recommended):

```typescript
import { Controller, Get } from '@nestjs/common';
import { Inert, type InertiaInstance } from '@inertianode/nestjs';

@Controller('users')
export class UsersController {
  @Get()
  async index(@Inert() inertia: InertiaInstance) {
    await inertia.render('Users/Index', {
      users: await this.usersService.findAll()
    });
  }
}
```

Without the decorator:

```typescript
import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  @Get()
  async index(@Req() req: Request, @Res() res: Response) {
    await (req as any).Inertia.render('Users/Index', {
      users: await this.usersService.findAll()
    });
  }
}
```

### Sharing Data

Share data across all Inertia requests using middleware:

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ShareDataMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    (req as any).Inertia.share({
      auth: { user: req.user },
      flash: req.flash?.()
    });
    next();
  }
}
```

Register in your module:

```typescript
@Module({
  // ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        ShareDataMiddleware,
        inertiaNestJSAdapter({ /* ... */ })
      )
      .forRoutes('*');
  }
}
```

## Learn More

- [NestJS Documentation](https://docs.nestjs.com/)
- [Inertia.js Documentation](https://inertiajs.com/)
- [InertiaNode Documentation](https://inertianode.com/)

## License

MIT
