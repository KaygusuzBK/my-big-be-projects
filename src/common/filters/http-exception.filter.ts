import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Sunucu hatası oluştu';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exceptionResponse;
      }
    } else if (exception instanceof Error) {
      // 404 için özel mesaj
      if (exception.message && exception.message.includes('Cannot')) {
        const method = request.method;
        const url = request.url;
        message = `Endpoint bulunamadı: ${method} ${url}`;
        status = HttpStatus.NOT_FOUND;
      } else {
        message = exception.message || 'Sunucu hatası oluştu';
      }
    }

    // 404 için daha açıklayıcı mesaj
    if (status === HttpStatus.NOT_FOUND) {
      const method = request.method;
      const url = request.url;
      if (!Array.isArray(message) && typeof message === 'string' && message.includes('Cannot')) {
        message = `Endpoint bulunamadı: ${method} ${url}. Lütfen doğru endpoint'i kullandığınızdan emin olun.`;
      } else if (!Array.isArray(message)) {
        message = message || `Endpoint bulunamadı: ${method} ${url}`;
      }
    }

    // 404 mesajlarını Türkçeleştir
    let finalMessage = message;
    if (status === HttpStatus.NOT_FOUND) {
      if (typeof message === 'string' && message.includes('Cannot')) {
        finalMessage = `Endpoint bulunamadı: ${request.method} ${request.url}. Lütfen doğru endpoint'i kullandığınızdan emin olun.`;
      } else if (typeof message === 'string') {
        finalMessage = message;
      }
    }

    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: Array.isArray(finalMessage) ? finalMessage : [finalMessage],
    };

    // 404 için mevcut endpoint'leri göster
    if (status === HttpStatus.NOT_FOUND) {
      errorResponse.availableEndpoints = {
        auth: [
          'POST /auth/register - Kullanıcı kaydı',
          'POST /auth/login - Kullanıcı girişi',
          'GET /auth/profile - Profil bilgisi (JWT gerekli)',
        ],
        users: [
          'GET /users/:id - Kullanıcı bilgisi (JWT gerekli)',
        ],
        posts: [
          'GET /posts - Tüm postlar',
          'GET /posts?published=true - Sadece yayınlananlar',
          'GET /posts/:id - Post detayı',
          'POST /posts - Yeni post (JWT gerekli)',
          'PATCH /posts/:id - Post güncelle (JWT gerekli)',
          'DELETE /posts/:id - Post sil (JWT gerekli)',
        ],
        categories: [
          'GET /categories - Tüm kategoriler',
          'GET /categories/:id - Kategori detayı',
          'POST /categories - Yeni kategori (JWT gerekli)',
          'PATCH /categories/:id - Kategori güncelle (JWT gerekli)',
          'DELETE /categories/:id - Kategori sil (JWT gerekli)',
        ],
        other: [
          'GET / - Ana sayfa',
          'GET /api - Swagger dokümantasyonu',
        ],
      };
    }

    response.status(status).json(errorResponse);
  }
}

