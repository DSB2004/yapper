import { Provider } from '@nestjs/common';
import { LRUCache } from 'lru-cache';

export const USER_CACHE = 'USER_CACHE';

export const UserCacheProvider: Provider = {
  provide: USER_CACHE,
  useFactory: () => {
    return new LRUCache<string, any>({
      max: 5000, // max entries
      ttl: 1000 * 60 * 5, // 5 minutes
    });
  },
};
