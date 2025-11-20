import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Swagger ve static dosyalar için geç
    if (req.path.startsWith('/api') || req.path.startsWith('/_next') || req.path.startsWith('/static')) {
      return next();
    }

    // Eğer route bulunamazsa
    throw new NotFoundException(
      `Endpoint bulunamadı: ${req.method} ${req.path}. Lütfen doğru endpoint'i kullandığınızdan emin olun.`
    );
  }
}

