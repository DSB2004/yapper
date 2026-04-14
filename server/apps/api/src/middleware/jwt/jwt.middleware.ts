import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/api/auth/auth.service';

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  constructor(private readonly util: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const path = req.originalUrl;

    if (path.includes('auth')) return next();
    try {
      const accessToken = req.headers['authorization']?.split(' ')[1];
      const refreshToken = req.headers['x-refresh-token'] as string;

      if (!accessToken || !refreshToken) {
        throw new UnauthorizedException('Tokens are missing');
      }

      const {
        phone,
        authId,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = await this.util.validateUser({
        refreshToken,
        accessToken,
      });
      (req as any).user = {
        phone,
        authId,
      };

      res.setHeader('x-access-token', newAccessToken);
      res.setHeader('x-refresh-token', newRefreshToken);

      next();
    } catch (error: any) {
      throw new UnauthorizedException(
        error.message || 'Invalid or expired tokens',
      );
    }
  }
}
