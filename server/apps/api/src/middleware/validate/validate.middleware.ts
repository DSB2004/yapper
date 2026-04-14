import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidateMiddleware implements NestMiddleware {
  constructor() {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (process.env.NODE_ENV === 'production') {
        const apiKey = req.headers['x-api-secret'];
        if (!apiKey) {
          throw new UnauthorizedException('API Key is missing');
        }
        const serverApiKey = process.env.API_SECRET;

        if (apiKey !== serverApiKey) {
          throw new ForbiddenException('Invalid API Key');
        }
      }

      next();
    } catch (error: any) {
      throw new UnauthorizedException(
        error.message || 'Invalid or expired API Key',
      );
    }
  }
}
