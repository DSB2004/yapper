import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly secret = process.env.JWT_SECRET as string;

  generateJWT(payload: any, expireIn: string = '15m'): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: expireIn,
    });
  }

  verifyJWT(token: string): { valid: boolean; payload: any | null } {
    try {
      const payload = jwt.verify(token, this.secret);

      return {
        valid: true,
        payload,
      };
    } catch (err) {
      return {
        valid: false,
        payload: null,
      };
    }
  }

  async validateToken<T>(token?: string): Promise<T | null> {
    if (!token) return null;

    const result = this.verifyJWT(token);
    if (!result.valid) return null;

    return result.payload as T;
  }
}
